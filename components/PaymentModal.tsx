import React, { useState } from 'react';
import { SubscriptionPlan } from '../types';
import { XIcon, OvoIcon, GopayIcon, DanaIcon, BcaIcon, BriIcon, MandiriIcon, BniIcon, BankIcon, EwalletIcon } from './Icons';

interface PaymentModalProps {
  plan: SubscriptionPlan;
  onClose: () => void;
  onSuccess: (planId: SubscriptionPlan['id']) => void;
}

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


const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose, onSuccess }) => {
    const [selectedMethod, setSelectedMethod] = useState<string | null>('ovo');
    const [activeCategory, setActiveCategory] = useState<'ewallet' | 'bank'>('ewallet');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCategoryChange = (category: 'ewallet' | 'bank') => {
        setActiveCategory(category);
        if (category === 'ewallet') {
            setSelectedMethod('ovo');
        } else {
            setSelectedMethod('bca');
        }
    }

    const handlePayment = () => {
        if (!selectedMethod) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                onSuccess(plan.id);
            }, 1500);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in">
                <div className="bg-gray-800 rounded-xl w-full max-w-md flex flex-col items-center justify-center shadow-lg p-8 space-y-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-xl font-bold">Payment Successful!</h2>
                    <p className="text-gray-400 text-center">You have successfully upgraded to the {plan.name} plan.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-end z-50 p-4 animate-fade-in">
            <div className="bg-gray-800 rounded-t-2xl w-full max-w-md h-[90vh] flex flex-col shadow-lg animate-slide-up">
                <header className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-lg font-bold">Complete Payment</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 disabled:opacity-50" disabled={isProcessing}>
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-4 space-y-4 flex-shrink-0">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">You are upgrading to</p>
                        <div className="flex justify-between items-baseline">
                            <span className="text-xl font-bold">{plan.name} Plan</span>
                            <span className="text-2xl font-bold">{plan.price}<span className="text-base text-gray-400">{plan.priceDetails}</span></span>
                        </div>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto px-4">
                    <div className="sticky top-0 bg-gray-800 py-2">
                        <div className="flex bg-gray-700 rounded-lg p-1">
                            <button onClick={() => handleCategoryChange('ewallet')} className={`w-1/2 py-1.5 text-sm rounded-md flex items-center justify-center space-x-2 ${activeCategory === 'ewallet' ? 'bg-gray-600' : ''}`}>
                                <EwalletIcon className="w-5 h-5" />
                                <span>E-Wallet</span>
                            </button>
                            <button onClick={() => handleCategoryChange('bank')} className={`w-1/2 py-1.5 text-sm rounded-md flex items-center justify-center space-x-2 ${activeCategory === 'bank' ? 'bg-gray-600' : ''}`}>
                                <BankIcon className="w-5 h-5" />
                                <span>Bank Transfer</span>
                            </button>
                        </div>
                    </div>

                    <div className="py-4">
                        {activeCategory === 'ewallet' && (
                            <div className="grid grid-cols-3 gap-3">
                                {ewalletMethods.map(method => (
                                    <button key={method.id} onClick={() => setSelectedMethod(method.id)} className={`p-4 rounded-lg flex items-center justify-center border-2 transition-colors h-20 ${selectedMethod === method.id ? 'bg-green-500/10 border-green-500' : 'bg-gray-700 border-gray-700 hover:border-gray-500'}`}>
                                        <method.icon className="h-8 object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                         {activeCategory === 'bank' && (
                             <div className="grid grid-cols-2 gap-3">
                                {bankMethods.map(method => (
                                    <button key={method.id} onClick={() => setSelectedMethod(method.id)} className={`p-4 rounded-lg flex items-center justify-center border-2 transition-colors h-20 ${selectedMethod === method.id ? 'bg-green-500/10 border-green-500' : 'bg-gray-700 border-gray-700 hover:border-gray-500'}`}>
                                        <method.icon className="h-8 object-contain" />
                                    </button>
                                ))}
                            </div>
                         )}
                    </div>
                </div>

                <footer className="p-4 border-t border-gray-700 flex-shrink-0">
                     <button 
                        onClick={handlePayment}
                        disabled={!selectedMethod || isProcessing}
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
                            `Confirm Payment`
                        )}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default PaymentModal;