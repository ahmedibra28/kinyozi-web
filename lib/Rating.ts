import { prisma } from '@/lib/prisma.db'

type Rate = {
  average: number
  count: number
}

export const Rating = async ({
  user,
}: {
  user?: string
}): Promise<Rate | null> => {
  if (!user) return null
  try {
    const rating = await prisma.rating.findFirst({
      where: {
        barberId: `${user}`,
      },
      select: {
        average: true,
        count: true,
      },
    })

    if (!rating) return null

    return rating
  } catch (error: any) {
    throw {
      message: error.message,
      status: 500,
    }
  }
}
