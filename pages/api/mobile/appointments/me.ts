import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import Appointment from '../../../../models/Appointment'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'

const handler = nc()
handler.use(isAuth)

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { _id, role } = req.user

      if (role === 'CLIENT') {
        const myAppointment = await Appointment.findOne({
          client: _id,
          status: 'pending',
        }).lean()

        if (!myAppointment) return res.json([])

        const barber = await Profile.findOne({
          user: myAppointment?.barber,
        }).lean()

        return res.status(200).json({
          ...myAppointment,
          barber: { ...barber, user: myAppointment._id },
        })
      }

      if (role === 'BARBER') {
        let myAppointment = await Appointment.find({
          barber: _id,
          status: 'pending',
        })
          .limit(5)
          .sort({ appointmentDate: 1 })
          .lean()
          .select('-createdAt -updatedAt -__v')

        if (!myAppointment) return res.json([])

        myAppointment = await Promise.all(
          myAppointment?.map(async (item) => {
            const client = await Profile.findOne({
              user: item?.client,
            })
              .lean()
              .select('_id name image role user mobile')

            return { ...item, client }
          })
        )

        console.log(myAppointment)

        return res.status(200).json(myAppointment)
      }

      return res.status(200).json([])
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
