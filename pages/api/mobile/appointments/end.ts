import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import Appointment from '../../../../models/Appointment'
import db from '../../../../config/db'

const handler = nc()
handler.use(isAuth)

handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { _id, completedService, amount } = req.body

      const appointment = await Appointment.findOne({
        _id,
        barber: req.user._id,
        status: 'accepted',
        start: { $exists: true },
      })

      if (!appointment)
        return res
          .status(400)
          .json({ error: 'Appointment not found or has not started yet' })

      if (Number(amount) <= 0)
        return res.status(400).json({ error: 'Amount must be greater than 0' })

      appointment.end = Date.now()
      appointment.completedService = completedService
      appointment.amount = amount
      await appointment.save()

      res.status(200).json(appointment)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
