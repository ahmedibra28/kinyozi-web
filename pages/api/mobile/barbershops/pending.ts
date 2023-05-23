import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'
import Barbershop from '../../../../models/Barbershop'
import Profile from '../../../../models/Profile'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { barber, barbershop } = req.query

      let pendingRequests: any = []

      if (barber) {
        const barberQuery = {
          barbers: {
            $elemMatch: {
              barber: barber,
              status: { $eq: 'from barbershop' },
            },
          },
        }
        pendingRequests = await Barbershop.find(barberQuery).lean()

        if (pendingRequests?.length > 0) {
          const items = await Promise.all(
            pendingRequests.map(async (item: any) => {
              return await Profile.findOne({
                user: item.barbershop,
              })
                .lean()
                .select('name image mobile role businessHours user rating')
            })
          )

          pendingRequests = items
        }
      }

      if (barbershop) {
        const barbershopQuery = {
          barbershop,
          barbers: {
            $elemMatch: {
              status: { $eq: 'from barber' },
            },
          },
        }

        pendingRequests = await Barbershop.find(barbershopQuery).lean()

        if (pendingRequests?.length > 0) {
          const barbers = pendingRequests
            ?.map((item: any) =>
              item?.barbers?.filter(
                (barber: any) => barber?.status === 'from barber'
              )
            )
            ?.flat()

          const items = await Promise.all(
            barbers.map(async (item: any) => {
              return await Profile.findOne({
                user: item.barber,
              })
                .lean()
                .select('name image mobile role businessHours user rating')
            })
          )

          pendingRequests = items
        }
      }

      return res.status(200).json(pendingRequests)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
