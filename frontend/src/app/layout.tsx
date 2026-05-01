import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'STRIX — Autonomous Hospitality OS',
  description: 'AI-powered operating system for short-term rentals',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
