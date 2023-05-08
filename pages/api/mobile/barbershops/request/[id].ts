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
      const { id: barber } = req.query
      const barbershop = req.user._id

      const cancelObj = await Barbershop.findOne({
        'barbers.barber': barber,
        'barbers.status': { $ne: 'active' },
        barbershop,
      })

      if (!cancelObj) return res.status(404).json({ error: 'Barber not found' })

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
      const { id: barber } = req.query
      const barbershop = req.user._id
      const { status } = req.body

      const cancelObj = await Barbershop.findOne({
        'barbers.barber': barber,
        ...(status === 'accept' && { 'barbers.status': { $ne: 'active' } }),
        barbershop,
      })

      if (!cancelObj) return res.status(404).json({ error: 'Barber not found' })

      cancelObj.barbers = cancelObj.barbers.filter(
        (item: any) =>
          item.barber?.toString() !== barber?.toString() &&
          item.status !== 'active'
      )
      if (status === 'accept') {
        cancelObj.barbers.push({
          barber,
          status: 'active',
        })
      }

      await cancelObj.save()

      res.status(200).json({ error: `Request has cancelled` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
