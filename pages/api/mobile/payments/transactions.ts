import nc from 'next-connect'
import db from '../../../../config/db'
import { isAuth } from '../../../../utils/auth'
import Appointment from '../../../../models/Appointment'

const handler = nc()

handler.use(isAuth)

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { q } = req.query
      const { _id, role } = req.user

      const appendQuery = {
        ...(role === 'BARBER' && { barber: _id }),
        ...(role === 'CLIENT' && { client: _id }),
        ...(role === 'BARBERSHOP' && { barbershop: _id }),
        status: 'accepted',
      }

      let query = Appointment.find(
        q
          ? {
              appointmentDate: q,
              ...appendQuery,
            }
          : {
              ...appendQuery,
            }
      )

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Appointment.countDocuments(
        q
          ? {
              appointmentDate: q,
              ...appendQuery,
            }
          : {
              ...appendQuery,
            }
      )

      const pages = Math.ceil(total / pageSize)

      query = query
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean()
        .select('-__v -updatedAt')

      const result = await query

      // get total amount
      const totalAmount = await Appointment.aggregate([
        {
          $match: {
            ...appendQuery,
          },
        },
        {
          $group: {
            _id: null,
            amount: { $sum: '$amount' },
          },
        },
      ])

      res.status(200).json({
        startIndex: skip + 1,
        endIndex: skip + result.length,
        count: result.length,
        page,
        pages,
        total,
        data: { result, totalAmount: totalAmount?.[0]?.amount || 0 },
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
