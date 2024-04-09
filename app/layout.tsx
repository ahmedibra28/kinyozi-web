import Meta from '@/components/Meta'
import './globals.css'
import { Roboto } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Providers from '@/lib/provider'
import Link from 'next/link'
import Image from 'next/image'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '500', '700', '900'],
})

export const metadata = {
  ...Meta({}),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>

      <body
        className={`${roboto.className} bg-gray-100`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <div className='navbar z-50 h-[68px] flex justify-between items-center bg-white px-5'>
            <div>
              <Link href='/' className='w-24 normal-case text-xl'>
                <Image
                  src='/logo.png'
                  width={40}
                  height={40}
                  alt='logo'
                  className='rounded'
                />
              </Link>
            </div>
            <Navigation />
          </div>
          <div className='mx-autos px-2'>
            <main className='min-h-[85.5vh]'>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
