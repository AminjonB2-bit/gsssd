'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Users, Zap, Target, Ticket } from 'lucide-react'
import { useBalance } from '../context/BalanceContext'

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  progress: number
  maxProgress: number
  completed: boolean
}

export default function Achievements() {
  const { solBalance, dfyrBalance, missionStatus, referralData } = useBalance()

  const achievements: Achievement[] = [
    {
      id: 'first_spin',
      name: 'First Spin',
      description: 'Spin the wheel for the first time',
      icon: <Zap className="w-6 h-6" />,
      progress: missionStatus.firstSpin ? 1 : 0,
      maxProgress: 1,
      completed: missionStatus.firstSpin,
    },
    {
      id: 'lucky_spin',
      name: 'Lucky Spin',
      description: 'Win the top prize on the wheel',
      icon: <Star className="w-6 h-6" />,
      progress: missionStatus.luckySpin ? 1 : 0,
      maxProgress: 1,
      completed: missionStatus.luckySpin,
    },
    {
      id: 'referral_master',
      name: 'Referral Master',
      description: 'Invite 10 friends to join the game',
      icon: <Users className="w-6 h-6" />,
      progress: referralData.referredUsers.length,
      maxProgress: 10,
      completed: referralData.referredUsers.length >= 10,
    },
    {
      id: 'dfyre_collector',
      name: 'DFYRE Collector',
      description: 'Collect 100,000 DFYRE tokens',
      icon: <Trophy className="w-6 h-6" />,
      progress: dfyrBalance,
      maxProgress: 100000,
      completed: dfyrBalance >= 100000,
    },
    {
      id: 'sol_hoarder',
      name: 'SOL Hoarder',
      description: 'Collect 0.05 SOL',
      icon: <Target className="w-6 h-6" />,
      progress: solBalance,
      maxProgress: 0.05,
      completed: solBalance >= 0.05,
    },
    {
      id: 'scratch_master',
      name: 'Scratch Master',
      description: 'Play the daily scratch card 10 times',
      icon: <Ticket className="w-6 h-6" />,
      progress: missionStatus.scratchCardPlays || 0,
      maxProgress: 10,
      completed: (missionStatus.scratchCardPlays || 0) >= 10,
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Achievements</h2>
      {achievements.map((achievement) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white/10 backdrop-blur-md rounded-xl p-4 ${
            achievement.completed ? 'border-2 border-yellow-400' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${achievement.completed ? 'bg-yellow-400' : 'bg-gray-600'}`}>
                {achievement.icon}
              </div>
              <div>
                <h3 className="font-semibold">{achievement.name}</h3>
                <p className="text-sm text-gray-300">{achievement.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {achievement.progress} / {achievement.maxProgress}
              </p>
              <div className="w-20 h-2 bg-gray-700 rounded-full mt-1">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

