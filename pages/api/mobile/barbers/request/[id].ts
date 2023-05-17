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
        barbershop,
      })

      if (!cancelObj)
        return res.status(404).json({ error: 'Barbershop not found' })

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
      const { id: barbershop } = req.query
      const barber = req.user._id
      const { status } = req.body

      if (status !== 'fire') {
        const acceptQuery = {
          barbershop,
          barbers: {
            $elemMatch: {
              barber: barber,
              status: { $ne: 'active' },
            },
          },
        }

        const acceptBarbershop = await Barbershop.findOne(acceptQuery)

        if (!acceptBarbershop)
          return res.status(404).json({ error: 'Barbershop not found' })

        acceptBarbershop.barbers = acceptBarbershop.barbers.filter(
          (item: any) => item.barber?.toString() !== barber?.toString()
        )

        acceptBarbershop.barbers.push({
          barber,
          status: 'active',
        })

        await acceptBarbershop.save()

        return res.json(acceptBarbershop)
      }

      const fireQuery = {
        barbershop,
        barbers: {
          $elemMatch: {
            barber: barber,
            status: { $eq: 'active' },
          },
        },
      }

      if (status === 'fire') {
        const fireBarbershop = await Barbershop.findOne(fireQuery)
        if (!fireBarbershop)
          return res.status(404).json({ error: 'Barbershop not found' })

        fireBarbershop.barbers = fireBarbershop.barbers.filter(
          (item: any) => item.barber?.toString() !== barber?.toString()
        )

        await fireBarbershop.save()

        return res.send('success')
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
