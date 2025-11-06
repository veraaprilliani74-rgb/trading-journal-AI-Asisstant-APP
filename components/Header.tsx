

import React, { useState, useMemo } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { BellIcon, InboxIcon, XIcon } from './Icons';
import { mockNotifications, mockSmartNotifications } from '../data/mockData';
import { SystemNotification } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { useUser } from '../contexts/UserContext';

// --- InboxModal Component ---
// This component displays system notifications in a modal view. It is now a controlled component.
const InboxModal: React.FC<{
  onClose: () => void;
  notifications: SystemNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<SystemNotification[]>>;
}> = ({ onClose, notifications, setNotifications }) => {

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, isRead: true })));
  };
  
  const NotificationIcon: React.FC<{ type: SystemNotification['type'] }> = ({ type }) => {
    const baseClass = "w-6 h-6";
    if (type === 'deposit') {
        return <svg xmlns="http://www.w3.org/2000/svg" className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
    }
    if (type === 'withdrawal') {
        return <svg xmlns="http://www.w3.org/2000/svg" className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-end z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-t-2xl w-full max-w-md h-[90vh] flex flex-col shadow-lg animate-slide-up">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Inbox</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-4 border-b border-gray-700">
            <button onClick={handleMarkAllAsRead} className="text-sm text-blue-400 hover:underline">
                Mark all as read
            </button>
        </div>

        <div className="flex-grow overflow-y-auto">
            {notifications.length > 0 ? (
                <div className="divide-y divide-gray-700">
                    {notifications.map(notification => (
                        <div 
                            key={notification.id} 
                            className={`p-4 flex space-x-4 cursor-pointer hover:bg-gray-700/50 ${!notification.isRead ? 'bg-blue-900/30' : ''}`}
                            onClick={() => handleMarkAsRead(notification.id)}
                        >
                            <div className={`flex-shrink-0 mt-1 ${notification.type === 'deposit' ? 'text-green-400' : notification.type === 'withdrawal' ? 'text-yellow-400' : 'text-gray-400'}`}>
                                <NotificationIcon type={notification.type} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold">{notification.title}</h3>
                                    {!notification.isRead && (
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5 ml-2"></div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 pt-20">
                    <p>Your inbox is empty.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};


const Header: React.FC = () => {
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState<SystemNotification[]>(mockNotifications);
  const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();
  const { user } = useUser();
  
  const location = ReactRouterDOM.useLocation();
  const navigate = ReactRouterDOM.useNavigate();

  const hasUnreadSystem = useMemo(() => systemNotifications.some(n => !n.isRead), [systemNotifications]);
  const unreadSmartCount = useMemo(() => mockSmartNotifications.filter(n => !n.isRead).length, []);

  const pagesWithBackButtonAndTitle: Record<string, string> = {
      '/analytics': 'Performance Analytics',
      '/community': 'Trading Community',
      '/notifications': 'Smart Notifications',
      '/wallet': 'Wallet',
      '/subscription': 'Subscription Plans',
      '/settings': 'Account Settings',
  };

  const currentPath = location.pathname;
  const showBackButton = Object.keys(pagesWithBackButtonAndTitle).includes(currentPath);
  const pageTitle = showBackButton ? pagesWithBackButtonAndTitle[currentPath] : '';
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-gray-900 p-4 h-16 flex justify-between items-center z-20 border-b border-gray-700">
        {showBackButton ? (
          <div className="flex items-center w-full">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-700" aria-label="Go back">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            </button>
            <h1 className="text-lg font-bold text-center flex-grow pr-8">{pageTitle}</h1>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-xl font-bold">Welcome back,</h1>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-400">{user.name}</p>
                <div className="relative">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="bg-gray-800 border-none rounded text-xs text-white py-0.5 pl-2 pr-6 appearance-none focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer"
                    aria-label="Select currency"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-400">
                    <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsInboxOpen(true)} className="relative p-2 rounded-full bg-gray-800 hover:bg-gray-700">
                <InboxIcon className="w-5 h-5 text-gray-300" />
                {hasUnreadSystem && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-gray-900"></span>
                )}
              </button>
              <ReactRouterDOM.Link to="/notifications" className="relative p-2 rounded-full bg-gray-800 hover:bg-gray-700">
                <BellIcon className="w-5 h-5 text-gray-300" />
                {unreadSmartCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full ring-2 ring-gray-900">
                        {unreadSmartCount}
                    </span>
                )}
              </ReactRouterDOM.Link>
            </div>
          </>
        )}
      </header>
      {isInboxOpen && <InboxModal onClose={() => setIsInboxOpen(false)} notifications={systemNotifications} setNotifications={setSystemNotifications} />}
    </>
  );
};

export default Header;
