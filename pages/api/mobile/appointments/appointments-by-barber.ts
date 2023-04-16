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
      const { barber } = req.body

      const appointmentsByBarber = await Appointment.find({
        barber,
        status: 'pending',
      })
        .sort({ appointmentDate: -1 })
        .lean()

      res.status(200).json(appointmentsByBarber)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
