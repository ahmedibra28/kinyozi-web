import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import Appointment from '../../../../models/Appointment'
import db from '../../../../config/db'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query

      let query = Appointment.find({
        $or: [{ barbershop: id }, { client: id }, { barber: id }],
      })

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Appointment.countDocuments({
        $or: [{ barbershop: id }, { client: id }, { barber: id }],
      })

      const pages = Math.ceil(total / pageSize)

      query = query
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean()
        .select(
          '_id barber barbershop client appointmentDate appointmentTime status specialty rating amount createdAt'
        )
        .populate('barber', ['name', 'image'])
        .populate('client', ['name', 'image'])
        .populate('barbershop', ['name', 'image'])

      let result = await query

      result = result?.map((item: any) => ({
        ...item,
        appointmentDate: moment(item?.appointmentDate)
          .add(Number(item?.appointmentTime?.split(' -')?.[0]) - 3, 'hours')
          .format(),
      }))

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

export default handler
