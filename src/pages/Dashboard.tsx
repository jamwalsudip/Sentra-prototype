import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDownLeft, Send, Eye, TrendingUp, ArrowRight, Check, DollarSign } from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { EXCHANGE_RATES, COMPETITOR_RATES, FEE_STRUCTURE } from '../data/mockData';

// Competitor fee structures (for comparison)
const COMPETITOR_FEES = {
    wise: { baseFee: 0.50, variableRate: 0.005 }, // $0.50 + 0.5%
    paypal: { baseFee: 0.30, variableRate: 0.029 }, // $0.30 + 2.9%
    westernUnion: { baseFee: 5.00, variableRate: 0.02 }, // $5 + 2%
    sentra: FEE_STRUCTURE,
};

interface ComparisonResult {
    provider: string;
    logo: string;
    isImage: boolean;
    rate: number;
    fee: number;
    netAmount: number;
    amountInINR: number;
    savings: number;
}

// Provider logos
const PROVIDER_LOGOS = {
    sentra: 'https://media.licdn.com/dms/image/v2/D560BAQHjI7tQ8oVfeA/company-logo_100_100/B56ZccO1rmG0AQ-/0/1748525342204/sentrapay_logo?e=1767225600&v=beta&t=r4MrSr8uA10ejGK3sLP-72eJah-yY1ASAZEnrOOZwV8',
    wise: 'https://media.licdn.com/dms/image/v2/C4E0BAQGi4FxUQN6fqw/company-logo_200_200/company-logo_200_200/0/1677655590999/wiseaccount_logo?e=1767225600&v=beta&t=R1RIJOhIgVjmRUgWOgFKG6QkUuVUvB5OqThCN4DRosA',
    paypal: 'https://media.licdn.com/dms/image/v2/D560BAQGlX0cKdGRk-w/company-logo_200_200/company-logo_200_200/0/1725506319701?e=1767225600&v=beta&t=liyIxraL9-8swDyq0lyneUGCaBoIqTf1Br264uqsqEU',
    westernUnion: 'https://media.licdn.com/dms/image/v2/C4E0BAQFX-w3SJJhaOw/company-logo_200_200/company-logo_200_200/0/1673279981250/western_union_logo?e=1767225600&v=beta&t=lOrHzHaP0iMMDMbUsNNzPn40TxWM4Qik-mC0_vo7i7s',
};

