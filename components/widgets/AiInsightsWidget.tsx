import React, { useState, useEffect } from 'react';
import { getAIInsights } from '../../services/geminiService';
import { useUser } from '../../contexts/UserContext';
import { SparklesIcon } from '../Icons';

const AiInsightsWidget: React.FC = () => {
    const [insight, setInsight] = useState<string>('');
    const [riskAlert, setRiskAlert] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const { user, trades } = useUser();

    useEffect(() => {
        const fetchInsight = async () => {
            setLoading(true);
            if (trades.length > 0) {
                const mockDataString = `User: ${user.name}, Balance: ${user.accountBalance}, Recent Trades: ${JSON.stringify(trades.slice(0, 3))}`;
                const result = await getAIInsights(mockDataString);
                setInsight(result.insights[0] || 'No new insights at the moment.');
                setRiskAlert(result.riskAlert);
            } else {
                setInsight("Make some trades to get your first AI insight!");
                setRiskAlert("No trading activity to analyze for risks.");
            }
            setLoading(false);
        };
        fetchInsight();
    }, [user, trades]);

    return (
        <div className="bg-gray-800 p-4 rounded-xl space-y-3">
             <div className="flex items-center space-x-2">
                <SparklesIcon className="w-6 h-6 text-green-400"/>
                <h3 className="text-lg font-bold">AI Insights</h3>
            </div>
            {loading ? (
                 <div className="text-center text-gray-400 py-4">Generating insights...</div>
            ) : (
                <>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                        <h4 className="font-semibold text-green-400 text-sm mb-1">Top Insight</h4>
                        <p className="text-sm text-gray-300">{insight}</p>
                    </div>
                     <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
                        <h4 className="font-semibold text-red-400 text-sm mb-1">Risk Alert</h4>
                        <p className="text-sm text-gray-300">{riskAlert}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default AiInsightsWidget;
