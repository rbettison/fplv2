import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/global/Header'
import AuthProvider from './contexts/AuthProvider'
import LeaguesProvider from './contexts/LeaguesProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FPL Dash.',
  description: 'Fantasy Premier League Reports and Analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthProvider>
      <LeaguesProvider>
      <body className={`${inter.className} relative text-[#000042] bg-gray-50 pt-20 min-h-screen`}>
        <Header />
        {children}
        
      </body>
      </LeaguesProvider>
      </AuthProvider>
    </html>
  )
}
