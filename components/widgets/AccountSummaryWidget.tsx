import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { EyeIcon } from '../Icons';

const AccountSummaryWidget: React.FC = () => {
    const { user } = useUser();
    const { convert } = useCurrency();

    const today = new Date().toISOString().split('T')[0];
    const todayPL = (useUser().trades)
        .filter(t => t.date === today && t.status === 'closed' && t.pnl)
        .reduce((acc, trade) => acc + (trade.pnl || 0), 0);

    const convertedBalance = convert(user.accountBalance);
    const convertedTodayPL = convert(todayPL);

    return (
        <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex justify-between items-center text-gray-400 text-sm">
                <span>Account Balance</span>
                <EyeIcon className="w-5 h-5" />
            </div>
            <div className="text-4xl font-bold mt-2">
                {convertedBalance.symbol}{convertedBalance.formatted}
            </div>
            {user.accountBalance > 0 ? (
                <div className={`text-sm mt-1 ${todayPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    Today: {todayPL >= 0 ? '+' : ''}{convertedTodayPL.symbol}{convertedTodayPL.formatted}
                </div>
            ) : (
                <div className="mt-4">
                    <ReactRouterDOM.Link
                        to="/wallet"
                        state={{ initialTab: 'deposit' }}
                        className="w-full inline-block text-center bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition duration-300"
                    >
                        Make Your First Deposit
                    </ReactRouterDOM.Link>
                </div>
            )}
        </div>
    );
};

export default AccountSummaryWidget;
