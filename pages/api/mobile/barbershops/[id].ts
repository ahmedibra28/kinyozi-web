import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import Barbershop from '../../../../models/Barbershop'
import db from '../../../../config/db'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query

      const object = await Barbershop.findById(id)

      res.status(200).json(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const { name, mobile, street, city, country, district } = req.body

      const object = await Barbershop.findById(id)

      if (!object)
        return res.status(400).json({ error: `Barbershop not found` })

      object.name = name
      object.mobile = mobile
      object.street = street
      object.city = city
      object.country = country
      object.district = district

      await object.save()
      res.status(200).json({ message: `Barbershop updated` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.delete(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const object = await Barbershop.deleteOne({ _id: id })
      if (!object)
        return res.status(400).json({ error: `Barbershop not found` })

      res.status(200).json({ message: `Barbershop removed` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
