import React, { useState } from 'react'
import Image from 'next/image'
import { X, Upload } from 'lucide-react'

const coloredAvatars = [
  { color: 'bg-red-500', letter: 'R' },
  { color: 'bg-blue-500', letter: 'B' },
  { color: 'bg-green-500', letter: 'G' },
  { color: 'bg-yellow-500', letter: 'Y' },
  { color: 'bg-purple-500', letter: 'P' },
  { color: 'bg-pink-500', letter: 'P' },
]

interface AvatarSelectorProps {
  currentAvatar: string
  onSelect: (avatar: string) => void
  onClose: () => void
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ currentAvatar, onSelect, onClose }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar)

  const handleColoredAvatarSelect = (color: string, letter: string) => {
    setSelectedAvatar(`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="${color.replace('bg-', '')}" /><text x="50" y="50" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dy=".3em">${letter}</text></svg>`)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onSelect(selectedAvatar)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Select Avatar</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {coloredAvatars.map(({ color, letter }) => (
            <div
              key={color}
              className={`cursor-pointer rounded-full overflow-hidden border-4 ${
                selectedAvatar.includes(color.replace('bg-', '')) ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => handleColoredAvatarSelect(color, letter)}
            >
              <div className={`w-16 h-16 ${color} flex items-center justify-center text-white text-2xl font-bold`}>
                {letter}
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label htmlFor="avatar-upload" className="block w-full py-2 px-4 bg-blue-500 text-white rounded cursor-pointer text-center">
            <Upload className="inline-block mr-2" size={18} />
            Upload Custom Image
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default AvatarSelector

