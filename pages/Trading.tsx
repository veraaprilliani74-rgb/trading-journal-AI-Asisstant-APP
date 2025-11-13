

import React, { useState, useMemo, useEffect } from 'react';
import { mockMarketWatch, mockOpenPositions, mockCommunityData, mockTradingGroups, mockPendingOrders, mockAiSignals } from '../data/mockData';
import { MarketAsset, PriceAlert, OpenPosition, CommunityMember, TradingGroup, PendingOrder, AiSignal, Trade } from '../types';
import { BellIcon, TrashIcon, XIcon, UsersIcon, CurrencyEur, GoldIcon, BtcIcon, AnalyticsIcon, TelegramIcon, CheckIcon, FilterIcon } from '../components/Icons';
import AiSignalCard from '../components/AiSignalCard';
import { useCurrency } from '../contexts/CurrencyContext';
import { useUser } from '../contexts/UserContext';
import TradingChart from '../components/TradingChart';
import { mockCandlestickData } from '../data/mockData';

// Price Alert Modal (remains unchanged)
const PriceAlertModal: React.FC<{
    asset: MarketAsset;
    onClose: () => void;
    onSetAlert: (alert: Omit<PriceAlert, 'id'>) => void;
}> = ({ asset, onClose, onSetAlert }) => {
    const [targetPrice, setTargetPrice] = useState('');
    const [condition, setCondition] = useState<'above' | 'below'>('above');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        const price = parseFloat(targetPrice);
        if (isNaN(price) || price <= 0) {
            setError('Please enter a valid target price.');
            return;
        }
        setError('');
        onSetAlert({
            pair: asset.pair,
            fullName: asset.fullName,
            targetPrice: price,
            condition,
            icon: asset.icon,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-800 rounded-xl w-full max-w-md flex flex-col shadow-lg">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold">Set Alert for {asset.pair}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="p-4 space-y-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-400">Current Price</p>
                        <p className="text-2xl font-mono font-bold">{asset.price.toFixed(asset.category === 'FX' ? 4 : 2)}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Alert me when price is</label>
                        <div className="flex bg-gray-700 rounded-lg p-1">
                            <button onClick={() => setCondition('above')} className={`w-1/2 py-1.5 text-sm rounded-md ${condition === 'above' ? 'bg-gray-600' : ''}`}>Above</button>
                            <button onClick={() => setCondition('below')} className={`w-1/2 py-1.5 text-sm rounded-md ${condition === 'below' ? 'bg-gray-600' : ''}`}>Below</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Target Price</label>
                        <input
                            type="number"
                            value={targetPrice}
                            onChange={(e) => setTargetPrice(e.target.value)}
                            step="any"
                            placeholder="Enter target price"
                            className={`w-full bg-gray-700 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${error ? 'border-red-500' : 'border-gray-600'}`}
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                </div>
                <div className="flex justify-end space-x-3 p-4 border-t border-gray-700">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-semibold">Set Alert</button>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components for new tabs ---

const OrderPanel: React.FC<{ 
    asset: MarketAsset; 
    positions: OpenPosition[]; 
    pendingOrders: PendingOrder[];
    onClosePosition: (id: string) => void; 
    onCancelPendingOrder: (id: string) => void;
    onPlaceOrder: (order: any) => void;
    onUpdateStopLoss: (id: string, stopLoss?: number) => void;
}> = ({ asset, positions, pendingOrders, onClosePosition, onCancelPendingOrder, onPlaceOrder, onUpdateStopLoss }) => {
    const [orderType, setOrderType] = useState<'Market' | 'Limit'>('Market');
    const [volume, setVolume] = useState(0.1);
    const [limitPrice, setLimitPrice] = useState('');
    const [stopLoss, setStopLoss] = useState('');
    const [takeProfit, setTakeProfit] = useState('');
    const [margin, setMargin] = useState(0); // in USD
    const [editingStopLoss, setEditingStopLoss] = useState<{ id: string; value: string } | null>(null);
    const { convert } = useCurrency();

    const isPlaceOrderDisabled = orderType === 'Limit' && (!limitPrice || parseFloat(limitPrice) <= 0);

    useEffect(() => {
        // Mock margin calculation: (Price * Volume * Contract Size) / Leverage
        const contractSize = 100000; // Standard lot for FX
        const leverage = 100;
        const requiredMargin = (asset.price * volume * contractSize) / leverage;
        setMargin(requiredMargin);
    }, [volume, asset.price]);

    const handleOrder = (tradeType: 'BUY' | 'SELL') => {
        onPlaceOrder({
            asset,
            orderType,
            tradeType,
            volume,
            limitPrice: parseFloat(limitPrice) || undefined,
            stopLoss: parseFloat(stopLoss) || undefined,
            takeProfit: parseFloat(takeProfit) || undefined,
        });
        // Reset form for next order
        setVolume(0.1);
        setLimitPrice('');
        setStopLoss('');
        setTakeProfit('');
    };
    
    const handleSaveStopLoss = () => {
        if (!editingStopLoss) return;
        const newStopLossValue = parseFloat(editingStopLoss.value);

        if (editingStopLoss.value.trim() === '') {
            onUpdateStopLoss(editingStopLoss.id, undefined);
        } else if (!isNaN(newStopLossValue) && newStopLossValue > 0) {
            onUpdateStopLoss(editingStopLoss.id, newStopLossValue);
        }
        
        setEditingStopLoss(null);
    };
    
    const convertedMargin = convert(margin);

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="bg-gray-800 p-3 rounded-xl">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-700 rounded-full"><asset.icon className="w-6 h-6" /></div>
                        <div>
                            <p className="font-bold">{asset.fullName}</p>
                            <p className="text-sm text-gray-400">{asset.pair}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-lg">{asset.price.toFixed(asset.category === 'FX' ? 4 : 2)}</p>
                        <p className={`text-sm font-semibold ${asset.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-xl space-y-3">
                <div className="flex bg-gray-700 rounded-lg p-1">
                    <button onClick={() => setOrderType('Market')} className={`w-1/2 py-1.5 text-sm rounded-md ${orderType === 'Market' ? 'bg-gray-600' : ''}`}>Market Order</button>
                    <button onClick={() => setOrderType('Limit')} className={`w-1/2 py-1.5 text-sm rounded-md ${orderType === 'Limit' ? 'bg-gray-600' : ''}`}>Limit Order</button>
                </div>
                
                {orderType === 'Limit' && (
                     <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Price</label>
                        <input type="number" value={limitPrice} onChange={e => setLimitPrice(e.target.value)} placeholder="Enter limit price" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                )}
                
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Volume (Lots)</label>
                    <input type="number" value={volume} onChange={e => setVolume(parseFloat(e.target.value) || 0)} step="0.01" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Stop Loss</label>
                        <input type="number" value={stopLoss} onChange={e => setStopLoss(e.target.value)} placeholder="Optional" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Take Profit</label>
                        <input type="number" value={takeProfit} onChange={e => setTakeProfit(e.target.value)} placeholder="Optional" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                </div>
                
                <div className="text-center text-sm text-gray-400 pt-2 border-t border-gray-700">
                    Required Margin: <span className="font-mono text-white">{convertedMargin.symbol}{convertedMargin.formatted}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleOrder('SELL')} disabled={isPlaceOrderDisabled} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed">SELL</button>
                    <button onClick={() => handleOrder('BUY')} disabled={isPlaceOrderDisabled} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed">BUY</button>
                </div>
            </div>
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Open Positions ({positions.length})</h3>
                    {positions.length > 0 ? positions.map(pos => {
                        const convertedPnl = convert(pos.pnl);
                        return (
                            <div key={pos.id} className="bg-gray-800 p-3 rounded-lg space-y-2">
                                <div className="flex justify-between items-center">
                                     <span className={`px-2 py-0.5 text-xs font-bold rounded ${pos.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{pos.type} {pos.volume} lots</span>
                                     <span className={`font-bold ${pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pos.pnl >= 0 ? '+' : ''}{convertedPnl.symbol}{convertedPnl.formatted}</span>
                                </div>
                                <div className="text-xs text-gray-400 pt-2 border-t border-gray-700/50 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Entry: {pos.entryPrice.toFixed(asset.category === 'FX' ? 4 : 2)}</span>
                                        <span>TP: {pos.takeProfit ? pos.takeProfit.toFixed(asset.category === 'FX' ? 4 : 2) : <span className="text-gray-500">Not set</span>}</span>
                                    </div>
                                    
                                    {editingStopLoss?.id === pos.id ? (
                                        <div className="flex items-center space-x-2 bg-gray-700 p-1.5 rounded-md">
                                            <label htmlFor={`sl-${pos.id}`} className="flex-shrink-0 text-gray-400 pl-1">SL:</label>
                                            <input 
                                                id={`sl-${pos.id}`}
                                                type="number"
                                                value={editingStopLoss.value}
                                                onChange={(e) => setEditingStopLoss({ id: pos.id, value: e.target.value })}
                                                className="w-full bg-gray-600 rounded px-2 py-1 text-white text-xs appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                placeholder="Set price"
                                                autoFocus
                                                step="any"
                                            />
                                            <button onClick={handleSaveStopLoss} className="p-1 rounded bg-green-600 text-white hover:bg-green-700">
                                                <CheckIcon className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setEditingStopLoss(null)} className="p-1 rounded bg-gray-500 text-white hover:bg-gray-400">
                                                <XIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <span>SL: {pos.stopLoss ? pos.stopLoss.toFixed(asset.category === 'FX' ? 4 : 2) : <span className="text-gray-500">Not set</span>}</span>
                                            <button onClick={() => setEditingStopLoss({ id: pos.id, value: pos.stopLoss?.toFixed(asset.category === 'FX' ? 4 : 2) || '' })} className="text-blue-400 hover:underline text-xs font-semibold">
                                                {pos.stopLoss ? 'Modify SL' : 'Set SL'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => onClosePosition(pos.id)} className="w-full text-center text-xs bg-gray-700 py-1.5 rounded hover:bg-gray-600">Close Position</button>
                            </div>
                        )
                    }) : <div className="text-center text-xs text-gray-500 py-2">No open positions for {asset.pair}</div>}
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Pending Orders ({pendingOrders.length})</h3>
                    {pendingOrders.length > 0 ? pendingOrders.map(order => (
                        <div key={order.id} className="bg-gray-800 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                                 <span className={`px-2 py-0.5 text-xs font-bold rounded ${order.type === 'BUY' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>{order.type} LIMIT {order.volume} lots</span>
                                 <span className="font-mono text-sm">{order.limitPrice.toFixed(asset.category === 'FX' ? 4 : 2)}</span>
                            </div>
                            {(order.stopLoss || order.takeProfit) && (
                                <div className="text-xs text-gray-400 mt-1 flex justify-end">
                                    <div>
                                        {order.stopLoss && <span className="mr-2">SL: {order.stopLoss.toFixed(asset.category === 'FX' ? 4 : 2)}</span>}
                                        {order.takeProfit && <span>TP: {order.takeProfit.toFixed(asset.category === 'FX' ? 4 : 2)}</span>}
                                    </div>
                                </div>
                            )}
                            <button onClick={() => onCancelPendingOrder(order.id)} className="w-full mt-2 text-center text-xs bg-gray-700 py-1.5 rounded hover:bg-gray-600">Cancel Order</button>
                        </div>
                    )) : <div className="text-center text-xs text-gray-500 py-2">No pending orders for {asset.pair}</div>}
                </div>
            </div>
        </div>
    );
};

const CommunityMemberCard: React.FC<{ 
    member: CommunityMember;
    isFollowed: boolean;
    onFollow: (id: string) => void;
    onUnfollow: (id: string) => void; 
}> = ({ member, isFollowed, onFollow, onUnfollow }) => {
    const handleFollowClick = () => {
        if (isFollowed) {
            onUnfollow(member.id);
        } else {
            onFollow(member.id);
        }
    };
    return (
        <div className="p-3 rounded-xl flex items-center space-x-3 bg-gray-800 animate-fade-in">
            <span className="text-md font-bold text-gray-400">#{member.rank}</span>
            <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                     <p className="font-bold text-sm">{member.name}</p>
                     {member.isPro && <span className="text-xs bg-yellow-500 text-black font-bold px-1.5 py-0.5 rounded-md">PRO</span>}
                </div>
                <p className="text-xs font-semibold text-green-400">{member.performance}</p>
            </div>
            <button 
                onClick={handleFollowClick}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${isFollowed ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                {isFollowed ? 'Following' : 'Follow'}
            </button>
        </div>
    );
};


const groupIconMap: { [key: string]: React.FC<any> } = {
    Forex: CurrencyEur,
    Commodities: GoldIcon,
    Crypto: BtcIcon,
    Strategy: AnalyticsIcon,
};
const GroupCard: React.FC<{ group: TradingGroup }> = ({ group }) => {
    const IconComponent = groupIconMap[group.category] || AnalyticsIcon;
    return (
        <a href={group.telegramLink} target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-xl flex items-center space-x-3 animate-fade-in hover:bg-gray-700/50 transition-colors">
            <div className="p-2 bg-gray-700 rounded-full">
                <IconComponent className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
                <p className="font-bold text-sm">{group.name}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                    <UsersIcon className="w-3 h-3" />
                    <span>{group.membersCount.toLocaleString()} members</span>
                </div>
            </div>
            <TelegramIcon className="w-5 h-5 text-blue-400"/>
        </a>
    );
};

const HistoryPanel: React.FC<{ trades: Trade[] }> = ({ trades }) => {
    const { convert } = useCurrency();
    const closedTrades = trades.filter(t => t.status === 'closed');

    return (
        <div className="space-y-3 animate-fade-in">
             <h3 className="text-sm font-semibold">Order History ({closedTrades.length})</h3>
             {closedTrades.length > 0 ? (
                closedTrades.map(trade => {
                    const convertedPnl = trade.pnl ? convert(trade.pnl) : null;
                    const isWin = trade.pnl ? trade.pnl >= 0 : false;
                    const isBuy = trade.type === 'BUY';
                    return (
                        <div key={trade.id} className="bg-gray-800 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${isBuy ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {trade.type}
                                    </span>
                                    <span className="ml-2 font-bold">{trade.pair}</span>
                                </div>
                                {convertedPnl && (
                                    <p className={`font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                                        {isWin ? '+' : ''}{convertedPnl.symbol}{convertedPnl.formatted}
                                    </p>
                                )}
                            </div>
                            <div className="text-xs text-gray-400 mt-1 flex justify-between">
                                <span>{trade.date}</span>
                                <span>Entry: {trade.entryPrice.toFixed(4)} | Exit: {trade.exitPrice?.toFixed(4)}</span>
                            </div>
                        </div>
                    );
                })
             ) : (
                <div className="text-center text-xs text-gray-500 py-10">No closed trades found.</div>
             )}
        </div>
    );
};


// --- Main Trading Component ---
type AiSignalSortKey = 'confidence' | 'timestamp';

interface AiSignalFilters {
    assetTypes: MarketAsset['category'][];
    minConfidence: number;
    signalTypes: AiSignal['signal'][];
}

const SortIcon: React.FC<{ order: 'asc' | 'desc', className?: string }> = ({ order, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {order === 'asc' ? <path d="M18 15l-6-6-6 6"/> : <path d="M6 9l6 6 6-6"/>}
    </svg>
);

const initialAiSignalFilters: AiSignalFilters = {
    assetTypes: [],
    minConfidence: 0,
    signalTypes: [],
};

const AiSignalFilterModal: React.FC<{
    onClose: () => void;
    currentFilters: AiSignalFilters;
    onApplyFilters: (filters: AiSignalFilters) => void;
    onClearFilters: () => void;
}> = ({ onClose, currentFilters, onApplyFilters, onClearFilters }) => {
    const [localFilters, setLocalFilters] = useState(currentFilters);
    const assetTypes: MarketAsset['category'][] = ['FX', 'Commodity', 'Crypto', 'Index'];
    const signalTypes: AiSignal['signal'][] = ['STRONG BUY', 'BUY', 'SELL', 'STRONG SELL'];
    
    const toggleItem = <T,>(array: T[], item: T) => {
        return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
    };

    const handleApply = () => {
        onApplyFilters(localFilters);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-800 rounded-xl w-full max-w-md flex flex-col shadow-lg">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold">Filter AI Signals</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="p-4 space-y-6 overflow-y-auto">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Asset Types</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {assetTypes.map(type => (
                                <button key={type} onClick={() => setLocalFilters(prev => ({ ...prev, assetTypes: toggleItem(prev.assetTypes, type) }))} className={`px-3 py-2 text-sm rounded-lg transition-colors ${localFilters.assetTypes.includes(type) ? 'bg-green-600 text-white font-semibold' : 'bg-gray-700 text-gray-300'}`}>
                                    {type === 'Commodity' ? 'Commodities' : type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confidence" className="block text-sm font-semibold text-gray-400 mb-2">
                            Min. Confidence: <span className="font-bold text-green-400">{localFilters.minConfidence}%</span>
                        </label>
                        <input id="confidence" type="range" min="0" max="100" step="5" value={localFilters.minConfidence} onChange={(e) => setLocalFilters(prev => ({ ...prev, minConfidence: parseInt(e.target.value) }))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb" />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Signal Types</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {signalTypes.map(type => (
                                <button key={type} onClick={() => setLocalFilters(prev => ({ ...prev, signalTypes: toggleItem(prev.signalTypes, type) }))} className={`px-3 py-2 text-sm rounded-lg transition-colors ${localFilters.signalTypes.includes(type) ? 'bg-green-600 text-white font-semibold' : 'bg-gray-700 text-gray-300'}`}>
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center p-4 border-t border-gray-700">
                     <button type="button" onClick={onClearFilters} className="px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 font-semibold">Clear Filters</button>
                    <div className="space-x-3">
                         <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold">Cancel</button>
                        <button type="button" onClick={handleApply} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-semibold">Apply Filters</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const Trading: React.FC = () => {
    const { trades, followedTraders, followTrader, unfollowTrader, priceAlerts, addPriceAlert, removePriceAlert } = useUser();
    const [activeTab, setActiveTab] = useState('Trade');
    const [activeInstrument, setActiveInstrument] = useState('All');
    const [alertModalAsset, setAlertModalAsset] = useState<MarketAsset | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
    const [openPositions, setOpenPositions] = useState<OpenPosition[]>(mockOpenPositions);
    const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>(mockPendingOrders);
    const [aiSignalSortConfig, setAiSignalSortConfig] = useState<{ key: AiSignalSortKey; order: 'asc' | 'desc' }>({ key: 'timestamp', order: 'desc' });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [aiSignalFilters, setAiSignalFilters] = useState<AiSignalFilters>(initialAiSignalFilters);
    
    const hasClosedTrades = useMemo(() => trades.some(t => t.status === 'closed'), [trades]);

    useEffect(() => {
        if (!hasClosedTrades && activeTab === 'History') {
            setActiveTab('Trade');
        }
    }, [hasClosedTrades, activeTab]);
    
    const gridColsClass = hasClosedTrades ? 'grid-cols-6' : 'grid-cols-5';
    
    const instruments = ['All', 'FX', 'Comm', 'Crypto', 'Index'];

    const assetCategoryMap = useMemo(() => {
        return mockMarketWatch.reduce((acc, asset) => {
            acc[asset.pair] = asset.category;
            return acc;
        }, {} as Record<string, MarketAsset['category']>);
    }, []);

    const filteredAssets = useMemo(() => {
        if (activeInstrument === 'All') return mockMarketWatch;
        const categoryMap: Record<string, MarketAsset['category']> = { 'FX': 'FX', 'Comm': 'Commodity', 'Crypto': 'Crypto', 'Index': 'Index' };
        return mockMarketWatch.filter(asset => asset.category === categoryMap[activeInstrument]);
    }, [activeInstrument]);
    
    const parseTimestamp = (timestamp: string): number => {
        if (timestamp === 'Just now') return 0;
        const parts = timestamp.split(' ');
        const value = parseInt(parts[0], 10);
        if (isNaN(value)) return Infinity;
        const unit = parts[1];
        if (unit.startsWith('m')) return value; // minutes
        if (unit.startsWith('h')) return value * 60; // hours
        if (unit.startsWith('d')) return value * 60 * 24; // days
        return Infinity;
    };

    const sortedAndFilteredAiSignals = useMemo(() => {
        const filtered = mockAiSignals.filter(signal => {
            const category = assetCategoryMap[signal.pair];
            if (aiSignalFilters.assetTypes.length > 0 && (!category || !aiSignalFilters.assetTypes.includes(category))) {
                return false;
            }
            if (signal.confidence < aiSignalFilters.minConfidence) {
                return false;
            }
            if (aiSignalFilters.signalTypes.length > 0 && !aiSignalFilters.signalTypes.includes(signal.signal)) {
                return false;
            }
            return true;
        });

        const sorted = [...filtered];
        sorted.sort((a, b) => {
            const orderMultiplier = aiSignalSortConfig.order === 'asc' ? 1 : -1;
            if (aiSignalSortConfig.key === 'confidence') {
                return (a.confidence - b.confidence) * orderMultiplier;
            }
            if (aiSignalSortConfig.key === 'timestamp') {
                return (parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp)) * orderMultiplier * -1; // Newest first
            }
            return 0;
        });
        return sorted;
    }, [aiSignalSortConfig, aiSignalFilters, assetCategoryMap]);

    const isFiltersActive = useMemo(() => {
      return aiSignalFilters.assetTypes.length > 0 ||
             aiSignalFilters.minConfidence > 0 ||
             aiSignalFilters.signalTypes.length > 0;
    }, [aiSignalFilters]);

    const relevantSignalsForChart = useMemo(() => {
        if (!selectedAsset) return [];
        return mockAiSignals.filter(signal => signal.pair === selectedAsset.pair);
    }, [selectedAsset]);

    const handleAiSignalSort = (key: AiSignalSortKey) => {
        setAiSignalSortConfig(prev => {
            if (prev.key === key) {
                return { key, order: prev.order === 'asc' ? 'desc' : 'asc' };
            }
            return { key, order: 'desc' }; // Default to descending for new sort keys
        });
    };

    const handleSelectAsset = (asset: MarketAsset) => {
        setSelectedAsset(asset);
        setActiveTab('Chart');
    };
    
    const handleClosePosition = (positionId: string) => {
        setOpenPositions(prev => prev.filter(p => p.id !== positionId));
    };

    const handleCancelPendingOrder = (orderId: string) => {
        setPendingOrders(prev => prev.filter(o => o.id !== orderId));
    };
    
    const handleUpdateStopLoss = (positionId: string, newStopLoss?: number) => {
        setOpenPositions(prevPositions => 
            prevPositions.map(pos => 
                pos.id === positionId ? { ...pos, stopLoss: newStopLoss } : pos
            )
        );
    };

    const handlePlaceOrder = (order: {
        asset: MarketAsset;
        orderType: 'Market' | 'Limit';
        tradeType: 'BUY' | 'SELL';
        volume: number;
        limitPrice?: number;
        stopLoss?: number;
        takeProfit?: number;
    }) => {
        if (order.orderType === 'Market') {
            const newPosition: OpenPosition = {
                id: `pos-${Date.now()}`,
                pair: order.asset.pair,
                type: order.tradeType,
                entryPrice: order.asset.price,
                volume: order.volume,
                pnl: 0,
                stopLoss: order.stopLoss,
                takeProfit: order.takeProfit,
            };
            setOpenPositions(prev => [newPosition, ...prev]);
        } else if (order.orderType === 'Limit' && order.limitPrice) {
            const newPendingOrder: PendingOrder = {
                id: `pend-${Date.now()}`,
                pair: order.asset.pair,
                type: order.tradeType,
                limitPrice: order.limitPrice,
                volume: order.volume,
                stopLoss: order.stopLoss,
                takeProfit: order.takeProfit,
            };
            setPendingOrders(prev => [newPendingOrder, ...prev]);
        }
    };

    const handleSetAlert = (alertData: Omit<PriceAlert, 'id'>) => {
        addPriceAlert(alertData);
        setAlertModalAsset(null);
    };

    const handleDeleteAlert = (alertId: string) => {
        removePriceAlert(alertId);
    };
    
  return (
    <>
    <div className="p-3 space-y-4">
      <div className="text-center">
        <h1 className="text-xl font-bold">Enhanced Trading</h1>
        <p className="text-sm text-gray-400">AI-Powered Multi-Asset Platform</p>
      </div>

      <div className={`grid ${gridColsClass} bg-gray-800 p-1 rounded-lg text-sm`}>
        <button onClick={() => setActiveTab('Trade')} className={`px-2 py-1 rounded-md transition-colors ${activeTab === 'Trade' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>Trade</button>
        <button onClick={() => setActiveTab('Chart')} className={`px-2 py-1 rounded-md transition-colors ${activeTab === 'Chart' ? 'bg-gray-700 font-semibold' : 'text-gray-400'} disabled:text-gray-600 disabled:cursor-not-allowed`} disabled={!selectedAsset}>Chart</button>
        <button onClick={() => setActiveTab('Order')} className={`px-2 py-1 rounded-md transition-colors ${activeTab === 'Order' ? 'bg-gray-700 font-semibold' : 'text-gray-400'} disabled:text-gray-600 disabled:cursor-not-allowed`} disabled={!selectedAsset}>Order</button>
        <button onClick={() => setActiveTab('AI Signals')} className={`px-2 py-1 rounded-md transition-colors ${activeTab === 'AI Signals' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>AI&nbsp;Signals</button>
        <button onClick={() => setActiveTab('Community')} className={`px-2 py-1 rounded-md transition-colors ${activeTab === 'Community' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>Community</button>
        {hasClosedTrades && (
            <button onClick={() => setActiveTab('History')} className={`px-2 py-1 rounded-md transition-colors ${activeTab === 'History' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>History</button>
        )}
      </div>

      {activeTab === 'Trade' && (
        <div className="animate-fade-in space-y-4">
            <div className="space-y-2">
                <h3 className="text-sm font-semibold">Active Alerts ({priceAlerts.length})</h3>
                {priceAlerts.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                        {priceAlerts.map(alert => (
                            <div key={alert.id} className="bg-gray-800 p-2 rounded-lg flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="p-1 bg-gray-700 rounded-full"><alert.icon className="w-5 h-5" /></div>
                                    <div>
                                        <p className="font-bold text-sm">{alert.pair}</p>
                                        <p className="text-xs text-gray-400">
                                            Notify if price {alert.condition === 'above' ? '>' : '<'} <span className="font-mono">{alert.targetPrice}</span>
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteAlert(alert.id)} className="p-1 text-red-400 hover:text-red-300"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                ) : <div className="bg-gray-800/50 p-3 rounded-lg text-center text-sm text-gray-500 border border-dashed border-gray-700">No active price alerts.</div>}
            </div>

            <div>
                <h3 className="text-sm font-semibold mb-2">Choose Trading Instrument</h3>
                <div className="flex space-x-2 overflow-x-auto pb-2 -mx-3 px-3">
                     {instruments.map(instrument => (
                        <button key={instrument} onClick={() => setActiveInstrument(instrument)} className={`px-4 py-2 text-sm rounded-full flex-shrink-0 transition-colors ${activeInstrument === instrument ? 'bg-green-600 text-white font-semibold' : 'bg-gray-700 text-gray-300'}`}>{instrument}</button>
                     ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {filteredAssets.map(asset => (
                    <div key={asset.pair} className="bg-gray-800 p-3 rounded-xl flex flex-col cursor-pointer" onClick={() => handleSelectAsset(asset)}>
                        <div className="flex justify-between items-start">
                             <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gray-700 rounded-full"><asset.icon className="w-6 h-6" /></div>
                                <div>
                                    <p className="font-bold text-sm">{asset.fullName}</p>
                                    <p className="text-xs text-gray-400">{asset.pair}</p>
                                </div>
                            </div>
                             <button onClick={(e) => { e.stopPropagation(); setAlertModalAsset(asset); }} className="p-1 text-gray-400 hover:text-white flex-shrink-0" aria-label="Set price alert"><BellIcon className="w-5 h-5" /></button>
                        </div>
                        <div className="mt-2 text-right">
                            <p className="font-mono text-lg">{asset.price.toFixed(asset.category === 'FX' ? 4 : 2)}</p>
                            <p className={`text-sm font-semibold ${asset.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {activeTab === 'Chart' && (
        selectedAsset ? <TradingChart asset={selectedAsset} signals={relevantSignalsForChart} /> : 
        <div className="text-center py-10 text-gray-500 animate-fade-in">Please select an asset from the 'Trade' tab to view its chart.</div>
      )}

      {activeTab === 'Order' && (
        selectedAsset ? <OrderPanel 
                            asset={selectedAsset} 
                            positions={openPositions.filter(p => p.pair === selectedAsset.pair)}
                            pendingOrders={pendingOrders.filter(p => p.pair === selectedAsset.pair)}
                            onClosePosition={handleClosePosition}
                            onCancelPendingOrder={handleCancelPendingOrder}
                            onPlaceOrder={handlePlaceOrder}
                            onUpdateStopLoss={handleUpdateStopLoss}
                        /> : 
        <div className="text-center py-10 text-gray-500 animate-fade-in">Please select an asset from the 'Trade' tab to place an order.</div>
      )}
      
      {activeTab === 'AI Signals' && (
        <div className="space-y-4 animate-fade-in">
            <div>
                <h3 className="text-sm font-semibold mb-2">AI Generated Trade Ideas</h3>
                <div className="flex items-center space-x-2 bg-gray-800 p-1.5 rounded-lg">
                    <span className="text-xs text-gray-400 font-medium px-2">Sort by:</span>
                    {(['timestamp', 'confidence'] as AiSignalSortKey[]).map(key => (
                      <button 
                        key={key} 
                        onClick={() => handleAiSignalSort(key)} 
                        className={`flex-1 px-2 py-1.5 rounded-md flex items-center justify-center space-x-1.5 text-sm transition-colors ${aiSignalSortConfig.key === key ? 'bg-gray-700 text-white font-semibold' : 'text-gray-400 hover:bg-gray-700/50'}`}
                      >
                        <span className="capitalize">{key}</span>
                        {aiSignalSortConfig.key === key && <SortIcon order={aiSignalSortConfig.order} />}
                      </button>
                    ))}
                    <div className="border-l border-gray-700 h-6 mx-1"></div>
                     <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="flex-1 px-2 py-1.5 rounded-md flex items-center justify-center space-x-1.5 text-sm transition-colors text-gray-400 hover:bg-gray-700/50 relative"
                    >
                        <FilterIcon className="w-4 h-4" />
                        <span>Filter</span>
                        {isFiltersActive && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-gray-800"></span>}
                    </button>
                </div>
            </div>
            <div className="space-y-3">
                {sortedAndFilteredAiSignals.length > 0 ? (
                    sortedAndFilteredAiSignals.map(signal => (
                        <AiSignalCard key={signal.pair + signal.timestamp} signal={signal} />
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500 bg-gray-800 rounded-lg">
                        <p>No AI signals match your criteria.</p>
                        <p className="text-sm mt-1">Try adjusting your filters.</p>
                    </div>
                )}
            </div>
        </div>
      )}

      {activeTab === 'Community' && (
          <div className="space-y-4 animate-fade-in">
              <div>
                  <h3 className="text-sm font-semibold mb-2">Top Traders</h3>
                  <div className="space-y-2">
                      {mockCommunityData.filter(m => m.id !== 'user-self').slice(0, 3).map(member => (
                          <CommunityMemberCard 
                            key={member.id} 
                            member={member} 
                            isFollowed={followedTraders.includes(member.id)}
                            onFollow={followTrader}
                            onUnfollow={unfollowTrader}
                          />)
                       )}
                  </div>
              </div>
               <div>
                  <h3 className="text-sm font-semibold mb-2">Trading Groups</h3>
                  <div className="space-y-2">
                      {mockTradingGroups.map(group => <GroupCard key={group.id} group={group} />)}
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'History' && (
        <HistoryPanel trades={trades} />
      )}

    </div>
    {alertModalAsset && <PriceAlertModal asset={alertModalAsset} onClose={() => setAlertModalAsset(null)} onSetAlert={handleSetAlert} />}
    {isFilterModalOpen && (
        <AiSignalFilterModal
            currentFilters={aiSignalFilters}
            onClose={() => setIsFilterModalOpen(false)}
            onApplyFilters={(newFilters) => {
                setAiSignalFilters(newFilters);
                setIsFilterModalOpen(false);
            }}
            onClearFilters={() => {
                setAiSignalFilters(initialAiSignalFilters);
                setIsFilterModalOpen(false);
            }}
        />
    )}
    </>
  );
};

export default Trading;