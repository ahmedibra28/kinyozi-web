import nc from 'next-connect'
import { isAuth } from '../../../../../utils/auth'
import db from '../../../../../config/db'
import User from '../../../../../models/User'
import Barbershop from '../../../../../models/Barbershop'

const handler = nc()
handler.use(isAuth)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { barber } = req.body
      const barbershop = req.user._id

      const checkBarber = await User.findOne({
        _id: barber,
        confirmed: true,
        blocked: false,
      })
      if (!checkBarber) return res.status(400).json({ error: 'Invalid barber' })

      const checkBarbershop = await User.findOne({
        _id: barbershop,
        confirmed: true,
        blocked: false,
      })
      if (!checkBarbershop)
        return res.status(400).json({ error: 'Invalid barbershop' })

      const barbershopObj = await Barbershop.findOne({ barbershop })
      if (!barbershopObj)
        return res.status(400).json({ error: 'Invalid barbershop' })

      const foundBarber = barbershopObj.barbers.find(
        (item: { _id: string }) => item._id.toString() === barber
      )

      if (!foundBarber) {
        barbershopObj.barbers.push({
          barber,
          status: 'from barbershop',
        })
        await barbershopObj.save()

        return res.status(200).json({ message: 'Request sent' })
      }

      if (foundBarber.status === 'active')
        return res
          .status(400)
          .json({ error: 'Th barber already a part of this barbershop' })

      if (foundBarber.status === 'from barbershop')
        return res
          .status(400)
          .json({ error: 'Your request is pending approval' })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
