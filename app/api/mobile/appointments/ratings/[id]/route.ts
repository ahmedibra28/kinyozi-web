import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import { Rating } from '@/lib/Rating'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: NextApiRequestExtended, { params }: Params) {
  try {
    await isAuth(req, params)

    const { id, rating, description } = await req.json()

    if (!rating || rating < 1 || rating > 5)
      return getErrorResponse('Rating must be between 1 and 5')

    const isAlreadyRated = await prisma.appointment.findFirst({
      where: {
        id: `${params.id}`,
        status: 'COMPLETED',
        barber: {
          id: id,
        },
        transaction: {
          rating: {
            not: null,
          },
        },
      },
    })

    if (isAlreadyRated) return getErrorResponse('Appointment is already rated')

    const barber = await prisma.appointment.findFirst({
      where: {
        id: `${params.id}`,
        status: 'COMPLETED',
        clientId: req.user.id,
      },
    })

    if (!barber) return getErrorResponse('Appointment not found')

    await prisma.$transaction(async (prisma) => {
      const t = await prisma.transaction.update({
        where: {
          appointmentId: `${params.id}`,
        },
        data: {
          rating: Number(rating),
          ratingDescription: description,
        },
      })

      if (!t) throw { message: 'Transaction could not be updated', status: 400 }

      const ratingObj = await Rating({ user: barber?.barberId })

      let count = (ratingObj?.count || 0) + 1
      let average = (ratingObj?.average || 0) * (ratingObj?.count || 0)
      average += rating
      let newAverage = average / count

      const rate = await prisma.rating.upsert({
        // @ts-ignore
        where: {
          barberId: barber?.barberId,
        },
        update: {
          average: Number(newAverage.toFixed(1)),
          count: count,
        },
        create: {
          barberId: barber?.barberId,
          average: Number(newAverage.toFixed(1)),
          count: count,
        },
      })

      if (!rate) throw { message: 'Rating could not be updated', status: 400 }
    })

    return NextResponse.json({
      message: 'Rating updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
