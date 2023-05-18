import nc from 'next-connect'
import { isAuth } from '../../../../../utils/auth'
import Appointment from '../../../../../models/Appointment'
import db from '../../../../../config/db'

const handler = nc()
handler.use(isAuth)

handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { _id } = req.body

      const appointment = await Appointment.findOne({
        _id,
        barber: req.user._id,
        status: 'pending',
      })

      if (!appointment)
        return res
          .status(400)
          .json({ error: 'Appointment not found or has already started' })

      appointment.status = 'accepted'
      appointment.start = Date.now()
      await appointment.save()

      res.status(200).json(appointment)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
