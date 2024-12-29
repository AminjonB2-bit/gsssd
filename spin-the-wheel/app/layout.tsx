import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import ClientLayout from './client-layout'
import { BalanceProvider } from './context/BalanceContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DFYRE Spin & Win',
  description: 'Spin the wheel to win DFIRE tokens or SOL!',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script 
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <BalanceProvider>
        <ClientLayout inter={inter.className}>{children}</ClientLayout>
      </BalanceProvider>
    </html>
  )
}