const Dashboard: React.FC = () => {
    const { user, virtualAccounts } = useApp();
    const navigate = useNavigate();

    // Calculator state
    const [calcAmount, setCalcAmount] = useState<string>('1000');
    const [calcCurrency, setCalcCurrency] = useState<'USD' | 'EUR'>('USD');

    const totalBalanceINR = virtualAccounts.reduce((total, va) => {
        const rate = va.currency === 'USD' ? EXCHANGE_RATES.USD_INR : EXCHANGE_RATES.EUR_INR;
        return total + (va.balance * rate);
    }, 0);

    // Calculate comparison for all providers
    const comparison = useMemo((): ComparisonResult[] => {
        const amount = parseFloat(calcAmount) || 0;
        if (amount <= 0) return [];

        const rateKey = calcCurrency === 'USD' ? 'USD_INR' : 'EUR_INR';
        const rates = COMPETITOR_RATES[rateKey];

        const providers = [
            { key: 'sentra', name: 'Sentra' },
            { key: 'wise', name: 'Wise' },
            { key: 'paypal', name: 'PayPal' },
            { key: 'westernUnion', name: 'Western Union' },
        ];

        const results = providers.map(provider => {
            const fees = COMPETITOR_FEES[provider.key as keyof typeof COMPETITOR_FEES];
            const rate = rates[provider.key as keyof typeof rates];
            const fee = fees.baseFee + (amount * fees.variableRate);
            const netAmount = amount - fee;
            const amountInINR = netAmount * rate;

            return {
                provider: provider.name,
                logo: PROVIDER_LOGOS[provider.key as keyof typeof PROVIDER_LOGOS],
                isImage: true,
                rate,
                fee,
                netAmount,
                amountInINR,
                savings: 0,
            };
        });

        // Calculate savings compared to Sentra
        const sentraAmount = results.find(r => r.provider === 'Sentra')?.amountInINR || 0;
        results.forEach(r => {
            r.savings = sentraAmount - r.amountInINR;
        });

        // Sort by amountInINR descending (Sentra should be first)
        return results.sort((a, b) => b.amountInINR - a.amountInINR);
    }, [calcAmount, calcCurrency]);

    const sentraResult = comparison.find(c => c.provider === 'Sentra');
    const bestCompetitor = comparison.find(c => c.provider !== 'Sentra');
    const savingsVsBest = sentraResult && bestCompetitor ? sentraResult.amountInINR - bestCompetitor.amountInINR : 0;

    return (
        <Layout title="Dashboard" subtitle={`Welcome back, ${user?.fullName?.split(' ')[0] || 'User'}`}>
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-5 mb-6">
                {/* Total Balance */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-indigo-200 text-[11px] font-bold uppercase tracking-wider">Total Balance (INR)</span>
                        <TrendingUp className="w-5 h-5 text-indigo-300" />
                    </div>
                    <p className="text-3xl font-bold mb-2">{formatCurrency(totalBalanceINR, 'INR')}</p>
                    <p className="text-indigo-200 text-[12px]">
                        Across {virtualAccounts.length} virtual accounts
                    </p>
                </div>

                {/* USD Balance */}
                {virtualAccounts.filter(va => va.currency === 'USD').map(va => (
                    <div key={va.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg shadow-sm">
                                    🇺🇸
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-slate-900">USD Account</p>
                                    <p className="text-[11px] text-slate-500">JPMorgan Chase</p>
                                </div>
                            </div>
                            <Link
                                to="/virtual-accounts"
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                                <Eye className="w-4 h-4" />
                            </Link>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(va.balance, 'USD')}</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                            ≈ {formatCurrency(va.balance * EXCHANGE_RATES.USD_INR, 'INR')}
                        </p>
                    </div>
                ))}

                {/* EUR Balance */}
                {virtualAccounts.filter(va => va.currency === 'EUR').map(va => (
                    <div key={va.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg shadow-sm">
                                    🇪🇺
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-slate-900">EUR Account</p>
                                    <p className="text-[11px] text-slate-500">Deutsche Bank</p>
                                </div>
                            </div>
                            <Link
                                to="/virtual-accounts"
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                                <Eye className="w-4 h-4" />
                            </Link>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(va.balance, 'EUR')}</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                            ≈ {formatCurrency(va.balance * EXCHANGE_RATES.EUR_INR, 'INR')}
                        </p>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button
                    onClick={() => navigate('/virtual-accounts')}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-5 rounded-xl shadow-lg flex items-center justify-between hover:from-emerald-600 hover:to-emerald-700 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <ArrowDownLeft className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-white text-[15px]">Receive Money</p>
                            <p className="text-[12px] text-emerald-100">Get paid in USD or EUR</p>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                    onClick={() => navigate('/withdrawal')}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-5 rounded-xl shadow-lg flex items-center justify-between hover:from-indigo-600 hover:to-indigo-700 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Send className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-white text-[15px]">Withdraw Money</p>
                            <p className="text-[12px] text-indigo-100">Transfer to your bank</p>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Exchange Rates */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Live Rates</span>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🇺🇸</span>
                                <span className="text-[14px] font-bold text-slate-900">1 USD = ₹{EXCHANGE_RATES.USD_INR}</span>
                            </div>
                            <div className="w-px h-5 bg-slate-200"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🇪🇺</span>
                                <span className="text-[14px] font-bold text-slate-900">1 EUR = ₹{EXCHANGE_RATES.EUR_INR}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[11px] text-emerald-600 font-semibold">Live</span>
                    </div>
                </div>
            </div>

            {/* Withdrawal Calculator & Comparison */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 text-[16px]">Withdrawal Calculator</h2>
                            <p className="text-[12px] text-slate-500">Compare how much you'll receive with different providers</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Calculator Input */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="flex-1">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Amount to Withdraw
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-semibold">
                                    {calcCurrency === 'USD' ? '$' : '€'}
                                </span>
                                <input
                                    type="number"
                                    value={calcAmount}
                                    onChange={(e) => setCalcAmount(e.target.value)}
                                    placeholder="1000"
                                    className="w-full pl-10 pr-4 py-4 border border-slate-200 rounded-xl text-xl font-bold text-slate-900 placeholder:text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Currency
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setCalcCurrency('USD')}
                                    className={`px-4 py-4 rounded-xl border text-[14px] font-bold transition-all flex items-center justify-center gap-2 ${calcCurrency === 'USD'
                                            ? 'border-indigo-300 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100'
                                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    🇺🇸 USD
                                </button>
                                <button
                                    onClick={() => setCalcCurrency('EUR')}
                                    className={`px-4 py-4 rounded-xl border text-[14px] font-bold transition-all flex items-center justify-center gap-2 ${calcCurrency === 'EUR'
                                            ? 'border-indigo-300 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100'
                                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    🇪🇺 EUR
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Savings Highlight */}
                    {savingsVsBest > 0 && parseFloat(calcAmount) > 0 && (
                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-5 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Check className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-[13px] text-emerald-700 font-medium">With Sentra, you save</p>
                                    <p className="text-2xl font-bold text-emerald-800">
                                        {formatCurrency(savingsVsBest, 'INR')}
                                    </p>
                                    <p className="text-[12px] text-emerald-600">compared to {bestCompetitor?.provider}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Comparison Table */}
                    {comparison.length > 0 && parseFloat(calcAmount) > 0 && (
                        <div className="overflow-hidden rounded-xl border border-slate-200">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="text-left px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Provider</th>
                                        <th className="text-right px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Exchange Rate</th>
                                        <th className="text-right px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fee</th>
                                        <th className="text-right px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">You Receive</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {comparison.map((result) => (
                                        <tr
                                            key={result.provider}
                                            className={`transition-colors ${result.provider === 'Sentra'
                                                    ? 'bg-indigo-50/50'
                                                    : 'hover:bg-slate-50'
                                                }`}
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center ${result.provider === 'Sentra' ? 'bg-indigo-100' : 'bg-slate-100'
                                                        }`}>
                                                        <img
                                                            src={result.logo}
                                                            alt={result.provider}
                                                            className="w-7 h-7 object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className={`font-bold text-[14px] ${result.provider === 'Sentra' ? 'text-indigo-700' : 'text-slate-900'
                                                            }`}>
                                                            {result.provider}
                                                        </span>
                                                        {result.provider === 'Sentra' && (
                                                            <span className="ml-2 px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-bold rounded-full uppercase">
                                                                Best
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <span className="font-mono text-[13px] text-slate-900">
                                                    1 {calcCurrency} = ₹{result.rate}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <span className="font-mono text-[13px] text-slate-600">
                                                    {formatCurrency(result.fee, calcCurrency)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div>
                                                    <span className={`font-bold text-[15px] ${result.provider === 'Sentra' ? 'text-emerald-600' : 'text-slate-900'
                                                        }`}>
                                                        {formatCurrency(result.amountInINR, 'INR')}
                                                    </span>
                                                    {result.provider !== 'Sentra' && result.savings > 0 && (
                                                        <p className="text-[11px] text-red-500 font-medium">
                                                            -{formatCurrency(result.savings, 'INR')} less
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* CTA */}
                    {parseFloat(calcAmount) > 0 && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => navigate('/withdrawal')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white text-[14px] font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                Withdraw {formatCurrency(parseFloat(calcAmount), calcCurrency)} Now
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
