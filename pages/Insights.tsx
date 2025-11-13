import React, { useState, useMemo } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { mockAiSignals, mockMarketAnalysis, mockEconomicCalendar } from '../data/mockData';
import { mockNews } from '../data/mockNews';
import { MarketAnalysis, EconomicEvent } from '../types';
import { SparklesIcon, CalendarIcon, AnalyticsIcon, NewsIcon } from '../components/Icons';
import AiSignalCard from '../components/AiSignalCard';
import NewsCard from '../components/NewsCard';
import { useUser } from '../contexts/UserContext';

const MarketAnalysisCard: React.FC<{ analysis: MarketAnalysis }> = ({ analysis }) => {
    const sentimentColor = analysis.sentiment === 'Bullish' ? 'text-green-400' : analysis.sentiment === 'Bearish' ? 'text-red-400' : 'text-gray-400';
    const sentimentBg = analysis.sentiment === 'Bullish' ? 'bg-green-500/20' : analysis.sentiment === 'Bearish' ? 'bg-red-500/20' : 'bg-gray-500/20';

    return (
        <div className="bg-gray-800 p-4 rounded-xl space-y-3 animate-fade-in">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{analysis.market}</h3>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${sentimentBg} ${sentimentColor}`}>
                    {analysis.sentiment}
                </span>
            </div>
            <p className="text-sm text-gray-300">{analysis.summary}</p>
            <p className="text-right text-xs text-gray-500">{analysis.timestamp}</p>
        </div>
    );
};

const ImpactIndicator: React.FC<{ impact: 'High' | 'Medium' | 'Low' }> = ({ impact }) => (
    <div className="flex items-center space-x-1">
        <div className={`w-2 h-3 rounded-sm ${impact === 'High' ? 'bg-red-500' : 'bg-gray-600'}`}></div>
        <div className={`w-2 h-3 rounded-sm ${impact === 'High' || impact === 'Medium' ? 'bg-yellow-500' : 'bg-gray-600'}`}></div>
        <div className="w-2 h-3 rounded-sm bg-green-500"></div>
    </div>
);


const EconomicEventRow: React.FC<{ event: EconomicEvent }> = ({ event }) => (
    <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-4 animate-fade-in">
        <div className="text-center">
            <p className="font-bold text-sm">{event.time}</p>
            <p className="text-xs text-gray-400">{event.countryCode}</p>
        </div>
        <div className="flex-1">
            <p className="font-semibold text-sm">{event.eventName}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                <span>Act: {event.actual || '-'}</span>
                <span>F'cast: {event.forecast}</span>
                <span>Prev: {event.previous}</span>
            </div>
        </div>
        <ImpactIndicator impact={event.impact} />
    </div>
);


const Insights: React.FC = () => {
  const [activeTab, setActiveTab] = useState('News');
  const { user } = useUser();
  const isProOrHigher = user.accountType === 'Pro' || user.accountType === 'Premium';

  const groupedEvents = useMemo(() => {
    // Fix: Used generic type argument for Array.prototype.reduce to ensure correct type inference for the accumulator.
    return mockEconomicCalendar.reduce<Record<string, EconomicEvent[]>>((acc, event) => {
        const date = new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(event);
        return acc;
    }, {});
  }, []);
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold">Market Insights</h1>
        <p className="text-sm text-gray-400">AI-powered analysis and data</p>
      </div>

       <div className="grid grid-cols-4 bg-gray-800 p-1 rounded-lg text-sm">
        <button onClick={() => handleTabClick('News')} className={`flex-1 px-3 py-1.5 rounded-md transition-colors flex items-center justify-center space-x-2 ${activeTab === 'News' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>
            <NewsIcon className="w-4 h-4" />
            <span>Berita</span>
        </button>
        <button onClick={() => handleTabClick('Analysis')} className={`flex-1 px-3 py-1.5 rounded-md transition-colors flex items-center justify-center space-x-2 ${activeTab === 'Analysis' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>
            <AnalyticsIcon className="w-4 h-4" />
            <span>Analysis</span>
        </button>
        <button onClick={() => handleTabClick('Signals')} className={`flex-1 px-3 py-1.5 rounded-md transition-colors flex items-center justify-center space-x-2 relative ${activeTab === 'Signals' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>
            <SparklesIcon className="w-4 h-4" />
            <span>Signals</span>
            {!isProOrHigher && <span className="absolute -top-1.5 -right-1.5 text-xs bg-yellow-500 text-black font-bold px-1.5 py-0.5 rounded-md text-[8px]">PRO</span>}
        </button>
        <button onClick={() => handleTabClick('Calendar')} className={`flex-1 px-3 py-1.5 rounded-md transition-colors flex items-center justify-center space-x-2 ${activeTab === 'Calendar' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>
            <CalendarIcon className="w-4 h-4" />
            <span>Calendar</span>
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'News' && (
          mockNews.map(newsItem => <NewsCard key={newsItem.id} news={newsItem} />)
        )}

        {activeTab === 'Analysis' && (
            mockMarketAnalysis.map(analysis => <MarketAnalysisCard key={analysis.id} analysis={analysis} />)
        )}
        
        {activeTab === 'Signals' && (
            isProOrHigher ? (
                mockAiSignals.map(signal => <AiSignalCard key={signal.pair} signal={signal} />)
            ) : (
                <div className="text-center py-16 bg-gray-800 rounded-xl">
                    <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full mb-2">PRO FEATURE</span>
                    <h3 className="font-bold text-lg mt-2">AI Generated Signals</h3>
                    <p className="text-gray-400 text-sm mt-1 mb-4">Upgrade to Pro to get real-time, AI-powered trade ideas.</p>
                    <ReactRouterDOM.Link to="/subscription" className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg font-semibold hover:bg-green-700 transition-colors">
                        Upgrade to Pro
                    </ReactRouterDOM.Link>
                </div>
            )
        )}
        
        {activeTab === 'Calendar' && (
// Fix: Replaced Object.entries with Object.keys to avoid type inference issues with Object.entries in some environments.
            Object.keys(groupedEvents).map(date => (
                <div key={date}>
                    <h3 className="font-semibold text-gray-300 my-3">{date}</h3>
                    <div className="space-y-2">
                        {groupedEvents[date].map(event => <EconomicEventRow key={event.id} event={event} />)}
                    </div>
                </div>
            ))
        )}
      </div>

    </div>
  );
};

export default Insights;