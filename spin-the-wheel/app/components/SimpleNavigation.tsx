'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Wallet, Users, Home, BarChart2, Info, Gift } from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/invite', icon: Users, label: 'Invite' },
  { href: '/redeem', icon: Gift, label: 'Redeem' },
  { href: '/wallet', icon: Wallet, label: 'Wallet' },
  { href: '/coin-info', icon: BarChart2, label: 'DFYR' },
  { href: '/about', icon: Info, label: 'About' },
];

export function SimpleNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isTelegramWebAppAvailable, setIsTelegramWebAppAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.Telegram?.WebApp) {
        console.log('Telegram WebApp detected. Version:', window.Telegram.WebApp.version);
        setIsTelegramWebAppAvailable(true);
        try {
          window.Telegram.WebApp.ready();
          console.log('Telegram WebApp initialized successfully');
        } catch (error) {
          console.error('Failed to initialize Telegram WebApp:', error);
        }
      } else {
        console.log('Telegram WebApp is not available');
      }
    }
  }, []);

  const handleNavigation = (path: string) => {
    console.log('Navigation attempted to:', path);
    console.log('Current pathname:', pathname);
    console.log('Telegram WebApp available:', isTelegramWebAppAvailable);

    if (isTelegramWebAppAvailable) {
      console.log('Using Telegram WebApp navigation');
      try {
        window.Telegram.WebApp.navigate(path);
      } catch (error) {
        console.error('Telegram WebApp navigation failed:', error);
        fallbackNavigation(path);
      }
    } else {
      fallbackNavigation(path);
    }
  };

  const fallbackNavigation = (path: string) => {
    console.log('Using fallback navigation (Next.js router)');
    try {
      router.push(path);
    } catch (error) {
      console.error('Next.js router navigation failed:', error);
      console.log('Attempting direct URL change');
      window.location.href = path;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={`flex flex-col items-center p-2 ${
                pathname === item.href
                  ? 'text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

