import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Marsana Fleet Management',
    short_name: 'Marsana Fleet',
    description: 'Modern fleet management application',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f0f0f',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
