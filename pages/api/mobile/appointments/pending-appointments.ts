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
      const pendingAppointments = await Appointment.find({
        barber: req.user._id,
        status: 'pending',
      })
        .sort({ appointmentDate: -1 })
        .limit(10)

      res.status(200).json(pendingAppointments)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
