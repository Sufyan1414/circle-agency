import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import MagneticCursor from '@/components/MagneticCursor'
import { AudioEngineProvider } from '@/components/AudioEngine'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Circle | Elite Enterprise Software Engineering & Fractional CTO Services',
  description:
    'We engineer resilient cloud systems, scale distributed data pipelines, and provide fractional tech governance for Tier-1 global enterprise networks and venture-backed startups.',
  keywords: [
    'Fractional CTO',
    'Enterprise Web Development',
    'Next.js 3D Agency',
    'Custom AI Systems Architecture',
    'Circle Technology',
  ],
  openGraph: {
    title: 'Circle | Elite Enterprise Software Engineering & Fractional CTO Services',
    description:
      'We engineer resilient cloud systems, scale distributed data pipelines, and provide fractional tech governance for Tier-1 global enterprise networks and venture-backed startups.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Circle',
    url: 'https://circle.engineering',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Circle - Scale for Global Enterprises',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#010102',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-[family-name:var(--font-inter)] antialiased">
        <AudioEngineProvider>
          {/* Magnetic cursor — client-only, no SSR flash */}
          <MagneticCursor />

          {/* Film-grain noise overlay for luxury texture */}
          <div className="noise-overlay" aria-hidden="true" />

          {children}
        </AudioEngineProvider>
      </body>
    </html>
  )
}
