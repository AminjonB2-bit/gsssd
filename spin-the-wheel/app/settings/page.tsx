'use client'

import { useState, useEffect } from 'react'
import { Copy, Globe2, Users, HeadphonesIcon, HelpCircle, Scale } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Get user data from Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tgUser = window.Telegram.WebApp.initDataUnsafe?.user
      if (tgUser) {
        setUser(tgUser)
      }
    }
  }, [])

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#1a237e] to-[#0d47a1] text-white pb-16">
      <DynamicSnowfall snowflakeCount={100} />
      
      <div className="relative z-10 max-w-md mx-auto p-4">
        {/* Profile Section */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              {user?.photo_url ? (
                <Image
                  src={user.photo_url}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-600 flex items-center justify-center text-2xl">
                  {user?.first_name?.[0] || '?'}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {user?.first_name} {user?.last_name}
              </h2>
              {user?.username && (
                <p className="text-blue-300">@{user.username}</p>
              )}
            </div>
          </div>

          <div className="mt-4 bg-black/20 rounded-xl p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-gray-300">My ID</span>
              <span className="font-mono">{user?.id || 'Loading...'}</span>
            </div>
            <button
              onClick={handleCopyId}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied && (
                <span className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded -mt-8 -ml-6">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe2 className="w-6 h-6 text-blue-300" />
              <span>Language</span>
            </div>
            <span className="text-blue-300">{user?.language_code || 'en'}</span>
          </div>

          <Link 
            href="/invite"
            className="backdrop-blur-md bg-white/10 rounded-xl p-4 flex items-center gap-3 hover:bg-white/20"
          >
            <Users className="w-6 h-6 text-blue-300" />
            <span>Invite Friends</span>
          </Link>

          <Link 
            href="https://t.me/dumpsterfireportal"
            target="_blank"
            className="backdrop-blur-md bg-white/10 rounded-xl p-4 flex items-center gap-3 hover:bg-white/20"
          >
            <HeadphonesIcon className="w-6 h-6 text-blue-300" />
            <span>Contact Support</span>
          </Link>

          <Link 
            href="/faq"
            className="backdrop-blur-md bg-white/10 rounded-xl p-4 flex items-center gap-3 hover:bg-white/20"
          >
            <HelpCircle className="w-6 h-6 text-blue-300" />
            <span>FAQ</span>
          </Link>

          <Link 
            href="/legal"
            className="backdrop-blur-md bg-white/10 rounded-xl p-4 flex items-center gap-3 hover:bg-white/20"
          >
            <Scale className="w-6 h-6 text-blue-300" />
            <span>Legal Information</span>
          </Link>
        </div>
      </div>

    </div>
  )
}

