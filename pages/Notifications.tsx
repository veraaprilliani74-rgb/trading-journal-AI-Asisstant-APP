
import React, { useState, useMemo } from 'react';
import { mockSmartNotifications } from '../data/mockData';
import { SmartNotification } from '../types';
import { WarningIcon, TradingIcon, TrophyIcon } from '../components/Icons';
import { useCurrency } from '../contexts/CurrencyContext';

type FilterType = 'all' | 'unread' | 'critical' | 'trading' | 'performance';

const NotificationIcon: React.FC<{ type: SmartNotification['type'] }> = ({ type }) => {
    const iconClass = "w-6 h-6";
    switch (type) {
        case 'critical':
            return <WarningIcon className={`${iconClass} text-red-400`} />;
        case 'trading':
            return <TradingIcon className={`${iconClass} text-blue-400`} />;
        case 'performance':
            return <TrophyIcon className={`${iconClass} text-yellow-400`} />;
        default:
            return null;
    }
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<SmartNotification[]>(mockSmartNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { convert } = useCurrency();

  const convertMessage = (message: string) => {
    // Regex to find dollar amounts like $500.00 or +$1,250.50
    return message.replace(/(\+?\$(\d{1,3}(,\d{3})*(\.\d{2})?))/g, (match) => {
        const amount = parseFloat(match.replace(/[+$,]/g, ''));
        if (isNaN(amount)) return match;
        const converted = convert(amount);
        const prefix = match.includes('+') ? '+' : '';
        return `${prefix}${converted.symbol}${converted.formatted}`;
    });
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') {
      return notifications;
    }
    if (activeFilter === 'unread') {
      return notifications.filter(n => !n.isRead);
    }
    return notifications.filter(n => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    // In a real app, you might want a confirmation modal here
    setNotifications([]);
  };

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Unread', value: 'unread' },
    { label: 'Critical', value: 'critical' },
    { label: 'Trading', value: 'trading' },
    { label: 'Performance', value: 'performance' },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
        {filters.map(filter => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 text-sm rounded-full flex-shrink-0 transition-colors ${
              activeFilter === filter.value
                ? 'bg-green-600 text-white font-semibold'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <button onClick={handleMarkAllAsRead} className="text-sm text-blue-400 hover:underline">
            Mark all as read
        </button>
        <button onClick={handleClearAll} className="text-sm text-red-400 hover:underline">
            Clear All
        </button>
      </div>

      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 flex space-x-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-700/50 ${
                !notification.isRead ? 'bg-blue-900/30 border border-blue-700' : 'bg-gray-800'
              }`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="flex-shrink-0 mt-1">
                <NotificationIcon type={notification.type} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{notification.title}</h3>
                  {!notification.isRead && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5 ml-2" aria-label="Unread"></div>
                  )}
                </div>
                <p className="text-sm text-gray-300 mt-1">{convertMessage(notification.message)}</p>
                <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-16">
            <p>No notifications in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
