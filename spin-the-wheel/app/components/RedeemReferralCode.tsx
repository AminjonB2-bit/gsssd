'use client'

import React, { useState } from 'react'
import { useBalance } from '../context/BalanceContext'

export default function RedeemReferralCode() {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const { redeemReferralCode } = useBalance()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = redeemReferralCode(code)
    if (result) {
      setMessage('Referral code redeemed successfully! You received 1 free spin.')
      setCode('')
    } else {
      setMessage('Invalid or already redeemed code. Please try again.')
    }
  }

  return (
    <div className="bg-white/10 rounded-xl p-4 mb-6">
      <h2 className="text-xl font-bold mb-4">Redeem Referral Code</h2>
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
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl transition-colors"
        >
          Redeem Code
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-center ${message.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  )
}

