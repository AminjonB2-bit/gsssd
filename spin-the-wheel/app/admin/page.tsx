'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBalance } from '../context/BalanceContext'
import { Clock, CheckCircle, XCircle, Users, RefreshCw, DollarSign, Flame } from 'lucide-react'
import DynamicSnowfall from '../components/DynamicSnowfall'

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { 
    statistics, 
    updateStatistics, 
    withdrawalRequests, 
    updateWithdrawalStatus 
  } = useBalance()

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      // Simulate updating active users every 30 seconds
      const interval = setInterval(() => {
        updateStatistics({ activeUsers: Math.floor(Math.random() * 100) + 50 })
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, updateStatistics])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') { // In a real app, use a secure authentication method
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
    } else {
      alert('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
    router.push('/')
  }

  const handleStatusUpdate = (id: string, status: 'approved' | 'rejected') => {
    updateWithdrawalStatus(id, status)
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[#9333EA] text-white flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#9333EA] text-white flex items-center justify-center">
        <DynamicSnowfall />
        <form onSubmit={handleLogin} className="bg-white/10 p-8 rounded-xl relative z-10">
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white mb-4"
          />
          <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded">
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#9333EA] text-white pb-16">
      <DynamicSnowfall />
      <div className="max-w-md mx-auto p-4 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>

        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <h2 className="text-xl font-bold mb-4">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 mr-2" />
                <span className="text-sm">Active Users</span>
              </div>
              <p className="text-2xl font-bold">{statistics.activeUsers}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <RefreshCw className="w-5 h-5 mr-2" />
                <span className="text-sm">Total Spins</span>
              </div>
              <p className="text-2xl font-bold">{statistics.totalSpins}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <DollarSign className="w-5 h-5 mr-2" />
                <span className="text-sm">Total Withdrawals</span>
              </div>
              <p className="text-2xl font-bold">{statistics.totalWithdrawals}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Flame className="w-5 h-5 mr-2" />
                <span className="text-sm">DFYR Distributed</span>
              </div>
              <p className="text-2xl font-bold">{statistics.totalDfyrDistributed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <h2 className="text-xl font-bold mb-4">Withdrawal Requests</h2>
          <div className="space-y-4">
            {withdrawalRequests.length === 0 ? (
              <p className="text-center text-gray-400">No withdrawal requests yet.</p>
            ) : (
              withdrawalRequests.map((request) => (
                <div key={request.id} className="bg-white/5 rounded-lg p-3 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">{request.amount} {request.type}</p>
                    <div className="flex items-center">
                      {request.status === 'pending' ? (
                        <Clock className="text-yellow-500 w-4 h-4 mr-1" />
                      ) : request.status === 'approved' ? (
                        <CheckCircle className="text-green-500 w-4 h-4 mr-1" />
                      ) : (
                        <XCircle className="text-red-500 w-4 h-4 mr-1" />
                      )}
                      <span className="capitalize text-sm">{request.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">User ID: {request.userId}</p>
                  <p className="text-xs text-gray-500 mb-2">{new Date(request.timestamp).toLocaleString()}</p>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'approved')}
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

