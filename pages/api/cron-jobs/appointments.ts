import nc from 'next-connect'
import db from '../../../config/db'
import Appointment from '../../../models/Appointment'
import moment from 'moment'
import Profile from '../../../models/Profile'
import axios from 'axios'

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const startDate = moment(new Date()).startOf('day')
      const endDate = moment(new Date()).endOf('day').add(1, 'day')

      let appointments = await Appointment.find(
        {
          appointmentDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
        { client: 1, appointmentDate: 1, appointmentTime: 1, barber: 1 }
      ).lean()

      if (appointments.length === 0) return res.json([])

      interface IAppointment {
        _id: string
        client: string
        barber: string
        appointmentDate: string
      }

      appointments = appointments?.map((item: any) => ({
        ...item,
        appointmentDate: moment(item?.appointmentDate)
          .add(Number(item?.appointmentTime?.split(' -')?.[0]) - 3, 'hours')
          .format(),
      })) as IAppointment[]

      const getAppointmentsWithinTheNext12Hours = (
        appointments: IAppointment[]
      ): IAppointment[] => {
        const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000
        const currentDateTime = new Date().getTime()

        const filteredAppointments = appointments.filter((appointment) => {
          const appointmentDateTime = new Date(
            appointment.appointmentDate
          ).getTime()
          const timeDifference = appointmentDateTime - currentDateTime
          return (
            timeDifference > 0 && timeDifference <= twelveHoursInMilliseconds
          )
        })

        return filteredAppointments
      }

      appointments = getAppointmentsWithinTheNext12Hours(appointments as any)

      appointments = await Promise.all(
        appointments.map(async (appointment) => {
          const clientProfile = await Profile.findOne({
            user: appointment.client,
          })
            .lean()
            .select('name settings.pushToken')

          return {
            ...appointment,
            client: clientProfile,
          }
        })
      )

      //  send notification

      interface IAppointment2 {
        _id: string
        client: {
          _id: string
          name: string
          settings: {
            pushToken: string
          }
        }
        barber: string
        appointmentDate: string
        appointmentTime: string
      }

      type AppointmentsData = IAppointment2[][]

      const tokens = appointments.filter(
        (token) => token?.client?.settings?.pushToken !== ''
      ) as IAppointment2[]

      const splittedTokens: AppointmentsData = tokens.reduce(
        (acc: any, curr, index) => {
          const group = Math.floor(index / 50)
          if (!acc[group]) {
            acc[group] = []
          }
          acc[group].push(curr)
          return acc
        },
        []
      )

      const notificationResults = await Promise.all(
        splittedTokens.map(async (tokens) => {
          const messages = tokens.map((token) => ({
            to: token?.client?.settings?.pushToken,
            title: 'Appointment',
            body: `You have a new appointment at ${moment(
              token?.appointmentDate
            ).format('HH:mm')} on ${moment(token.appointmentDate).format(
              'dddd'
            )}`,

            data: {
              screen: 'BarberAppointment',
              params: { _id: token?.barber },
            },
          }))

          const { data } = await axios.post(
            'https://exp.host/--/api/v2/push/send',
            messages,
            {
              headers: {
                Host: 'exp.host',
                Accept: 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
              },
            }
          )

          return data
        })
      )

      return res
        .status(200)
        .send(notificationResults?.map((item) => item?.data).flat())
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
