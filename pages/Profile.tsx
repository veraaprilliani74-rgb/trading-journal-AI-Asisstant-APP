
import React, { useState, useRef, useEffect } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { TwoFactorAuthModal } from '../components/TwoFactorAuthModal';
import { LoginActivityModal } from '../components/LoginActivityModal';
import { useAuth } from '../contexts/AuthContext';
import { XIcon, LinkIcon, UnlinkIcon } from '../components/Icons';

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

const BrokerLoginModal: React.FC<{
    onClose: () => void;
    onConnect: (brokerName: string, accountId: string) => void;
}> = ({ onClose, onConnect }) => {
    const [broker, setBroker] = useState('MetaTrader 5');
    const [accountId, setAccountId] = useState('');
    const [password, setPassword] = useState('');
    const [server, setServer] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!accountId || !password || !server) {
            setError('All fields are required.');
            return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onConnect(broker, accountId);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-800 rounded-xl w-full max-w-md flex flex-col shadow-lg">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold">Connect Broker</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><XIcon className="w-6 h-6" /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="p-4 space-y-4">
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Broker</label>
                            <select value={broker} onChange={e => setBroker(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                                <option>MetaTrader 5</option>
                                <option>MetaTrader 4</option>
                                <option>OANDA</option>
                                <option>FXCM</option>
                                <option>cTrader</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Account ID</label>
                            <input type="text" value={accountId} onChange={e => setAccountId(e.target.value)} placeholder="Enter your account ID" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your broker password" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Server</label>
                            <input type="text" value={server} onChange={e => setServer(e.target.value)} placeholder="Enter server name" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 p-4 border-t border-gray-700">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-semibold flex items-center justify-center disabled:bg-gray-500 w-28">
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : 'Connect'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Profile: React.FC = () => {
  const { user, updateProfile, connectBroker, disconnectBroker } = useUser();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(user.name === 'New Trader');
  const navigate = ReactRouterDOM.useNavigate();

  const [localProfile, setLocalProfile] = useState({
    phoneNumber: '',
    address: '',
    company: '',
    tradingExperience: 'Beginner (<1 year)'
  });

  const [formInput, setFormInput] = useState({
    name: user.name,
    email: user.email,
    ...localProfile
  });
  
  const [profilePicture, setProfilePicture] = useState('https://i.pravatar.cc/150?u=a042581f4e29026704d');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { convert } = useCurrency();

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [is2faOpen, setIs2faOpen] = useState(false);
  const [isLoginActivityOpen, setIsLoginActivityOpen] = useState(false);
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);
  
  const isProOrHigher = user.accountType === 'Pro' || user.accountType === 'Premium';

  useEffect(() => {
    setFormInput(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
    }));
  }, [user.name, user.email]);

  const convertedBalance = convert(user.accountBalance);
  const convertedTotalPL = convert(user.totalPL);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormInput(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile({ name: formInput.name, email: formInput.email });
    setLocalProfile({
        phoneNumber: formInput.phoneNumber,
        address: formInput.address,
        company: formInput.company,
        tradingExperience: formInput.tradingExperience
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormInput({
        name: user.name,
        email: user.email,
        ...localProfile
    });
    setIsEditing(false);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
            setProfilePicture(loadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
    <div className="p-4 space-y-6">
       <div>
            <h1 className="text-xl font-bold">Profile</h1>
            <p className="text-sm text-gray-400">Manage your account and preferences</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl">
            {isEditing ? (
              <>
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-center mb-2">Complete Your Profile</h2>
                    <div className="flex justify-center">
                        <div className="relative">
                            <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-gray-600" />
                             <button onClick={handleUploadClick} className="absolute -bottom-1 -right-1 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-transform transform hover:scale-110 border-2 border-gray-800" aria-label="Upload new profile picture">
                                <PencilIcon className="w-4 h-4" />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input type="text" name="name" value={formInput.name} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <input type="email" name="email" value={formInput.email} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                        <input type="tel" name="phoneNumber" value={formInput.phoneNumber} onChange={handleInputChange} placeholder="e.g. +6281234567890" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                        <input type="text" name="address" value={formInput.address} onChange={handleInputChange} placeholder="Your full address" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Company</label>
                        <input type="text" name="company" value={formInput.company} onChange={handleInputChange} placeholder="Optional" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Trading Experience</label>
                         <select name="tradingExperience" value={formInput.tradingExperience} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option>Beginner (&lt;1 year)</option>
                            <option>Intermediate (1-3 years)</option>
                            <option>Intermediate (3-5 years)</option>
                            <option>Advanced (5+ years)</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={handleCancel} className="bg-gray-600 text-white px-4 py-1.5 text-sm rounded-lg font-semibold hover:bg-gray-500">Cancel</button>
                    <button onClick={handleSave} className="bg-green-600 text-white px-4 py-1.5 text-sm rounded-lg font-semibold hover:bg-green-700">Save Changes</button>
                </div>
              </>
            ) : (
                <>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <img src={profilePicture} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-gray-600" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">{user.name}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Phone Number</span>
                            <span className="font-medium">{localProfile.phoneNumber || 'Not set'}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-gray-400">Company</span>
                            <span className="font-medium">{localProfile.company || 'Not set'}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-gray-400">Trading Experience</span>
                            <span className="font-medium">{localProfile.tradingExperience}</span>
                        </div>
                        <div className="flex flex-col text-sm">
                          <span className="text-gray-400 mb-1">Address</span>
                          <span className="font-medium text-right">{localProfile.address || 'Not set'}</span>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                        <button onClick={() => setIsEditing(true)} className="bg-gray-700 text-white px-4 py-1.5 text-sm rounded-lg font-semibold hover:bg-gray-600">Edit Profile</button>
                    </div>
                </>
            )}
        </div>


        <div className="bg-gray-800 p-4 rounded-xl">
            <h2 className="text-base font-bold mb-4">Account Summary</h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-400 text-sm">Account Balance</p>
                        <p className="font-bold text-2xl">{convertedBalance.symbol}{convertedBalance.formatted}</p>
                    </div>
                    <div className="flex space-x-2">
                        <ReactRouterDOM.Link to="/wallet" state={{ initialTab: 'deposit' }} className="bg-green-600 text-white px-3 py-1.5 text-sm rounded-lg font-semibold hover:bg-green-700 transition-colors">Top Up</ReactRouterDOM.Link>
                        <ReactRouterDOM.Link to="/wallet" state={{ initialTab: 'withdraw' }} className="bg-gray-600 text-white px-3 py-1.5 text-sm rounded-lg font-semibold hover:bg-gray-500 transition-colors">Withdraw</ReactRouterDOM.Link>
                    </div>
                </div>
                 <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                    <p className="text-gray-400">Total P&L</p>
                    <p className="font-semibold text-lg text-green-400">+{convertedTotalPL.symbol}{convertedTotalPL.formatted}</p>
                </div>
            </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
            <h2 className="text-base font-bold mb-4">Broker Integration</h2>
            {user.brokerConnection.connected ? (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Status</span>
                        <span className="font-semibold text-green-400">Connected</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Broker</span>
                        <span className="font-semibold">{user.brokerConnection.brokerName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Account ID</span>
                        <span className="font-semibold">{user.brokerConnection.accountId}</span>
                    </div>
                    <div className="mt-2 pt-3 border-t border-gray-700">
                        <button onClick={disconnectBroker} className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 text-sm rounded-lg font-semibold hover:bg-red-700 transition-colors">
                            <UnlinkIcon className="w-4 h-4" />
                            <span>Disconnect</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-400 mb-4">Connect your trading account to sync trades automatically and enable live trading.</p>
                    <button 
                        onClick={() => isProOrHigher && setIsBrokerModalOpen(true)} 
                        disabled={!isProOrHigher}
                        className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 text-sm rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed relative"
                    >
                        <LinkIcon className="w-4 h-4" />
                        <span>Connect Broker</span>
                         {!isProOrHigher && (
                            <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">PRO</span>
                        )}
                    </button>
                    {!isProOrHigher && (
                        <ReactRouterDOM.Link to="/subscription" className="text-sm text-green-400 hover:underline mt-2 inline-block">
                            Upgrade to Pro to unlock
                        </ReactRouterDOM.Link>
                    )}
                </div>
            )}
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl">
            <h2 className="text-base font-bold mb-3">Account Security</h2>
            <div className="space-y-2">
                <button onClick={() => setIsChangePasswordOpen(true)} className="w-full text-left flex justify-between items-center p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
                    <span>🔑 Change Password</span>
                    <span className="text-gray-400">&gt;</span>
                </button>
                 <button onClick={() => setIs2faOpen(true)} className="w-full text-left flex justify-between items-center p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
                    <span>🛡️ Two-Factor Authentication (2FA)</span>
                    <span className="text-gray-400">&gt;</span>
                </button>
                 <button onClick={() => setIsLoginActivityOpen(true)} className="w-full text-left flex justify-between items-center p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
                    <span>📜 Login Activity</span>
                    <span className="text-gray-400">&gt;</span>
                </button>
            </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
            <h2 className="text-base font-bold mb-3">Subscription</h2>
            <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                <div>
                    <p className="font-semibold">{user.accountType} Plan</p>
                    <p className="text-xs text-gray-400">Limited AI insights & basic features.</p>
                </div>
                <ReactRouterDOM.Link to="/subscription" className="bg-yellow-500 text-black px-4 py-2 text-sm rounded-lg font-bold hover:bg-yellow-600 transition-colors">Upgrade</ReactRouterDOM.Link>
            </div>
        </div>

         <div className="bg-gray-800 p-4 rounded-xl">
            <h2 className="text-base font-bold mb-3">Settings</h2>
            <div className="space-y-2">
                <ReactRouterDOM.Link to="/settings" className="w-full text-left flex justify-between items-center p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
                    <span>⚙️ Account Settings</span>
                    <span className="text-gray-400">&gt;</span>
                </ReactRouterDOM.Link>
                <ReactRouterDOM.Link to="/notifications" className="w-full text-left flex justify-between items-center p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
                    <span>🔔 Notifications</span>
                    <span className="text-gray-400">&gt;</span>
                </ReactRouterDOM.Link>
                <button onClick={handleLogout} className="w-full text-left p-3 hover:bg-gray-700/50 rounded-lg text-red-400 font-semibold transition-colors">Logout</button>
            </div>
        </div>
    </div>
    {isChangePasswordOpen && <ChangePasswordModal onClose={() => setIsChangePasswordOpen(false)} />}
    {is2faOpen && <TwoFactorAuthModal onClose={() => setIs2faOpen(false)} />}
    {isLoginActivityOpen && <LoginActivityModal onClose={() => setIsLoginActivityOpen(false)} />}
    {isBrokerModalOpen && <BrokerLoginModal onClose={() => setIsBrokerModalOpen(false)} onConnect={(brokerName, accountId) => {
        connectBroker(brokerName, accountId);
        setIsBrokerModalOpen(false);
    }} />}
    </>
  );
};

export default Profile;
