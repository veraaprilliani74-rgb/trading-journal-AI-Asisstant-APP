import { MarketNews } from '../types';

export const mockNews: MarketNews[] = [
  {
    id: '1',
    headline: 'US Dollar Surges as Fed Hints at Faster Tapering Schedule',
    summary: 'The Federal Reserve signaled it might accelerate the reduction of its asset purchases in response to persistent inflation, sending the US Dollar Index (DXY) to a 16-month high. Markets are now pricing in a potential rate hike as early as Q2 2025.',
    source: 'Reuters',
    timestamp: '5m ago',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    tags: ['Forex', 'Fed', 'USD', 'Inflation'],
  },
  {
    id: '2',
    headline: 'Gold Prices Plunge Below $2000 Support Amid Hawkish Fed Stance',
    summary: 'Gold fell sharply, breaking the key psychological level of $2000 per ounce. The move was triggered by a stronger dollar and rising Treasury yields, which dull the appeal of the non-yielding metal for investors.',
    source: 'Bloomberg',
    timestamp: '30m ago',
    imageUrl: 'https://images.unsplash.com/photo-1589311059810-3185a735e889?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
    tags: ['Commodities', 'Gold', 'XAUUSD'],
  },
  {
    id: '3',
    headline: 'OPEC+ Agrees to Modest Oil Production Increase Despite Supply Concerns',
    summary: 'OPEC and its allies have agreed to another small increase in oil production, sticking to their existing plan despite calls from major consumers for more supply to tame soaring prices. WTI crude oil prices remained volatile following the announcement.',
    source: 'Associated Press',
    timestamp: '1h ago',
    imageUrl: 'https://images.unsplash.com/photo-1631210741584-2e85494a8a3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    tags: ['Oil', 'OPEC', 'Energy'],
  },
  {
    id: '4',
    headline: 'Bitcoin Rebounds from Weekend Lows, But Regulatory Headwinds Remain',
    summary: 'Bitcoin has recovered to the $68,000 level after a weekend sell-off. However, the crypto market remains on edge amid increasing scrutiny from global regulators, with the SEC reportedly investigating several DeFi lending platforms.',
    source: 'CoinDesk',
    timestamp: '2h ago',
    imageUrl: 'https://images.unsplash.com/photo-1621417013238-a25b1a382e82?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    tags: ['Crypto', 'Bitcoin', 'Regulation'],
  },
];
