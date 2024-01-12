import { generateToken, getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import { allowedNumber } from '@/lib/demoNumbers'

export async function POST(req: Request) {
  try {
    const { otp, id } = await req.json()

    if (!id || !otp) return getErrorResponse(`Invalid OTP`)

    const user =
      id &&
      otp &&
      (await prisma.user.findFirst({
        where: {
          id: id,
          platform: 'MOBILE',
          role: {
            OR: [{ type: 'CLIENT' }, { type: 'BARBER' }],
          },
        },
        select: {
          id: true,
          name: true,
          mobile: true,
          image: true,
          blocked: true,
          confirmed: true,
          address: true,
          rating: true,
          otp: true,
          role: {
            select: {
              type: true,
            },
          },
        },
      }))

    if (!user) return getErrorResponse(`Invalid OTP`)

    if (user.blocked || !user.confirmed)
      return getErrorResponse(`User blocked or not confirmed`)

    if (allowedNumber.includes(user.mobile)) {
      // login automatically if mobile number is allowed

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          otp: null,
        },
      })

      return NextResponse.json({
        ...user,
        role: user.role.type,
        token: await generateToken(user.id),
        message: 'User has been logged in successfully',
      })
    }

    if (user.otp !== String(otp)) return getErrorResponse(`Invalid OTP`)

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        otp: null,
      },
    })

    return NextResponse.json({
      ...user,
      role: user.role.type,
      token: await generateToken(user.id),
      message: 'User has been logged in successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
