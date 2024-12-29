'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Clock } from 'lucide-react'

interface SpinningWheelProps {
  onSpinComplete: (prize: string) => void;
  canSpin: boolean;
  timeUntilNextSpin: string;
  onSpinStart?: () => void;
}

const prizes = [
  { label: '10,000 DFYR', color: '#F87171' },
  { label: 'Try Again', color: '#60A5FA' },
  { label: '0.05 SOL', color: '#34D399' },
  { label: '0.01 SOL', color: '#F59E0B' },
  { label: '25,000 DFYR', color: '#8B5CF6' },
  { label: 'Try Again', color: '#EC4899' },
  { label: '0.02 SOL', color: '#10B981' },
  { label: 'Try Again', color: '#6366F1' },
]

export default function SpinningWheel({ onSpinComplete, canSpin, timeUntilNextSpin, onSpinStart }: SpinningWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [prize, setPrize] = useState<string | null>(null)

  const spinWheel = () => {
    if (canSpin && !isSpinning) {
      setIsSpinning(true)
      setPrize(null)
      if (onSpinStart) {
        onSpinStart()
      }
      const randomRotation = Math.floor(Math.random() * 360) + 3600 // 10+ full rotations
      setRotation(prevRotation => prevRotation + randomRotation)

      setTimeout(() => {
        setIsSpinning(false)
        const prizeIndex = Math.floor((randomRotation % 360) / (360 / prizes.length))
        const wonPrize = prizes[prizeIndex].label
        setPrize(wonPrize)
        onSpinComplete(wonPrize)
      }, 5000) // 5 seconds spin time
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-80 h-80 mb-8">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <filter id="inner-shadow">
              <feOffset dx="0" dy="1" />
              <feGaussianBlur stdDeviation="1" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="black" floodOpacity="0.2" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
          </defs>
          <circle cx="50" cy="50" r="49" fill="#1F2937" filter="url(#inner-shadow)" />
          {prizes.map((prize, index) => {
            const angle = (index / prizes.length) * 360
            const endAngle = ((index + 1) / prizes.length) * 360
            const x1 = 50 + 45 * Math.cos((angle - 90) * (Math.PI / 180))
            const y1 = 50 + 45 * Math.sin((angle - 90) * (Math.PI / 180))
            const x2 = 50 + 45 * Math.cos((endAngle - 90) * (Math.PI / 180))
            const y2 = 50 + 45 * Math.sin((endAngle - 90) * (Math.PI / 180))

            return (
              <path
                key={index}
                d={`M50,50 L${x1},${y1} A45,45 0 0,1 ${x2},${y2} Z`}
                fill={prize.color}
                stroke="#4B5563"
                strokeWidth="0.5"
              />
            )
          })}
          {prizes.map((prize, index) => {
            const angle = ((index + 0.5) / prizes.length) * 360
            const x = 50 + 30 * Math.cos((angle - 90) * (Math.PI / 180))
            const y = 50 + 30 * Math.sin((angle - 90) * (Math.PI / 180))

            return (
              <text
                key={index}
                x={x}
                y={y}
                fontSize="3.5"
                fontWeight="bold"
                textAnchor="middle"
                fill="white"
                transform={`rotate(${angle}, ${x}, ${y})`}
              >
                {prize.label}
              </text>
            )
          })}
        </svg>
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{ transformOrigin: 'center' }}
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="absolute top-[-10px] left-1/2 -ml-5 w-0 h-0 border-l-[20px] border-l-transparent border-t-[40px] border-t-yellow-400 border-r-[20px] border-r-transparent filter drop-shadow-md" />
        </motion.div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-full border-4 border-yellow-400 shadow-lg" />
      </div>
      <button
        onClick={spinWheel}
        disabled={!canSpin || isSpinning}
        className={`
          w-full py-4 px-8 rounded-full text-lg font-bold
          transition-all duration-300 transform hover:scale-105 hover:shadow-lg
          flex items-center justify-center
          ${!canSpin || isSpinning
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 hover:from-yellow-500 hover:to-orange-600 shadow-md'
          }
        `}
      >
        {isSpinning ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Spinning...
          </span>
        ) : (
          <span className="flex items-center justify-center w-full">
            {canSpin ? (
              <>
                <Sparkles className="mr-2" />
                SPIN THE WHEEL
              </>
            ) : (
              <>
                <Clock className="mr-2" />
                WAIT FOR NEXT SPIN
              </>
            )}
          </span>
        )}
      </button>
      <div className={`mt-4 text-center bg-indigo-900 backdrop-blur-md rounded-xl p-4 shadow-lg w-full ${!canSpin ? 'border border-yellow-400' : ''}`}>
        <div className="flex items-center justify-center mb-2">
          <Clock className={`mr-2 ${!canSpin ? 'text-yellow-400' : 'text-white'}`} />
          <p className={`text-lg font-semibold ${!canSpin ? 'text-yellow-400' : 'text-white'}`}>
            {!canSpin ? 'Next spin available in:' : 'You can spin now!'}
          </p>
        </div>
        {!canSpin && timeUntilNextSpin && (
          <p className="text-3xl font-bold text-yellow-300">{timeUntilNextSpin}</p>
        )}
      </div>
      <AnimatePresence>
        {prize && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 text-center bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg"
          >
            {prize === 'Try Again' ? (
              <>
                <p className="text-2xl font-bold text-yellow-400">Better luck next time!</p>
                <p className="text-xl mt-2 text-white">Don't give up, try again tomorrow!</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-yellow-400">You won:</p>
                <p className="text-3xl font-extrabold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  {prize}
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

