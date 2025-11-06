import React from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import EquityChart from '../components/EquityChart';
import { useCurrency } from '../contexts/CurrencyContext';
import { useUser } from '../contexts/UserContext';

const Analytics: React.FC = () => {
  const { convert } = useCurrency();
  const { user, trades } = useUser();
  
  const isProOrHigher = user.accountType === 'Pro' || user.accountType === 'Premium';

  const closedTrades = trades.filter(t => t.status === 'closed');
  const winningTrades = closedTrades.filter(t => t.pnl && t.pnl > 0).length;
  const totalClosedTrades = closedTrades.length;
  const winRate = totalClosedTrades > 0 ? (winningTrades / totalClosedTrades) * 100 : 0;
  
  const totalPL = user.totalPL;
  const startingBalance = user.accountBalance - totalPL;

  const equityCurveData = [{ name: 'Start', value: startingBalance }];
  let cumulativePL = 0;
  closedTrades
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((trade, index) => {
        cumulativePL += trade.pnl || 0;
        equityCurveData.push({
            name: `Trade ${index + 1}`,
            value: startingBalance + cumulativePL,
        });
    });

  const dailyAvg = totalClosedTrades > 0 ? totalPL / totalClosedTrades : 0;
  const weeklyAvg = dailyAvg * 5; // Simple projection
  const monthlyAvg = dailyAvg * 20; // Simple projection

  const convertedTotalPL = convert(totalPL);
  const convertedDailyAvg = convert(dailyAvg);
  const convertedWeeklyAvg = convert(weeklyAvg);
  const convertedMonthly = convert(monthlyAvg);
    
  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-xl">
            <p className="text-sm text-gray-400">Total P&L</p>
            <p className={`text-2xl font-bold mt-1 ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPL >=0 ? '+' : ''}{convertedTotalPL.symbol}{convertedTotalPL.formatted}
            </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl">
            <p className="text-sm text-gray-400">Win Rate</p>
            <p className={`text-2xl font-bold mt-1 ${winRate >= 50 ? 'text-green-400' : 'text-gray-200'}`}>{winRate.toFixed(1)}%</p>
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-xl">
        <div className="flex justify-around bg-gray-700/50 p-1 rounded-lg text-sm mb-4">
            <button className="px-3 py-1 bg-gray-700 rounded-md flex-1">Equity</button>
            <button className="px-3 py-1 text-gray-400 flex-1">Risk</button>
            <button className="px-3 py-1 text-gray-400 flex-1">Assets</button>
            <button className="px-3 py-1 text-gray-400 flex-1">Emotion</button>
        </div>
        
        <h3 className="text-lg font-bold mb-4">Equity Curve</h3>
        <EquityChart data={equityCurveData} />
      </div>

      <div className="relative">
        <div className={`grid grid-cols-3 gap-4 text-center ${!isProOrHigher ? 'blur-sm' : ''}`}>
            <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-400 text-xs">Daily Avg</p>
                <p className={`text-lg font-semibold mt-1 ${dailyAvg >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {dailyAvg >=0 ? '+' : ''}{convertedDailyAvg.symbol}{convertedDailyAvg.formatted}
                </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-400 text-xs">Weekly Avg</p>
                <p className={`text-lg font-semibold mt-1 ${weeklyAvg >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {weeklyAvg >= 0 ? '+' : ''}{convertedWeeklyAvg.symbol}{convertedWeeklyAvg.formatted}
                </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-400 text-xs">Monthly</p>
                <p className={`text-lg font-semibold mt-1 ${monthlyAvg >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {monthlyAvg >= 0 ? '+' : ''}{convertedMonthly.symbol}{convertedMonthly.formatted}
                </p>
            </div>
        </div>
        {!isProOrHigher && (
            <div className="absolute inset-0 bg-gray-800/80 rounded-xl flex flex-col items-center justify-center p-4">
                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full mb-2">PRO</span>
                <p className="font-bold text-center">Advanced Analytics</p>
                <p className="text-xs text-gray-400 text-center mb-3">Upgrade to view detailed performance metrics.</p>
                <ReactRouterDOM.Link to="/subscription" className="bg-green-600 text-white px-4 py-1.5 text-sm rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Upgrade Now
                </ReactRouterDOM.Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;