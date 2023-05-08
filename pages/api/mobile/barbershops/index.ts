import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import Profile from '../../../../models/Profile'
import db from '../../../../config/db'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { q, role } = req.query

      let query = Profile.find(
        q ? { name: { $regex: q, $options: 'i' }, role } : { role }
      )

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Profile.countDocuments(
        q ? { name: { $regex: q, $options: 'i' }, role } : { role }
      )

      const pages = Math.ceil(total / pageSize)

      query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 }).lean()

      const result = await query

      res.status(200).json({
        startIndex: skip + 1,
        endIndex: skip + result.length,
        count: result.length,
        page,
        pages,
        total,
        data: result,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { name, mobile, street, city, country, district } = req.body

      const exist = await Profile.findOne({
        // name: { $regex: `^${name?.trim()}$`, $options: 'i' },
        mobile,
      })
      if (exist)
        return res.status(400).json({ error: 'Duplicate Profile detected' })

      const object = await Profile.create({
        name,
        mobile,
        address: `${street?.trim()}, ${district?.trim()}, ${city?.trim()}, ${country?.trim()}`,
        street,
        city,
        district,
        country,
        createdBy: req.user._id,
      })
      res.status(200).send(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
