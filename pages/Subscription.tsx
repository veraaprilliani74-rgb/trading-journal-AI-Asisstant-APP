import React, { useState } from 'react';
import { mockSubscriptionPlans } from '../data/mockData';
import { SubscriptionPlan } from '../types';
import { CheckIcon } from '../components/Icons';
import { useUser } from '../contexts/UserContext';
import PaymentModal from '../components/PaymentModal';

const PlanCard: React.FC<{ plan: SubscriptionPlan; onSelect: (plan: SubscriptionPlan) => void; }> = ({ plan, onSelect }) => {
    const cardClass = plan.highlight
        ? 'bg-gray-800 border-2 border-green-500'
        : plan.isCurrent
        ? 'bg-blue-900/50 border-2 border-blue-500'
        : 'bg-gray-800 border-2 border-gray-700';

    const buttonClass = plan.highlight
        ? 'bg-green-600 text-white hover:bg-green-700'
        : plan.isCurrent
        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
        : 'bg-gray-700 text-white hover:bg-gray-600';

    return (
        <div className={`p-6 rounded-2xl ${cardClass} flex flex-col`}>
            {plan.highlight && (
                <div className="text-center mb-4">
                    <span className="bg-green-500 text-black font-bold text-xs px-3 py-1 rounded-full">RECOMMENDED</span>
                </div>
            )}
            <h3 className="text-2xl font-bold text-center">{plan.name}</h3>
            <div className="flex items-baseline justify-center my-4">
                <span className="text-5xl font-extrabold">{plan.price}</span>
                <span className="text-gray-400">{plan.priceDetails}</span>
            </div>
            <ul className="space-y-3 text-sm flex-grow">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                        <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                    </li>
                ))}
            </ul>
            <button 
                onClick={() => onSelect(plan)}
                disabled={plan.isCurrent}
                className={`w-full mt-8 py-3 font-bold rounded-lg transition-colors ${buttonClass}`}
            >
                {plan.ctaText}
            </button>
        </div>
    );
};

const Subscription: React.FC = () => {
    const { updateAccountType } = useUser();
    const [plans, setPlans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans);
    const [planForPayment, setPlanForPayment] = useState<SubscriptionPlan | null>(null);

    const handleSuccessfulPayment = (planId: SubscriptionPlan['id']) => {
        setPlans(prevPlans => 
            prevPlans.map(p => {
                const isSelected = p.id === planId;
                return {
                    ...p,
                    isCurrent: isSelected,
                    ctaText: isSelected ? 'Current Plan' : p.id === 'basic' ? 'Downgrade to Basic' : `Upgrade to ${p.name}`
                };
            })
        );
        
        const planMap: { [key in SubscriptionPlan['id']]: 'Standard' | 'Pro' | 'Premium' } = {
            basic: 'Standard',
            pro: 'Pro',
            premium: 'Premium'
        };
        updateAccountType(planMap[planId]);
        setPlanForPayment(null);
    };

    const handleSelectPlan = (plan: SubscriptionPlan) => {
        if (plan.isCurrent) return;

        // For upgrades (non-zero price), open payment modal.
        // For downgrades (to basic), process immediately.
        if (plan.price !== '$0') {
            setPlanForPayment(plan);
        } else {
            // This is a downgrade to Basic
            handleSuccessfulPayment(plan.id);
            alert(`Successfully downgraded to the ${plan.name} plan.`);
        }
    };

    return (
        <>
            <div className="p-4 space-y-6">
                <div className="text-center">
                    <h1 className="text-xl font-bold">Choose Your Plan</h1>
                    <p className="text-sm text-gray-400">Unlock more with our Pro and Premium plans.</p>
                </div>

                <div className="space-y-4">
                    {plans.map(plan => (
                        <PlanCard key={plan.id} plan={plan} onSelect={handleSelectPlan} />
                    ))}
                </div>

                <div className="text-center text-xs text-gray-500 pt-4">
                    <p>You can change your plan at any time. Payments are securely processed.</p>
                    <p className="mt-1">
                        <a href="#" className="underline hover:text-gray-400">Terms of Service</a> &bull; <a href="#" className="underline hover:text-gray-400">Privacy Policy</a>
                    </p>
                </div>
            </div>
            {planForPayment && (
                <PaymentModal
                    plan={planForPayment}
                    onClose={() => setPlanForPayment(null)}
                    onSuccess={handleSuccessfulPayment}
                />
            )}
        </>
    );
};

export default Subscription;