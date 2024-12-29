'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

// Define the shape of the context
interface BalanceContextType {
  solBalance: number;
  dfyrBalance: number;
  lastSpinTime: number;
  missionStatus: MissionStatus;
  freeSpins: number;
  referralData: ReferralData;
  statistics: Statistics;
  userProfile: UserProfile;
  telegramUser: TelegramUser | null;
  updateSolBalance: (amount: number) => void;
  updateDfyrBalance: (amount: number) => void;
  updateLastSpinTime: (time: number) => void;
  completeMission: (mission: keyof MissionStatus, value: boolean | number) => void;
  checkDailyLogin: () => void;
  updateFreeSpins: (amount: number) => void;
  updateAchievement: (achievement: string, progress: number) => void;
  updateStatistics: (updates: Partial<Statistics>) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  generateReferralCode: () => Promise<string>;
  redeemReferralCode: (code: string) => Promise<{ success: boolean; message: string }>;
  redeemedCodes: string[];
  claimMissionReward: (mission: keyof MissionStatus) => boolean;
  claimedMissions: Array<keyof MissionStatus>;
  lastScratchTime: number;
  updateLastScratchTime: (time: number) => void;
  withdrawalRequests: WithdrawalRequest[];
  addWithdrawalRequest: (request: Omit<WithdrawalRequest, 'id'>) => Promise<void>;
  updateWithdrawalStatus: (id: string, status: 'approved' | 'rejected') => void;
  initializeTelegramUser: () => Promise<void>;
}

// Create the context with a default undefined value
const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

interface MissionStatus {
  firstSpin: boolean;
  inviteFriend: boolean;
  dailyLogin: number;
  luckySpin: boolean;
  joinChannel: boolean;
  scratchCardPlays: number;
}

interface ReferralData {
  referralCode: string;
  referredUsers: Array<{ userId: string; referralCode: string; redeemedBy?: string[] }>;
}

interface Statistics {
  activeUsers: number;
  totalSpins: number;
  totalWithdrawals: number;
  totalDfyrDistributed: number;
  totalSolDistributed: number;
  dailyActiveUsers: number;
  pendingWithdrawals: number;
}

interface UserProfile {
  username: string;
  avatar: string;
  badges: string[];
}

interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  type: 'SOL' | 'DFYR';
  status: 'pending' | 'approved' | 'rejected';
  address: string;
  timestamp: number;
}

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [solBalance, setSolBalance] = useState<number>(0);
  const [dfyrBalance, setDfyrBalance] = useState<number>(0);
  const [lastSpinTime, setLastSpinTime] = useState<number>(0);
  const [missionStatus, setMissionStatus] = useState<MissionStatus>({
    firstSpin: false,
    inviteFriend: false,
    dailyLogin: 0,
    luckySpin: false,
    joinChannel: false,
    scratchCardPlays: 0,
  });
  const [freeSpins, setFreeSpins] = useState<number>(0);
  const [referralData, setReferralData] = useState<ReferralData>({
    referralCode: '',
    referredUsers: [],
  });
  const [statistics, setStatistics] = useState<Statistics>({
    activeUsers: 0,
    totalSpins: 0,
    totalWithdrawals: 0,
    totalDfyrDistributed: 0,
    totalSolDistributed: 0,
    dailyActiveUsers: 0,
    pendingWithdrawals: 0,
  });
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'Anonymous',
    avatar: '/avatars/default.svg',
    badges: [],
  });
  const [redeemedCodes, setRedeemedCodes] = useState<string[]>([]);
  const [claimedMissions, setClaimedMissions] = useState<Array<keyof MissionStatus>>([]);
  const [lastScratchTime, setLastScratchTime] = useState<number>(0);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);

  const updateSolBalance = (amount: number) => {
    setSolBalance(prev => prev + amount);
  };

  const updateDfyrBalance = (amount: number) => {
    setDfyrBalance(prev => prev + amount);
  };

  const updateLastSpinTime = (time: number) => {
    setLastSpinTime(time);
  };

  const completeMission = (mission: keyof MissionStatus, value: boolean | number) => {
    setMissionStatus(prev => ({ ...prev, [mission]: value }));
  };

  const checkDailyLogin = () => {
    const today = new Date().toDateString();
    if (typeof window !== 'undefined' && localStorage.getItem('lastLogin') !== today) {
      localStorage.setItem('lastLogin', today);
      completeMission('dailyLogin', (missionStatus.dailyLogin || 0) + 1);
    }
  };

  const updateFreeSpins = (amount: number) => {
    setFreeSpins(prev => prev + amount);
  };

  const updateAchievement = (achievement: string, progress: number) => {
    console.log(`Achievement ${achievement} updated with progress ${progress}`);
  };

  const updateStatistics = (updates: Partial<Statistics>) => {
    setStatistics(prev => ({ ...prev, ...updates }));
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const generateReferralCode = useCallback(async (): Promise<string> => {
    if (referralData.referralCode) {
      return referralData.referralCode;
    }

    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setReferralData(prev => ({ ...prev, referralCode: newCode }));
    
    return newCode;
  }, [referralData.referralCode]);

  const redeemReferralCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    console.log('Attempting to redeem code:', code);

    // Check if the user is trying to redeem their own code
    if (code === referralData.referralCode) {
      console.log('User attempted to redeem their own code');
      return { success: false, message: 'Error: You cannot use your own referral code.' };
    }

    // Get the current user's ID (or use a unique identifier)
    const currentUserId = telegramUser?.id?.toString() || 'anonymous';
    console.log('Current user ID:', currentUserId);

    // Check if the code exists and has not been redeemed by this user
    const referredUser = referralData.referredUsers.find(user => user.referralCode === code);
    if (!referredUser) {
      console.log('Invalid referral code');
      return { success: false, message: 'Invalid referral code. Please try again.' };
    }

    if (referredUser.redeemedBy && referredUser.redeemedBy.includes(currentUserId)) {
      console.log('User has already redeemed this code');
      return { success: false, message: 'You have already redeemed this code.' };
    }

    // Redeem the code
    setFreeSpins(prev => {
      const newFreeSpins = prev + 1;
      console.log('Updated free spins:', newFreeSpins);
      return newFreeSpins;
    });

    // Update the referral data
    setReferralData(prev => ({
      ...prev,
      referredUsers: prev.referredUsers.map(user => 
        user.referralCode === code 
          ? { ...user, redeemedBy: [...(user.redeemedBy || []), currentUserId] }
          : user
      )
    }));

    console.log('Code redeemed successfully');
    return { success: true, message: 'Code redeemed successfully! You received 1 free spin.' };
  };

  const claimMissionReward = (mission: keyof MissionStatus): boolean => {
    if (!claimedMissions.includes(mission)) {
      setClaimedMissions(prev => [...prev, mission]);
      return true;
    }
    return false;
  };

  const updateLastScratchTime = (time: number) => {
    setLastScratchTime(time);
  };

  const addWithdrawalRequest = async (request: Omit<WithdrawalRequest, 'id'>): Promise<void> => {
    const newRequest: WithdrawalRequest = {
      ...request,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      status: 'pending',
    };
    setWithdrawalRequests(prev => [...prev, newRequest]);
  };

  const updateWithdrawalStatus = (id: string, status: 'approved' | 'rejected') => {
    setWithdrawalRequests(prev =>
      prev.map(request =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  const initializeTelegramUser = useCallback(async () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
      if (tgUser) {
        setTelegramUser(tgUser);
        setUserProfile(prev => ({
          ...prev,
          username: tgUser.username || prev.username,
          avatar: tgUser.photo_url || prev.avatar,
        }));
      }
    }
  }, []);

  useEffect(() => {
    initializeTelegramUser();
  }, [initializeTelegramUser]);

  const value: BalanceContextType = {
    solBalance,
    dfyrBalance,
    lastSpinTime,
    missionStatus,
    freeSpins,
    referralData,
    statistics,
    userProfile,
    telegramUser,
    updateSolBalance,
    updateDfyrBalance,
    updateLastSpinTime,
    completeMission,
    checkDailyLogin,
    updateFreeSpins,
    updateAchievement,
    updateStatistics,
    updateUserProfile,
    generateReferralCode,
    redeemReferralCode,
    redeemedCodes,
    claimMissionReward,
    claimedMissions,
    lastScratchTime,
    updateLastScratchTime,
    withdrawalRequests,
    addWithdrawalRequest,
    updateWithdrawalStatus,
    initializeTelegramUser,
  };

  return (
    <BalanceContext.Provider value={value}>
      {children}
    </BalanceContext.Provider>
  );
}

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

