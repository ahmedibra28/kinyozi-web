import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import type { Appointment as IAppointment, User as IUser } from '@prisma/client'

export interface AppointmentType extends IAppointment {
  client: IUser
  barber: IUser
}

export async function POST(req: NextApiRequestExtended) {
  try {
    let appointments = await prisma.appointment.findMany({
      where: {
        dateTime: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        status: 'PENDING',
      },
      select: {
        id: true,
        dateTime: true,
        specialty: true,
        client: {
          select: {
            id: true,
            pushToken: true,
          },
        },
        barber: {
          select: {
            name: true,
          },
        },
      },
    })

    appointments = appointments.filter(
      (appointment) => appointment.client.pushToken
    )

    // group by 30 by 30 if the appointments are more than 30
    const groupedAppointments = appointments.reduce(
      (acc: any, appointment, index) => {
        const chunkIndex = Math.floor(index / 30)

        if (!acc[chunkIndex]) {
          acc[chunkIndex] = []
        }

        acc[chunkIndex].push(appointment)

        return acc
      },
      []
    )

    // send notification to all
    for (const appointments of groupedAppointments) {
      const pushTokens = appointments.map(
        (appointment: AppointmentType) => appointment.client.pushToken
      )

      const messages = pushTokens.map((pushToken: string) => ({
        to: pushToken,
        sound: 'default',
        title: 'Appointment Reminder',
        body: `You have an appointment at ${new Date(
          appointments[0].dateTime
        ).toLocaleTimeString()} by ${appointments[0].barber.name}`,
      }))

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Host: 'exp.host',
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      })
    }

    return NextResponse.json({
      message: `Sent ${appointments.length} notifications`,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
