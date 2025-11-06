import React, { useState, useEffect } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { mockTransactionHistory } from '../data/mockData';
import { TransactionHistoryItem } from '../types';
import { VisaIcon, MastercardIcon, EwalletIcon, BankIcon, ClockIcon, ChevronLeftIcon, OvoIcon, GopayIcon, DanaIcon, BcaIcon, BriIcon, MandiriIcon, BniIcon } from '../components/Icons';
import { useCurrency } from '../contexts/CurrencyContext';
import { useUser } from '../contexts/UserContext';
import { exchangeRates } from '../data/exchangeRates';

const mainPaymentMethods = [
    { id: 'visa', name: 'Visa', icon: VisaIcon, type: 'direct' },
    { id: 'mastercard', name: 'Mastercard', icon: MastercardIcon, type: 'direct' },
    { id: 'ewallet', name: 'E-Wallet', icon: EwalletIcon, type: 'view' },
    { id: 'bank', name: 'Bank Transfer', icon: BankIcon, type: 'view' },
];

const ewalletMethods = [
    { id: 'ovo', name: 'OVO', icon: OvoIcon },
    { id: 'gopay', name: 'Gopay', icon: GopayIcon },
    { id: 'dana', name: 'DANA', icon: DanaIcon },
];

const bankMethods = [
    { id: 'bca', name: 'BCA', icon: BcaIcon },
    { id: 'bri', name: 'BRI', icon: BriIcon },
    { id: 'mandiri', name: 'Mandiri', icon: MandiriIcon },
    { id: 'bni', name: 'BNI', icon: BniIcon },
];

const allPaymentMethodsForNameLookup = [
    { id: 'visa', name: 'Visa'},
    { id: 'mastercard', name: 'Mastercard'},
    { id: 'ovo', name: 'OVO' },
    { id: 'gopay', name: 'Gopay' },
    { id: 'dana', name: 'DANA' },
    { id: 'bca', name: 'BCA' },
    { id: 'bri', name: 'BRI' },
    { id: 'mandiri', name: 'Mandiri' },
    { id: 'bni', name: 'BNI' },
];


