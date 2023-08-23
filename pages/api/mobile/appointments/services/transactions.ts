import nc from 'next-connect'
import { isAuth } from '../../../../../utils/auth'
import Appointment from '../../../../../models/Appointment'
import db from '../../../../../config/db'
import Profile from '../../../../../models/Profile'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      let { startDate, endDate } = req.query as any
      const { barber } = req.query

      startDate = moment(`${startDate} 00:00:00`).format()
      endDate = moment(`${endDate} 23:59:59`).format()

      let query = Appointment.find({
        appointmentDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        barber,
        barbershop: req.user._id,
        status: { $in: ['pending', 'accepted'] },
      })

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Appointment.countDocuments({
        appointmentDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        barber,
        barbershop: req.user._id,
        status: { $in: ['pending', 'accepted'] },
      })

      const pages = Math.ceil(total / pageSize)

      query = query
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean()
        .select(
          '_id barber client appointmentDate appointmentTime status specialty rating amount'
        )

      let result = await query

      result = await Promise.all(
        result?.map(async (item) => {
          const clientProfile = await Profile.findOne({
            user: item?.client,
          })
            .lean()
            .select('_id name image user')

          return {
            ...item,
            clientProfile,
          }
        })
      )

      const barberProfile = await Profile.findOne({
        user: barber,
      })
        .lean()
        .select('_id name image user rating')

      res.status(200).json({
        startIndex: skip + 1,
        endIndex: skip + result.length,
        count: result.length,
        page,
        pages,
        total,
        data: { result, barberProfile },
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
