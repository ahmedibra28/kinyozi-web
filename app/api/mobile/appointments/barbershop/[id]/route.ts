import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import type { AppointmentStatus as IAppointmentStatus } from '@prisma/client'

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
            status: 'PENDING' as IAppointmentStatus,
            barber: { barbershopId: parseInt(params.id) },
            dateTime: {
              gt: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
              lt: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
            },
          }
        : {
            status: 'PENDING' as IAppointmentStatus,
            barber: { barbershopId: parseInt(params.id) },
          }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.appointment.findMany({
        where: query,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              image: true,
              mobile: true,
            },
          },
          barber: {
            select: {
              id: true,
              name: true,
              image: true,
              mobile: true,
              barbershopId: true,
              barbershopName: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.appointment.count({ where: query }),
    ])

    const pages = Math.ceil(total / pageSize)

    return NextResponse.json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
