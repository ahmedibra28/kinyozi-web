import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import Appointment from '../../../../models/Appointment'
import db from '../../../../config/db'
import User from '../../../../models/User'
import UserRole from '../../../../models/UserRole'
import Profile from '../../../../models/Profile'
import Barbershop from '../../../../models/Barbershop'
import moment from 'moment'

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
              status: { $ne: 'rejected' },
            }
          : { barber, status: { $ne: 'rejected' } }
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
              status: { $ne: 'rejected' },
            }
          : { barber, status: { $ne: 'rejected' } }
      )

      const pages = Math.ceil(total / pageSize)

      query = query
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean()
        .select(
          '_id barber barbershop client appointmentDate appointmentTime status specialty rating'
        )

      let result = await query

      result = await Promise.all(
        result?.map(async (item) => {
          const clientProfile = await Profile.findOne({
            user: item?.client,
          })
            .lean()
            .select('_id name image role user mobile')

          return {
            ...item,
            clientProfile,
          }
        })
      )

      const barberProfile = await Profile.findOne({ user: barber })
        .lean()
        .select('_id name image role rating user mobile')

      const barbershop = await Barbershop.findOne(
        {
          'barbers.barber': barber,
          'barbers.status': 'active',
        },
        { barbershop: 1 }
      )
      const barbershopProfile = await Profile.findOne({
        user: barbershop?.barbershop,
      })
        .lean()
        .select('_id name image role rating user businessHours mobile')

      result = {
        // @ts-ignore
        appointments: result,
        barberProfile,
        barbershopProfile,
      }

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
      const { barber, barbershop, day, time, specialty } = req.body

      const body = {
        barber,
        barbershop,
        client: req.user._id,
        appointmentDate: day,
        appointmentTime: time,
        specialty,
        status: 'pending',
        rating: 0,
      }

      // check if barber exists
      const barberExists = await User.findOne({
        _id: body.barber,
        confirmed: true,
        blocked: false,
      })
      if (!barberExists)
        return res.status(400).json({ error: 'Barber not found' })

      const role = await UserRole.findOne({ user: barber })
        .select('role')
        .populate('role', ['type'])

      if (role.role.type !== 'BARBER')
        return res.status(400).json({ error: 'Barber not found' })

      // check if appointmentDate is less than today
      const today = new Date()
      if (new Date(body.appointmentDate) < today)
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

      const checkIfAvailableAppointment = await Appointment.findOne({
        barber: body.barber,
        appointmentDate: body.appointmentDate,
        appointmentTime: body.appointmentTime,
        status: { $in: ['pending', 'accepted'] },
      })
      if (checkIfAvailableAppointment)
        return res.status(400).json({ error: 'Barber is not available' })

      const profileBarbershop = await Profile.findOne({
        user: body.barbershop,
      })
      if (!profileBarbershop)
        return res.status(400).json({ error: 'Barbershop not found' })

      const dayName = moment(body.appointmentDate).format('dddd')

      const checkAvailable = profileBarbershop.businessHours?.find(
        (item: any) =>
          item.day === dayName && item.hours.includes(body.appointmentTime)
      )
      if (!checkAvailable)
        return res
          .status(400)
          .json({ error: 'Barbershop is not available at the selected time' })

      const object = await Appointment.create({
        ...body,
        createdBy: req.user._id,
      })
      res.status(200).send(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
