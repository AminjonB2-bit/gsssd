'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useBalance } from '../context/BalanceContext'

interface ScratchCardProps {
  onReveal: (prize: number) => void
}

const prizes = [0, 0, 0, 0.01, 0.01, 0.01, 0.02, 0.05, 0.1]

export default function ScratchCard({ onReveal }: ScratchCardProps) {
  const [isScratched, setIsScratched] = useState(false)
  const [prize, setPrize] = useState(0)
  const [cooldown, setCooldown] = useState(false)
  const [timeUntilNextScratch, setTimeUntilNextScratch] = useState('')
  const { lastScratchTime, updateLastScratchTime } = useBalance()

  useEffect(() => {
    const checkCooldown = () => {
      if (lastScratchTime) {
        const now = Date.now()
        const timeSinceLastScratch = now - lastScratchTime
        const cooldownPeriod = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

        if (timeSinceLastScratch < cooldownPeriod) {
          setCooldown(true)
          const timeLeft = cooldownPeriod - timeSinceLastScratch
          updateCountdown(timeLeft)
        } else {
          setCooldown(false)
          setTimeUntilNextScratch('')
        }
      } else {
        setCooldown(false)
        setTimeUntilNextScratch('')
      }
    }

    checkCooldown()
    const interval = setInterval(checkCooldown, 1000)

    return () => clearInterval(interval)
  }, [lastScratchTime])

  const updateCountdown = (timeLeft: number) => {
    const hours = Math.floor(timeLeft / (60 * 60 * 1000))
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000))
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000)
    setTimeUntilNextScratch(`${hours}h ${minutes}m ${seconds}s`)
  }

  const handleScratch = () => {
    if (cooldown) return
    setIsScratched(true)
    let newPrize
    const random = Math.random()
    if (random < 0.05) { // 5% chance for maximum prize
      newPrize = 0.1
    } else if (random < 0.4) { // 35% chance for minimum prize
      newPrize = 0.01
    } else if (random < 0.7) { // 30% chance for no win
      newPrize = 0
    } else if (random < 0.85) { // 15% chance for 0.02
      newPrize = 0.02
    } else { // 15% chance for 0.05
      newPrize = 0.05
    }
    setPrize(newPrize)
    onReveal(newPrize)
    updateLastScratchTime(Date.now())
  }

  return (
    <div className="relative w-64 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg overflow-hidden">
      {cooldown ? (
        <div className="absolute inset-0 bg-gray-500 flex items-center justify-center">
          <p className="text-white font-bold text-center">
            Next scratch card in:<br />{timeUntilNextScratch}
          </p>
        </div>
      ) : !isScratched ? (
        <motion.div
          className="absolute inset-0 bg-gray-300 flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleScratch}
        >
          <p className="text-gray-700 font-bold">Scratch Here!</p>
        </motion.div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white font-bold text-xl">
            {prize === 0 ? "Try Again" : `${prize === 0.1 ? '0.1' : prize.toFixed(2)} SOL`}
          </p>
        </div>
      )}
    </div>
  )
}

