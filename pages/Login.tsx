import React, { useState } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlphalyticLogo } from '../components/Icons';
import { mockCredentials } from '../data/auth';

const Login: React.FC = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = ReactRouterDOM.useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!identifier || !password) {
            setError('Email/Nama Lengkap dan password diperlukan');
            return;
        }

        const success = login(identifier, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Email/Nama Lengkap atau password salah');
        }
    };

    const handleDemoLogin = () => {
        const success = login(mockCredentials.email, mockCredentials.password);
        if (success) {
            navigate('/dashboard');
        } else {
            // This should not happen in normal circumstances
            setError('Could not log in to demo account.');
        }
    };

    return (
        <div className="bg-gray-900 text-white h-screen w-full flex flex-col justify-center items-center p-8 animate-fade-in">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <AlphalyticLogo className="w-24 h-24 mx-auto text-green-500" />
                    <h1 className="text-3xl font-bold text-white mt-2">Welcome Back</h1>
                    <p className="text-gray-400 mt-1">Sign in to your Alphalytic account.</p>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-6">
                    <form onSubmit={handleSubmit} noValidate>
                        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email or Full Name</label>
                            <input 
                                type="text" 
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="Enter your email or full name" 
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" 
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password" 
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" 
                            />
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition duration-300">
                            Masuk
                        </button>
                    </form>
                    <div className="relative flex py-4 items-center">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-xs">OR</span>
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>
                    <button type="button" onClick={handleDemoLogin} className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition duration-300">
                        Try Demo Account
                    </button>
                </div>
                
                <div className="text-center text-sm text-gray-400 mt-8">
                    Don't have an account? <ReactRouterDOM.Link to="/signup" className="font-semibold text-green-400 hover:underline">Sign Up</ReactRouterDOM.Link>
                </div>
            </div>
        </div>
    );
};

export default Login;