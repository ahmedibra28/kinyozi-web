import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import Appointment from '../../../../models/Appointment'
import db from '../../../../config/db'
import User from '../../../../models/User'
import UserRole from '../../../../models/UserRole'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { startDate, endDate, barber } = req.query

      let query = Appointment.find(
        startDate && endDate
          ? {
              appointmentDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
              },
              barber,
            }
          : { barber }
      )

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Appointment.countDocuments(
        startDate && endDate
          ? {
              appointmentDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
              },
              barber,
            }
          : { barber }
      )

      const pages = Math.ceil(total / pageSize)

      query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 }).lean()

      const result = await query

      res.status(200).json({
        startIndex: skip + 1,
        endIndex: skip + result.length,
        count: result.length,
        page,
        pages,
        total,
        data: result,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { barber, appointmentDate, speciality } = req.body

      // check if barber exists
      const barberExists = await User.findOne({
        _id: barber,
        confirmed: true,
        blocked: false,
      })

      const role = await UserRole.findOne({ user: barber })
        .select('role')
        .populate('role', ['type'])

      if (!barberExists || role.role.type !== 'BARBER')
        return res.status(400).json({ error: 'Barber not found' })

      // check if appointmentDate is less than today
      const today = new Date()
      if (new Date(appointmentDate) < today)
        return res
          .status(400)
          .json({ error: 'Appointment date cannot be in the past' })

      // Check if client already has an appointment
      const clientExists = await Appointment.findOne({
        client: req.user._id,
        status: 'pending',
      })
      if (clientExists)
        return res
          .status(400)
          .json({ error: 'Client already has an appointment' })

      const object = await Appointment.create({
        client: req.user._id,
        barber,
        appointmentDate,
        speciality,
        status: 'pending',
        createdBy: req.user._id,
      })
      res.status(200).send(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
