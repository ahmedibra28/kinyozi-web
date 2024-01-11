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

export async function GET(req: NextApiRequestExtended, { params }: Params) {
  try {
    await isAuth(req, params)

    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const query =
      startDate && endDate
        ? {
            appointment: {
              clientId: params.id,
            },
            dateTime: {
              gt: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
              lt: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
            },
          }
        : {
            appointment: {
              clientId: params.id,
            },
          }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.transaction.findMany({
        where: query as any,
        include: {
          appointment: {
            select: {
              specialty: true,
              dateTime: true,
              barber: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  mobile: true,
                  rating: true,
                },
              },
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({ where: query as any }),
    ])

    const pages = Math.ceil(total / pageSize)

    const resultWithRating = await Promise.all(
      result.map(async (user) => {
        return {
          ...user,
          appointment: {
            ...user.appointment,
            barber: {
              ...user.appointment.barber,
              rating: await Rating({ user: user.appointment.barber.id }),
            },
          },
        }
      })
    )

    return NextResponse.json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: resultWithRating,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
