import React, { useState } from 'react';
import { useBalance } from '../contexts/BalanceContext';
import { toast } from 'react-hot-toast';

export default function RedeemReferralCode() {
  const [code, setCode] = useState('');
  const { redeemReferralCode } = useBalance();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Redeem button clicked');
    console.log('Code entered:', code);

    try {
      const result = await redeemReferralCode(code);
      console.log('Redeem result:', result);

      if (result.success) {
        toast.success(result.message);
        setCode('');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error redeeming code:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Redeem Referral Code</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter referral code"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Redeem Code
        </button>
      </form>
    </div>
  );
}

