import React, { createContext, useState, useContext, useEffect } from 'react';

interface BalanceContextType {
  balance: number;
  addToBalance: (amount: number) => void;
  userId: string;
  isWebAppAvailable: boolean;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState('');
  const [isWebAppAvailable, setIsWebAppAvailable] = useState(false);

  useEffect(() => {
    checkWebAppAvailability();
    loadData();
  }, []);

  const checkWebAppAvailability = () => {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      setIsWebAppAvailable(true);
      console.log('Telegram WebApp is available');
      setUserId(window.Telegram.WebApp.initDataUnsafe?.user?.id?.toString() || generateUserId());
    } else {
      setIsWebAppAvailable(false);
      console.log('Telegram WebApp is not available, using localStorage fallback');
      setUserId(generateUserId());
    }
  };

  const generateUserId = () => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      return storedUserId;
    }
    const newUserId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', newUserId);
    return newUserId;
  };

  const loadData = () => {
    try {
      const storedData = localStorage.getItem('gameState');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setBalance(parsedData.balance || 0);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveGameState = (newBalance: number) => {
    try {
      const gameState = JSON.stringify({ balance: newBalance });
      localStorage.setItem('gameState', gameState);
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };

  const addToBalance = (amount: number) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    saveGameState(newBalance);
  };

  return (
    <BalanceContext.Provider value={{ balance, addToBalance, userId, isWebAppAvailable }}>
      {children}
    </BalanceContext.Provider>
  );
};

