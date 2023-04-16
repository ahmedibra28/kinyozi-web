import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import Appointment from '../../../../models/Appointment'
import db from '../../../../config/db'

const handler = nc()
handler.use(isAuth)

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const lastAppointment = await Appointment.find({
        client: req.user._id,
        status: { $ne: 'rejected' },
      })
        .sort({ appointmentDate: -1 })
        .limit(1)

      res.status(200).json(lastAppointment)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
