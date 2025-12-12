import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, ChevronDown, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Transaction } from '../types';

const Transactions: React.FC = () => {
    const { transactions, localBankAccounts, virtualAccounts } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Transaction['status']>('all');
    const [typeFilter, setTypeFilter] = useState<'all' | Transaction['type']>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((txn) => {
            const matchesSearch = searchQuery === '' ||
                txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                txn.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
            const matchesType = typeFilter === 'all' || txn.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [transactions, searchQuery, statusFilter, typeFilter]);

    const getAccountName = (txn: Transaction) => {
        if (txn.type === 'received') {
            const va = virtualAccounts.find(v => v.id === txn.sourceAccountId);
            return va ? `${va.bankName} (${va.currency})` : 'Virtual Account';
        } else {
            const lba = localBankAccounts.find(l => l.id === txn.destinationAccountId);
            return lba ? lba.bankName : 'Bank Account';
        }
    };

    return (
        <Layout title="Transactions" subtitle="Your complete transaction history">
            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search transactions..."
                            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50 focus:bg-white"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                            className="pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none bg-slate-50 focus:bg-white min-w-[140px]"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Type Filter */}
                    <div className="relative">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                            className="px-4 pr-10 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none bg-slate-50 focus:bg-white min-w-[140px]"
                        >
                            <option value="all">All Types</option>
                            <option value="received">Received</option>
                            <option value="withdrawal">Withdrawals</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Results count */}
            <p className="text-[12px] text-slate-500 mb-4 font-medium">
                Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>

            {/* Transactions List */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                {filteredTransactions.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Search className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-[16px] font-bold text-slate-900 mb-2">No transactions found</h3>
                        <p className="text-slate-500 text-[13px]">
                            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                                ? 'Try adjusting your filters'
                                : 'Your transactions will appear here'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredTransactions.map((txn) => (
                            <div key={txn.id}>
                                {/* Transaction Row */}
                                <button
                                    onClick={() => setExpandedId(expandedId === txn.id ? null : txn.id)}
                                    className={`w-full px-6 py-5 flex items-center gap-5 hover:bg-slate-50 transition-colors text-left ${expandedId === txn.id ? 'bg-slate-50/80' : ''
                                        }`}
                                >
                                    {/* Icon */}
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${txn.type === 'received'
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : 'bg-indigo-100 text-indigo-600'
                                        }`}>
                                        {txn.type === 'received' ? (
                                            <ArrowDownLeft className="w-5 h-5" />
                                        ) : (
                                            <ArrowUpRight className="w-5 h-5" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-bold text-slate-900 text-[14px] truncate">
                                                {txn.description}
                                            </p>
                                            <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${txn.type === 'received'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-indigo-100 text-indigo-700'
                                                }`}>
                                                {txn.type === 'received' ? 'Received' : 'Withdrawal'}
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-slate-500">
                                            {getAccountName(txn)} • {formatDate(txn.createdAt)}
                                        </p>
                                    </div>

                                    {/* Amount & Status */}
                                    <div className="text-right flex items-center gap-4 flex-shrink-0">
                                        <div className="flex flex-col items-end gap-1">
                                            <p className={`font-bold text-[15px] ${txn.type === 'received' ? 'text-emerald-600' : 'text-slate-900'
                                                }`}>
                                                {txn.type === 'received' ? '+' : '-'}
                                                {formatCurrency(txn.amountSource, txn.currencySource)}
                                            </p>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${txn.status === 'completed'
                                                    ? 'bg-emerald-100 text-emerald-600'
                                                    : txn.status === 'pending'
                                                        ? 'bg-amber-100 text-amber-600'
                                                        : 'bg-red-100 text-red-600'
                                                }`}>
                                                {txn.status}
                                            </span>
                                        </div>

                                        <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform duration-200 ${expandedId === txn.id ? 'rotate-90 text-slate-500' : ''
                                            }`} />
                                    </div>
                                </button>

                                {/* Expanded Details - Single Line */}
                                {expandedId === txn.id && (
                                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                                        <div className="flex items-center gap-8 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">ID:</span>
                                                <span className="text-[12px] font-mono text-slate-700 font-medium">{txn.id}</span>
                                            </div>
                                            {txn.type === 'withdrawal' && txn.exchangeRate && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Rate:</span>
                                                    <span className="text-[12px] text-slate-700 font-medium">1 {txn.currencySource} = ₹{txn.exchangeRate}</span>
                                                </div>
                                            )}
                                            {txn.type === 'withdrawal' && txn.amountDestination && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Received:</span>
                                                    <span className="text-[12px] text-emerald-600 font-bold">{formatCurrency(txn.amountDestination, 'INR')}</span>
                                                </div>
                                            )}
                                            {txn.fee > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Fee:</span>
                                                    <span className="text-[12px] text-slate-700 font-medium">{formatCurrency(txn.fee, txn.currencySource)}</span>
                                                </div>
                                            )}
                                            {txn.completedAt && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Completed:</span>
                                                    <span className="text-[12px] text-slate-700 font-medium">{formatDate(txn.completedAt)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Transactions;
