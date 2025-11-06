
import React, { useState } from 'react';
import { XIcon } from './Icons';

export const TwoFactorAuthModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isEnabled, setIsEnabled] = useState(false);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-800 rounded-xl w-full max-w-md flex flex-col shadow-lg">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold">Two-Factor Authentication (2FA)</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-300">
                        Enhance your account's security by enabling two-factor authentication. You'll need an authenticator app like Google Authenticator or Authy.
                    </p>
                     <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                        <span className="font-semibold">Enable 2FA</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={isEnabled} onChange={() => setIsEnabled(!isEnabled)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>

                    {isEnabled && (
                        <div className="p-4 bg-gray-700 rounded-lg space-y-4 animate-fade-in">
                            <h3 className="font-semibold">Step 1: Scan QR Code</h3>
                            <p className="text-xs text-gray-400">Scan this QR code with your authenticator app.</p>
                             <div className="flex justify-center p-2 bg-white rounded-lg">
                                 {/* Placeholder for QR code */}
                                <svg className="w-32 h-32" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="#000" d="M128 0h128v128H128V0ZM0 0h128v128H0V0Zm128 128h128v128H128V128ZM0 128h128v128H0V128Zm32 32h64v64H32v-64Zm128-96h64v64h-64V64ZM32 32h64v64H32V32Zm96 128h64v64h-64v-64Z"/></svg>
                             </div>
                             <h3 className="font-semibold">Step 2: Enter Verification Code</h3>
                             <p className="text-xs text-gray-400">Enter the 6-digit code from your app to complete setup.</p>
                            <input type="text" maxLength={6} placeholder="123456" className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                    )}
                </div>
                <div className="flex justify-end p-4 border-t border-gray-700">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-semibold">Done</button>
                </div>
            </div>
        </div>
    );
};
