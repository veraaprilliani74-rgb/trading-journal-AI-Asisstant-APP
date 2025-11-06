
import React from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { HomeIcon, TradingIcon, JournalIcon, SparklesIcon, ProfileIcon } from './Icons';

const navItems = [
  { path: '/dashboard', icon: HomeIcon, label: 'Home' },
  { path: '/trading', icon: TradingIcon, label: 'Trading' },
  { path: '/journal', icon: JournalIcon, label: 'Journal' },
  { path: '/insights', icon: SparklesIcon, label: 'Insights' },
  { path: '/profile', icon: ProfileIcon, label: 'Profile' },
];

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-gray-800 border-t border-gray-700 z-20">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <ReactRouterDOM.NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
                isActive ? 'text-green-400' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </ReactRouterDOM.NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;