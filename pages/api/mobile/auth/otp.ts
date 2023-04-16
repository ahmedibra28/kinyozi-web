import nc from 'next-connect'
import db from '../../../../config/db'
import User from '../../../../models/User'
import { generateToken } from '../../../../utils/auth'
import UserRole from '../../../../models/UserRole'
import Profile from '../../../../models/Profile'

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      await db()

      const { _id, otp } = req.body
      if (!otp) return res.status(400).json({ error: 'Please enter your OTP' })

      const user = await User.findOne({
        _id,
        otp,
        otpExpire: { $gt: Date.now() },
      }).select('blocked confirmed otp otpExpire name, mobile')

      if (!user)
        return res.status(400).json({ error: `Invalid OTP or expired` })

      if (user.blocked)
        return res.status(401).send({ error: 'User is blocked' })

      if (!user.confirmed)
        return res.status(401).send({ error: 'User is not confirmed' })

      user.otp = undefined
      user.otpExpire = undefined

      await user.save()

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

      const profile = await Profile.findOne(
        { user: user._id },
        { image: 1, address: 1 }
      )
      return res.send({
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        address: profile.address,
        image: profile.image,
        role: roleObj.role.type,
        token: generateToken(user._id),
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler