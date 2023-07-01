import nc from 'next-connect'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'
import User from '../../../../models/User'
import UserRole from '../../../../models/UserRole'
import { sendSMS } from '../../../../utils/help'

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { name, address, mobile } = req.body

      const allowedNumberKeys = ['70', '71', '72', '74', '75', '79']

      if (mobile.length !== 9)
        return res.status(400).json({ error: 'Invalid mobile number' })

      if (!allowedNumberKeys.includes(mobile.slice(0, 2)))
        return res.status(400).json({ error: 'Invalid mobile number' })

      const email = `${mobile}@kinyozi.app`
      const confirmed = true
      const blocked = false

      //   return res.status(200).json({ mobile })

      const object = await User.create({
        name,
        email,
        mobile,
        confirmed,
        blocked,
      })

      object.getRandomOtp()
      const otpGenerate = await object.save()
      if (!otpGenerate) {
        await object.remove()
        return res.status(400).json({ error: 'OTP not generated' })
      }

      await Profile.create({
        user: object._id,
        name: object.name,
        image: `https://ui-avatars.com/api/?uppercase=true&name=${object.name}&background=random&color=random&size=128`,
        mobile,
        address,
        role: 'BARBER',
      })

      await UserRole.create({
        user: object._id,
        role: '5e0af1c63b6482125c1b44ce', // Barber role
      })

      console.log(object)

      const data = await sendSMS(`254${mobile}`, `Your OTP is ${object.otp}`)
      // 254743551250

      if (data.responses[0]['response-code'] !== 200)
        return res
          .status(400)
          .json({ error: data.responses[0]['response-code'] })

      res.status(200).json({ _id: object._id, otp: object.opt })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
