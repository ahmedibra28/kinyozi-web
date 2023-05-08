import nc from 'next-connect'
import { isAuth } from '../../../../../utils/auth'
import db from '../../../../../config/db'
import Barbershop from '../../../../../models/Barbershop'

const handler = nc()
handler.use(isAuth)

handler.delete(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id: barbershop } = req.query
      const barber = req.user._id

      const cancelObj = await Barbershop.findOne({
        'barbers.barber': barber,
        'barbers.status': { $ne: 'active' },
        barbershop,
      })

      if (!cancelObj)
        return res.status(404).json({ error: 'Barbershop not found' })

      cancelObj.barbers = cancelObj.barbers.filter(
        (item: any) =>
          item.barber?.toString() !== barber?.toString() &&
          item.status !== 'active'
      )

      await cancelObj.save()

      res.status(200).json({ error: `Request has cancelled` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id: barbershop } = req.query
      const barber = req.user._id

      const cancelObj = await Barbershop.findOne({
        'barbers.barber': barber,
        'barbers.status': { $ne: 'active' },
        barbershop,
      })

      if (!cancelObj)
        return res.status(404).json({ error: 'Barbershop not found' })

      cancelObj.barbers = cancelObj.barbers.filter(
        (item: any) =>
          item.barber?.toString() !== barber?.toString() &&
          item.status !== 'active'
      )
      cancelObj.barbers.push({
        barber,
        status: 'active',
      })
      await cancelObj.save()

      res.status(200).json({ error: `Request has cancelled` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
