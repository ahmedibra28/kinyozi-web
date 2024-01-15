interface Props {
  title?: string
  description?: string
  author?: string
  image?: string
  keyword?: string
  asPath?: string
}

const Meta = ({
  title = 'Kinyozi App',
  description = `Kinyozi App is a barber appointment app that allows you to book an appointment with your favorite barber, and also allows you to pay for the service online.`,
  image: outsideImage = 'https://kinyozi.app/logo.png',
  asPath = '/',
  author = 'Ahmed Ibrahim',
  keyword = 'Ahmed',
}: Props) => {
  const url = `https://kinyozi.app${asPath}`
  const image = outsideImage
    ? `https://kinyozi.app${outsideImage}`
    : `https://kinyozi.app/logo.png`

  return {
    // viewport: {
    //   width: 'device-width',
    //   initialScale: 1,
    //   maximumScale: 1,
    // },
    title: title ? title : title,
    description: description ? description : description,
    image: image,

    metadataBase: new URL('https://kinyozi.app'),
    alternates: {
      canonical: url,
      languages: {
        'en-US': '/en-US',
      },
    },
    openGraph: {
      type: 'website',
      images: image,
      title: title ? title : title,
      description: description ? description : description,
    },
    keywords: [
      `${keyword} Kinyozi, kinyozi app, Ahmed Ibrahim, Ahmed Ibrahim Samow`,
    ],
    authors: [
      {
        name: author ? author : author,
        url: 'https://kinyozi.app',
      },
    ],
    publisher: author ? author : author,
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icon: '/logo.png',
    twitter: {
      card: 'summary_large_image',
      title: title ? title : title,
      description: description ? description : description,
      // siteId: '1467726470533754880',
      // creatorId: '1467726470533754880',
      creator: `@${author ? author : author}`,
      images: {
        url: image,
        alt: title ? title : title,
      },
      app: {
        name: 'twitter_app',
        id: {
          iphone: 'twitter_app://iphone',
          ipad: 'twitter_app://ipad',
          googleplay: 'twitter_app://googleplay',
        },
        url: {
          iphone: image,
          ipad: image,
        },
      },
    },
    appleWebApp: {
      title: title ? title : title,
      statusBarStyle: 'black-translucent',
      startupImage: [
        '/logo.png',
        {
          url: '/logo.png',
          media: '(device-width: 768px) and (device-height: 1024px)',
        },
      ],
    },
    verification: {
      google: 'google',
      yandex: 'yandex',
      yahoo: 'yahoo',
      other: {
        me: ['info@kinyozi.app', 'http://kinyozi.app'],
      },
    },
  }
}
export default Meta
