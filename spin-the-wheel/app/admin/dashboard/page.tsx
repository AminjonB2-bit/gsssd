import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, FileText } from 'lucide-react'

export default function AdminDashboard() {
  const cookieStore = cookies()
  const isAdmin = cookieStore.get('admin')?.value === 'true'

  if (!isAdmin) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#9333EA] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center text-white mb-6">
          <ArrowLeft className="mr-2" /> Back to Main App
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="text-gray-300 mb-4">Manage user accounts and permissions.</p>
            <Link href="/admin/users" className="text-blue-400 hover:underline">
              View Users
            </Link>
          </div>
          
          <div className="bg-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Withdrawal Requests</h2>
            <p className="text-gray-300 mb-4">Review and process user withdrawal requests.</p>
            <Link href="/admin/withdrawals" className="text-blue-400 hover:underline">
              Manage Withdrawals
            </Link>
          </div>
          
          <div className="bg-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Game Statistics</h2>
            <p className="text-gray-300 mb-4">View game performance and user engagement metrics.</p>
            <Link href="/admin/stats" className="text-blue-400 hover:underline">
              View Statistics
            </Link>
          </div>
          
          <div className="bg-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            <p className="text-gray-300 mb-4">Configure game parameters and system settings.</p>
            <Link href="/admin/settings" className="text-blue-400 hover:underline">
              Manage Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

