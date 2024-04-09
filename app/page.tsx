import Image from 'next/image'
import { FaAppStore, FaGooglePlay } from 'react-icons/fa6'

export default function Home() {
  return (
    <main
      className='flex flex-col bg-gray-100 p-0 m-0 mb-10'
      style={
        {
          // backgroundImage: 'url(/wave.svg); background-repeat: no-repeat;',
        }
      }
    >
      <div className='mx-auto py-3 flex flex-col md:flex-row gap-y-10 md:justify-between items-center h-screen max-w-6xl md:mt-20'>
        <div className='space-y-10 w-full md:w-[48%] mx-auto md:-mt-20 duration-1000 mt-auto'>
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-primary duration-1000 text-center md:text-start'>
            Book Your Next Haircut with Ease
          </h1>
          <div className='text-center md:text-start text-gray-700 space-y-2'>
            <p> Discover the easiest way to book your next haircut. </p>
            <p>
              <strong>Kinyozi App </strong> streamlines the process, connecting
              you with top barbers for personalized grooming experiences.
            </p>
            <p>Say goodbye to long waits and missed appointments.</p>

            <p>
              Download now and experience the future of seamless barber
              bookings.
            </p>
          </div>

          <div className='flex-col lg:flex-row gap-x-3 justify-center md:justify-start hidden md:flex'>
            <button className='bg-gray-700 border-2 border-gray-300 px-4 py-2 w-60 text-white rounded-2xl shadow-md flex items-center text-start gap-x-2 hover:scale-105 duration-700 mx-auto lg:mx-0'>
              <FaAppStore className='text-3xl' />
              <span>
                <span>Download on the</span> <br />
                <span className='font-bold text-lg'>App Store</span>
              </span>
            </button>

            <a
              href='https://play.google.com/store/apps/details?id=com.kinyozi.app'
              target='_blank'
              className='bg-gray-700 border-2 border-gray-300 px-4 py-2 w-60 text-white rounded-2xl shadow-md flex items-center text-start gap-x-2 hover:scale-105 duration-700 mx-auto lg:mx-0'
            >
              <FaGooglePlay className='text-3xl' />
              <span>
                <span>Get in on</span> <br />
                <span className='font-bold text-lg'>Google Play</span>
              </span>
            </a>
          </div>
        </div>

        <div className='w-full md:w-[48%] mx-auto duration-1000 mb-5 pb-5'>
          <Image
            src='/kinyozi.png'
            width={1000}
            height={1000}
            quality={100}
            alt='kinyozi app'
            className='mx-auto w-[50%] lg:w-[80%] duration-1000'
          />

          <div className='flex flex-row gap-x-3 justify-center md:justify-center md:hidden mt-10 text-xs'>
            <button className='bg-gray-700 border-2 border-gray-300 px-2 py-2 w-40 text-white rounded-2xl shadow-md flex items-center text-start gap-x-2 hover:scale-105 duration-700 mx-auto lg:mx-0'>
              <FaAppStore className='text-xl' />
              <span>
                <span>Download on the</span> <br />
                <span className='font-bold'>App Store</span>
              </span>
            </button>

            <a
              href='https://play.google.com/store/apps/details?id=com.kinyozi.app'
              target='_blank'
              className='bg-gray-700 border-2 border-gray-300 px-2 py-2 w-40 text-white rounded-2xl shadow-md flex items-center text-start gap-x-2 hover:scale-105 duration-700 mx-auto lg:mx-0'
            >
              <FaGooglePlay className='text-xl' />
              <span>
                <span>Get in on</span> <br />
                <span className='font-bold'>Google Play</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
