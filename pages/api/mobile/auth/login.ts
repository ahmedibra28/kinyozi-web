import nc from 'next-connect'
import db from '../../../../config/db'
import User from '../../../../models/User'
import UserRole from '../../../../models/UserRole'
import { sendSMS } from '../../../../utils/help'

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      await db()

      const { mobile } = req.body
      const allowedNumberKeys = ['70', '71', '72', '74', '75', '79']

      if (mobile.length !== 9)
        return res.status(400).json({ error: 'Invalid mobile number' })

      if (!allowedNumberKeys.includes(mobile.slice(0, 2)))
        return res.status(400).json({ error: 'Invalid mobile number' })

      const user = await User.findOne({ mobile })

      if (!user) return res.status(404).json({ error: 'User not found' })

      if (user.blocked)
        return res.status(401).send({ error: 'User is blocked' })

      if (!user.confirmed)
        return res.status(401).send({ error: 'User is not confirmed' })

      const roleObj = await UserRole.findOne({ user: user?._id })
        .lean()
        .populate({
          path: 'role',
          select: 'type',
        })

      if (!roleObj)
        return res
          .status(404)
          .json({ error: 'This user does not have associated role' })

      user.getRandomOtp()
      const otpGenerate = await user.save()
      if (!otpGenerate)
        return res.status(400).json({ error: 'OTP not generated' })

      const data = await sendSMS(`254${mobile}`, `Your OTP is ${user.otp}`)
      // 254743551250

      if (data.responses[0]['response-code'] !== 200)
        return res
          .status(400)
          .json({ error: data.responses[0]['response-code'] })

      return res.json({ _id: user._id, otp: user.otp })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