const DepositTab: React.FC<{
    updateBalance: (amount: number) => void;
    navigate: ReactRouterDOM.NavigateFunction;
    addTransactionToHistory: (item: Omit<TransactionHistoryItem, 'id' | 'date'>) => void;
}> = ({ updateBalance, navigate, addTransactionToHistory }) => {
    const [amount, setAmount] = useState('1000');
    const [selectedMethod, setSelectedMethod] = useState<string>('visa');
    const [isProcessing, setIsProcessing] = useState(false);
    const { convert, selectedCurrency } = useCurrency();
    const [paymentView, setPaymentView] = useState<'main' | 'ewallet' | 'bank'>('main');

    const handleMainMethodClick = (method: typeof mainPaymentMethods[0]) => {
        if (isProcessing) return;
        if (method.type === 'view') {
            const view = method.id as 'ewallet' | 'bank';
            setPaymentView(view);
            if (view === 'ewallet') {
                setSelectedMethod('ovo');
            } else if (view === 'bank') {
                setSelectedMethod('bca');
            }
        } else {
            setSelectedMethod(method.id);
        }
    };

    const handleDeposit = () => {
        const depositAmount = parseFloat(amount);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            alert('Please enter a valid amount to deposit.');
            return;
        }

        setIsProcessing(true);
        
        setTimeout(() => {
            const rate = exchangeRates[selectedCurrency] || 1;
            const depositAmountInUsd = depositAmount / rate;
            updateBalance(depositAmountInUsd);
            
            const methodName = allPaymentMethodsForNameLookup.find(m => m.id === selectedMethod)?.name || 'Card';
            addTransactionToHistory({
                type: 'Deposit',
                amount: depositAmountInUsd,
                status: 'Completed',
                method: methodName
            });

            const convertedAmount = convert(depositAmountInUsd);
            alert(`Deposit of ${convertedAmount.symbol}${convertedAmount.formatted} was successful!`);
            
            setIsProcessing(false);
            setAmount('1000');
            navigate('/dashboard');
        }, 2500);
    };

    const displayAmount = convert(parseFloat(amount) / (exchangeRates[selectedCurrency] || 1));

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">Amount ({selectedCurrency})</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{convert(0).symbol}</span>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-7 pr-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                        disabled={isProcessing}
                    />
                </div>
            </div>
            <div>
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-400">
                        {paymentView === 'ewallet' && 'Select E-Wallet'}
                        {paymentView === 'bank' && 'Select Bank'}
                        {paymentView === 'main' && 'Select Payment Method'}
                    </h3>
                    {paymentView !== 'main' && (
                        <button onClick={() => setPaymentView('main')} className="text-sm text-blue-400 hover:underline flex items-center space-x-1 disabled:opacity-50" disabled={isProcessing}>
                            <ChevronLeftIcon className="w-4 h-4" />
                            <span>Back</span>
                        </button>
                    )}
                </div>

                {paymentView === 'main' && (
                    <div className="grid grid-cols-2 gap-3">
                        {mainPaymentMethods.map(method => (
                            <button
                                key={method.id}
                                onClick={() => handleMainMethodClick(method)}
                                className={`p-3 rounded-lg flex flex-col items-center justify-center space-y-2 border-2 transition-colors ${
                                    (method.type === 'direct' && selectedMethod === method.id)
                                    ? 'bg-green-500/10 border-green-500' 
                                    : 'bg-gray-700 border-gray-700 hover:border-gray-500'
                                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isProcessing}
                            >
                                <method.icon className="w-8 h-8" />
                                <span className="text-sm font-semibold">{method.name}</span>
                            </button>
                        ))}
                    </div>
                )}
                
                {paymentView === 'ewallet' && (
                    <div className="grid grid-cols-2 gap-3">
                        {ewalletMethods.map(method => (
                             <button
                                key={method.id}
                                onClick={() => setSelectedMethod(method.id)}
                                className={`p-3 rounded-lg flex flex-col items-center justify-center space-y-2 border-2 transition-colors ${selectedMethod === method.id ? 'bg-green-500/10 border-green-500' : 'bg-gray-700 border-gray-700 hover:border-gray-500'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isProcessing}
                            >
                                <method.icon className="h-8 w-16 object-contain" />
                            </button>
                        ))}
                    </div>
                )}
                
                {paymentView === 'bank' && (
                     <div className="grid grid-cols-2 gap-3">
                        {bankMethods.map(method => (
                             <button
                                key={method.id}
                                onClick={() => setSelectedMethod(method.id)}
                                className={`p-3 rounded-lg flex flex-col items-center justify-center space-y-2 border-2 transition-colors ${selectedMethod === method.id ? 'bg-green-500/10 border-green-500' : 'bg-gray-700 border-gray-700 hover:border-gray-500'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isProcessing}
                            >
                                <method.icon className="h-8 w-20 object-contain" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <button 
                onClick={handleDeposit}
                disabled={isProcessing || !amount || parseFloat(amount) <= 0}
                className="w-full bg-green-600 text-white font-bold py-3.5 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {isProcessing ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    `Proceed to Deposit ${displayAmount.symbol}${displayAmount.formatted}`
                )}
            </button>
        </div>
    );
};

const WithdrawTab: React.FC<{
    withdrawFromBalance: (amount: number) => void;
    addTransactionToHistory: (item: Omit<TransactionHistoryItem, 'id' | 'date'>) => void;
}> = ({ withdrawFromBalance, addTransactionToHistory }) => {
    const { user } = useUser();
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { convert, selectedCurrency } = useCurrency();
    const feeInUsd = 5.00;
    
    const rate = exchangeRates[selectedCurrency] || 1;
    const convertedFee = convert(feeInUsd);
    
    const amountValue = parseFloat(amount) || 0;
    const amountInUsd = amountValue / rate;
    const total = amountInUsd > feeInUsd ? amountInUsd - feeInUsd : 0;
    const convertedTotal = convert(total);
    
    const convertedMaxWithdrawal = convert(user.accountBalance);

    const handleWithdrawal = () => {
        const withdrawalAmount = parseFloat(amount);
        if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
            alert('Please enter a valid amount to withdraw.');
            return;
        }

        const withdrawalAmountInUsd = withdrawalAmount / rate;

        if (withdrawalAmountInUsd > user.accountBalance) {
            alert('Withdrawal amount cannot exceed your available balance.');
            return;
        }

        setIsProcessing(true);

        setTimeout(() => {
            withdrawFromBalance(withdrawalAmountInUsd);
            addTransactionToHistory({
                type: 'Withdrawal',
                amount: withdrawalAmountInUsd,
                status: 'Completed',
                method: 'Bank Transfer'
            });

            alert(`Your withdrawal request for ${convert(withdrawalAmountInUsd).symbol}${convert(withdrawalAmountInUsd).formatted} is being processed.`);
            setIsProcessing(false);
            setAmount('');
        }, 2500);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-400 mb-1">Amount to Withdraw ({selectedCurrency})</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{convert(0).symbol}</span>
                    <input
                        type="number"
                        id="withdraw-amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-7 pr-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                        disabled={isProcessing}
                    />
                </div>
                 <p className="text-xs text-gray-500 mt-1">Maximum withdrawal: {convertedMaxWithdrawal.symbol}{convertedMaxWithdrawal.formatted}</p>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Withdrawal Method</h3>
                <div className={`bg-gray-700 p-3 rounded-lg flex items-center space-x-3 border-2 border-green-500 ${isProcessing ? 'opacity-50' : ''}`}>
                    <BankIcon className="w-8 h-8 text-green-400" />
                    <div>
                        <p className="font-semibold">Bank Transfer</p>
                        <p className="text-xs text-gray-400">Account ending in **** 5678</p>
                    </div>
                </div>
            </div>
             <div className="bg-gray-700/50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">Withdrawal Amount:</span>
                    <span>{convert(0).symbol}{amountValue.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-400">Processing Fee:</span>
                    <span>-{convertedFee.symbol}{convertedFee.formatted}</span>
                </div>
                 <div className="flex justify-between font-bold border-t border-gray-600 pt-2 mt-2">
                    <span>You will receive:</span>
                    <span>{convertedTotal.symbol}{total > 0 ? convertedTotal.formatted : '0.00'}</span>
                </div>
            </div>
            <button 
                onClick={handleWithdrawal}
                disabled={isProcessing || !amount || parseFloat(amount) <= 0 || (parseFloat(amount) / (exchangeRates[selectedCurrency] || 1)) > user.accountBalance}
                className="w-full bg-green-600 text-white font-bold py-3.5 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {isProcessing ? (
                     <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    'Request Withdrawal'
                )}
            </button>
        </div>
    );
};

const HistoryTab: React.FC<{ history: TransactionHistoryItem[] }> = ({ history }) => {
    const { convert } = useCurrency();
    const getStatusClass = (status: TransactionHistoryItem['status']) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/20 text-green-400';
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'Failed': return 'bg-red-500/20 text-red-400';
        }
    };
    
    return (
        <div className="space-y-3 animate-fade-in">
            {history.length > 0 ? history.map(item => {
                const convertedAmount = convert(item.amount);
                return (
                    <div key={item.id} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                        <div>
                            <p className={`font-bold ${item.type === 'Deposit' ? 'text-green-400' : 'text-red-400'}`}>
                                {item.type}
                            </p>
                            <p className="text-xs text-gray-400">{item.date} via {item.method}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-semibold text-lg">{item.type === 'Deposit' ? '+' : '-'}{convertedAmount.symbol}{convertedAmount.formatted}</p>
                            <p className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${getStatusClass(item.status)}`}>
                                {item.status}
                            </p>
                        </div>
                    </div>
                );
            }) : (
                 <div className="text-center text-gray-500 py-10">
                    <p>No transaction history found.</p>
                </div>
            )}
        </div>
    );
};


