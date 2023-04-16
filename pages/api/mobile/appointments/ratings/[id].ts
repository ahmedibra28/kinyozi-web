import nc from 'next-connect'
import { isAuth } from '../../../../../utils/auth'
import Appointment from '../../../../../models/Appointment'
import db from '../../../../../config/db'
import Profile from '../../../../../models/Profile'

const handler = nc()
handler.use(isAuth)

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const object = await Appointment.find({
        client: req.user._id,
        rating: 0,
      }).lean()

      res.status(200).json(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const { rating } = req.body

      // rating must be between 1 and 5
      if (Number(rating) < 1 || Number(rating) > 5)
        return res.status(400).json({ error: 'Rating must be between 1 and 5' })

      const object = await Appointment.findOne({
        _id: id,
        status: 'accepted',
        client: req.user._id,
      })

      if (!object)
        return res.status(400).json({ error: `Appointment not found` })

      object.rating = rating
      await object.save()

      const result = await Appointment.aggregate([
        { $match: { barber: object.barber, status: 'accepted' } },
        {
          $group: {
            _id: '$barber',
            average: { $avg: '$rating' },
            count: { $sum: 1 },
          },
        },
      ])

      const { average, count } = result[0] || { average: 0, count: 0 }

      await Profile.findOneAndUpdate(
        { user: object.barber },
        {
          rating: { average, count },
        }
      )

      res.status(200).json({ message: `Appointment updated` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
