import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

export async function POST(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { dateTime, specialty, barber } = await req.json()

    if (req.user.role !== 'CLIENT' || !dateTime || !specialty)
      return getErrorResponse(`You can't create appointment`)

    if (new Date(dateTime) < new Date())
      return getErrorResponse(`You can't create appointment in past`)

    //  Date & Time should be between 7:00 AM to 11:59 PM if not return error
    const date = new Date(dateTime)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const milliseconds = date.getMilliseconds()
    const time =
      hours * 60 * 60 * 1000 +
      minutes * 60 * 1000 +
      seconds * 1000 +
      milliseconds

    if (time < 25200000 || time > 86399000)
      return getErrorResponse(
        `You can't create appointment before 7:00 AM or after 11:59 PM`
      )

    const checkPending = await prisma.appointment.findFirst({
      where: {
        clientId: req.user.id,
        status: 'PENDING',
      },
    })

    if (checkPending)
      return getErrorResponse(
        `You already have an appointment at ${checkPending.dateTime?.toLocaleString()}`
      )

    const checkExistence = await prisma.appointment.findFirst({
      where: {
        barberId: barber,
        dateTime: {
          gt: new Date(new Date(dateTime).setMinutes(0, 0, 0)),
          lt: new Date(new Date(dateTime).setMinutes(59, 59, 999)),
        },
        status: 'PENDING',
      },
    })

    if (checkExistence)
      return getErrorResponse(
        `The barber is already booked at ${dateTime.toLocaleString()}`
      )

    const appointmentObj = await prisma.appointment.create({
      data: {
        dateTime,
        specialty,
        clientId: req.user.id,
        barberId: barber,
        status: 'PENDING',
      },
    })

    if (!appointmentObj)
      return getErrorResponse('Appointment could not be created')

    return NextResponse.json({
      ...appointmentObj,
      message: 'Appointment created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
