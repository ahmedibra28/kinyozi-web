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
      const { _id } = req.user

      const myAppointment = await Appointment.findOne({
        client: _id,
        status: 'pending',
      }).lean()

      if (!myAppointment) return res.json([])

      const barber = await Profile.findOne({
        user: myAppointment?.barber,
      }).lean()

      res.status(200).json({
        ...myAppointment,
        barber: { ...barber, user: myAppointment._id },
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
