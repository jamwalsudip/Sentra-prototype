import React from 'react';
import { Globe, Bell, Shield, Moon, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';

const Settings: React.FC = () => {
    return (
        <Layout title="Settings" subtitle="Manage your preferences">
            <div className="max-w-2xl">
                {/* Currency & Display */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-5 shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                        <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-indigo-600" />
                        </div>
                        <h2 className="font-bold text-slate-900 text-[14px]">Currency & Display</h2>
                    </div>
                    <div className="p-5 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-900 text-[13px]">Default Currency</p>
                                <p className="text-[12px] text-slate-500 mt-0.5">Currency for displaying totals</p>
                            </div>
                            <select
                                disabled
                                className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-400 bg-slate-50 cursor-not-allowed"
                            >
                                <option>INR (₹)</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-900 text-[13px]">Language</p>
                                <p className="text-[12px] text-slate-500 mt-0.5">Interface language</p>
                            </div>
                            <select
                                disabled
                                className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-400 bg-slate-50 cursor-not-allowed"
                            >
                                <option>English</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-5 shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                        <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Bell className="w-4 h-4 text-amber-600" />
                        </div>
                        <h2 className="font-bold text-slate-900 text-[14px]">Notifications</h2>
                    </div>
                    <div className="p-5 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-900 text-[13px]">Email Notifications</p>
                                <p className="text-[12px] text-slate-500 mt-0.5">Receive updates via email</p>
                            </div>
                            <button
                                disabled
                                className="w-12 h-7 bg-slate-200 rounded-full p-1 cursor-not-allowed"
                            >
                                <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-900 text-[13px]">Transaction Alerts</p>
                                <p className="text-[12px] text-slate-500 mt-0.5">Get notified on received funds and withdrawals</p>
                            </div>
                            <button
                                disabled
                                className="w-12 h-7 bg-indigo-600 rounded-full p-1 cursor-not-allowed flex justify-end"
                            >
                                <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-900 text-[13px]">Marketing Communications</p>
                                <p className="text-[12px] text-slate-500 mt-0.5">News and product updates</p>
                            </div>
                            <button
                                disabled
                                className="w-12 h-7 bg-slate-200 rounded-full p-1 cursor-not-allowed"
                            >
                                <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-5 shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                        <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-emerald-600" />
                        </div>
                        <h2 className="font-bold text-slate-900 text-[14px]">Security</h2>
                    </div>
                    <div className="p-5 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-900 text-[13px]">Two-Factor Authentication</p>
                                <p className="text-[12px] text-slate-500 mt-0.5">Add an extra layer of security</p>
                            </div>
                            <button
                                disabled
                                className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-400 cursor-not-allowed"
                            >
                                Enable
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-900 text-[13px]">Change Password</p>
                                <p className="text-[12px] text-slate-500 mt-0.5">Update your account password</p>
                            </div>
                            <button
                                disabled
                                className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-400 cursor-not-allowed"
                            >
                                Change
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-900 text-[13px]">Active Sessions</p>
                                <p className="text-[12px] text-slate-500 mt-0.5">Manage devices logged into your account</p>
                            </div>
                            <button
                                disabled
                                className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-400 cursor-not-allowed"
                            >
                                View
                            </button>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-5 shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                        <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Moon className="w-4 h-4 text-purple-600" />
                        </div>
                        <h2 className="font-bold text-slate-900 text-[14px]">Appearance</h2>
                    </div>
                    <div className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-900 text-[13px]">Dark Mode</p>
                                <p className="text-[12px] text-slate-500 mt-0.5">Switch to dark theme</p>
                            </div>
                            <button
                                disabled
                                className="w-12 h-7 bg-slate-200 rounded-full p-1 cursor-not-allowed"
                            >
                                <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Prototype Notice */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-[13px] text-amber-900 font-bold">Prototype Notice</p>
                        <p className="text-[12px] text-amber-700 mt-1 leading-relaxed">
                            Settings are for demonstration only and changes are not persisted.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
