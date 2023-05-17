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

      const barbers = await Barbershop.findOne({
        barbershop,
        'barbers.barber': barber,
      })

      if (!barbers) return res.status(404).json({ error: 'Barber not found' })

      await Barbershop.findOneAndUpdate(
        { barbershop, 'barbers.barber': barber },
        { $pull: { barbers: { barber } } }
      )

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
      console.log(status)

      if (status === 'fire') {
        const fireQuery = {
          barbershop,
          barbers: {
            $elemMatch: {
              barber: barber,
              status: { $eq: 'active' },
            },
          },
        }
        const fireBarber = await Barbershop.findOne(fireQuery)
        if (!fireBarber)
          return res.status(404).json({ error: 'Barber not found' })

        fireBarber.barbers = fireBarber.barbers.filter(
          (item: any) => item.barber?.toString() !== barber?.toString()
        )

        await fireBarber.save()

        return res.send('success')
      }

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
