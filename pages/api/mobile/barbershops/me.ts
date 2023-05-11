import nc from 'next-connect'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'
import { isAuth } from '../../../../utils/auth'
import Barbershop from '../../../../models/Barbershop'

const handler = nc()

handler.use(isAuth)

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const barbershop = await Barbershop.findOne({
        barbershop: req.user._id,
      })

      if (!barbershop)
        return res.status(400).json({ error: 'Invalid barbershop' })

      const activeBarbers = barbershop.barbers?.filter(
        (item: any) => item?.status === 'active'
      )

      const profiles = await Promise.all(
        activeBarbers?.map(async (item: any) => {
          return await Profile.findOne({
            user: item.barber,
          })
            .lean()
            .select('name image mobile role businessHours user rating')
        })
      )

      res.status(200).json(profiles)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
