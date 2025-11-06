
import React from 'react';
import { XIcon } from './Icons';

const mockActivity = [
    { id: 1, device: 'Chrome on Windows', location: 'Jakarta, ID', time: 'Just now', isCurrent: true },
    { id: 2, device: 'Alphalytic iOS App', location: 'Bandung, ID', time: '2 hours ago', isCurrent: false },
    { id: 3, device: 'Safari on macOS', location: 'Surabaya, ID', time: '1 day ago', isCurrent: false },
];

export const LoginActivityModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-800 rounded-xl w-full max-w-md flex flex-col shadow-lg h-[80vh]">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold">Login Activity</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="p-4 flex-grow overflow-y-auto space-y-3">
                    {mockActivity.map(activity => (
                        <div key={activity.id} className="p-3 bg-gray-700/50 rounded-lg">
                            <p className="font-semibold">{activity.device}</p>
                            <p className="text-sm text-gray-400">{activity.location}</p>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-gray-500">{activity.time}</p>
                                {activity.isCurrent && <span className="text-xs text-green-400 font-semibold">Active now</span>}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end p-4 border-t border-gray-700">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-semibold">Done</button>
                </div>
            </div>
        </div>
    );
};
