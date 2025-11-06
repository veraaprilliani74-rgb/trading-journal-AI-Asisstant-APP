import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { OpenPosition } from '../../types';

const OpenPositionsWidget: React.FC = () => {
    const { trades } = useUser();
    const { convert } = useCurrency();

    // Deriving open positions from the main trades list
    const openPositions: OpenPosition[] = trades
        .filter(trade => trade.status === 'open')
        .map(trade => ({
            id: trade.id,
            pair: trade.pair,
            type: trade.type,
            entryPrice: trade.entryPrice,
            volume: trade.quantity,
            pnl: 0, // PNL for open positions would need real-time data, showing 0 for now.
        }));

    return (
        <div className="bg-gray-800 p-4 rounded-xl space-y-3">
            <h3 className="text-lg font-bold">Open Positions ({openPositions.length})</h3>
            {openPositions.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {openPositions.map(pos => {
                        const convertedPnl = convert(pos.pnl);
                        return (
                            <div key={pos.id} className="bg-gray-700 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${pos.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{pos.type}</span>
                                        <span className="font-semibold">{pos.pair}</span>
                                    </div>
                                    <span className={`font-bold ${pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pos.pnl >= 0 ? '+' : ''}{convertedPnl.symbol}{convertedPnl.formatted}</span>
                                </div>
                                <div className="text-xs text-gray-400 mt-1 flex justify-between">
                                    <span>Entry: {pos.entryPrice.toFixed(4)}</span>
                                    <span>Volume: {pos.volume} lots</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : <div className="text-center text-sm text-gray-500 py-4">No open positions.</div>}
        </div>
    );
};

export default OpenPositionsWidget;
