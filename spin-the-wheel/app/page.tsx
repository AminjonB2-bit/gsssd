'use client'

import { useState, useEffect } from 'react'
import { Wallet, BarChart2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useBalance } from './context/BalanceContext'
import Image from 'next/image'
import SpinningWheel from './components/SpinningWheel'
import DynamicSnowfall from './components/DynamicSnowfall'
import { fetchDfireData } from './lib/api'

interface DfireData {
  marketCap: number;
}

export default function SpinWheelPage() {
  const { 
    solBalance, 
    dfyrBalance,
    telegramUser,
    lastSpinTime, 
    updateSolBalance, 
    updateDfyrBalance, 
    updateLastSpinTime,
    completeMission,
    checkDailyLogin,
    updateAchievement,
    statistics,
    updateStatistics
  } = useBalance()
  const [result, setResult] = useState('')
  const [pendingReward, setPendingReward] = useState({ type: '', amount: 0 })
  const [timeUntilNextSpin, setTimeUntilNextSpin] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [dfyrData, setDfyrData] = useState<DfireData | null>(null)
  const [canSpin, setCanSpin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsMounted(true)
        if (typeof window !== 'undefined') {
          if (!window.Telegram?.WebApp) {
            console.warn('This app is designed to run in the Telegram Web App environment. Some features may not work as expected.')
          } else {
            await window.Telegram.WebApp.ready()
            window.Telegram.WebApp.expand()
          }
        }
        await checkDailyLogin()
        checkSpinAvailability()
        const data = await fetchDfireData()
        setDfyrData(data)
      } catch (err) {
        console.error('Error initializing app:', err)
        setError('Failed to initialize the app. Please try again.')
      }
    }

    initializeApp()

    const spinInterval = setInterval(checkSpinAvailability, 1000)
    const marketDataInterval = setInterval(async () => {
      try {
        const data = await fetchDfireData()
        setDfyrData(data)
      } catch (err) {
        console.error('Error fetching market data:', err)
      }
    }, 60000)

    return () => {
      clearInterval(spinInterval)
      clearInterval(marketDataInterval)
    }
  }, [lastSpinTime, checkDailyLogin])

  const checkSpinAvailability = () => {
    const now = Date.now()
    const oneDayInMs = 24 * 60 * 60 * 1000
    
    if (lastSpinTime) {
      const timeSinceLastSpin = now - lastSpinTime
      
      if (timeSinceLastSpin < oneDayInMs) {
        const timeLeft = oneDayInMs - timeSinceLastSpin
        updateCountdown(timeLeft)
        setCanSpin(false)
      } else {
        setTimeUntilNextSpin('')
        setCanSpin(true)
      }
    } else {
      setTimeUntilNextSpin('')
      setCanSpin(true)
    }
  }

  const updateCountdown = (timeLeft: number) => {
    const hours = Math.floor(timeLeft / (60 * 60 * 1000))
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000))
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000)
    setTimeUntilNextSpin(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`)
  }

  const handleSpinComplete = (prize: string) => {
    if (prize === 'Try Again') {
      setResult('Better luck next time!')
      setPendingReward({ type: '', amount: 0 })
    } else {
      setResult(`You won: ${prize}`)
    
      if (prize.includes('DFYR')) {
        const amount = parseInt(prize.split(' ')[0].replace(/,/g, ''))
        setPendingReward({ type: 'DFYR', amount })
      } else if (prize.includes('SOL')) {
        const amount = parseFloat(prize.split(' ')[0])
        setPendingReward({ type: 'SOL', amount })
        if (amount === 0.05) {
          completeMission('luckySpin', true)
        }
      }
    }

    updateStatistics({ totalSpins: (statistics?.totalSpins || 0) + 1 })
    completeMission('firstSpin', true)
    updateLastSpinTime(Date.now())

    updateAchievement('first_spin', 1)
    if (prize.includes('SOL') && parseFloat(prize.split(' ')[0]) === 0.05) {
      updateAchievement('lucky_spin', 1)
    }
    updateAchievement('dfyre_collector', dfyrBalance + (prize.includes('DFYR') ? parseInt(prize.split(' ')[0].replace(',', '')) : 0))
    updateAchievement('sol_hoarder', Math.min(solBalance + (prize.includes('SOL') ? parseFloat(prize.split(' ')[0]) : 0), 0.05))

    checkSpinAvailability()
    setCanSpin(false)
  }

  const handleCollect = () => {
    if (pendingReward.type === 'DFYR') {
      updateDfyrBalance(pendingReward.amount)
    } else if (pendingReward.type === 'SOL') {
      updateSolBalance(pendingReward.amount)
    }
    
    setPendingReward({ type: '', amount: 0 })
    setResult('')
  }

  const handleWalletClick = () => {
    router.push('/wallet')
  }

  const handleCoinInfoClick = () => {
    router.push('/coin-info')
  }

  const handleSpinStart = () => {
    updateLastSpinTime(Date.now())
  }

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#9333EA]">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#9333EA]">
        <div className="text-white text-xl text-center p-4">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-white text-[#9333EA] px-4 py-2 rounded-full"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#9333EA] text-white overflow-hidden pb-16">
      <div className="bg-indigo-900 text-white p-4 shadow-lg">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          {telegramUser && (
            <>
              <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-700 border-2 border-indigo-400">
                {telegramUser.photo_url ? (
                  <Image
                    src={telegramUser.photo_url}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold">
                    {telegramUser.first_name[0]}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold">{telegramUser.first_name} {telegramUser.last_name}</h1>
                {telegramUser.username && (
                  <p className="text-sm opacity-70">@{telegramUser.username}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <DynamicSnowfall />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="p-4 space-y-4">
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-black">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Solana-Logo-dcYhi6uMXN3SoFa8h0e2q2zG0c69Ig.png"
                    alt="SOL"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm opacity-70">SOL Balance</p>
                  <p className="font-bold">{solBalance.toFixed(2)}</p>
                </div>
              </div>
              <button 
                onClick={handleWalletClick}
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Wallet className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-black overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(3)-ztkjhWHgTHzFCoaZohNt6I1F1SfkNT.png"
                    alt="DFYRE"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm opacity-70">DFYRE Balance</p>
                  <p className="font-bold">{dfyrBalance.toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={handleWalletClick}
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Wallet className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">DFYR Market Cap</p>
                <p className="font-bold">
                  {dfyrData ? `$${dfyrData.marketCap.toLocaleString()}` : 'Loading...'}
                </p>
              </div>
              <button 
                onClick={handleCoinInfoClick}
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <BarChart2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="mb-8 backdrop-blur-md bg-white/5 p-8 rounded-2xl shadow-lg">
            <SpinningWheel 
              onSpinComplete={handleSpinComplete}
              canSpin={canSpin}
              timeUntilNextSpin={timeUntilNextSpin}
              onSpinStart={handleSpinStart}
            />
          </div>
          {result && (
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 text-center w-full max-w-md shadow-lg mt-4">
              <p className="text-xl font-semibold mb-2">{result}</p>
              {pendingReward.amount > 0 && (
                <button
                  onClick={handleCollect}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-colors mb-4"
                >
                  Collect {pendingReward.amount} {pendingReward.type}
                </button>
              )}
              {result === 'Better luck next time!' && (
                <p className="text-lg text-gray-300">Don't give up, try again tomorrow!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

