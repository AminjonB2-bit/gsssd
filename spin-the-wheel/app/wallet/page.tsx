'use client'

import { useState, useEffect } from 'react'
import { Wallet, ArrowRight, Clock, CheckCircle, XCircle, Copy, ExternalLink } from 'lucide-react'
import { useBalance } from '../context/BalanceContext'
import Image from 'next/image'
import DynamicSnowfall from '../components/DynamicSnowfall'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'

export default function WalletPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const { 
    solBalance = 0, 
    dfyrBalance = 0, 
    updateSolBalance, 
    updateDfyrBalance, 
    withdrawalRequests = [], 
    addWithdrawalRequest,
    telegramUser,
    initializeTelegramUser
  } = useBalance()

  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawType, setWithdrawType] = useState<'SOL' | 'DFYR'>('SOL')
  const [walletAddress, setWalletAddress] = useState('')

  useEffect(() => {
    const initializeData = async () => {
      await initializeTelegramUser()
      setIsLoading(false)
    }
    initializeData()
  }, [initializeTelegramUser])

  useEffect(() => {
    setWithdrawAmount('')
  }, [withdrawType])

  const handleWithdraw = async () => {
    setIsWithdrawing(true)
    setError(null)

    try {
      if (!telegramUser?.id) {
        throw new Error('Unable to retrieve Telegram user data. Please try refreshing the page.')
      }

      const amount = parseFloat(withdrawAmount)
      const minWithdrawal = withdrawType === 'SOL' ? 0.05 : 50000

      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount')
      }

      if (amount < minWithdrawal) {
        throw new Error(`Minimum withdrawal is ${minWithdrawal} ${withdrawType}`)
      }

      if (withdrawType === 'SOL' && amount > solBalance) {
        throw new Error('Insufficient SOL balance')
      }

      if (withdrawType === 'DFYR' && amount > dfyrBalance) {
        throw new Error('Insufficient DFYR balance')
      }

      if (!walletAddress || walletAddress.trim().length < 32) {
        throw new Error('Please enter a valid wallet address')
      }

      const request = {
        userId: telegramUser.id.toString(),
        amount,
        type: withdrawType,
        status: 'pending' as const,
        address: walletAddress.trim(),
      }

      console.log('Submitting withdrawal request:', request)

      await addWithdrawalRequest(request)

      if (withdrawType === 'SOL') {
        updateSolBalance(-amount)
      } else {
        updateDfyrBalance(-Math.floor(amount))
      }

      setWithdrawAmount('')
      setWalletAddress('')
      toast.success('Withdrawal request submitted successfully')
    } catch (err) {
      console.error('Withdrawal error:', err)
      let errorMessage: string
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      } else {
        console.error('Unknown error type:', err)
        errorMessage = 'An unexpected error occurred. Please try again.'
      }
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsWithdrawing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#9333EA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#9333EA] text-white pb-24">
      <DynamicSnowfall />
      
      <div className="max-w-md mx-auto p-4 relative z-10">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl">Your Balance</CardTitle>
            <CardDescription className="text-gray-200">Manage your crypto assets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-900/50 p-3 rounded-lg">
                <div className="flex items-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Solana-Logo-k00TZDVa9RxutqST0B80WaAohydsw2.png"
                    alt="SOL"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <span className="text-sm text-indigo-200">SOL Balance</span>
                </div>
                <p className="text-lg font-semibold mt-1 text-yellow-300">{solBalance?.toFixed(2) ?? '0.00'}</p>
              </div>
              
              <div className="bg-indigo-900/50 p-3 rounded-lg">
                <div className="flex items-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(3)-ajvVvXcQBZtsfa97fm4WRArWVpNh54.png"
                    alt="DFYR"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <span className="text-sm text-indigo-200">DFYR Balance</span>
                </div>
                <p className="text-lg font-semibold mt-1 text-yellow-300">{dfyrBalance?.toLocaleString() ?? '0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
            <CardDescription className="text-gray-200">
              Request a withdrawal to your wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Select Token</Label>
              <Select
                value={withdrawType}
                onValueChange={(value) => setWithdrawType(value as 'SOL' | 'DFYR')}
              >
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="DFYR">DFYR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder={`Min ${withdrawType === 'SOL' ? '0.05' : '50,000'}`}
                className="bg-white/5 border-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Wallet Address</Label>
              <Input
                id="address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter your wallet address"
                className="bg-white/5 border-white/20"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-gradient-to-r from-[#9945FF] to-[#FF5733] hover:opacity-90"
              onClick={handleWithdraw}
              disabled={isWithdrawing}
            >
              {isWithdrawing ? 'Processing...' : 'Request Withdrawal'}
            </Button>
          </CardFooter>
        </Card>

        <Card className="mt-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle>Recent Withdrawals</CardTitle>
            <CardDescription className="text-gray-200">
              Track your withdrawal requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {withdrawalRequests.length === 0 ? (
                <p className="text-center text-gray-400 py-4">No withdrawal requests yet</p>
              ) : (
                withdrawalRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className="bg-white/5 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-400' :
                          request.status === 'sent' ? 'bg-green-400' :
                          'bg-red-400'
                        }`} />
                        <span className="font-medium">
                          {request.amount} {request.type}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(request.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="truncate">{request.address}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(request.address)
                          toast.success('Address copied to clipboard')
                        }}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {request.status === 'pending' ? (
                        <Clock className="w-4 h-4 text-yellow-400" />
                      ) : request.status === 'sent' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="capitalize">{request.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

