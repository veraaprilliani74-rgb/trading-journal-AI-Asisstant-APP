
import React, { useState } from 'react';
import { AiSignal } from '../types';
import { ChevronDownIcon, SparklesIcon } from './Icons';
import { getSignalInsight } from '../services/geminiService';

const AiSignalCard: React.FC<{ signal: AiSignal }> = ({ signal }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [insight, setInsight] = useState<string | null>(null);
    const [isFetchingInsight, setIsFetchingInsight] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const signalBgColor = signal.signal.includes('BUY') ? 'bg-green-600' : 'bg-red-600';
    const confidenceColor = signal.confidence > 75 ? 'text-green-400' : signal.confidence > 50 ? 'text-yellow-400' : 'text-red-400';
    const confidenceBarColor = signal.confidence > 75 ? 'bg-green-500' : signal.confidence > 50 ? 'bg-yellow-500' : 'bg-red-500';

    const handleFetchInsight = async () => {
        // Prevent re-fetching
        if (insight || isFetchingInsight) {
            // If we have an error, allow retry
            if (!fetchError) return;
        }

        setIsFetchingInsight(true);
        setFetchError(null);
        try {
            const result = await getSignalInsight(signal);
            setInsight(result);
        } catch (error) {
            console.error(error);
            setFetchError('Failed to load insight.');
        } finally {
            setIsFetchingInsight(false);
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-xl space-y-3 border border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-700 rounded-full">
                        <signal.icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-base">{signal.fullName}</p>
                        <p className="text-xs text-gray-400">{signal.pair}</p>
                    </div>
                </div>
                <div className={`px-3 py-1 text-xs font-bold rounded-full text-white ${signalBgColor}`}>
                    {signal.signal}
                </div>
            </div>

            <div className="flex items-center justify-between space-x-4">
                <div className="flex-shrink-0">
                    <p className="text-xs text-gray-400">Confidence</p>
                    <p className={`text-xl font-bold ${confidenceColor}`}>{signal.confidence}%</p>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className={`${confidenceBarColor} h-2.5 rounded-full`} style={{ width: `${signal.confidence}%` }}></div>
                </div>
            </div>
            
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 pt-3' : 'max-h-0'}`}>
                <div className="border-t border-gray-700 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Entry Range:</span>
                        <span className="font-mono font-semibold">{signal.entryPriceRange || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Target(s):</span>
                        <div className="flex items-center space-x-2">
                            {signal.targetPrices && signal.targetPrices.length > 0 ? 
                                signal.targetPrices.map((tp, i) => (
                                <span key={i} className="font-mono font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md">{tp.toFixed(signal.pair.includes('JPY') ? 2 : 4)}</span>
                            )) : <span className="font-semibold text-gray-500">N/A</span>}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Stop Loss:</span>
                        <span className="font-mono font-semibold text-red-400">{signal.stopLoss?.toFixed(signal.pair.includes('JPY') ? 2 : 4) || 'N/A'}</span>
                    </div>
                     <div className="flex justify-between pt-2 mt-2 border-t border-gray-700/50">
                        <span className="text-gray-400">Strategy:</span>
                        <span className="font-semibold">{signal.strategy}</span>
                    </div>
                    
                    {/* New AI Insight Section */}
                    <div className="pt-2 mt-2 border-t border-gray-700/50">
                        {!insight && !isFetchingInsight && !fetchError && (
                             <button onClick={handleFetchInsight} className="w-full flex items-center justify-center space-x-2 text-sm font-semibold py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-green-400 transition-colors">
                                <SparklesIcon className="w-4 h-4" />
                                <span>Get AI Rationale</span>
                            </button>
                        )}
                        {isFetchingInsight && (
                            <div className="text-center py-4 text-gray-400 text-sm">
                                <p>Generating insight...</p>
                            </div>
                        )}
                        {fetchError && (
                            <div className="text-center py-2 text-red-400 text-sm bg-red-500/10 rounded-lg">
                                <p>{fetchError}</p>
                                <button onClick={handleFetchInsight} className="font-semibold text-blue-400 hover:underline mt-1">Try again</button>
                            </div>
                        )}
                        {insight && (
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                                <h4 className="font-semibold text-green-400 text-sm mb-1 flex items-center space-x-1.5">
                                    <SparklesIcon className="w-4 h-4" />
                                    <span>AI Rationale</span>
                                </h4>
                                <p className="text-sm text-gray-300">{insight}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="text-xs text-gray-400 pt-3 border-t border-gray-700 flex justify-between items-center">
                {signal.authorName && signal.authorAvatar ? (
                    <div className="flex items-center space-x-2">
                        <img src={signal.authorAvatar} alt={signal.authorName} className="w-5 h-5 rounded-full"/>
                        <span>Signal by <span className="font-semibold text-gray-300">{signal.authorName}</span></span>
                    </div>
                ) : <span />}
                <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center space-x-1 text-blue-400 hover:underline font-semibold">
                    <span>{isExpanded ? 'Less' : 'More'} Info</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
            </div>
        </div>
    );
};

export default AiSignalCard;