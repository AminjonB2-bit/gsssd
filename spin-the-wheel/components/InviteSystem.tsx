'use client';

import React from 'react';
import { Copy, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface InviteSystemProps {
  userId: string;
}

const InviteSystem: React.FC<InviteSystemProps> = ({ userId }) => {
  const botUsername = 'DumpsterJackpotBot';
  const inviteLink = `https://t.me/${botUsername}?start=${userId}`;

  const handleInvite = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.switchInlineQuery(`start=${userId}`, ['users']);
    } else {
      navigator.clipboard.writeText(inviteLink).then(() => {
        toast.success('Invite link copied to clipboard!');
      });
    }
  };

  const handleOpenFriendsList = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/${botUsername}`);
    } else {
      window.open(`https://t.me/${botUsername}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center mb-4">
        <p className="text-white/80 break-all text-sm">{inviteLink}</p>
      </div>
      
      <button
        onClick={handleInvite}
        className="flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 text-white py-4 px-6 rounded-full transition-all duration-200 text-lg font-semibold"
      >
        <Copy className="w-6 h-6" />
        Invite a friend
      </button>
      
      <button
        onClick={handleOpenFriendsList}
        className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-4 px-6 rounded-full transition-all duration-200 text-lg font-semibold backdrop-blur-md"
      >
        <Users className="w-6 h-6" />
        Open Friends List
      </button>
    </div>
  );
};

export default InviteSystem;

