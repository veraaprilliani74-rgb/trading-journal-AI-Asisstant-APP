import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Trade, PriceAlert } from '../types';
import { mockUser, mockTrades } from '../data/mockData';
import { useAuth } from './AuthContext';
import { mockCredentials } from '../data/auth';

interface UserContextType {
  user: User;
  trades: Trade[];
  setTrades: (trades: Trade[] | ((prev: Trade[]) => Trade[])) => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email'>>) => void;
  updateBalance: (amount: number) => void;
  withdrawFromBalance: (amount: number) => void;
  connectBroker: (brokerName: string, accountId: string) => void;
  disconnectBroker: () => void;
  updateAccountType: (plan: 'Standard' | 'Pro' | 'Premium') => void;
  followedTraders: string[];
  followTrader: (traderId: string) => void;
  unfollowTrader: (traderId: string) => void;
  priceAlerts: PriceAlert[];
  addPriceAlert: (alertData: Omit<PriceAlert, 'id'>) => void;
  removePriceAlert: (alertId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(mockUser);
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [followedTraders, setFollowedTraders] = useState<string[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const isDemoUser = currentUser.email === mockCredentials.email;
      if (isDemoUser) {
        setUser(mockUser);
        setTrades(mockTrades);
        setFollowedTraders([]);
        setPriceAlerts([]);
      } else {
        // New registered user starts with a clean slate
        setUser({
          name: currentUser.name,
          email: currentUser.email,
          accountBalance: 0,
          totalPL: 0,
          accountType: 'Standard',
          brokerConnection: { connected: false },
        });
        setTrades([]);
        setFollowedTraders([]);
        setPriceAlerts([]);
      }
    } else {
      // When logged out, reset to default (demo) state.
      setUser(mockUser);
      setTrades(mockTrades);
      setFollowedTraders([]);
      setPriceAlerts([]);
    }
  }, [isAuthenticated, currentUser]);

  const updateUserPL = (currentTrades: Trade[]) => {
    const totalPL = currentTrades
      .filter(t => t.status === 'closed' && t.pnl)
      .reduce((acc, trade) => acc + (trade.pnl || 0), 0);
    setUser(prevUser => ({ ...prevUser, totalPL }));
  };

  const setTradesAndRecalculatePL = (newTrades: Trade[] | ((prev: Trade[]) => Trade[])) => {
      const updatedTrades = typeof newTrades === 'function' ? newTrades(trades) : newTrades;
      setTrades(updatedTrades);
      updateUserPL(updatedTrades);
  };

  const updateProfile = (updates: Partial<Pick<User, 'name' | 'email'>>) => {
    setUser(prevUser => ({ ...prevUser, ...updates }));
  };

  const updateBalance = (amount: number) => {
    setUser(prevUser => ({
      ...prevUser,
      accountBalance: prevUser.accountBalance + amount,
    }));
  };

  const withdrawFromBalance = (amount: number) => {
    setUser(prevUser => ({
        ...prevUser,
        accountBalance: prevUser.accountBalance - amount,
    }));
  };

  const connectBroker = (brokerName: string, accountId: string) => {
    setUser(prevUser => ({
      ...prevUser,
      brokerConnection: {
        connected: true,
        brokerName,
        accountId,
      },
    }));
  };

  const disconnectBroker = () => {
    setUser(prevUser => ({
      ...prevUser,
      brokerConnection: {
        connected: false,
        brokerName: undefined,
        accountId: undefined,
      },
    }));
  };
  
  const updateAccountType = (plan: 'Standard' | 'Pro' | 'Premium') => {
    setUser(prevUser => ({ ...prevUser, accountType: plan }));
  };

  const followTrader = (traderId: string) => {
    setFollowedTraders(prev => [...new Set([...prev, traderId])]);
  };
  
  const unfollowTrader = (traderId: string) => {
    setFollowedTraders(prev => prev.filter(id => id !== traderId));
  };

  const addPriceAlert = (alertData: Omit<PriceAlert, 'id'>) => {
    const newAlert: PriceAlert = { ...alertData, id: `${alertData.pair}-${Date.now()}` };
    // This logic replaces any existing alert for the same pair
    setPriceAlerts(prev => [newAlert, ...prev.filter(a => a.pair !== newAlert.pair)]);
  };

  const removePriceAlert = (alertId: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const value = {
    user,
    trades,
    setTrades: setTradesAndRecalculatePL,
    updateProfile,
    updateBalance,
    withdrawFromBalance,
    connectBroker,
    disconnectBroker,
    updateAccountType,
    followedTraders,
    followTrader,
    unfollowTrader,
    priceAlerts,
    addPriceAlert,
    removePriceAlert,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};