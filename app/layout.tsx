import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Run — Sean Andrews',
  description:
    'An interactive 3D ski mountain portfolio. Ski down and discover my projects.',
  openGraph: {
    title: 'The Run — Sean Andrews',
    description: 'An interactive 3D ski mountain portfolio.',
    url: 'https://world.seanjandrews.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body>{children}</body>
    </html>
  )
}
