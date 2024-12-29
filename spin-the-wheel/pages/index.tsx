import React, { useEffect } from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { useBalance } from '../contexts/BalanceContext';
import SnowEffect from '../components/SnowEffect';

const Home: React.FC = () => {
  const { balance, userId } = useBalance();

  useEffect(() => {
    console.log('Home component rendered. Invite and Redeem functionality removed.');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden">
      <Head>
        <title>DumpsterJackpot Game</title>
        <meta name="description" content="Play and win with DumpsterJackpot!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SnowEffect />

      <main className="relative z-10 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2 text-center text-white">DumpsterJackpot Game</h1>
        <p className="text-xl text-center text-yellow-300 mb-8">Win big with DFIRE tokens!</p>
        
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg text-center">
            <p className="text-2xl font-bold mb-4">Welcome to DumpsterJackpot!</p>
            <p className="text-xl font-semibold">Current Balance: {balance} DFIRE</p>
            <p className="text-sm text-gray-300 mt-2">User ID: {userId}</p>
          </div>
        </div>
      </main>

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default Home;

