'use client'

import { useState } from 'react'
import { useBalance } from '../context/BalanceContext'
import DynamicSnowfall from '../components/DynamicSnowfall'

export default function UseReferralPage() {
  const [referralCode, setReferralCode] = useState('')
  const [message, setMessage] = useState('')
  const { checkReferral, addReferredUser } = useBalance()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (checkReferral(referralCode)) {
      // In a real app, you'd generate a unique user ID here
      const newUserId = 'user_' + Math.random().toString(36).substr(2, 9)
      addReferredUser(newUserId)
      setMessage('Referral code accepted! Welcome to Dumpster Fire Coin!')
    } else {
      setMessage('Invalid referral code. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen bg-[#9333EA] text-white">
      <DynamicSnowfall />
      <div className="max-w-md mx-auto p-4 pb-24 relative z-10">
        <h1 className="text-2xl font-bold mb-4">Use Referral Code</h1>
        
        <form onSubmit={handleSubmit} className="bg-white/10 rounded-xl p-4 mb-6">
          <div className="mb-4">
            <label htmlFor="referralCode" className="block text-sm font-medium mb-2">
              Enter Referral Code:
            </label>
            <input
              type="text"
              id="referralCode"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
        
        {message && (
          <div className={`p-4 rounded-xl ${message.includes('accepted') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

