import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { headers } from 'next/headers'
import './globals.css'
import { Providers } from './providers'

const inter = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'LaundryStrap — Never Lose a Garment Again',
  description:
    'Professional laundry service with photo verification and item tracking. Every garment photographed, tagged, and tracked.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Geist Mono for tag IDs and code */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className={`${inter.variable} font-sans antialiased`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
