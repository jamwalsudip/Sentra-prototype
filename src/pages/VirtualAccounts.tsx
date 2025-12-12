import React, { useState } from 'react';
import { Copy, Check, CreditCard, Info, Send, Mail } from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { formatCurrency, copyToClipboard } from '../utils/formatters';
import { EXCHANGE_RATES } from '../data/mockData';
import { Toast } from '../components/Toast';
import Modal from '../components/Modal';
import type { VirtualAccount } from '../types';

type RequestMode = 'choice' | 'email';

const VirtualAccounts: React.FC = () => {
    const { virtualAccounts } = useApp();
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<VirtualAccount | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestMode, setRequestMode] = useState<RequestMode>('choice');
    const [requestEmail, setRequestEmail] = useState('');
    const [requestAmount, setRequestAmount] = useState('');
    const [requestNote, setRequestNote] = useState('');
    const [formError, setFormError] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleCopy = async (value: string, fieldId: string, fieldName: string) => {
        const success = await copyToClipboard(value);
        if (success) {
            setCopiedField(fieldId);
            setToastMessage(`${fieldName} copied to clipboard`);
            setShowToast(true);
            setTimeout(() => setCopiedField(null), 2000);
        }
    };

    const handleCopyAll = async (account: VirtualAccount) => {
        const details = [
            `Account Holder: ${account.accountHolderName}`,
            `Bank: ${account.bankName}`,
            `Account Number: ${account.accountNumber}`,
            account.routingNumber ? `Routing Number: ${account.routingNumber}` : null,
            account.iban ? `IBAN: ${account.iban}` : null,
            `SWIFT/BIC: ${account.swiftBic}`,
        ].filter(Boolean).join('\n');

        const success = await copyToClipboard(details);
        if (success) {
            setToastMessage('All account details copied');
            setShowToast(true);
        }
    };

    const openRequestModal = (account: VirtualAccount) => {
        setSelectedAccount(account);
        setIsModalOpen(true);
        setFormError('');
        setRequestMode('choice');
        setRequestEmail('');
        setRequestAmount('');
        setRequestNote('');
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    const handleSendRequest = async () => {
        if (!requestEmail.trim()) {
            setFormError('Please enter an email address');
            return;
        }
        if (!validateEmail(requestEmail)) {
            setFormError('Enter a valid email address');
            return;
        }
        if (requestAmount && Number(requestAmount) <= 0) {
            setFormError('Amount should be greater than zero');
            return;
        }

        setFormError('');
        setIsSending(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSending(false);
        setIsModalOpen(false);
        setToastMessage('Request sent with account details');
        setShowToast(true);
        setRequestEmail('');
        setRequestAmount('');
        setRequestNote('');
    };

    const CopyButton: React.FC<{ value: string; fieldId: string; fieldName: string }> = ({
        value, fieldId, fieldName
    }) => (
        <button
            onClick={() => handleCopy(value, fieldId, fieldName)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title={`Copy ${fieldName}`}
        >
            {copiedField === fieldId ? (
                <Check className="w-4 h-4 text-emerald-600" />
            ) : (
                <Copy className="w-4 h-4" />
            )}
        </button>
    );

    return (
        <Layout
            title="Virtual Accounts"
            subtitle="Your dedicated bank accounts for receiving international payments"
        >
            {showToast && (
                <Toast
                    message={toastMessage}
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}

            {/* Info Banner */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 flex gap-4 shadow-sm">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <p className="text-[13px] text-indigo-900 font-bold">Share these details to receive payments</p>
                    <p className="text-[12px] text-indigo-700 mt-1 leading-relaxed">
                        Your clients can use these account details to transfer money directly to your virtual accounts.
                    </p>
                </div>
            </div>

            {/* Account Cards */}
            <div className="grid lg:grid-cols-2 gap-5">
                {virtualAccounts.map((account) => {
                    const rate = account.currency === 'USD' ? EXCHANGE_RATES.USD_INR : EXCHANGE_RATES.EUR_INR;
                    const flag = account.currency === 'USD' ? '🇺🇸' : '🇪🇺';
                    const gradientClass = account.currency === 'USD'
                        ? 'from-blue-600 to-blue-700'
                        : 'from-purple-600 to-purple-700';

                    return (
                        <div
                            key={account.id}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md"
                        >
                            {/* Card Header */}
                            <div className={`p-6 bg-gradient-to-br ${gradientClass} text-white`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{flag}</span>
                                        <div>
                                            <p className="font-bold text-[15px]">{account.currency} Account</p>
                                            <p className="text-[12px] opacity-80">{account.bankName}</p>
                                        </div>
                                    </div>
                                    <CreditCard className="w-7 h-7 opacity-40" />
                                </div>

                                <div>
                                    <p className="text-[11px] opacity-80 mb-1 uppercase tracking-wider font-semibold">Available Balance</p>
                                    <p className="text-3xl font-bold">{formatCurrency(account.balance, account.currency)}</p>
                                    <p className="text-[12px] opacity-80 mt-1">
                                        ≈ {formatCurrency(account.balance * rate, 'INR')}
                                    </p>
                                </div>
                            </div>

                            {/* Account Details */}
                            <div className="p-5 space-y-0">
                                {/* Account Number */}
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Account Number</p>
                                        <p className="text-[13px] font-mono text-slate-900 mt-0.5 font-semibold">{account.accountNumber}</p>
                                    </div>
                                    <CopyButton
                                        value={account.accountNumber}
                                        fieldId={`${account.id}-account`}
                                        fieldName="Account Number"
                                    />
                                </div>

                                {/* Routing Number (USD only) */}
                                {account.routingNumber && (
                                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Routing Number</p>
                                            <p className="text-[13px] font-mono text-slate-900 mt-0.5 font-semibold">{account.routingNumber}</p>
                                        </div>
                                        <CopyButton
                                            value={account.routingNumber}
                                            fieldId={`${account.id}-routing`}
                                            fieldName="Routing Number"
                                        />
                                    </div>
                                )}

                                {/* IBAN (EUR only) */}
                                {account.iban && (
                                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">IBAN</p>
                                            <p className="text-[13px] font-mono text-slate-900 mt-0.5 font-semibold">{account.iban}</p>
                                        </div>
                                        <CopyButton
                                            value={account.iban}
                                            fieldId={`${account.id}-iban`}
                                            fieldName="IBAN"
                                        />
                                    </div>
                                )}

                                {/* Bank Name */}
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Bank Name</p>
                                        <p className="text-[13px] text-slate-900 mt-0.5 font-semibold">{account.bankName}</p>
                                    </div>
                                    <CopyButton
                                        value={account.bankName}
                                        fieldId={`${account.id}-bank`}
                                        fieldName="Bank Name"
                                    />
                                </div>

                                {/* SWIFT/BIC */}
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">SWIFT/BIC Code</p>
                                        <p className="text-[13px] font-mono text-slate-900 mt-0.5 font-semibold">{account.swiftBic}</p>
                                    </div>
                                    <CopyButton
                                        value={account.swiftBic}
                                        fieldId={`${account.id}-swift`}
                                        fieldName="SWIFT/BIC Code"
                                    />
                                </div>

                                {/* Account Holder Name */}
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Account Holder Name</p>
                                        <p className="text-[13px] text-slate-900 mt-0.5 font-semibold">{account.accountHolderName}</p>
                                    </div>
                                    <CopyButton
                                        value={account.accountHolderName}
                                        fieldId={`${account.id}-holder`}
                                        fieldName="Account Holder Name"
                                    />
                                </div>

                                {/* Receive Money CTA */}
                                <button
                                    onClick={() => openRequestModal(account)}
                                    className="w-full mt-4 px-4 py-3 bg-indigo-600 text-white text-[13px] font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Send className="w-4 h-4" />
                                    Receive Money in This Account
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Usage Tips */}
            <div className="mt-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 text-[14px] mb-5">How to receive payments</h3>
                <div className="grid md:grid-cols-3 gap-5">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-[14px] flex-shrink-0 shadow-sm">
                            1
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-[13px]">Share your details</p>
                            <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                                Copy and share with your client
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-[14px] flex-shrink-0 shadow-sm">
                            2
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-[13px]">Receive payment</p>
                            <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                                Arrives in 1-3 business days
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-[14px] flex-shrink-0 shadow-sm">
                            3
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-[13px]">Withdraw to bank</p>
                            <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                                Transfer at the best rates
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setFormError('');
                    setIsSending(false);
                    setRequestMode('choice');
                }}
                title="Receive money request"
                size="lg"
            >
                {selectedAccount && (
                    <div className="space-y-5">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                            <p className="text-[12px] text-slate-500 mb-2 font-semibold">Account selected</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-900 text-[14px]">{selectedAccount.currency} Account</p>
                                    <p className="text-[12px] text-slate-500">{selectedAccount.bankName}</p>
                                </div>
                            </div>
                        </div>

                        {requestMode === 'choice' && (
                            <div className="grid sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRequestMode('email')}
                                    className="flex items-center justify-center gap-2 px-4 py-4 bg-indigo-600 text-white text-[13px] font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                >
                                    <Send className="w-4 h-4" />
                                    Email details to client
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleCopyAll(selectedAccount);
                                        setIsModalOpen(false);
                                    }}
                                    className="flex items-center justify-center gap-2 px-4 py-4 border border-slate-200 text-slate-700 text-[13px] font-bold rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy details manually
                                </button>
                            </div>
                        )}

                        {requestMode === 'email' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Recipient Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="email"
                                            value={requestEmail}
                                            onChange={(e) => setRequestEmail(e.target.value)}
                                            placeholder="client@company.com"
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            Amount (optional)
                                        </label>
                                        <input
                                            type="number"
                                            value={requestAmount}
                                            onChange={(e) => setRequestAmount(e.target.value)}
                                            placeholder="e.g. 1200"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            Currency
                                        </label>
                                        <input
                                            value={selectedAccount.currency}
                                            disabled
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[13px] text-slate-500 bg-slate-50 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Note (optional)
                                    </label>
                                    <textarea
                                        value={requestNote}
                                        onChange={(e) => setRequestNote(e.target.value)}
                                        placeholder="Add payment instructions or PO reference"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                                    />
                                </div>

                                {formError && (
                                    <p className="text-[12px] text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-lg font-semibold">
                                        {formError}
                                    </p>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={handleSendRequest}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white text-[13px] font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70"
                                        disabled={isSending}
                                    >
                                        {isSending ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Email details to client
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </Layout>
    );
};

export default VirtualAccounts;
