import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, AlertCircle, TrendingUp, Building2, Plus, X, Star, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { formatCurrency, calculateWithdrawal, formatDate } from '../utils/formatters';
import { EXCHANGE_RATES, COMPETITOR_RATES, INDIAN_BANKS } from '../data/mockData';
import type { VirtualAccount, LocalBankAccount } from '../types';

type Step = 1 | 2 | 3 | 4 | 5;

const Withdrawal: React.FC = () => {
    const navigate = useNavigate();
    const { virtualAccounts, localBankAccounts, addTransaction, updateVirtualAccountBalance, setDefaultBankAccount, removeBankAccount, addBankAccount } = useApp();

    const [step, setStep] = useState<Step>(1);
    const [selectedSource, setSelectedSource] = useState<VirtualAccount | null>(null);
    const [selectedDestination, setSelectedDestination] = useState<LocalBankAccount | null>(null);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [completedTxnId, setCompletedTxnId] = useState('');
    
    // Bank account management states
    const [selectedBankAccount, setSelectedBankAccount] = useState<LocalBankAccount | null>(null);
    const [showAddAccountForm, setShowAddAccountForm] = useState(false);
    const [newAccountForm, setNewAccountForm] = useState({
        bankName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        accountType: 'savings' as 'savings' | 'current',
    });
    const [addAccountError, setAddAccountError] = useState('');

    const withdrawalDetails = useMemo(() => {
        if (!selectedSource || !amount || isNaN(parseFloat(amount))) {
            return null;
        }
        const amountNum = parseFloat(amount);
        return calculateWithdrawal(amountNum, selectedSource.currency, EXCHANGE_RATES);
    }, [selectedSource, amount]);

    const validateAmount = (): boolean => {
        setError('');
        const amountNum = parseFloat(amount);

        if (!amount || isNaN(amountNum)) {
            setError('Please enter a valid amount');
            return false;
        }

        if (amountNum < 10) {
            setError(`Minimum withdrawal is ${formatCurrency(10, selectedSource?.currency || 'USD')}`);
            return false;
        }

        if (selectedSource && amountNum > selectedSource.balance) {
            setError('Insufficient balance');
            return false;
        }

        return true;
    };

    const handleContinue = () => {
        if (step === 1 && selectedSource) {
            setStep(2);
        } else if (step === 2) {
            if (selectedDestination) {
                setStep(3);
            } else if (localBankAccounts.length === 0) {
                navigate('/bank-accounts');
            }
        } else if (step === 3) {
            if (validateAmount()) {
                setStep(4);
            }
        } else if (step === 4) {
            handleConfirmWithdrawal();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep((step - 1) as Step);
            setError('');
        }
    };

    const handleConfirmWithdrawal = async () => {
        if (!selectedSource || !selectedDestination || !withdrawalDetails) return;

        setIsProcessing(true);

        await new Promise(resolve => setTimeout(resolve, 1500));

        const txnId = `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        addTransaction({
            type: 'withdrawal',
            sourceAccountId: selectedSource.id,
            destinationAccountId: selectedDestination.id,
            amountSource: parseFloat(amount),
            currencySource: selectedSource.currency,
            amountDestination: withdrawalDetails.amountInINR,
            currencyDestination: 'INR',
            exchangeRate: withdrawalDetails.exchangeRate,
            fee: withdrawalDetails.totalFee,
            status: 'pending',
            description: `Withdrawal to ${selectedDestination.bankName}`,
        });

        updateVirtualAccountBalance(
            selectedSource.id,
            selectedSource.balance - parseFloat(amount)
        );

        setCompletedTxnId(txnId);
        setIsProcessing(false);
        setStep(5);
    };

    const stepLabels = ['Source', 'Destination', 'Amount', 'Review', 'Done'];

    const handleSetDefault = (accountId: string) => {
        setDefaultBankAccount(accountId);
        setSelectedBankAccount(null);
    };

    const handleDeleteAccount = (accountId: string) => {
        removeBankAccount(accountId);
        setSelectedBankAccount(null);
        // If the deleted account was selected as destination, clear it
        if (selectedDestination?.id === accountId) {
            setSelectedDestination(null);
        }
    };

    const handleAddAccount = () => {
        setAddAccountError('');
        
        if (!newAccountForm.bankName || !newAccountForm.accountNumber || !newAccountForm.ifscCode || !newAccountForm.accountHolderName) {
            setAddAccountError('Please fill in all required fields');
            return;
        }
        
        if (newAccountForm.accountNumber !== newAccountForm.confirmAccountNumber) {
            setAddAccountError('Account numbers do not match');
            return;
        }
        
        if (newAccountForm.accountNumber.length < 9 || newAccountForm.accountNumber.length > 18) {
            setAddAccountError('Please enter a valid account number');
            return;
        }
        
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(newAccountForm.ifscCode.toUpperCase())) {
            setAddAccountError('Please enter a valid IFSC code');
            return;
        }

        addBankAccount({
            bankName: newAccountForm.bankName,
            accountNumber: newAccountForm.accountNumber,
            ifscCode: newAccountForm.ifscCode.toUpperCase(),
            accountHolderName: newAccountForm.accountHolderName,
            accountType: newAccountForm.accountType,
            isDefault: localBankAccounts.length === 0, // Make default if first account
        });

        // Reset form
        setNewAccountForm({
            bankName: '',
            accountNumber: '',
            confirmAccountNumber: '',
            ifscCode: '',
            accountHolderName: '',
            accountType: 'savings',
        });
        setShowAddAccountForm(false);
    };

    return (
        <Layout title="Withdraw Funds" subtitle="Transfer money to your local bank account">
            <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
                {/* Flow (left column) */}
                <div className="space-y-5">
                    {/* Progress Steps */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            {stepLabels.map((label, index) => (
                                <React.Fragment key={label}>
                                    <div className="flex flex-col items-center">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shadow-sm ${index + 1 < step
                                            ? 'bg-emerald-600 text-white'
                                            : index + 1 === step
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {index + 1 < step ? <Check className="w-4 h-4" /> : index + 1}
                                        </div>
                                        <span className={`text-[11px] mt-1.5 font-semibold ${index + 1 === step ? 'text-indigo-600' : 'text-slate-400'}`}>
                                            {label}
                                        </span>
                                    </div>
                                    {index < stepLabels.length - 1 && (
                                        <div className={`flex-1 h-1 mx-3 rounded-full ${index + 1 < step ? 'bg-emerald-600' : 'bg-slate-100'}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="max-w-3xl w-full">
                        {/* Step 1: Select Source */}
                        {step === 1 && (
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <h2 className="font-bold text-slate-900 text-[15px]">Select Source Account</h2>
                            <p className="text-[12px] text-slate-500 mt-0.5">Choose where to withdraw from</p>
                        </div>
                        <div className="p-5 space-y-3">
                            {virtualAccounts.map((account) => (
                                <button
                                    key={account.id}
                                    onClick={() => setSelectedSource(account)}
                                    className={`w-full p-5 rounded-xl border text-left transition-all ${selectedSource?.id === account.id
                                        ? 'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-200 shadow-md'
                                        : 'border-slate-200 hover:border-slate-300 shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-2xl shadow-sm">
                                            {account.currency === 'USD' ? '🇺🇸' : '🇪🇺'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 text-[14px]">{account.currency} Account</p>
                                            <p className="text-[12px] text-slate-500">{account.bankName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900 text-[16px]">{formatCurrency(account.balance, account.currency)}</p>
                                            <p className="text-[11px] text-slate-500">Available</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                            <button
                                onClick={handleContinue}
                                disabled={!selectedSource}
                                className="w-full px-4 py-3 bg-indigo-600 text-white text-[13px] font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Select Destination */}
                {step === 2 && (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <h2 className="font-bold text-slate-900 text-[15px]">Select Destination Bank</h2>
                            <p className="text-[12px] text-slate-500 mt-0.5">Where should we send the money?</p>
                        </div>
                        <div className="p-5">
                            {localBankAccounts.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <Building2 className="w-7 h-7 text-slate-400" />
                                    </div>
                                    <h3 className="text-[15px] font-bold text-slate-900 mb-2">No bank accounts linked</h3>
                                    <p className="text-[12px] text-slate-500 mb-5">Add a bank account to continue</p>
                                    <button
                                        onClick={() => navigate('/bank-accounts')}
                                        className="px-5 py-2.5 bg-indigo-600 text-white text-[13px] font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                                    >
                                        Add Bank Account
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {localBankAccounts.map((account) => (
                                        <button
                                            key={account.id}
                                            onClick={() => setSelectedDestination(account)}
                                            className={`w-full p-5 rounded-xl border text-left transition-all ${selectedDestination?.id === account.id
                                                ? 'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-200 shadow-md'
                                                : 'border-slate-200 hover:border-slate-300 shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                                                    🏦
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-slate-900 text-[14px]">{account.bankName}</p>
                                                    <p className="text-[12px] text-slate-500">
                                                        •••• {account.accountNumber.slice(-4)} • {account.accountType}
                                                    </p>
                                                </div>
                                                {account.isDefault && (
                                                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full uppercase">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {localBankAccounts.length > 0 && (
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                                <button
                                    onClick={handleBack}
                                    className="px-5 py-3 border border-slate-200 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                                <button
                                    onClick={handleContinue}
                                    disabled={!selectedDestination}
                                    className="flex-1 px-4 py-3 bg-indigo-600 text-white text-[13px] font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Enter Amount */}
                {step === 3 && selectedSource && (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <h2 className="font-bold text-slate-900 text-[15px]">Enter Amount</h2>
                            <p className="text-[12px] text-slate-500 mt-0.5">How much do you want to withdraw?</p>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Amount ({selectedSource.currency})
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-semibold">
                                        {selectedSource.currency === 'USD' ? '$' : '€'}
                                    </span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-4 border border-slate-200 rounded-xl text-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                                    />
                                </div>
                                <p className="text-[12px] text-slate-500 mt-2">
                                    Available: {formatCurrency(selectedSource.balance, selectedSource.currency)}
                                </p>
                                {error && (
                                    <p className="text-[12px] text-red-600 mt-2 flex items-center gap-1 font-semibold bg-red-50 px-3 py-2 rounded-lg">
                                        <AlertCircle className="w-4 h-4" /> {error}
                                    </p>
                                )}
                            </div>

                            {/* Preview */}
                            {withdrawalDetails && (
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-3">
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-slate-500">Amount sent</span>
                                        <span className="text-slate-900 font-semibold">
                                            {formatCurrency(parseFloat(amount), selectedSource.currency)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-slate-500">Fee</span>
                                        <span className="text-slate-900 font-semibold">
                                            -{formatCurrency(withdrawalDetails.totalFee, selectedSource.currency)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-slate-500">Net to convert</span>
                                        <span className="text-slate-900 font-semibold">
                                            {formatCurrency(withdrawalDetails.netAmount, selectedSource.currency)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-slate-500">Exchange rate</span>
                                        <span className="text-slate-900">
                                            1 {selectedSource.currency} = ₹{withdrawalDetails.exchangeRate}
                                        </span>
                                    </div>
                                    <div className="pt-3 border-t border-slate-200 flex justify-between">
                                        <span className="text-slate-900 font-bold text-[14px]">You'll receive</span>
                                        <span className="text-emerald-600 font-bold text-xl">
                                            {formatCurrency(withdrawalDetails.amountInINR, 'INR')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={handleBack}
                                className="px-5 py-3 border border-slate-200 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                                onClick={handleContinue}
                                disabled={!amount || parseFloat(amount) <= 0}
                                className="flex-1 px-4 py-3 bg-indigo-600 text-white text-[13px] font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                Review <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Review & Confirm */}
                {step === 4 && selectedSource && selectedDestination && withdrawalDetails && (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <h2 className="font-bold text-slate-900 text-[15px]">Review & Confirm</h2>
                            <p className="text-[12px] text-slate-500 mt-0.5">Please review the details before confirming</p>
                        </div>
                        <div className="p-6 space-y-5">
                            {/* Summary */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 text-[13px]">From</span>
                                    <span className="text-slate-900 text-[13px] font-semibold">
                                        {selectedSource.currency} Account
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 text-[13px]">To</span>
                                    <span className="text-slate-900 text-[13px] font-semibold">
                                        {selectedDestination.bankName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 text-[13px]">Amount sent</span>
                                    <span className="text-slate-900 text-[13px] font-semibold">
                                        {formatCurrency(parseFloat(amount), selectedSource.currency)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 text-[13px]">Fee</span>
                                    <span className="text-slate-900 text-[13px] font-semibold">
                                        -{formatCurrency(withdrawalDetails.totalFee, selectedSource.currency)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 text-[13px]">Net to convert</span>
                                    <span className="text-slate-900 text-[13px] font-semibold">
                                        {formatCurrency(withdrawalDetails.netAmount, selectedSource.currency)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 text-[13px]">Exchange rate</span>
                                    <span className="text-slate-900 text-[13px]">
                                        1 {selectedSource.currency} = ₹{withdrawalDetails.exchangeRate}
                                    </span>
                                </div>
                                <div className="pt-4 border-t border-slate-200 flex justify-between">
                                    <span className="text-slate-900 font-bold text-[14px]">You'll receive</span>
                                    <span className="text-emerald-600 font-bold text-2xl">
                                        {formatCurrency(withdrawalDetails.amountInINR, 'INR')}
                                    </span>
                                </div>
                            </div>

                            {/* Rate Comparison */}
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <span className="text-[13px] font-bold text-emerald-800">Better Rate with Sentra</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    {Object.entries(COMPETITOR_RATES[selectedSource.currency === 'USD' ? 'USD_INR' : 'EUR_INR'])
                                        .filter(([key]) => key !== 'sentra')
                                        .slice(0, 3)
                                        .map(([name, rate]) => (
                                            <div key={name} className="bg-white border border-emerald-100 rounded-lg p-3 shadow-sm">
                                                <p className="text-[10px] text-slate-500 capitalize font-semibold">{name} rate</p>
                                                <p className="text-[13px] font-bold text-slate-600 mt-0.5">
                                                    1 {selectedSource.currency} = ₹{rate}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <p className="text-[12px] text-slate-500 text-center font-medium">
                                Estimated arrival: 10-30 mins
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={handleBack}
                                disabled={isProcessing}
                                className="px-5 py-3 border border-slate-200 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                                onClick={handleContinue}
                                disabled={isProcessing}
                                className="flex-1 px-4 py-3 bg-indigo-600 text-white text-[13px] font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md disabled:bg-indigo-400 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm Withdrawal'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Success */}
                {step === 5 && (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-center p-10 shadow-md">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 success-checkmark shadow-lg">
                            <Check className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Withdrawal Initiated</h2>
                        <p className="text-[14px] text-slate-500 mb-6">
                            Your transfer is being processed
                        </p>

                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-left space-y-3 mb-6">
                            <div className="flex justify-between text-[13px]">
                                <span className="text-slate-500">Amount</span>
                                <span className="text-slate-900 font-semibold">
                                    {formatCurrency(parseFloat(amount), selectedSource?.currency || 'USD')}
                                </span>
                            </div>
                            <div className="flex justify-between text-[13px]">
                                <span className="text-slate-500">To receive</span>
                                <span className="text-emerald-600 font-bold">
                                    {formatCurrency(withdrawalDetails?.amountInINR || 0, 'INR')}
                                </span>
                            </div>
                            <div className="flex justify-between text-[13px]">
                                <span className="text-slate-500">Destination</span>
                                <span className="text-slate-900 font-semibold">{selectedDestination?.bankName}</span>
                            </div>
                            <div className="flex justify-between text-[13px]">
                                <span className="text-slate-500">Transaction ID</span>
                                <span className="text-slate-900 font-mono text-[11px] font-semibold">{completedTxnId.slice(0, 20)}...</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/transactions')}
                                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                View Transactions
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 px-4 py-3 bg-indigo-600 text-white text-[13px] font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                        )}
                    </div>
                </div>

                {/* Linked bank accounts (right column) */}
                <div className="lg:sticky lg:top-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-slate-900 text-[15px]">Linked bank accounts</h2>
                            <p className="text-[12px] text-slate-500">Tap a card to view details</p>
                        </div>
                    </div>

                    {/* Bank Account Cards */}
                    <div className="space-y-3">
                        {localBankAccounts.map(account => (
                            <button
                                key={account.id}
                                onClick={() => setSelectedBankAccount(account)}
                                className={`w-full bg-white border rounded-xl p-4 shadow-sm text-left transition-all hover:shadow-md hover:border-indigo-200 ${account.isDefault ? 'border-indigo-200 ring-2 ring-indigo-100' : 'border-slate-200'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center text-xl border border-slate-200 shadow-sm">
                                        🏦
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-slate-900 text-[14px] truncate">{account.bankName}</p>
                                            {account.isDefault && (
                                                <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-bold rounded-full uppercase shadow-sm">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[12px] text-slate-500">
                                            •••• {account.accountNumber.slice(-4)} • {account.accountType}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400" />
                                </div>
                            </button>
                        ))}

                        {/* Add Account Button */}
                        <button
                            onClick={() => setShowAddAccountForm(true)}
                            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-semibold text-[13px]">Add bank account</span>
                        </button>
                    </div>

                    {localBankAccounts.length === 0 && (
                        <p className="text-center text-[12px] text-slate-400 py-2">
                            No accounts linked yet. Add one to start withdrawing.
                        </p>
                    )}
                        </div>

                {/* Bank Account Detail Modal */}
                {selectedBankAccount && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBankAccount(null)}>
                        <div 
                            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl flex items-center justify-center text-2xl border border-indigo-100 shadow-sm">
                                            🏦
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 text-[16px]">{selectedBankAccount.bankName}</h3>
                                                {selectedBankAccount.isDefault && (
                                                    <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-bold rounded-full uppercase">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[13px] text-slate-500">{selectedBankAccount.accountHolderName}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedBankAccount(null)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Account Details */}
                            <div className="p-6 space-y-4">
                                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                                        <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Account Number</span>
                                        <span className="font-mono text-[13px] text-slate-900 font-semibold">{selectedBankAccount.accountNumber}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">IFSC Code</span>
                                        <span className="font-mono text-[13px] text-slate-900 font-semibold">{selectedBankAccount.ifscCode}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Account Type</span>
                                        <span className="capitalize text-[13px] text-slate-900 font-semibold">{selectedBankAccount.accountType}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Linked On</span>
                                        <span className="text-[13px] text-slate-900 font-semibold">{formatDate(selectedBankAccount.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3 pt-2">
                                    {!selectedBankAccount.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(selectedBankAccount.id)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white text-[13px] font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md"
                                        >
                                            <Star className="w-4 h-4" />
                                            Set as Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteAccount(selectedBankAccount.id)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200 text-red-600 text-[13px] font-semibold rounded-xl hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Remove Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Account Modal */}
                {showAddAccountForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddAccountForm(false)}>
                        <div 
                            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white sticky top-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-[16px]">Add Bank Account</h3>
                                        <p className="text-[12px] text-slate-500 mt-0.5">Enter your Indian bank details</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddAccountForm(false)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="p-6 space-y-4">
                                {/* Bank Selection */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Bank Name *
                                    </label>
                                    <select
                                        value={newAccountForm.bankName}
                                        onChange={(e) => setNewAccountForm(prev => ({ ...prev, bankName: e.target.value }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[13px] text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none bg-white"
                                    >
                                        <option value="">Select your bank</option>
                                        {INDIAN_BANKS.map(bank => (
                                            <option key={bank.code} value={bank.name}>{bank.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Account Holder Name */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Account Holder Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newAccountForm.accountHolderName}
                                        onChange={(e) => setNewAccountForm(prev => ({ ...prev, accountHolderName: e.target.value }))}
                                        placeholder="As per bank records"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                                    />
                                </div>

                                {/* Account Number */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Account Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={newAccountForm.accountNumber}
                                        onChange={(e) => setNewAccountForm(prev => ({ ...prev, accountNumber: e.target.value.replace(/\D/g, '') }))}
                                        placeholder="Enter account number"
                                        maxLength={18}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-mono"
                                    />
                                </div>

                                {/* Confirm Account Number */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Confirm Account Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={newAccountForm.confirmAccountNumber}
                                        onChange={(e) => setNewAccountForm(prev => ({ ...prev, confirmAccountNumber: e.target.value.replace(/\D/g, '') }))}
                                        placeholder="Re-enter account number"
                                        maxLength={18}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-mono"
                                    />
                                </div>

                                {/* IFSC Code */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        IFSC Code *
                                    </label>
                                    <input
                                        type="text"
                                        value={newAccountForm.ifscCode}
                                        onChange={(e) => setNewAccountForm(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                                        placeholder="e.g., HDFC0001234"
                                        maxLength={11}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-mono uppercase"
                                    />
                                        </div>

                                {/* Account Type */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Account Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setNewAccountForm(prev => ({ ...prev, accountType: 'savings' }))}
                                            className={`px-4 py-3 rounded-xl border text-[13px] font-semibold transition-all ${newAccountForm.accountType === 'savings'
                                                ? 'border-indigo-300 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100'
                                                : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                        >
                                            Savings
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewAccountForm(prev => ({ ...prev, accountType: 'current' }))}
                                            className={`px-4 py-3 rounded-xl border text-[13px] font-semibold transition-all ${newAccountForm.accountType === 'current'
                                                ? 'border-indigo-300 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100'
                                                : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                        >
                                            Current
                                        </button>
                                    </div>
                                </div>

                                {addAccountError && (
                                    <p className="text-[12px] text-red-600 flex items-center gap-1 font-semibold bg-red-50 px-3 py-2 rounded-lg">
                                        <AlertCircle className="w-4 h-4" /> {addAccountError}
                                    </p>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={handleAddAccount}
                                    className="w-full px-4 py-3 bg-indigo-600 text-white text-[13px] font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md mt-2"
                                >
                                    Add Account
                                </button>
                            </div>
                        </div>
                        </div>
                    )}
            </div>
        </Layout>
    );
};

export default Withdrawal;
