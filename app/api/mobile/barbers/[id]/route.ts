import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const { status } = await req.json()

    if (!['ACTIVE', 'INACTIVE'].includes(status))
      return getErrorResponse('Invalid status', 400)

    const object = await prisma.user.findUnique({
      where: { id: `${params.id}`, platform: 'MOBILE' },
    })

    if (!object) return getErrorResponse('User profile not found', 404)

    const result = await prisma.user.update({
      where: { id: params.id },
      data: {
        status,
        ...(status === 'INACTIVE' && { barbershopId: null }),
      },
    })

    if (!result) return getErrorResponse('User profile not found', 404)

    return NextResponse.json({
      message: 'Profile has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
