import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Users',
  }),
}

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='mx-auto max-w-6xl'>
      <main className='flex flex-col'>{children}</main>
    </div>
  )
}
