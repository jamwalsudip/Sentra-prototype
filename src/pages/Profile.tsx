import React from 'react';
import { Mail, Phone, MapPin, Calendar, Shield, Edit2, CheckCircle2, User, Globe } from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/formatters';

// Sample profile picture
const PROFILE_PICTURE = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face';

const Profile: React.FC = () => {
    const { user } = useApp();

    if (!user) {
        return (
            <Layout title="Profile" subtitle="Your account information">
                <div className="text-center py-12">
                    <p className="text-slate-500 text-[13px]">No user data available</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Profile" subtitle="Your account information">
            <div className="max-w-3xl">
                {/* Profile Header Card - Simple Design */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6 shadow-sm">
                    <div className="flex items-center gap-6">
                        {/* Profile Picture */}
                        <img
                            src={PROFILE_PICTURE}
                            alt={user.fullName}
                            className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white"
                        />

                        {/* User Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-slate-900">{user.fullName}</h2>
                                {user.kycStatus === 'verified' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-full">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        VERIFIED
                                    </span>
                                )}
                            </div>
                            <p className="text-[14px] text-slate-500">{user.email}</p>
                            <p className="text-[13px] text-slate-400 mt-1">Member since {formatDate(user.createdAt)}</p>
                        </div>

                        {/* Edit Button */}
                        <button
                            disabled
                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-400 text-[13px] font-semibold rounded-xl flex items-center gap-2 cursor-not-allowed shadow-sm"
                            title="Not available in prototype"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <User className="w-4 h-4 text-indigo-600" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-[15px]">Personal Information</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-5">
                            {/* Email */}
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Email</p>
                                    <p className="font-semibold text-slate-900 text-[14px] mt-0.5">{user.email}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Phone</p>
                                    <p className="font-semibold text-slate-900 text-[14px] mt-0.5">{user.phone}</p>
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Date of Birth</p>
                                    <p className="font-semibold text-slate-900 text-[14px] mt-0.5">{formatDate(user.dateOfBirth)}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Address</p>
                                    <p className="font-semibold text-slate-900 text-[14px] mt-0.5">{user.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* KYC Status */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-[15px]">Identity Verification</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className={`p-5 rounded-xl ${user.kycStatus === 'verified'
                                        ? 'bg-emerald-50 border border-emerald-200'
                                        : 'bg-amber-50 border border-amber-200'
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${user.kycStatus === 'verified'
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-amber-500 text-white'
                                            }`}>
                                            <Shield className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className={`font-bold text-[16px] ${user.kycStatus === 'verified' ? 'text-emerald-800' : 'text-amber-800'
                                                }`}>
                                                {user.kycStatus === 'verified' ? 'KYC Verified' : 'KYC Pending'}
                                            </p>
                                            <p className={`text-[13px] mt-1 ${user.kycStatus === 'verified' ? 'text-emerald-600' : 'text-amber-600'
                                                }`}>
                                                {user.kycStatus === 'verified'
                                                    ? 'Full access to all features'
                                                    : 'Some features may be limited'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Country Info */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <Globe className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-[15px]">Withdrawal Location</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-3xl border border-slate-200">
                                        🇮🇳
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-[16px]">India</p>
                                        <p className="text-[13px] text-slate-500 mt-1">
                                            Withdrawals to Indian banks in INR
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prototype Notice */}
                <div className="mt-6 bg-slate-100 border border-slate-200 rounded-xl p-4 text-center">
                    <p className="text-[12px] text-slate-500">
                        <span className="font-bold text-slate-600">Prototype Mode:</span> Profile data is simulated for demonstration.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
