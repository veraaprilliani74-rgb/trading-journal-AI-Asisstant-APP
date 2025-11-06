import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { useCurrency } from '../../contexts/CurrencyContext';

const StatsWidget: React.FC = () => {
    const { user, trades } = useUser();
    const { convert } = useCurrency();

    const closedTrades = trades.filter(t => t.status === 'closed');
    const totalTrades = closedTrades.length;
    const winningTrades = closedTrades.filter(t => t.pnl && t.pnl > 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const convertedTotalPL = convert(user.totalPL);

    return (
        <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400">Total Trades</p>
                <p className="text-lg font-bold mt-1">{totalTrades}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400">Win Rate</p>
                <p className={`text-lg font-bold mt-1 ${winRate > 50 ? 'text-green-400' : 'text-gray-200'}`}>{winRate.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400">Total P&L</p>
                <p className={`text-lg font-bold mt-1 ${user.totalPL > 0 ? 'text-green-400' : user.totalPL < 0 ? 'text-red-400' : ''}`}>
                    {user.totalPL >= 0 ? '+' : ''}{convertedTotalPL.symbol}{convertedTotalPL.formatted}
                </p>
            </div>
        </div>
    );
};
export default StatsWidget;
