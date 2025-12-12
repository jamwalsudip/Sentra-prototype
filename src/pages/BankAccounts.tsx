import React, { useState } from 'react';
import { Plus, Trash2, Star, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { useApp } from '../context/AppContext';
import { maskAccountNumber, validateIFSC, validateAccountNumber, formatDate } from '../utils/formatters';
import { INDIAN_BANKS } from '../data/mockData';
import { Toast } from '../components/Toast';

interface FormData {
    bankName: string;
    accountNumber: string;
    confirmAccountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    accountType: 'savings' | 'current';
}

const initialFormData: FormData = {
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    accountType: 'savings',
};

const BankAccounts: React.FC = () => {
    const { localBankAccounts, addBankAccount, removeBankAccount, setDefaultBankAccount } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.bankName) newErrors.bankName = 'Please select a bank';
        if (!formData.accountNumber) {
            newErrors.accountNumber = 'Account number is required';
        } else if (!validateAccountNumber(formData.accountNumber)) {
            newErrors.accountNumber = 'Enter a valid account number (9-18 digits)';
        }
        if (!formData.confirmAccountNumber) {
            newErrors.confirmAccountNumber = 'Please confirm account number';
        } else if (formData.accountNumber !== formData.confirmAccountNumber) {
            newErrors.confirmAccountNumber = 'Account numbers do not match';
        }
        if (!formData.ifscCode) {
            newErrors.ifscCode = 'IFSC code is required';
        } else if (!validateIFSC(formData.ifscCode)) {
            newErrors.ifscCode = 'Enter a valid IFSC code (e.g., HDFC0001234)';
        }
        if (!formData.accountHolderName) {
            newErrors.accountHolderName = 'Account holder name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        addBankAccount({
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode.toUpperCase(),
            accountHolderName: formData.accountHolderName,
            accountType: formData.accountType,
            isDefault: localBankAccounts.length === 0,
        });

        setFormData(initialFormData);
        setIsModalOpen(false);
        setToastMessage('Bank account added successfully');
        setToastType('success');
        setShowToast(true);
    };

    const handleDelete = (id: string, bankName: string) => {
        if (confirm(`Are you sure you want to remove ${bankName}?`)) {
            removeBankAccount(id);
            setToastMessage(`${bankName} removed`);
            setToastType('success');
            setShowToast(true);
        }
    };

    const handleSetDefault = (id: string) => {
        setDefaultBankAccount(id);
        setToastMessage('Default bank account updated');
        setToastType('success');
        setShowToast(true);
    };

    return (
        <Layout
            title="Bank Accounts"
            subtitle="Manage your linked bank accounts for withdrawals"
        >
            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}

            {/* Add Bank Button */}
            <div className="mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white text-[13px] font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                >
                    <Plus className="w-4 h-4" />
                    Add Bank Account
                </button>
            </div>

            {/* Bank Accounts List */}
            {localBankAccounts.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Plus className="w-7 h-7 text-slate-400" />
                    </div>
                    <h3 className="text-[16px] font-bold text-slate-900 mb-2">No bank accounts linked</h3>
                    <p className="text-slate-500 text-[13px] mb-6 max-w-sm mx-auto leading-relaxed">
                        Add your Indian bank account to start withdrawing funds from your virtual accounts.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white text-[13px] font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        Add Your First Bank Account
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {localBankAccounts.map((account) => (
                        <div
                            key={account.id}
                            className={`bg-white rounded-xl border shadow-sm relative hover:shadow-md transition-all ${account.isDefault ? 'border-indigo-200 ring-2 ring-indigo-100' : 'border-slate-200'
                                }`}
                        >
                            {/* Default Badge */}
                            {account.isDefault && (
                                <div className="absolute -top-2.5 -right-2.5 px-2.5 py-1 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center gap-1 uppercase shadow-md">
                                    <Star className="w-3 h-3 fill-current" />
                                    Default
                                </div>
                            )}

                            <div className="p-5">
                                {/* Bank Logo & Name */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl shadow-sm">
                                        🏦
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 text-[14px] truncate">{account.bankName}</h3>
                                        <p className="text-[12px] text-slate-500">{account.accountHolderName}</p>
                                    </div>
                                </div>

                                {/* Account Details */}
                                <div className="space-y-2.5 mb-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Account Holder</span>
                                        <span className="text-slate-900 text-[12px] font-semibold truncate">{account.accountHolderName}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Account</span>
                                        <span className="font-mono text-slate-900 text-[12px] font-semibold">{maskAccountNumber(account.accountNumber)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">IFSC</span>
                                        <span className="font-mono text-slate-900 text-[12px] font-semibold">{account.ifscCode}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Type</span>
                                        <span className="capitalize text-slate-900 text-[12px] font-semibold">{account.accountType}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Linked On</span>
                                        <span className="text-slate-900 text-[12px] font-semibold">{formatDate(account.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Status</span>
                                        <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${account.isDefault ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {account.isDefault ? 'Default' : 'Linked'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                    {!account.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(account.id)}
                                            className="flex-1 px-3 py-2 text-[12px] font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            Set as Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(account.id, account.bankName)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove bank account"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Bank Account Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setFormData(initialFormData);
                    setErrors({});
                }}
                title="Add Bank Account"
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Bank Selection */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Bank Name <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg text-[13px] text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none bg-slate-50 focus:bg-white ${errors.bankName ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                }`}
                        >
                            <option value="">Select your bank</option>
                            {INDIAN_BANKS.map((bank) => (
                                <option key={bank.code} value={bank.name}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                        {errors.bankName && (
                            <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3" />
                                {errors.bankName}
                            </p>
                        )}
                    </div>

                    {/* Account Number */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Account Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleInputChange}
                            placeholder="Enter your account number"
                            maxLength={18}
                            className={`w-full px-4 py-3 border rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-mono bg-slate-50 focus:bg-white ${errors.accountNumber ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                }`}
                        />
                        {errors.accountNumber && (
                            <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3" />
                                {errors.accountNumber}
                            </p>
                        )}
                    </div>

                    {/* Confirm Account Number */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Confirm Account Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="confirmAccountNumber"
                            value={formData.confirmAccountNumber}
                            onChange={handleInputChange}
                            placeholder="Re-enter your account number"
                            maxLength={18}
                            className={`w-full px-4 py-3 border rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-mono bg-slate-50 focus:bg-white ${errors.confirmAccountNumber ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                }`}
                        />
                        {errors.confirmAccountNumber && (
                            <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3" />
                                {errors.confirmAccountNumber}
                            </p>
                        )}
                    </div>

                    {/* IFSC Code */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            IFSC Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="ifscCode"
                            value={formData.ifscCode}
                            onChange={handleInputChange}
                            placeholder="e.g., HDFC0001234"
                            maxLength={11}
                            className={`w-full px-4 py-3 border rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-mono uppercase bg-slate-50 focus:bg-white ${errors.ifscCode ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                }`}
                        />
                        {errors.ifscCode && (
                            <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3" />
                                {errors.ifscCode}
                            </p>
                        )}
                    </div>

                    {/* Account Holder Name */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Account Holder Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="accountHolderName"
                            value={formData.accountHolderName}
                            onChange={handleInputChange}
                            placeholder="Name as per bank records"
                            className={`w-full px-4 py-3 border rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50 focus:bg-white ${errors.accountHolderName ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                }`}
                        />
                        {errors.accountHolderName && (
                            <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3" />
                                {errors.accountHolderName}
                            </p>
                        )}
                    </div>

                    {/* Account Type */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Account Type <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="accountType"
                                    value="savings"
                                    checked={formData.accountType === 'savings'}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                />
                                <span className="text-[13px] text-slate-700 font-medium">Savings</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="accountType"
                                    value="current"
                                    checked={formData.accountType === 'current'}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                />
                                <span className="text-[13px] text-slate-700 font-medium">Current</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setFormData(initialFormData);
                                setErrors({});
                            }}
                            className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-indigo-600 text-white text-[13px] font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            Add Bank Account
                        </button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default BankAccounts;
