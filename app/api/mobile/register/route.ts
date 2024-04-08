import { encryptPassword, getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import { sendSMS } from '@/lib/SMS'
import { allowedNumber } from '@/lib/demoNumbers'

export async function POST(req: Request) {
  try {
    const {
      name,
      mobile,
      address,
      numberOfTimes,
      favoriteBarber,
      // barbershopId,
      // barbershopName,
      type,
    } = await req.json()

    const allowedNumberKeys = ['70', '71', '72', '74', '75', '79', '61']

    if (mobile.length !== 9)
      return getErrorResponse(`Mobile number must be 9 digits`)

    if (!allowedNumberKeys.includes(mobile.slice(0, 2)))
      return getErrorResponse(`Invalid mobile number`)

    if (mobile.slice(0, 2) === '61') {
      if (!allowedNumber.includes(mobile))
        return getErrorResponse(`Invalid mobile number`)
    }

    const checkExistence =
      mobile &&
      (await prisma.user.findFirst({
        where: {
          mobile: Number(mobile),
        },
      }))
    if (checkExistence) return getErrorResponse(`User already exists`)

    const otp = Math.floor(1000 + Math.random() * 9000)

    const user = await prisma.user.create({
      data: {
        platform: 'MOBILE',
        name,
        mobile: Number(mobile),
        email: `${mobile}@kinyozi.app`,
        password: await encryptPassword({ password: String(mobile) }),
        address,
        otp: String(otp),
        image: `https://ui-avatars.com/api/?uppercase=true&name=${name}&background=random&color=random&size=128`,
        confirmed: true,
        blocked: false,
        ...(type === 'BARBER'
          ? {
              // barbershopId: Number(barbershopId),
              status: 'PENDING',
              // barbershopName,
              roleId: 'a75POUlJzMDmaJtz0JCxp',
            }
          : {
              favoriteBarber,
              numberOfTimes: Number(numberOfTimes),
              roleId: 'jopfvuBeup6d3mjyQqYgD',
            }),
      },
    })

    if (!user) return getErrorResponse(`Error creating user`)

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
      console.log(user)
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
