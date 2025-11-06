import React, { useState, useEffect, useCallback, useRef } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { SparklesIcon, XIcon, SendIcon } from './Icons';
import { getAIInsights, askAIAssistant } from '../services/geminiService';
import { useUser } from '../contexts/UserContext';

interface AiAssistantModalProps {
  onClose: () => void;
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ onClose }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [riskAlert, setRiskAlert] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, trades } = useUser();
  const [activeTab, setActiveTab] = useState('Chat');

  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hello! How can I help you with your trading today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isProOrHigher = user.accountType === 'Pro' || user.accountType === 'Premium';
  const isPremium = user.accountType === 'Premium';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isAiTyping]);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (trades.length === 0) {
        setInsights(["No trading data yet. Make some trades to get personalized insights!"]);
        setRiskAlert("N/A");
        setLoading(false);
        return;
      }
      const mockDataString = `User: ${user.name}, Balance: ${user.accountBalance}, Recent Trades: ${JSON.stringify(trades.slice(0, 5))}`;
      const result = await getAIInsights(mockDataString);
      setInsights(result.insights);
      setRiskAlert(result.riskAlert);
    } catch (err) {
      setError("Failed to fetch AI insights. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user, trades]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const currentInput = userInput;
    setUserInput(''); // Clear input immediately

    // Add user message using functional update
    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: currentInput }]);
    setIsAiTyping(true);

    const aiResponse = await askAIAssistant(currentInput);
    
    // Add AI response using functional update
    setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: aiResponse }]);
    setIsAiTyping(false);
  };
  
  const insightsToShow = isProOrHigher ? insights : insights.slice(0, 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-end z-50 p-4">
      <div className="bg-gray-800 rounded-t-2xl w-full max-w-md h-[90vh] flex flex-col shadow-lg animate-slide-up">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-6 h-6 text-green-400" />
            <h2 className="text-lg font-bold">AI Assistant</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex justify-around bg-gray-900 p-1 text-sm border-b border-gray-700">
            <button onClick={() => setActiveTab('Chat')} className={`flex-1 py-2 rounded-md ${activeTab === 'Chat' ? 'bg-gray-700' : ''}`}>Chat</button>
            <button onClick={() => setActiveTab('Insights')} className={`flex-1 py-2 rounded-md ${activeTab === 'Insights' ? 'bg-gray-700' : ''}`}>Insights</button>
            <button 
                onClick={() => isPremium && setActiveTab('Risk')} 
                className={`flex-1 py-2 rounded-md relative ${activeTab === 'Risk' ? 'bg-gray-700' : ''} disabled:text-gray-500 disabled:cursor-not-allowed`}
                disabled={!isPremium}
            >
                Risk
                {!isPremium && <span className="absolute top-1.5 right-1.5 text-xs bg-purple-500 text-white font-bold px-1.5 py-0.5 rounded-md text-[8px]">PREMIUM</span>}
            </button>
        </div>
        
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {activeTab === 'Chat' && (
              <>
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-green-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isAiTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-700 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-2">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
              </>
            )}

            {activeTab === 'Insights' && (
                <>
                {loading && <div className="text-center text-gray-400">Loading insights...</div>}
                {error && <div className="text-center text-red-400">{error}</div>}
                {!loading && !error && (
                    <>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                        <h3 className="font-semibold text-green-400 mb-2">Today's Insights</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                            {insightsToShow.map((insight, index) => <li key={index}>{insight}</li>)}
                        </ul>
                         {!isProOrHigher && insights.length > 1 && (
                            <div className="text-center p-3 mt-3 bg-gray-700 rounded-lg">
                                <p className="text-sm">Upgrade to Pro for unlimited insights.</p>
                                <ReactRouterDOM.Link to="/subscription" onClick={onClose} className="text-green-400 font-semibold text-sm hover:underline mt-1 inline-block">Upgrade Now</ReactRouterDOM.Link>
                            </div>
                        )}
                    </div>
                    <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                        <h3 className="font-semibold text-red-400 mb-2">Risk Alert</h3>
                        <p className="text-sm text-gray-300">{riskAlert}</p>
                    </div>
                    </>
                )}
                </>
            )}

            {activeTab === 'Risk' && isPremium && (
                <div className="animate-fade-in bg-gray-700/50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-400 mb-2">AI Risk Analysis</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                        <li>High exposure to USD detected (71% of your recent trades). A significant market move in the dollar could heavily impact your portfolio.</li>
                        <li>Your recent WTI trade's position size was over 4x your average. Such large sizing on a single trade dramatically increases risk.</li>
                        <li>Your trades tagged 'News Trading' show extreme outcomes (one large win, one large loss). This indicates a high-risk/high-reward pattern that may not be sustainable.</li>
                    </ul>
                </div>
            )}
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center bg-gray-700 rounded-full">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask AI Assistant..."
              className="w-full bg-transparent px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
              disabled={activeTab !== 'Chat'}
            />
            <button onClick={handleSendMessage} className="p-2 mr-1 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500" disabled={isAiTyping || !userInput.trim() || activeTab !== 'Chat'}>
              <SendIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantModal;