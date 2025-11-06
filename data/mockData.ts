import { User, Trade, MarketAsset, CommunityMember, AiSignal, CommunityPost, TradingGroup, MarketAnalysis, EconomicEvent, OpenPosition, PendingOrder, SystemNotification, SmartNotification, TransactionHistoryItem, SubscriptionPlan, Comment } from '../types';
import { CurrencyEur, CurrencyGbp, GoldIcon, SilverIcon, OilIcon, BtcIcon, EthIcon, IndexIcon, JournalIcon, AnalyticsIcon, SparklesIcon } from '../components/Icons';

export const mockTrades: Trade[] = [
    { id: '1', type: 'BUY', pair: 'EUR/USD', status: 'closed', entryPrice: 1.0750, exitPrice: 1.0780, quantity: 1, pnl: 300, date: '2024-07-25', notes: 'Bullish divergence on RSI.', tags: ['RSI', 'Divergence'] },
    { id: '2', type: 'SELL', pair: 'GBP/USD', status: 'closed', entryPrice: 1.2650, exitPrice: 1.2620, quantity: 0.5, pnl: 150, date: '2024-07-24', notes: 'Bearish engulfing on H4.', tags: ['Candlestick Pattern'] },
    { id: '3', type: 'BUY', pair: 'XAU/USD', status: 'closed', entryPrice: 2030.00, exitPrice: 2025.00, quantity: 0.1, pnl: -500, date: '2024-07-23', notes: 'Stopped out, news spike.', tags: ['News Trading', 'Loss'] },
    { id: '4', type: 'SELL', pair: 'USD/JPY', status: 'closed', entryPrice: 151.00, exitPrice: 150.50, quantity: 2, pnl: 1000, date: '2024-07-22', notes: 'Resistance hold.', tags: ['Supply/Demand'] },
    { id: '5', type: 'BUY', pair: 'BTC/USD', status: 'open', entryPrice: 68000.00, quantity: 0.01, date: '2024-07-21', notes: 'Long-term hold.', tags: ['Crypto', 'Position'] },
    { id: '6', type: 'SELL', pair: 'EUR/GBP', status: 'closed', entryPrice: 0.8550, exitPrice: 0.8565, quantity: 1, pnl: -150, date: '2024-07-20', notes: 'Trendline break failed.', tags: ['Breakout', 'Loss'] },
    { id: '7', type: 'BUY', pair: 'WTI', status: 'closed', entryPrice: 81.00, exitPrice: 82.50, quantity: 10, pnl: 1500, date: '2024-07-19', notes: 'Inventory data surprise.', tags: ['Commodity', 'News Trading'] }
];

export const mockUser: User = {
  name: 'Demo Trader',
  email: 'new.trader@alphalytic.com',
  accountBalance: 25000,
  totalPL: 2300, // This is now a static initial value; the context will manage dynamic updates.
  accountType: 'Standard',
  brokerConnection: {
    connected: false,
    brokerName: undefined,
    accountId: undefined
  },
};

