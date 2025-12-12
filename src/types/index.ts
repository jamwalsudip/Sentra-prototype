// User types
export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    country: 'IN' | 'US' | 'UK' | 'DE'; // Expandable for future
    kycStatus: 'pending' | 'verified' | 'rejected';
    createdAt: string;
}

// Virtual Account types
export interface VirtualAccount {
    id: string;
    userId: string;
    currency: 'USD' | 'EUR';
    balance: number;
    accountNumber: string;
    routingNumber?: string; // USD only
    iban?: string; // EUR only
    bankName: string;
    swiftBic: string;
    accountHolderName: string;
}

// Local Bank Account types
export interface LocalBankAccount {
    id: string;
    userId: string;
    bankName: string;
    bankLogo?: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    accountType: 'savings' | 'current';
    isDefault: boolean;
    createdAt: string;
}

// Transaction types
export interface Transaction {
    id: string;
    userId: string;
    type: 'received' | 'withdrawal';
    sourceAccountId: string;
    destinationAccountId?: string;
    amountSource: number;
    currencySource: 'USD' | 'EUR';
    amountDestination?: number;
    currencyDestination?: 'INR';
    exchangeRate?: number;
    fee: number;
    status: 'pending' | 'completed' | 'failed';
    description: string;
    createdAt: string;
    completedAt?: string;
}

// Bank options for India
export interface BankOption {
    name: string;
    code: string;
    logo?: string;
}

// Exchange rates
export interface ExchangeRates {
    USD_INR: number;
    EUR_INR: number;
}

// App state
export interface AppState {
    user: User | null;
    virtualAccounts: VirtualAccount[];
    localBankAccounts: LocalBankAccount[];
    transactions: Transaction[];
    isOnboarded: boolean;
}
