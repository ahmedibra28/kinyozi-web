import nc from 'next-connect'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'
import { isAuth } from '../../../../utils/auth'
import User from '../../../../models/User'
import Barbershop from '../../../../models/Barbershop'

const handler = nc()

handler.use(isAuth)

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      let profile = await Profile.findOne({ user: req.user._id }).lean()

      // @ts-ignore
      if (profile?.role === 'BARBER') {
        const bShop = await Barbershop.findOne({
          barbers: {
            $elemMatch: {
              barber: req.user._id,
              status: { $eq: 'active' },
            },
          },
        }).lean()

        if (!bShop) return res.status(200).json(profile)

        // @ts-ignore
        const barbershop = await Profile.findOne({ user: bShop.barbershop })
          .select('name image rating businessHours user')
          .lean()

        if (!barbershop)
          return res.status(400).json({ error: 'You are not active barber' })

        profile = { ...profile, barbershop }
      }

      res.status(200).json(profile)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { name, address, settings } = req.body

      console.log(req.body)

      const profile = await Profile.findOne({ user: req.user._id })

      if (!profile) return res.status(404).json({ error: 'Profile not found' })

      profile.name = name || profile.name
      profile.address = address || profile.address
      profile.settings = {
        pushToken: settings?.pushToken || profile.settings?.pushToken,
      }

      await profile.save()

      await User.findByIdAndUpdate(req.user._id, { name: profile.name })

      res.status(200).json(profile)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
