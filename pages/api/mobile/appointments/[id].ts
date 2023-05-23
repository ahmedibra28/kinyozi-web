import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import Appointment from '../../../../models/Appointment'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query

      const object = await Appointment.findById(id)
        .lean()
        .select('-__v -createdBy -updatedBy')
      if (!object)
        return res.status(404).json({ error: 'Appointment not found' })

      // @ts-ignore
      const profile = await Profile.findOne({ user: object?.client })
        .lean()
        .select('name image user')

      res.status(200).json({ ...object, client: profile })
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
      const { appointmentDate } = req.body

      const today = new Date()
      if (new Date(appointmentDate) < today)
        return res
          .status(400)
          .json({ error: 'Appointment date cannot be in the past' })

      const object = await Appointment.findOne({ _id: id, status: 'pending' })

      if (!object)
        return res.status(400).json({ error: `Appointment not found` })

      object.appointmentDate = appointmentDate

      await object.save()
      res.status(200).json({ message: `Appointment updated` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.delete(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query

      const object = await Appointment.updateOne(
        { _id: id },
        { $set: { status: 'rejected' } }
      )

      if (!object)
        return res.status(400).json({ error: `Appointment not found` })

      res.status(200).json({ message: `Appointment rejected` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
