import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: NextApiRequestExtended, { params }: Params) {
  try {
    await isAuth(req, params)

    const { status, service, amount } = await req.json()

    const isPending = await prisma.appointment.findFirst({
      where: {
        id: `${params.id}`,
        status: 'PENDING',
        ...(req.user.role === 'CLIENT' && { clientId: req.user.id }),
        ...(req.user.role === 'BARBER' && { barberId: req.user.id }),
      },
    })

    if (!isPending)
      return getErrorResponse(
        `Appointment is not pending or you don't have permission to update it`
      )

    if (status === 'COMPLETED') {
      await prisma.$transaction(async (prisma) => {
        const appointmentObj = await prisma.appointment.update({
          where: { id: `${params.id}` },
          data: { status },
        })

        if (!appointmentObj)
          throw { message: 'Appointment could not be updated', status: 400 }

        const transaction = await prisma.transaction.create({
          data: {
            appointmentId: `${params.id}`,
            service,
            amount: Number(amount),
          },
        })

        if (!transaction)
          throw { message: 'Transaction could not be created', status: 400 }
      })

      return NextResponse.json({
        message: 'Appointment updated successfully',
      })
    }

    const appointmentObj = await prisma.appointment.update({
      where: { id: `${params.id}` },
      data: { status },
    })

    if (!appointmentObj)
      return getErrorResponse('Appointment could not be updated')

    return NextResponse.json({
      ...appointmentObj,
      message: 'Appointment updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
