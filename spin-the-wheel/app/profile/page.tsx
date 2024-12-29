'use client'

import { useState, useEffect } from 'react'
import { useBalance } from '../context/BalanceContext'
import Image from 'next/image'
import { Wallet, Users, Target, Award, Edit2, Camera } from 'lucide-react'
import DynamicSnowfall from '../components/DynamicSnowfall'
import AvatarSelector from '../components/AvatarSelector'

const defaultAvatar = '/avatars/default.svg'

export default function ProfilePage() {
  const { 
    solBalance, 
    dfireBalance, 
    referralData, 
    missionStatus, 
    claimedMissions,
    userProfile,
    updateUserProfile,
  } = useBalance()

  const [editingUsername, setEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState(userProfile.username)
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [completedMissions, setCompletedMissions] = useState(0)


  // Update local state when userProfile changes
  useEffect(() => {
    setNewUsername(userProfile.username)
  }, [userProfile.username])

  useEffect(() => {
    const completed = Object.values(missionStatus ?? {}).filter(Boolean).length
    setCompletedMissions(completed)
  }, [missionStatus])

  const handleAvatarChange = (newAvatar: string) => {
    updateUserProfile({ avatar: newAvatar })
    setShowAvatarSelector(false)
  }

  const handleUsernameChange = () => {
    if (newUsername.trim() !== '') {
      updateUserProfile({ username: newUsername.trim() })
      setEditingUsername(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#9333EA] text-white pb-16">
      <DynamicSnowfall />
      <div className="max-w-md mx-auto p-4 relative z-10">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <div 
              className="w-20 h-20 rounded-full overflow-hidden cursor-pointer relative"
              onClick={() => setShowAvatarSelector(true)}
            >
              {userProfile.avatar.startsWith('data:') || userProfile.avatar.startsWith('http') ? (
                <Image
                  src={userProfile.avatar}
                  alt="User Avatar"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
                  {userProfile.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
                <Camera className="w-4 h-4 text-gray-800" />
              </div>
            </div>
            <div className="ml-4 flex-grow">
              {editingUsername ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="bg-white/20 text-white px-2 py-1 rounded mr-2"
                    maxLength={20}
                  />
                  <button
                    onClick={handleUsernameChange}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold mr-2">{userProfile.username}</h2>
                  <button
                    onClick={() => setEditingUsername(true)}
                    className="text-white/70 hover:text-white"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
              <p className="text-sm text-gray-400">Joined: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex items-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Solana-Logo-k00TZDVa9RxutqST0B80WaAohydsw2.png"
                  alt="SOL"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span className="text-sm">SOL Balance</span>
              </div>
              <p className="text-lg font-semibold mt-1">{solBalance?.toFixed(2) ?? '0.00'}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex items-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(3)-ajvVvXcQBZtsfa97fm4WRArWVpNh54.png"
                  alt="DFYR"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span className="text-sm">DFYR Balance</span>
              </div>
              <p className="text-lg font-semibold mt-1">{dfireBalance?.toLocaleString() ?? '0'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/10 rounded-xl p-4 flex items-center">
            <Users className="w-6 h-6 mr-3 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Referrals</p>
              <p className="text-lg font-semibold">{referralData?.referredUsers?.length ?? 0}</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 flex items-center">
            <Target className="w-6 h-6 mr-3 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Completed Missions</p>
              <p className="text-lg font-semibold">{completedMissions} / {Object.keys(missionStatus).length}</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 flex items-center">
            <Wallet className="w-6 h-6 mr-3 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">Claimed Rewards</p>
              <p className="text-lg font-semibold">{claimedMissions?.length ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.badges.map((badge, index) => (
              <div key={index} className="bg-white/10 rounded-full p-2">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAvatarSelector && (
        <AvatarSelector
          currentAvatar={userProfile.avatar}
          onSelect={handleAvatarChange}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}

    </div>
  )
}

