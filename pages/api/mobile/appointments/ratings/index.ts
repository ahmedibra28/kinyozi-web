import nc from 'next-connect'
import { isAuth } from '../../../../../utils/auth'
import db from '../../../../../config/db'
import Profile from '../../../../../models/Profile'

const handler = nc()
handler.use(isAuth)

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const topRatedBarbers = await Profile.aggregate([
        {
          $match: {
            'rating.count': { $gt: 0 }, // only consider barbers who have at least one rating
          },
        },
        {
          $addFields: {
            'rating.average': { $divide: ['$rating.average', '$rating.count'] }, // calculate the actual average rating
          },
        },
        {
          $sort: {
            'rating.average': -1, // sort by average rating in descending order
            'rating.count': -1, // sort by count in descending order (to break ties)
          },
        },
        {
          $limit: 10, // get only the top 10
        },
      ])

      res.status(200).json(topRatedBarbers)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
