'use client'

import { useState, useEffect } from 'react'
import { Copy, Share2, Users, Trophy } from 'lucide-react'
import { useBalance } from '../context/BalanceContext'
import DynamicSnowfall from '../components/DynamicSnowfall'
import { toast } from 'sonner'

export default function InvitePage() {
  const { referralData, missionStatus, freeSpins, generateReferralCode } = useBalance()
  const [inviteCount, setInviteCount] = useState(0)
  const [referralCode, setReferralCode] = useState('')

  useEffect(() => {
    const fetchReferralCode = async () => {
      const code = await generateReferralCode()
      setReferralCode(code)
    }
    fetchReferralCode()
  }, [generateReferralCode])

  useEffect(() => {
    setInviteCount(referralData?.referredUsers?.length ?? 0)
  }, [referralData])

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode)
      toast.success('Referral code copied to clipboard!')
    }
  }

  const shareReferralCode = () => {
    if (navigator.share && referralCode) {
      navigator.share({
        title: 'Join me on DFYR Coin!',
        text: `Use my referral code ${referralCode} to get started!`,
        url: 'https://dfyrcoin.com',
      }).then(() => {
        console.log('Referral code shared successfully')
      }).catch((error) => console.log('Error sharing', error))
    } else {
      toast.error('Web Share API is not supported in your browser')
    }
  }

  return (
    <div className="relative min-h-screen bg-[#9333EA] text-white pb-24">
      <DynamicSnowfall />
      <div className="max-w-md mx-auto p-4 relative z-10">
        <h1 className="text-2xl font-bold mb-4">Invite Friends</h1>
        
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <p className="text-lg mb-2">Your Referral Code:</p>
          <div className="flex items-center justify-between bg-white/20 rounded-lg p-2">
            <span className="font-mono text-xl">{referralCode || 'Loading...'}</span>
            <button onClick={copyReferralCode} className="p-2 hover:bg-white/10 rounded-full">
              <Copy size={20} />
            </button>
          </div>
        </div>
        
        <button 
          onClick={shareReferralCode}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl mb-6 flex items-center justify-center"
        >
          <Share2 className="mr-2" /> Share Referral Code
        </button>
        
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <p className="text-lg mb-2">Your Invites:</p>
          <div className="flex items-center">
            <Users className="w-6 h-6 mr-2" />
            <p className="text-3xl font-bold">{inviteCount}</p>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <p className="text-lg mb-2">Free Spins Available:</p>
          <p className="text-3xl font-bold">{freeSpins}</p>
        </div>

        {missionStatus?.inviteFriend && (
          <div className="mt-6 bg-green-500/20 rounded-xl p-4">
            <p className="text-green-400 font-bold">Mission Completed: Invite a Friend</p>
            <p>You've successfully invited a friend and earned your reward!</p>
          </div>
        )}
      </div>
    </div>
  )
}

