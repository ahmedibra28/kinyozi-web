import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import { Rating } from '@/lib/Rating'

export async function GET(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    let userObj = await prisma.user.findUnique({
      where: { id: req.user.id, platform: 'MOBILE' },
      select: {
        id: true,
        name: true,
        mobile: true,
        image: true,
        address: true,
        role: {
          select: {
            type: true,
          },
        },
      },
    })

    return NextResponse.json({
      ...userObj,
      role: userObj?.role?.type,
      rating: await Rating({ user: userObj?.id }),
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
