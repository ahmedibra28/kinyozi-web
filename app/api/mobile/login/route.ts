import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import { sendSMS } from '@/lib/SMS'
import { allowedNumber } from '@/lib/demoNumbers'

export async function POST(req: Request) {
  try {
    const { mobile } = await req.json()

    const allowedNumberKeys = ['70', '71', '72', '74', '75', '79', '61']

    if (mobile.length !== 9)
      return getErrorResponse(`Mobile number must be 9 digits`)

    if (!allowedNumberKeys.includes(mobile.slice(0, 2)))
      return getErrorResponse(`Invalid mobile number`)

    if (mobile.slice(0, 2) === '61') {
      if (!allowedNumber.includes(mobile))
        return getErrorResponse(`Invalid mobile number`)
    }

    const user =
      mobile &&
      (await prisma.user.findFirst({
        where: {
          mobile: Number(mobile),
          platform: 'MOBILE',
          role: {
            OR: [{ type: 'CLIENT' }, { type: 'BARBER' }],
          },
        },
      }))

    if (!user) return getErrorResponse(`Invalid credentials`)

    if (user.blocked || !user.confirmed)
      return getErrorResponse(`User blocked or not confirmed`)

    const otp = Math.floor(1000 + Math.random() * 9000)

    const otpObj = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        otp: String(otp),
      },
    })

    if (!otpObj || !otp) return getErrorResponse(`Error generating OTP`)

    if (mobile.slice(0, 2) === '61') {
      console.log({ otp: otpObj.otp })
      return NextResponse.json({
        id: user.id,
        message: 'OTP sent successfully',
      })
    }

    await sendSMS(`254${mobile}`, `Your OTP is ${user.otp}`)

    return NextResponse.json({ id: user.id, message: 'OTP sent successfully' })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
