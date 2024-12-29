'use client'

import React, { useState, useEffect } from 'react'
import { Copy, User, Globe2, MessageCircle, HelpCircle, Scale, Shield } from 'lucide-react'
import Image from 'next/image'
import DynamicSnowfall from '../components/DynamicSnowfall'
import Achievements from '../components/Achievements'
import { useBalance } from '../context/BalanceContext'
import { useRouter } from 'next/navigation'

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export default function AboutPage() {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [copied, setCopied] = useState(false)
  const { telegramUser } = useBalance()
  const router = useRouter()

  useEffect(() => {
    if (telegramUser) {
      setUser(telegramUser)
    }
  }, [telegramUser])

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNavigation = (path: string) => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.navigate(path)
    } else {
      router.push(path)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#A020F0] text-white pb-24">
      <DynamicSnowfall />
      <div className="relative z-10 max-w-md mx-auto p-4">
        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-black">
              {user?.photo_url ? (
                <Image
                  src={user.photo_url}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl text-[#90CAF9]">
                {user?.first_name} {user?.last_name}
              </h2>
              {user?.username && (
                <p className="text-white/70">@{user.username}</p>
              )}
            </div>
          </div>
        </div>

        {/* ID Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-[#90CAF9]" />
            <span>My ID</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#90CAF9]">{user?.id || 'Loading...'}</span>
            <button
              onClick={handleCopyId}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4 text-[#90CAF9]" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe2 className="w-6 h-6 text-[#90CAF9]" />
              <span>Language</span>
            </div>
            <span className="text-[#90CAF9]">{user?.language_code || 'en'}</span>
          </div>

          <button onClick={() => handleNavigation('/invite')} className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
            <User className="w-6 h-6 text-[#90CAF9]" />
            <span>Invite Friends</span>
          </button>

          <button onClick={() => window.open('https://t.me/dumpsterfireportal', '_blank')} className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-[#90CAF9]" />
            <span>Contact Support</span>
          </button>

          <button onClick={() => handleNavigation('/faq')} className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-[#90CAF9]" />
            <span>FAQ</span>
          </button>

          <button onClick={() => handleNavigation('/legal')} className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
            <Scale className="w-6 h-6 text-[#90CAF9]" />
            <span>Legal Information</span>
          </button>

          <button onClick={() => handleNavigation('/admin')} className="w-full mt-4 inline-flex items-center text-sm text-blue-300 hover:text-blue-100 transition-colors">
            <Shield className="w-4 h-4 mr-1" />
            Admin Panel
          </button>
        </div>

        {/* Achievements Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#90CAF9]">Your Achievements</h2>
          <Achievements />
        </div>

        {copied && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg">
            ID Copied!
          </div>
        )}
      </div>
    </div>
  )
}

