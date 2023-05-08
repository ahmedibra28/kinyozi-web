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

      let pendingRequests = await Barbershop.find(
        barber
          ? {
              'barbers.barber': barber,
              'barbers.status': 'from barbershop',
            }
          : {
              barbershop,
              'barbers.status': 'from barber',
            }
      ).lean()

      if (pendingRequests?.length > 0 && barbershop) {
        const barbers = pendingRequests
          ?.map((item) =>
            item?.barbers?.map((barber: any) =>
              barber?.status === 'from barber' ? barber : null
            )
          )
          ?.flat()

        const items = await Promise.all(
          barbers.map(async (item) => {
            return await Profile.findOne({
              user: item.barber,
            })
              .lean()
              .select('name image mobile role isOpen openTime user rating')
          })
        )

        pendingRequests = items
      }

      if (pendingRequests?.length > 0 && barber) {
        const items = await Promise.all(
          pendingRequests.map(async (item) => {
            return await Profile.findOne({
              user: item.barbershop,
            })
              .lean()
              .select('name image mobile role isOpen openTime user rating')
          })
        )

        pendingRequests = items
      }

      return res.status(200).json(pendingRequests)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
