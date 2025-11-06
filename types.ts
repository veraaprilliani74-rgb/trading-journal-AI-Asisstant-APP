import React from 'react';

export interface User {
  name: string;
  email: string;
  accountBalance: number;
  totalPL: number;
  accountType: 'Standard' | 'Pro' | 'Premium';
  brokerConnection: {
    connected: boolean;
    brokerName?: string;
    accountId?: string;
  };
}

export interface Tag {
  name:string;
  color: {
    bg: string;
    text: string;
  };
}

export interface Trade {
  id: string;
  type: 'BUY' | 'SELL';
  pair: string;
  status: 'open' | 'closed';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  pnl?: number;
  date: string;
  notes?: string;
  tags: string[];
}

export interface MarketAsset {
  pair: string;
  fullName:string;
  price: number;
  changePercent: number;
  changeValue: number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  category: 'FX' | 'Commodity' | 'Crypto' | 'Index';
}

export interface PriceAlert {
  id: string;
  pair: string;
  fullName: string;
  targetPrice: number;
  condition: 'above' | 'below';
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface CommunityMember {
    id: string;
    rank: number;
    name: string;
    avatar: string;
    performance: string;
    winRate: string;
    streak?: number;
    isPro?: boolean;
}

export interface AiSignal {
  pair: string;
  fullName: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  signal: 'STRONG BUY' | 'BUY' | 'SELL' | 'STRONG SELL';
  confidence: number; // 0 to 100
  strategy: string;
  timestamp: string;
  entryPriceRange?: string;
  targetPrices?: number[];
  stopLoss?: number;
  authorName?: string;
  authorAvatar?: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  text: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  likes: number;
  comments: number;
  chartImage?: string;
  commentList?: Comment[];
}

export interface TradingGroup {
  id: string;
  name: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  membersCount: number;
  category: string;
  isExclusive?: boolean;
  telegramLink?: string;
}

export interface EconomicEvent {
  id: string;
  date: string;
  time: string;
  countryCode: string; // For flag emoji
  eventName: string;
  impact: 'High' | 'Medium' | 'Low';
  previous: string;
  forecast: string;
  actual: string;
}

export interface MarketAnalysis {
  id: string;
  market: 'Forex' | 'Commodities' | 'Indices' | 'Crypto';
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  summary: string;
  timestamp: string;
}

export interface SystemNotification {
  id: string;
  type: 'deposit' | 'withdrawal' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface SmartNotification {
  id: string;
  type: 'critical' | 'trading' | 'performance';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface OpenPosition {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  volume: number;
  pnl: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface PendingOrder {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  volume: number;
  limitPrice: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface TransactionHistoryItem {
    id: string;
    type: 'Deposit' | 'Withdrawal';
    amount: number;
    status: 'Completed' | 'Pending' | 'Failed';
    date: string;
    method: string;
}

export interface SubscriptionPlan {
  id: 'basic' | 'pro' | 'premium';
  name: string;
  price: string;
  priceDetails: string;
  features: string[];
  isCurrent?: boolean;
  ctaText: string;
  highlight?: boolean;
}

export interface DashboardWidget {
  id: 'accountSummary' | 'stats' | 'marketWatch' | 'openPositions' | 'aiInsights';
  name: string;
}