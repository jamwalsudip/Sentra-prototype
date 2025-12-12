import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LocalBankAccount, Transaction, AppState } from '../types';
import {
    DEFAULT_USER,
    DEFAULT_VIRTUAL_ACCOUNTS,
    DEFAULT_LOCAL_BANK_ACCOUNTS,
    DEFAULT_TRANSACTIONS,
    generateId,
} from '../data/mockData';

const STORAGE_KEY = 'sentra_app_state';
const DATA_VERSION = '2'; // Increment this when mock data changes

interface AppContextType extends AppState {
    // User actions
    setUser: (user: User) => void;
    skipKYC: () => void;
    resetApp: () => void;
    logout: () => void;

    // Bank account actions
    addBankAccount: (account: Omit<LocalBankAccount, 'id' | 'userId' | 'createdAt'>) => void;
    removeBankAccount: (id: string) => void;
    setDefaultBankAccount: (id: string) => void;

    // Transaction actions
    addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => void;
    updateTransactionStatus: (id: string, status: Transaction['status']) => void;

    // Virtual account actions
    updateVirtualAccountBalance: (id: string, newBalance: number) => void;
}

const defaultState: AppState = {
    user: null,
    virtualAccounts: [],
    localBankAccounts: [],
    transactions: [],
    isOnboarded: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Load state from localStorage
const loadState = (): AppState => {
    try {
        const savedVersion = localStorage.getItem('sentra_data_version');
        // If version mismatch, clear old data and use fresh defaults
        if (savedVersion !== DATA_VERSION) {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.setItem('sentra_data_version', DATA_VERSION);
            return defaultState;
        }
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load state from localStorage:', e);
    }
    return defaultState;
};

// Save state to localStorage
const saveState = (state: AppState) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Failed to save state to localStorage:', e);
    }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>(loadState);

    // Save to localStorage whenever state changes
    useEffect(() => {
        saveState(state);
    }, [state]);

    const setUser = (user: User) => {
        setState(prev => ({ ...prev, user }));
    };

    const skipKYC = () => {
        // Set up default data for prototype
        setState({
            user: DEFAULT_USER,
            virtualAccounts: DEFAULT_VIRTUAL_ACCOUNTS,
            localBankAccounts: DEFAULT_LOCAL_BANK_ACCOUNTS,
            transactions: DEFAULT_TRANSACTIONS,
            isOnboarded: true,
        });
    };

    const resetApp = () => {
        localStorage.removeItem(STORAGE_KEY);
        setState(defaultState);
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem('signup_name');
        sessionStorage.removeItem('signup_email');
        setState(defaultState);
    };

    const addBankAccount = (account: Omit<LocalBankAccount, 'id' | 'userId' | 'createdAt'>) => {
        const newAccount: LocalBankAccount = {
            ...account,
            id: generateId('lba'),
            userId: state.user?.id || 'user-001',
            createdAt: new Date().toISOString(),
        };
        setState(prev => ({
            ...prev,
            localBankAccounts: [...prev.localBankAccounts, newAccount],
        }));
    };

    const removeBankAccount = (id: string) => {
        setState(prev => ({
            ...prev,
            localBankAccounts: prev.localBankAccounts.filter(acc => acc.id !== id),
        }));
    };

    const setDefaultBankAccount = (id: string) => {
        setState(prev => ({
            ...prev,
            localBankAccounts: prev.localBankAccounts.map(acc => ({
                ...acc,
                isDefault: acc.id === id,
            })),
        }));
    };

    const addTransaction = (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: generateId('txn'),
            userId: state.user?.id || 'user-001',
            createdAt: new Date().toISOString(),
        };
        setState(prev => ({
            ...prev,
            transactions: [newTransaction, ...prev.transactions],
        }));
        return newTransaction;
    };

    const updateTransactionStatus = (id: string, status: Transaction['status']) => {
        setState(prev => ({
            ...prev,
            transactions: prev.transactions.map(txn =>
                txn.id === id
                    ? { ...txn, status, completedAt: status === 'completed' ? new Date().toISOString() : undefined }
                    : txn
            ),
        }));
    };

    const updateVirtualAccountBalance = (id: string, newBalance: number) => {
        setState(prev => ({
            ...prev,
            virtualAccounts: prev.virtualAccounts.map(va =>
                va.id === id ? { ...va, balance: newBalance } : va
            ),
        }));
    };

    return (
        <AppContext.Provider
            value={{
                ...state,
                setUser,
                skipKYC,
                resetApp,
                logout,
                addBankAccount,
                removeBankAccount,
                setDefaultBankAccount,
                addTransaction,
                updateTransactionStatus,
                updateVirtualAccountBalance,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
