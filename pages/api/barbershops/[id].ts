import nc from 'next-connect'
import db from '../../../config/db'
import { isAuth } from '../../../utils/auth'
import Profile from '../../../models/Profile'

const schemaNameString = 'Notification'

const handler = nc()

handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query

      const { businessHours } = req.body

      if (!businessHours || businessHours?.length === 0)
        return res.status(400).json({ error: `business hours are required` })

      const profile = await Profile.findOne({ role: 'BARBER_SHOP', _id: id })
      if (!profile)
        return res.status(404).json({ error: 'Barbershop not found!' })

      profile.businessHours = businessHours
      await profile.save()

      res.status(200).json({ message: `${schemaNameString} updated` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
