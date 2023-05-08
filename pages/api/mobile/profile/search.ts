import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import Profile from '../../../../models/Profile'
import db from '../../../../config/db'
import Barbershop from '../../../../models/Barbershop'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { q, role } = req.query

      const { _id } = req.user

      let query = Profile.find(
        q
          ? { name: { $regex: q, $options: 'i' }, role, user: { $ne: _id } }
          : { role, user: { $ne: _id } }
      )

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Profile.countDocuments(
        q
          ? { name: { $regex: q, $options: 'i' }, role, user: { $ne: _id } }
          : { role, user: { $ne: _id } }
      )

      const pages = Math.ceil(total / pageSize)

      query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 }).lean()

      let result = await query

      if (role === 'BARBER_SHOP') {
        const barbers = await Promise.all(
          result.map(async (profile) => {
            const barbershop = await Barbershop.findOne({
              barbershop: profile.user,
            })
            return {
              barbers: barbershop?.barbers,
              ...profile,
            }
          })
        )

        result = barbers
      }

      if (role === 'BARBER') {
        const barbershops = await Promise.all(
          result.map(async (profile) => {
            const barber = await Barbershop.findOne({
              'barbers.barber': profile.user,
              // 'barbers.status': { $ne: 'active' },
            })

            return {
              barbers: barber?.barbers,
              ...profile,
            }
          })
        )

        result = barbershops
      }

      const newResult: { user: string; status: string }[] = []

      result?.forEach((item) => {
        if (!item?.barbers || item?.barbers?.length === 0) {
          newResult.push({ user: item?.user, status: 'new' })
        }

        item?.barbers?.forEach((barber: any) => {
          if (barber?.status !== 'active') {
            newResult.push({ user: item?.user, status: barber?.status })
          }
        })
      })

      result = newResult

      result = await Promise.all(
        result.map(async (item) => {
          const profiles = await Profile.findOne({
            user: item.user,
          })
            .lean()
            .select('_id name image mobile rating user isOpen, openTime')

          return {
            ...profiles,
            ...item,
          }
        })
      )

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
