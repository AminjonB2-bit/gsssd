'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useBalance, WithdrawalRequest } from '../../context/BalanceContext'
import DynamicSnowfall from '../../components/DynamicSnowfall'

export default function AdminWithdrawalsPage() {
  const { withdrawalRequests, updateWithdrawalRequestStatus } = useBalance()
  const [filteredRequests, setFilteredRequests] = useState<WithdrawalRequest[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'sent'>('all')

  useEffect(() => {
    setFilteredRequests(
      filter === 'all'
        ? withdrawalRequests
        : withdrawalRequests.filter(request => request.status === filter)
    )
  }, [withdrawalRequests, filter])

  const handleMarkAsSent = (id: string) => {
    updateWithdrawalRequestStatus(id, 'sent')
  }

  return (
    <div className="relative min-h-screen bg-[#9333EA] text-white p-4">
      <DynamicSnowfall />
      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="flex items-center text-white mb-6">
          <ArrowLeft className="mr-2" /> Back to Main App
        </Link>
        
        <h1 className="text-2xl font-bold mb-6">Admin: Manage Withdrawals</h1>
        
        <div className="mb-4">
          <label htmlFor="filter" className="mr-2">Filter:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'sent')}
            className="bg-white/10 border border-white/20 rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
          </select>
        </div>
        
        <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Type</th>
                <th className="p-2">Address</th>
                <th className="p-2">Timestamp</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-t border-white/10">
                  <td className="p-2">{request.id}</td>
                  <td className="p-2">{request.amount}</td>
                  <td className="p-2">{request.type}</td>
                  <td className="p-2">
                    <div className="max-w-xs overflow-hidden overflow-ellipsis">
                      {request.address}
                    </div>
                  </td>
                  <td className="p-2">{new Date(request.timestamp).toLocaleString()}</td>
                  <td className="p-2">
                    <span className="flex items-center">
                      {request.status === 'pending' ? (
                        <Clock className="text-yellow-500 w-4 h-4 mr-1" />
                      ) : (
                        <CheckCircle className="text-green-500 w-4 h-4 mr-1" />
                      )}
                      <span className="capitalize">{request.status}</span>
                    </span>
                  </td>
                  <td className="p-2">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleMarkAsSent(request.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Mark as Sent
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

