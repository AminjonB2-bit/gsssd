'use client'

import { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import { BalanceProvider } from './context/BalanceContext'
import { SimpleNavigation } from './components/SimpleNavigation'

interface ClientLayoutProps {
  children: React.ReactNode
  inter: string
}

export default function ClientLayout({ children, inter }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <body className={`${inter} bg-[#0F172A] text-white`}>
      <BalanceProvider>
        {isLoading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-[#0F172A] z-50">
            <Loader className="w-12 h-12 animate-spin text-blue-400" />
          </div>
        ) : (
          <div className="min-h-screen pb-16">
            {children}
            <SimpleNavigation />
          </div>
        )}
      </BalanceProvider>
    </body>
  )
}

