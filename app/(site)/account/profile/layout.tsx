import React from 'react'
import Meta from '@/components/Meta'
import Footer from '@/components/Footer'

export const metadata = {
  ...Meta({
    title: 'Profile',
  }),
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='mx-auto max-w-6xl'>
      <main className='flex flex-col'>
        {children} <Footer />
      </main>
    </div>
  )
}
