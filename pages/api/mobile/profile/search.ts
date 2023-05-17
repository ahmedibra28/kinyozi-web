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

      if (req?.user?.role === 'CLIENT' && role === 'BARBER_SHOP') {
        const barbershops = await Promise.all(
          result.map(async (profile) => {
            const barbershop = await Barbershop.findOne({
              barbershop: profile.user,
            })
            const barberProfile = await Promise.all(
              barbershop?.barbers?.map(async (barber: any) => {
                return await Profile.findOne({
                  user: barber?.barber,
                })
              })
            )
            return {
              barbers: barberProfile,
              ...profile,
            }
          })
        )

        result = barbershops

        return res.status(200).json({
          startIndex: skip + 1,
          endIndex: skip + result.length,
          count: result.length,
          page,
          pages,
          total,
          data: result,
        })
      }

      if (req?.user?.role !== 'CLIENT' && role === 'BARBER_SHOP') {
        const checkIfActive = await Barbershop.findOne({
          barbers: {
            $elemMatch: {
              barber: _id,
              status: { $eq: 'active' },
            },
          },
        })

        console.log(checkIfActive)

        if (checkIfActive)
          return res
            .status(400)
            .json({ error: 'You are already active barber' })

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
        const allBarbers = result?.map((item) => item?.user?.toString())

        const barbers = await Barbershop?.find({
          'barbers.barber': { $in: allBarbers },
        })

        const inBarbershop = barbers
          ?.map((item) =>
            item?.barbers?.map((item: any) => ({
              barber: item?.barber?.toString(),
              status: item?.status,
            }))
          )
          ?.flat()
        const inBarbershopIds = inBarbershop?.map((item) =>
          item?.barber?.toString()
        )

        const newBarberIds = allBarbers
          .filter((barber) => !inBarbershopIds.includes(barber))
          ?.map((item) => ({ barber: item, status: 'new' }))

        const objects = await Promise.all(
          [...inBarbershop, ...newBarberIds]?.map(async (barber) => {
            const profile = await Profile.findOne({
              user: barber?.barber,
            }).lean()
            return {
              ...profile,
              status: barber?.status,
            }
          })
        )

        // console.log(objects?.filter((item) => item?.status !== 'active'))

        return res.json(objects?.filter((item) => item?.status !== 'active'))
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

export default handler
