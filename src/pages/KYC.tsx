import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const KYC: React.FC = () => {
    const navigate = useNavigate();
    const { setUser, skipKYC } = useApp();

    const [formData, setFormData] = useState({
        fullName: sessionStorage.getItem('signup_name') || '',
        email: sessionStorage.getItem('signup_email') || '',
        phone: '',
        dateOfBirth: '',
        address: '',
        country: 'IN' as const,
    });

    const [documents, setDocuments] = useState({
        idProof: null as File | null,
        addressProof: null as File | null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: 'idProof' | 'addressProof') => {
        const file = e.target.files?.[0];
        if (file) {
            setDocuments(prev => ({ ...prev, [docType]: file }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        setUser({
            id: 'user-new',
            email: formData.email,
            fullName: formData.fullName,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            address: formData.address,
            country: 'IN',
            kycStatus: 'verified',
            createdAt: new Date().toISOString(),
        });

        sessionStorage.removeItem('signup_name');
        sessionStorage.removeItem('signup_email');

        setIsSubmitting(false);
        navigate('/dashboard');
    };

    const handleSkipKYC = () => {
        skipKYC();
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Profile</h1>
                    <p className="text-[13px] text-slate-500">
                        We need a few details to verify your identity
                    </p>
                </div>

                {/* Skip KYC Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-5 mb-5 shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-[14px] mb-1">Skip for Prototype?</h3>
                            <p className="text-[12px] text-indigo-100 mb-3 leading-relaxed">
                                Since this is a demo, you can skip KYC and access the dashboard with sample data.
                            </p>
                            <button
                                onClick={handleSkipKYC}
                                className="px-4 py-2 bg-white text-indigo-600 text-[12px] font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
                            >
                                Skip & Use Sample Data →
                            </button>
                        </div>
                    </div>
                </div>

                {/* KYC Form */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="font-bold text-slate-900 text-[15px]">Verification Details</h2>
                        <p className="text-[12px] text-slate-500 mt-0.5">All fields are required</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Full Name (as per ID)
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter your full legal name"
                                className={`w-full px-4 py-3 border rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50 focus:bg-white ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                            />
                            {errors.fullName && (
                                <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                                    <AlertCircle className="w-3 h-3" /> {errors.fullName}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className={`w-full px-4 py-3 border rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50 focus:bg-white ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                            />
                            {errors.email && (
                                <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                                    <AlertCircle className="w-3 h-3" /> {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Phone & DOB Row */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+91 9876543210"
                                    className={`w-full px-4 py-3 border rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50 focus:bg-white ${errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                                />
                                {errors.phone && (
                                    <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg text-[13px] text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50 focus:bg-white ${errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                                />
                                {errors.dateOfBirth && (
                                    <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3 h-3" /> {errors.dateOfBirth}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Residential Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter your full address"
                                className={`w-full px-4 py-3 border rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50 focus:bg-white ${errors.address ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                            />
                            {errors.address && (
                                <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                                    <AlertCircle className="w-3 h-3" /> {errors.address}
                                </p>
                            )}
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Country
                            </label>
                            <div className="relative">
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50 focus:bg-white appearance-none"
                                >
                                    <option value="IN">🇮🇳 India</option>
                                </select>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                                Only India is supported in this prototype
                            </p>
                        </div>

                        {/* Document Upload Section */}
                        <div className="pt-4 border-t border-slate-100">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                                Documents (Optional for Prototype)
                            </label>
                            <div className="grid sm:grid-cols-2 gap-3">
                                <label className="cursor-pointer">
                                    <div className={`p-4 border-2 border-dashed rounded-xl text-center hover:border-indigo-300 hover:bg-indigo-50 transition-all ${documents.idProof ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200'}`}>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileChange(e, 'idProof')}
                                            className="hidden"
                                        />
                                        {documents.idProof ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Check className="w-4 h-4 text-emerald-600" />
                                                <span className="text-[12px] font-semibold text-emerald-600">ID Uploaded</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                                                <span className="text-[12px] text-slate-500 font-medium">ID Proof</span>
                                            </>
                                        )}
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <div className={`p-4 border-2 border-dashed rounded-xl text-center hover:border-indigo-300 hover:bg-indigo-50 transition-all ${documents.addressProof ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200'}`}>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileChange(e, 'addressProof')}
                                            className="hidden"
                                        />
                                        {documents.addressProof ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Check className="w-4 h-4 text-emerald-600" />
                                                <span className="text-[12px] font-semibold text-emerald-600">Address Uploaded</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                                                <span className="text-[12px] text-slate-500 font-medium">Address Proof</span>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-4 py-3.5 bg-indigo-600 text-white rounded-lg text-[13px] font-bold hover:bg-indigo-700 transition-all shadow-lg disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Complete Verification
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default KYC;
