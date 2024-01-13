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

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const { name, address, pushToken, barbershopId, barbershopName } =
      await req.json()

    const object = await prisma.user.findUnique({
      where: { id: `${params.id}`, platform: 'MOBILE' },
    })

    if (!object) return getErrorResponse('User profile not found', 404)

    const result = await prisma.user.update({
      where: { id: params.id },
      data: {
        name: name || object.name,
        address: address || object.address,
        pushToken: pushToken || object.pushToken,
        barbershopId: barbershopId || object.barbershopId,
        barbershopName: barbershopName || object.barbershopName,
        ...(barbershopId &&
          object?.barbershopId !== barbershopId && { status: 'PENDING' }),
      },
    })

    return NextResponse.json({
      name: result.name,
      address: result.address,
      rating: await Rating({ user: result?.id }),
      message: 'Profile has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
