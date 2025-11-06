import React, { useState } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = ReactRouterDOM.useNavigate();

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Nama lengkap diperlukan';
        if (!formData.email.trim()) {
            newErrors.email = 'Alamat email diperlukan';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Alamat email tidak valid';
        }
        if (formData.password.length < 6) newErrors.password = 'Password harus minimal 6 karakter';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Password tidak cocok';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            setErrors({}); // Clear old errors

            // Simulate async operation for better UX
            setTimeout(() => {
                const { name, email, password } = formData;
                const registration = register({ name, email, password });

                if (registration.success) {
                    navigate('/dashboard');
                    // setLoading is not turned off because we are navigating away
                } else {
                    // Check if error is about email or name and set appropriately
                    if (registration.message.toLowerCase().includes('email')) {
                        setErrors({ email: registration.message });
                    } else if (registration.message.toLowerCase().includes('nama')) {
                        setErrors({ name: registration.message });
                    } else {
                        setErrors({ form: registration.message });
                    }
                    setLoading(false); // Turn off loading on error
                }
            }, 1000);
        }
    };

    return (
        <div className="bg-gray-900 text-white h-screen w-full flex flex-col justify-center items-center p-8 animate-fade-in">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <span className="text-4xl">🚀</span>
                    <h1 className="text-3xl font-bold text-white mt-2">Create Your Account</h1>
                    <p className="text-gray-400 mt-1">Join Alphalytic and start trading smarter.</p>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-6">
                    <form onSubmit={handleSubmit} noValidate>
                        {errors.form && <p className="text-red-500 text-sm text-center mb-4">{errors.form}</p>}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" className={`w-full bg-gray-700 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.name ? 'border-red-500' : 'border-gray-600'}`} />
                             {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className={`w-full bg-gray-700 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.email ? 'border-red-500' : 'border-gray-600'}`} />
                             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" className={`w-full bg-gray-700 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.password ? 'border-red-500' : 'border-gray-600'}`} />
                             {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                         <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" className={`w-full bg-gray-700 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'}`} />
                             {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-500 disabled:cursor-wait" disabled={loading}>
                            {loading ? (
                                <svg className="animate-spin h-6 w-6 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                'Daftar'
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="text-center text-sm text-gray-400 mt-8">
                    Already have an account? <ReactRouterDOM.Link to="/login" className="font-semibold text-green-400 hover:underline">Sign In</ReactRouterDOM.Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;