export const mockMarketWatch: MarketAsset[] = [
    { pair: 'EUR/USD', fullName: 'Euro Dollar', price: 1.0845, changePercent: 0.21, changeValue: 0.0023, icon: CurrencyEur, category: 'FX' },
    { pair: 'GBP/USD', fullName: 'Pound Dollar', price: 1.2634, changePercent: -0.35, changeValue: -0.0045, icon: CurrencyGbp, category: 'FX' },
    { pair: 'USD/JPY', fullName: 'Dollar Yen', price: 151.25, changePercent: 0.55, changeValue: 0.83, icon: CurrencyEur, category: 'FX' },
    { pair: 'USD/CAD', fullName: 'Dollar Cad', price: 1.3580, changePercent: -0.15, changeValue: -0.0020, icon: CurrencyGbp, category: 'FX' },
    { pair: 'USD/CHF', fullName: 'Dollar Swiss', price: 0.9010, changePercent: 0.11, changeValue: 0.0010, icon: CurrencyEur, category: 'FX' },
    { pair: 'EUR/AUD', fullName: 'Euro Aussie', price: 1.6540, changePercent: 0.40, changeValue: 0.0066, icon: CurrencyGbp, category: 'FX' },
    { pair: 'EUR/CAD', fullName: 'Euro Cad', price: 1.4745, changePercent: 0.05, changeValue: 0.0007, icon: CurrencyEur, category: 'FX' },
    { pair: 'AUD/NZD', fullName: 'Aussie Kiwi', price: 1.0850, changePercent: -0.20, changeValue: -0.0022, icon: CurrencyGbp, category: 'FX' },
    { pair: 'GBP/CAD', fullName: 'Pound Cad', price: 1.7155, changePercent: -0.45, changeValue: -0.0077, icon: CurrencyEur, category: 'FX' },
    { pair: 'EUR/GBP', fullName: 'Euro Pound', price: 0.8585, changePercent: 0.56, changeValue: 0.0048, icon: CurrencyGbp, category: 'FX' },
    { pair: 'CAD/JPY', fullName: 'Cad Yen', price: 111.35, changePercent: 0.70, changeValue: 0.77, icon: CurrencyEur, category: 'FX' },
    { pair: 'CHF/JPY', fullName: 'Swiss Yen', price: 167.85, changePercent: 0.44, changeValue: 0.73, icon: CurrencyGbp, category: 'FX' },
    { pair: 'NZD/JPY', fullName: 'Kiwi Yen', price: 92.50, changePercent: 0.80, changeValue: 0.74, icon: CurrencyEur, category: 'FX' },
    { pair: 'AUD/CAD', fullName: 'Aussie Cad', price: 0.8950, changePercent: -0.30, changeValue: -0.0027, icon: CurrencyGbp, category: 'FX' },
    { pair: 'CAD/CHF', fullName: 'Cad Swiss', price: 0.6635, changePercent: -0.25, changeValue: -0.0017, icon: CurrencyEur, category: 'FX' },
    { pair: 'EUR/NZD', fullName: 'Euro Kiwi', price: 1.7950, changePercent: 0.60, changeValue: 0.0107, icon: CurrencyGbp, category: 'FX' },
    { pair: 'NZD/CHF', fullName: 'Kiwi Swiss', price: 0.5980, changePercent: 0.35, changeValue: 0.0021, icon: CurrencyEur, category: 'FX' },
    { pair: 'NZD/CAD', fullName: 'Kiwi Cad', price: 0.8255, changePercent: 0.05, changeValue: 0.0004, icon: CurrencyGbp, category: 'FX' },
    { pair: 'GBP/AUD', fullName: 'Pound Aussie', price: 1.9210, changePercent: -0.75, changeValue: -0.0144, icon: CurrencyEur, category: 'FX' },
    { pair: 'EUR/JPY', fullName: 'Euro Yen', price: 164.05, changePercent: 0.75, changeValue: 1.22, icon: CurrencyGbp, category: 'FX' },
    { pair: 'GBP/CHF', fullName: 'Pound Swiss', price: 1.1380, changePercent: -0.25, changeValue: -0.0028, icon: CurrencyEur, category: 'FX' },
    { pair: 'XAU/USD', fullName: 'Gold', price: 2045.50, changePercent: 0.61, changeValue: 12.30, icon: GoldIcon, category: 'Commodity' },
    { pair: 'XAG/USD', fullName: 'Silver', price: 24.15, changePercent: -1.83, changeValue: -0.45, icon: SilverIcon, category: 'Commodity' },
    { pair: 'WTI', fullName: 'Oil (WTI)', price: 82.45, changePercent: 2.30, changeValue: 1.85, icon: OilIcon, category: 'Commodity' },
    { pair: 'BTC/USD', fullName: 'Bitcoin', price: 68543.21, changePercent: 3.55, changeValue: 2350.10, icon: BtcIcon, category: 'Crypto' },
    { pair: 'ETH/USD', fullName: 'Ethereum', price: 3560.80, changePercent: 1.89, changeValue: 66.20, icon: EthIcon, category: 'Crypto' },
    { pair: 'BCH/USD', fullName: 'Bitcoin Cash', price: 485.30, changePercent: 4.12, changeValue: 19.20, icon: BtcIcon, category: 'Crypto' },
    { pair: 'LTC/USD', fullName: 'Litecoin', price: 83.55, changePercent: 1.55, changeValue: 1.28, icon: EthIcon, category: 'Crypto' },
    { pair: 'XRP/USD', fullName: 'Ripple', price: 0.5270, changePercent: -0.60, changeValue: -0.0032, icon: BtcIcon, category: 'Crypto' },
    { pair: 'XEM/USD', fullName: 'NEM', price: 0.041, changePercent: 2.50, changeValue: 0.001, icon: EthIcon, category: 'Crypto' },
    { pair: 'EOS/USD', fullName: 'EOS', price: 0.81, changePercent: -1.80, changeValue: -0.015, icon: BtcIcon, category: 'Crypto' },
    { pair: 'DOGE/USD', fullName: 'Dogecoin', price: 0.165, changePercent: 5.80, changeValue: 0.009, icon: EthIcon, category: 'Crypto' },
    { pair: 'TRX/USD', fullName: 'TRON', price: 0.12, changePercent: 0.50, changeValue: 0.0006, icon: BtcIcon, category: 'Crypto' },
    { pair: 'BNB/USD', fullName: 'Binance Coin', price: 595.50, changePercent: 2.30, changeValue: 13.40, icon: EthIcon, category: 'Crypto' },
    { pair: 'LSK/USD', fullName: 'Lisk', price: 1.75, changePercent: -3.20, changeValue: -0.058, icon: BtcIcon, category: 'Crypto' },
    { pair: 'DASH/USD', fullName: 'Dash', price: 29.80, changePercent: 1.10, changeValue: 0.32, icon: EthIcon, category: 'Crypto' },
    { pair: 'ZEC/USD', fullName: 'Zcash', price: 27.40, changePercent: -0.90, changeValue: -0.25, icon: BtcIcon, category: 'Crypto' },
    { pair: 'XLM/USD', fullName: 'Stellar', price: 0.11, changePercent: 1.85, changeValue: 0.002, icon: EthIcon, category: 'Crypto' },
    { pair: 'AAVE/USD', fullName: 'Aave', price: 92.50, changePercent: 3.50, changeValue: 3.12, icon: BtcIcon, category: 'Crypto' },
    { pair: 'BSV/USD', fullName: 'Bitcoin SV', price: 64.20, changePercent: -2.10, changeValue: -1.38, icon: EthIcon, category: 'Crypto' },
    { pair: 'ETC/USD', fullName: 'Ethereum Classic', price: 30.80, changePercent: 2.70, changeValue: 0.81, icon: BtcIcon, category: 'Crypto' },
    { pair: 'XTZ/USD', fullName: 'Tezos', price: 0.95, changePercent: 0.65, changeValue: 0.006, icon: EthIcon, category: 'Crypto' },
    { pair: 'QTUM/USD', fullName: 'Qtum', price: 4.50, changePercent: -1.50, changeValue: -0.068, icon: BtcIcon, category: 'Crypto' },
    { pair: 'BAT/USD', fullName: 'Basic Attention', price: 0.25, changePercent: 2.20, changeValue: 0.005, icon: EthIcon, category: 'Crypto' },
    { pair: 'XMR/USD', fullName: 'Monero', price: 168.00, changePercent: 1.40, changeValue: 2.32, icon: BtcIcon, category: 'Crypto' },
    { pair: 'REP/USD', fullName: 'Augur', price: 1.20, changePercent: -4.50, changeValue: -0.056, icon: EthIcon, category: 'Crypto' },
    { pair: 'GRT/USD', fullName: 'The Graph', price: 0.33, changePercent: 5.10, changeValue: 0.016, icon: BtcIcon, category: 'Crypto' },
    { pair: 'LINK/USD', fullName: 'Chainlink', price: 18.50, changePercent: 4.80, changeValue: 0.85, icon: EthIcon, category: 'Crypto' },
    { pair: 'IOTA/USD', fullName: 'IOTA', price: 0.23, changePercent: -1.10, changeValue: -0.0025, icon: BtcIcon, category: 'Crypto' },
    { pair: 'IOST/USD', fullName: 'IOST', price: 0.009, changePercent: 3.30, changeValue: 0.0003, icon: EthIcon, category: 'Crypto' },
    { pair: 'USDT/USD', fullName: 'Tether', price: 1.000, changePercent: 0.01, changeValue: 0.0001, icon: BtcIcon, category: 'Crypto' },
    { pair: 'USDC/USD', fullName: 'USD Coin', price: 1.000, changePercent: 0.00, changeValue: 0.0000, icon: EthIcon, category: 'Crypto' },
    { pair: 'WBTC/USD', fullName: 'Wrapped Bitcoin', price: 68500.00, changePercent: 3.50, changeValue: 2315.00, icon: BtcIcon, category: 'Crypto' },
    { pair: 'THETA/USD', fullName: 'Theta', price: 2.30, changePercent: 6.20, changeValue: 0.13, icon: EthIcon, category: 'Crypto' },
    { pair: 'SNX/USD', fullName: 'Synthetix', price: 3.10, changePercent: -2.80, changeValue: -0.09, icon: BtcIcon, category: 'Crypto' },
    { pair: 'CRO/USD', fullName: 'Crypto.com Coin', price: 0.125, changePercent: 1.90, changeValue: 0.0023, icon: EthIcon, category: 'Crypto' },
    { pair: 'DAI/USD', fullName: 'Dai', price: 1.000, changePercent: 0.02, changeValue: 0.0002, icon: BtcIcon, category: 'Crypto' },
    { pair: 'COMP/USD', fullName: 'Compound', price: 58.00, changePercent: 4.10, changeValue: 2.28, icon: EthIcon, category: 'Crypto' },
    { pair: 'MKR/USD', fullName: 'Maker', price: 2750.00, changePercent: 2.90, changeValue: 77.50, icon: BtcIcon, category: 'Crypto' },
    { pair: 'HT/USD', fullName: 'Huobi Token', price: 0.55, changePercent: -1.20, changeValue: -0.006, icon: EthIcon, category: 'Crypto' },
    { pair: 'BUSD/USD', fullName: 'Binance USD', price: 0.999, changePercent: -0.01, changeValue: -0.0001, icon: BtcIcon, category: 'Crypto' },
    { pair: 'SOL/USD', fullName: 'Solana', price: 175.80, changePercent: 8.50, changeValue: 13.75, icon: EthIcon, category: 'Crypto' },
    { pair: 'FTT/USD', fullName: 'FTX Token', price: 1.65, changePercent: 1.50, changeValue: 0.024, icon: BtcIcon, category: 'Crypto' },
    { pair: 'CEL/USD', fullName: 'Celsius', price: 0.15, changePercent: -5.50, changeValue: -0.008, icon: EthIcon, category: 'Crypto' },
    { pair: 'FIL/USD', fullName: 'Filecoin', price: 6.20, changePercent: 3.80, changeValue: 0.22, icon: BtcIcon, category: 'Crypto' },
    { pair: 'EGLD/USD', fullName: 'MultiversX', price: 39.50, changePercent: 2.10, changeValue: 0.81, icon: EthIcon, category: 'Crypto' },
    { pair: 'AVAX/USD', fullName: 'Avalanche', price: 38.20, changePercent: 5.40, changeValue: 1.96, icon: BtcIcon, category: 'Crypto' },
    { pair: 'DCR/USD', fullName: 'Decred', price: 21.50, changePercent: -0.80, changeValue: -0.17, icon: EthIcon, category: 'Crypto' },
    { pair: 'UMA/USD', fullName: 'UMA', price: 3.25, changePercent: 6.10, changeValue: 0.18, icon: BtcIcon, category: 'Crypto' },
    { pair: 'ZIL/USD', fullName: 'Zilliqa', price: 0.025, changePercent: 1.20, changeValue: 0.0003, icon: EthIcon, category: 'Crypto' },
    { pair: 'ALGO/USD', fullName: 'Algorand', price: 0.19, changePercent: 2.30, changeValue: 0.004, icon: BtcIcon, category: 'Crypto' },
    { pair: 'WAVES/USD', fullName: 'Waves', price: 2.80, changePercent: -3.10, changeValue: -0.09, icon: EthIcon, category: 'Crypto' },
    { pair: 'NEAR/USD', fullName: 'NEAR Protocol', price: 7.50, changePercent: 7.20, changeValue: 0.50, icon: BtcIcon, category: 'Crypto' },
    { pair: 'HBAR/USD', fullName: 'Hedera', price: 0.10, changePercent: 1.50, changeValue: 0.0015, icon: EthIcon, category: 'Crypto' },
    { pair: 'LRC/USD', fullName: 'Loopring', price: 0.28, changePercent: 4.90, changeValue: 0.013, icon: BtcIcon, category: 'Crypto' },
    { pair: 'US30', fullName: 'Dow Jones', price: 39807.50, changePercent: -0.25, changeValue: -99.50, icon: IndexIcon, category: 'Index' },
    { pair: 'AAPL', fullName: 'Apple Inc.', price: 215.00, changePercent: 1.50, changeValue: 3.22, icon: IndexIcon, category: 'Index' },
    { pair: 'AMZN', fullName: 'Amazon.com Inc.', price: 185.00, changePercent: -0.80, changeValue: -1.48, icon: IndexIcon, category: 'Index' },
    { pair: 'TSLA', fullName: 'Tesla Inc.', price: 182.00, changePercent: 2.10, changeValue: 3.82, icon: IndexIcon, category: 'Index' },
];

