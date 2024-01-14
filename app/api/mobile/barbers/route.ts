import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { QueryMode, prisma } from '@/lib/prisma.db'
import { Rating } from '@/lib/Rating'

export async function GET(req: Request) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const status = searchParams.get('status')

    const query = q
      ? {
          name: { contains: q, mode: QueryMode.insensitive },
          role: { type: 'BARBER' },
          platform: 'MOBILE',
          confirmed: true,
          blocked: false,
          ...(status && { status: 'ACTIVE' }),
        }
      : {
          role: { type: 'BARBER' },
          platform: 'MOBILE',
          confirmed: true,
          blocked: false,
          ...(status && { status: 'ACTIVE' }),
        }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.user.findMany({
        where: query as any,
        select: {
          id: true,
          name: true,
          image: true,
          mobile: true,
          address: true,
          barbershopId: true,
          barbershopName: true,
          status: true,
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where: query as any }),
    ])

    const pages = Math.ceil(total / pageSize)

    const resultWithRating = await Promise.all(
      result.map(async (user) => {
        return {
          ...user,
          rating: await Rating({ user: user.id }),
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
