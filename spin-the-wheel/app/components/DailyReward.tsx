'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface DailyRewardProps {
  onClaimReward: () => void;
}

export default function DailyReward({ onClaimReward }: DailyRewardProps) {
  const [timeUntilNextReward, setTimeUntilNextReward] = useState<string>('')
  const [canClaimReward, setCanClaimReward] = useState(false)

  const formatCountdown = useCallback((timeLeft: number) => {
    const hours = Math.floor(timeLeft / (60 * 60 * 1000))
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000))
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [])

  const checkRewardAvailability = useCallback(() => {
    const lastClaimTime = localStorage.getItem('lastDailyRewardClaim')
    const now = new Date().getTime()
    
    if (!lastClaimTime || now - parseInt(lastClaimTime) >= 24 * 60 * 60 * 1000) {
      setCanClaimReward(true)
      setTimeUntilNextReward('')
    } else {
      setCanClaimReward(false)
      const timeLeft = 24 * 60 * 60 * 1000 - (now - parseInt(lastClaimTime))
      setTimeUntilNextReward(formatCountdown(timeLeft))
    }
  }, [formatCountdown])

  useEffect(() => {
    checkRewardAvailability()
    const interval = setInterval(checkRewardAvailability, 1000)

    return () => clearInterval(interval)
  }, [checkRewardAvailability])

  const handleClaimReward = () => {
    if (canClaimReward) {
      localStorage.setItem('lastDailyRewardClaim', new Date().getTime().toString())
      setCanClaimReward(false)
      onClaimReward()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-md rounded-xl p-4 mb-4 shadow-lg"
    >
      <h2 className="text-xl font-bold mb-2 text-white">Daily Reward</h2>
      {canClaimReward ? (
        <button
          onClick={handleClaimReward}
          className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-2 px-4 rounded-full transition-colors duration-300 shadow-md"
        >
          Claim Your Daily Reward!
        </button>
      ) : (
        <div>
          <p className="text-white">Next reward available in:</p>
          <p className="text-2xl font-bold text-yellow-300">{timeUntilNextReward}</p>
        </div>
      )}
    </motion.div>
  )
}