export const mockCommunityData: CommunityMember[] = [
    { id: 'user-self', rank: 47, name: 'Your Performance', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', performance: `+$0.00`, winRate: `0.0% win rate`, streak: 0 },
    { id: 'trader-1', rank: 1, name: 'Andi Forex Pro', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', performance: '+$25,420.5', winRate: '78.2% WR', streak: 8, isPro: true },
    { id: 'trader-2', rank: 2, name: 'CryptoQueen', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', performance: '+$19,830.2', winRate: '81.5% WR' },
    { id: 'trader-3', rank: 3, name: 'GoldFinger', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a', performance: '+$15,110.0', winRate: '71.0% WR', streak: 4 },
];

export const mockAiSignals: AiSignal[] = [
  {
    pair: 'XAU/USD',
    fullName: 'Gold',
    icon: GoldIcon,
    signal: 'STRONG BUY',
    confidence: 92,
    strategy: 'Momentum Breakout',
    timestamp: 'Just now',
    entryPriceRange: '2045.00 - 2048.50',
    targetPrices: [2060.00, 2075.00],
    stopLoss: 2038.00,
    authorName: 'GoldFinger',
    authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
  },
  {
    pair: 'EUR/USD',
    fullName: 'Euro Dollar',
    icon: CurrencyEur,
    signal: 'BUY',
    confidence: 78,
    strategy: 'RSI Divergence',
    timestamp: '5m ago',
    entryPriceRange: '1.0830 - 1.0850',
    targetPrices: [1.0900, 1.0925],
    stopLoss: 1.0810,
    authorName: 'Andi Forex Pro',
    authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
  },
  {
    pair: 'BTC/USD',
    fullName: 'Bitcoin',
    icon: BtcIcon,
    signal: 'SELL',
    confidence: 65,
    strategy: 'MA Crossover',
    timestamp: '12m ago',
    entryPriceRange: '68600 - 68400',
    targetPrices: [67500],
    stopLoss: 69000,
    authorName: 'CryptoQueen',
    authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
  },
   {
    pair: 'GBP/USD',
    fullName: 'Pound Dollar',
    icon: CurrencyGbp,
    signal: 'STRONG SELL',
    confidence: 85,
    strategy: 'Supply Zone Rejection',
    timestamp: '30m ago',
    entryPriceRange: '1.2640 - 1.2620',
    targetPrices: [1.2580, 1.2550],
    stopLoss: 1.2665,
    authorName: 'Andi Forex Pro',
    authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
  }
];

// Helper to generate sparkline data
const generateSparklineData = (currentPrice: number, changePercent: number, points = 15) => {
    const data = [];
    const startPrice = currentPrice / (1 + changePercent / 100);
    const step = (currentPrice - startPrice) / (points - 1);
    
    for (let i = 0; i < points; i++) {
        // Add some random noise for realism, but ensure the general trend is maintained
        const noise = (Math.random() - 0.5) * step * 1.5;
        data.push({
            name: `T-${points - i}`,
            price: startPrice + (step * i) + noise,
        });
    }
    // Ensure the last point is exactly the current price for consistency
    data[points - 1] = { name: 'Now', price: currentPrice };
    return data;
};

export const mockHistoricalData: Record<string, { name: string; price: number }[]> = {};
mockMarketWatch.forEach(asset => {
    // We use the asset's current data to generate a plausible history
    mockHistoricalData[asset.pair] = generateSparklineData(asset.price, asset.changePercent);
});

export const mockCommunityFeed: CommunityPost[] = [
    {
        id: '1',
        authorName: 'CryptoQueen',
        authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
        timestamp: '15m ago',
        content: "Looks like $BTC is consolidating around 68k. Watching for a potential breakout above 70k to confirm the next leg up. What's everyone's thoughts?",
        likes: 128,
        comments: 2,
        chartImage: 'https://i.imgur.com/gYfH7k4.png',
        commentList: [
            { id: 'c1-1', authorName: 'Andi Forex Pro', authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', timestamp: '12m ago', text: 'I agree, the volume profile supports this. Waiting for confirmation.' },
            { id: 'c1-2', authorName: 'GoldFinger', authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a', timestamp: '5m ago', text: 'Be careful with the resistance at 69.5k, it has been strong.' }
        ]
    },
    {
        id: '2',
        authorName: 'GoldFinger',
        authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
        timestamp: '1h ago',
        content: 'Just closed my XAU/USD long from this morning for a quick +80 pips. The resistance at $2050 held up strong. Taking profits and waiting for the next setup.',
        likes: 95,
        comments: 1,
        commentList: [
            { id: 'c2-1', authorName: 'CryptoQueen', authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', timestamp: '45m ago', text: 'Nice trade! Clean exit.' }
        ]
    },
    {
        id: '3',
        authorName: 'Andi Forex Pro',
        authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
        timestamp: '3h ago',
        content: 'Reminder for new traders: Risk management is key. Never risk more than 1-2% of your account on a single trade. Trading is a marathon, not a sprint.',
        likes: 256,
        comments: 0,
        commentList: []
    }
];

export const mockTradingGroups: TradingGroup[] = [
    {
        id: '1',
        name: 'Forex Majors',
        description: 'Discussions and setups for EUR/USD, GBP/USD, etc.',
        icon: CurrencyEur,
        membersCount: 2800,
        category: 'Forex',
        telegramLink: 'https://t.me/alphalytic_forex'
    },
    {
        id: '2',
        name: 'Gold & Silver Bugs',
        description: 'All about trading precious metals.',
        icon: GoldIcon,
        membersCount: 1500,
        category: 'Commodities',
        telegramLink: 'https://t.me/alphalytic_commodities'
    },
    {
        id: '3',
        name: 'Crypto Whales',
        description: 'Deep dives into BTC, ETH, and altcoins.',
        icon: BtcIcon,
        membersCount: 4200,
        category: 'Crypto',
        telegramLink: 'https://t.me/alphalytic_crypto'
    },
     {
        id: '4',
        name: 'Day Trading Scalpers',
        description: 'High-frequency trading strategies and ideas.',
        icon: AnalyticsIcon,
        membersCount: 980,
        category: 'Strategy',
        telegramLink: 'https://t.me/alphalytic_scalpers'
    },
    {
        id: '5',
        name: 'AI Risk Models',
        description: 'Premium group for AI-driven risk management.',
        icon: SparklesIcon,
        membersCount: 120,
        category: 'Strategy',
        isExclusive: true,
        telegramLink: 'https://t.me/alphalytic_ai_premium'
    }
];

export const mockMarketAnalysis: MarketAnalysis[] = [
    {
        id: '1',
        market: 'Forex',
        sentiment: 'Bullish',
        summary: 'The US Dollar is showing signs of strength ahead of the FOMC meeting. EUR/USD is testing key support levels, while USD/JPY is approaching yearly highs. A hawkish tone from the Fed could extend the dollar\'s rally.',
        timestamp: 'Updated 25m ago',
    },
    {
        id: '2',
        market: 'Commodities',
        sentiment: 'Neutral',
        summary: 'Gold (XAU/USD) remains range-bound between $2030 and $2050 as traders await inflation data. Oil (WTI) is seeing slight downward pressure due to inventory builds, but geopolitical tensions are providing a floor.',
        timestamp: 'Updated 30m ago',
    },
    {
        id: '3',
        market: 'Indices',
        sentiment: 'Bearish',
        summary: 'Stock indices are facing headwinds from concerns over persistent inflation and potential rate hikes. The US30 has broken below its 50-day moving average, signaling potential for further downside. Tech stocks remain particularly vulnerable.',
        timestamp: 'Updated 15m ago',
    },
];

export const mockEconomicCalendar: EconomicEvent[] = [
    {
        id: '1', date: '2024-07-28', time: '08:30', countryCode: '🇺🇸', eventName: 'Core PCE Price Index m/m', 
        impact: 'High', previous: '0.2%', forecast: '0.3%', actual: ''
    },
    {
        id: '2', date: '2024-07-28', time: '10:00', countryCode: '🇪🇺', eventName: 'German Prelim CPI m/m',
        impact: 'High', previous: '0.1%', forecast: '0.4%', actual: ''
    },
    {
        id: '3', date: '2024-07-28', time: '14:30', countryCode: '🇨🇦', eventName: 'GDP m/m',
        impact: 'Medium', previous: '0.3%', forecast: '0.1%', actual: ''
    },
    {
        id: '4', date: '2024-07-29', time: '04:30', countryCode: '🇬🇧', eventName: 'Mortgage Approvals',
        impact: 'Low', previous: '60K', forecast: '61K', actual: ''
    },
    {
        id: '5', date: '2024-07-29', time: '10:00', countryCode: '🇺🇸', eventName: 'CB Consumer Confidence',
        impact: 'High', previous: '100.4', forecast: '101.2', actual: ''
    },
];

export const mockOpenPositions: OpenPosition[] = [
    { id: 'op1', pair: 'BTC/USD', type: 'BUY', entryPrice: 68000.00, volume: 0.01, pnl: 54.32, takeProfit: 72000.00 },
];

export const mockPendingOrders: PendingOrder[] = [];

export const mockNotifications: SystemNotification[] = [
  {
    id: '1',
    type: 'system',
    title: 'Welcome to Alphalytic!',
    message: 'Explore your demo account features and make your first virtual trade.',
    timestamp: 'Just now',
    isRead: false,
  },
   {
    id: '2',
    type: 'deposit',
    title: 'Demo Funds Added',
    message: 'We\'ve added $25,000 in virtual funds to your account to get you started.',
    timestamp: 'Just now',
    isRead: false,
  },
];

export const mockSmartNotifications: SmartNotification[] = [
  {
    id: 's1',
    type: 'critical',
    title: 'Margin Call Warning',
    message: 'Your margin level is at 35%. Consider closing positions or adding funds to avoid liquidation.',
    timestamp: '2m ago',
    isRead: false,
  },
  {
    id: 's2',
    type: 'trading',
    title: 'XAU/USD Alert Triggered',
    message: 'Gold has crossed above your alert price of $2050.00.',
    timestamp: '15m ago',
    isRead: false,
  },
  {
    id: 's3',
    type: 'performance',
    title: 'New Win Rate High!',
    message: 'Congratulations! Your win rate has reached a new peak of 78.5%. Keep up the great work!',
    timestamp: '1h ago',
    isRead: true,
  },
  {
    id: 's4',
    type: 'trading',
    title: 'Economic Event: US CPI',
    message: 'High-impact US CPI data will be released in 15 minutes. Expect high volatility in USD pairs.',
    timestamp: '1h ago',
    isRead: true,
  },
  {
    id: 's5',
    type: 'performance',
    title: 'Weekly P&L Summary',
    message: 'You finished the week with a net profit of +$2,300.50. Your best pair was EUR/USD.',
    timestamp: '1d ago',
    isRead: true,
  },
];

export const mockTransactionHistory: TransactionHistoryItem[] = [
    { id: 'th1', type: 'Deposit', amount: 25000.00, status: 'Completed', date: '2024-07-20 10:00', method: 'Virtual Funds' },
];

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$0',
    priceDetails: '/month',
    features: [
      'Manual Trade Journal',
      'Basic Analytics',
      'Community Access',
      '5 AI Insights per day',
      'Standard Support'
    ],
    isCurrent: true,
    ctaText: 'Current Plan',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    priceDetails: '/month',
    features: [
      'Everything in Basic, plus:',
      'Broker Integration (auto-sync)',
      'Advanced Performance Analytics',
      'Unlimited AI Insights & Signals',
      'Priority Support'
    ],
    ctaText: 'Upgrade to Pro',
    highlight: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$79',
    priceDetails: '/month',
    features: [
      'Everything in Pro, plus:',
      'AI Risk Management Assistant',
      'Exclusive Trading Groups',
      '1-on-1 Performance Coaching',
      'Dedicated Support Agent'
    ],
    ctaText: 'Upgrade to Premium',
  },
];