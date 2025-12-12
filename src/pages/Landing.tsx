import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, UserPlus, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SENTRA_LOGO = 'https://media.licdn.com/dms/image/v2/D560BAQHjI7tQ8oVfeA/company-logo_100_100/B56ZccO1rmG0AQ-/0/1748525342204/sentrapay_logo?e=1767225600&v=beta&t=r4MrSr8uA10ejGK3sLP-72eJah-yY1ASAZEnrOOZwV8';

type AuthMode = 'initial' | 'signin-message' | 'signup';

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const { skipKYC } = useApp();
    const [authMode, setAuthMode] = useState<AuthMode>('initial');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = () => {
        setAuthMode('signin-message');
    };

    const handleContinueToDashboard = () => {
        skipKYC();
        navigate('/dashboard');
    };

    const handleCreateAccount = () => {
        setAuthMode('signup');
    };

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!signupName.trim()) {
            setError('Please enter your name');
            return;
        }
        if (!signupEmail.trim()) {
            setError('Please enter your email');
            return;
        }

        sessionStorage.setItem('signup_name', signupName.trim());
        sessionStorage.setItem('signup_email', signupEmail.trim());

        navigate('/kyc');
    };

    const handleBackToInitial = () => {
        setAuthMode('initial');
        setSignupName('');
        setSignupEmail('');
        setError('');
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
            {/* Main card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-[400px] overflow-hidden relative">
                {/* Global Back Button */}
                {authMode !== 'initial' && (
                    <button
                        onClick={handleBackToInitial}
                        className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm z-10"
                        title="Go Back"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                )}
                {/* Header */}
                <div className="px-6 pt-6 pb-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img
                            src={SENTRA_LOGO}
                            alt="Sentra"
                            className="w-12 h-12 rounded-xl shadow-md"
                        />
                        <div className="text-left">
                            <h1 className="text-xl font-bold text-slate-900 leading-none">Sentra</h1>
                            <span className="inline-block text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider mt-1">
                                Prototype
                            </span>
                        </div>
                    </div>
                    <p className="text-slate-600 text-[13px] leading-relaxed">
                        Cross-border payments made simple. <br /> Collect in USD/EUR, receive in Local currency.
                    </p>
                </div>

                {/* Content - Initial State */}
                {authMode === 'initial' && (
                    <div className="p-6 text-center">
                        <h2 className="text-[15px] font-bold text-slate-900 mb-6">
                            Welcome to Sentra
                        </h2>

                        <div className="space-y-4 flex flex-col items-center">
                            <button
                                onClick={handleSignIn}
                                className="w-full max-w-[260px] flex items-center justify-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-lg text-[13px] font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <User className="w-4 h-4" />
                                <span>Sign In</span>
                                <ArrowRight className="w-4 h-4 opacity-50" />
                            </button>

                            <div className="relative py-2 w-full max-w-[260px]">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-3 bg-white text-[11px] text-slate-400 font-medium">or</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCreateAccount}
                                className="w-full max-w-[260px] flex items-center justify-center gap-3 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg text-[13px] font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Create an Account</span>
                                <ArrowRight className="w-4 h-4 opacity-50" />
                            </button>
                        </div>

                        <p className="text-center text-[11px] text-slate-400 mt-8 leading-relaxed">
                            This is a prototype. No real data is processed.
                        </p>
                    </div>
                )}

                {/* Content - Sign In Message */}
                {authMode === 'signin-message' && (
                    <div className="p-8 flex flex-col justify-center min-h-[300px]">
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-8 shadow-sm">
                            <p className="text-[13px] text-indigo-800 leading-relaxed font-medium">
                                <span className="font-bold block mb-2 text-indigo-900">Prototype Mode</span>
                                You'll be logged in as a sample user with pre-populated accounts and transactions.
                            </p>
                        </div>

                        <button
                            onClick={handleContinueToDashboard}
                            className="w-full px-4 py-3.5 bg-indigo-600 text-white rounded-lg text-[13px] font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            Continue to Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Content - Sign Up Form */}
                {authMode === 'signup' && (
                    <div className="p-6">
                        <div className="mb-6 text-center flex flex-col items-center">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                                <UserPlus className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h2 className="text-[15px] font-bold text-slate-900 mb-2">
                                Create Your Account
                            </h2>
                            <p className="text-slate-500 text-[13px] leading-relaxed">
                                Enter your details to get started
                            </p>
                        </div>

                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={signupName}
                                    onChange={(e) => setSignupName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={signupEmail}
                                    onChange={(e) => setSignupEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50 focus:bg-white"
                                />
                            </div>

                            {error && (
                                <p className="text-[12px] text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg font-medium">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg text-[13px] font-semibold hover:bg-indigo-700 transition-all shadow-md mt-2"
                            >
                                Sign Up & Continue to KYC →
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Landing;