const Wallet: React.FC = () => {
  const { user, updateBalance, withdrawFromBalance } = useUser();
  const navigate = ReactRouterDOM.useNavigate();
  const location = ReactRouterDOM.useLocation();
  const initialTab = location.state?.initialTab || 'deposit';
  const [activeTab, setActiveTab] = useState(initialTab);
  const { convert } = useCurrency();
  const convertedBalance = convert(user.accountBalance);
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistoryItem[]>(mockTransactionHistory);
  
  const addTransactionToHistory = (item: Omit<TransactionHistoryItem, 'id' | 'date'>) => {
    const newTransaction: TransactionHistoryItem = {
        ...item,
        id: `txn-${Date.now()}`,
        date: new Date().toLocaleString(),
    };
    setTransactionHistory(prev => [newTransaction, ...prev]);
  };

  useEffect(() => {
    // If the user navigates back to this page, ensure the state is fresh
    if (location.state?.initialTab) {
        setActiveTab(location.state.initialTab);
    }
  }, [location.state]);
  
  return (
    <div className="p-4 space-y-6">
        <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-400">Available Balance</p>
            <p className="text-4xl font-bold mt-1">{convertedBalance.symbol}{convertedBalance.formatted}</p>
        </div>
        
        <div className="flex justify-around bg-gray-800 p-1 rounded-lg text-sm">
            <button onClick={() => setActiveTab('deposit')} className={`flex-1 px-3 py-1.5 rounded-md transition-colors ${activeTab === 'deposit' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>Deposit</button>
            <button onClick={() => setActiveTab('withdraw')} className={`flex-1 px-3 py-1.5 rounded-md transition-colors ${activeTab === 'withdraw' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>Withdraw</button>
            <button onClick={() => setActiveTab('history')} className={`flex-1 px-3 py-1.5 rounded-md transition-colors flex items-center justify-center space-x-1.5 ${activeTab === 'history' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>
                <ClockIcon className="w-4 h-4" />
                <span>History</span>
            </button>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl">
            {activeTab === 'deposit' && <DepositTab updateBalance={updateBalance} navigate={navigate} addTransactionToHistory={addTransactionToHistory} />}
            {activeTab === 'withdraw' && <WithdrawTab withdrawFromBalance={withdrawFromBalance} addTransactionToHistory={addTransactionToHistory} />}
            {activeTab === 'history' && <HistoryTab history={transactionHistory} />}
        </div>
    </div>
  );
};

export default Wallet;