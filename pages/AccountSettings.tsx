
import React, { useState } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

const AccountSettings: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();

  return (
    <div className="p-4 space-y-6">
        <div className="bg-gray-800 p-4 rounded-xl space-y-4">
             <h2 className="text-lg font-bold border-b border-gray-700 pb-2">Preferences</h2>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Display Currency</label>
                 <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Language</label>
                 <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="en">English</option>
                    <option value="id">Bahasa Indonesia</option>
                  </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Theme</label>
                 <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light (coming soon)</option>
                  </select>
            </div>
        </div>
    </div>
  );
};

export default AccountSettings;
