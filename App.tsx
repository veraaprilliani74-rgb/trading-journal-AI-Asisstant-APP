import React, { useState, useEffect, useContext } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import Splash from './pages/Splash';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Trading from './pages/Trading';
import Journal from './pages/Journal';
import Analytics from './pages/Analytics';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Insights from './pages/Insights';
import Notifications from './pages/Notifications';
import Wallet from './pages/Wallet';
import Subscription from './pages/Subscription';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { UserProvider } from './contexts/UserContext';
import AccountSettings from './pages/AccountSettings';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


const App: React.FC = () => {
  return (
    <div className="flex justify-center items-start min-h-screen bg-black">
      <div className="w-full max-w-md h-screen font-sans bg-gray-900 text-white overflow-hidden flex flex-col relative">
        <ReactRouterDOM.HashRouter>
          <AuthProvider>
            <CurrencyProvider>
              <UserProvider>
                <AppContent />
              </UserProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ReactRouterDOM.HashRouter>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const location = ReactRouterDOM.useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSplashClick = () => {
    setShowSplash(false);
  };
  
  const { isAuthenticated } = useAuth();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';
  
  if (showSplash) {
    return <Splash onClick={handleSplashClick} />;
  }

  return (
    <>
      {isAuthenticated && !isAuthPage && <Header />}
      <main className={`flex-grow overflow-y-auto ${isAuthenticated && !isAuthPage ? 'pb-20 pt-16' : ''}`}>
        <ReactRouterDOM.Routes>
          <ReactRouterDOM.Route path="/" element={<Login />} />
          <ReactRouterDOM.Route path="/login" element={<Login />} />
          <ReactRouterDOM.Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <ReactRouterDOM.Route element={<ProtectedRoute />}>
              <ReactRouterDOM.Route path="/dashboard" element={<Dashboard />} />
              <ReactRouterDOM.Route path="/trading" element={<Trading />} />
              <ReactRouterDOM.Route path="/journal" element={<Journal />} />
              <ReactRouterDOM.Route path="/analytics" element={<Analytics />} />
              <ReactRouterDOM.Route path="/community" element={<Community />} />
              <ReactRouterDOM.Route path="/insights" element={<Insights />} />
              <ReactRouterDOM.Route path="/profile" element={<Profile />} />
              <ReactRouterDOM.Route path="/notifications" element={<Notifications />} />
              <ReactRouterDOM.Route path="/wallet" element={<Wallet />} />
              <ReactRouterDOM.Route path="/subscription" element={<Subscription />} />
              <ReactRouterDOM.Route path="/settings" element={<AccountSettings />} />
          </ReactRouterDOM.Route>

        </ReactRouterDOM.Routes>
      </main>
      {isAuthenticated && !isAuthPage && <BottomNav />}
    </>
  );
}

export default App;