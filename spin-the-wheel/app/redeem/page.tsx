'use client'

import { useState } from 'react'
import { useBalance } from '../context/BalanceContext'
import DynamicSnowfall from '../components/DynamicSnowfall'
import { toast } from 'sonner'

export default function RedeemPage() {
  const [code, setCode] = useState('')
  const [isRedeeming, setIsRedeeming] = useState(false)
  const { redeemReferralCode, freeSpins } = useBalance()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRedeeming(true)

    try {
      const result = await redeemReferralCode(code)
      if (result.success) {
        toast.success(result.message)
        setCode('')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error redeeming code:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsRedeeming(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#9333EA] text-white pb-16">
      <DynamicSnowfall />
      <div className="max-w-md mx-auto p-4 relative z-10">
        <h1 className="text-2xl font-bold mb-6">Redeem Referral Code</h1>

        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <p className="text-lg mb-2">Your Free Spins:</p>
          <p className="text-3xl font-bold">{freeSpins}</p>
        </div>

        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium mb-1">
                Enter Referral Code:
              </label>
              <input
                type="text"
                id="referralCode"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isRedeeming}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold py-2 px-4 rounded-xl transition-colors hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRedeeming ? 'Redeeming...' : 'Redeem Code'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

