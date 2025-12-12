import type { User, VirtualAccount, LocalBankAccount, Transaction, BankOption, ExchangeRates } from '../types';

// Exchange rates (prototype values)
export const EXCHANGE_RATES: ExchangeRates = {
    USD_INR: 88,
    EUR_INR: 92,
};

// Fee structure
export const FEE_STRUCTURE = {
    baseFee: 1, // $1
    variableRate: 0.005, // 0.5%
};

// Calculate fee
export const calculateFee = (amount: number): number => {
    return FEE_STRUCTURE.baseFee + (amount * FEE_STRUCTURE.variableRate);
};

// Indian Banks
export const INDIAN_BANKS: BankOption[] = [
    { name: 'State Bank of India', code: 'SBI' },
    { name: 'HDFC Bank', code: 'HDFC' },
    { name: 'ICICI Bank', code: 'ICICI' },
    { name: 'Axis Bank', code: 'AXIS' },
    { name: 'Punjab National Bank', code: 'PNB' },
    { name: 'Bank of Baroda', code: 'BOB' },
    { name: 'Kotak Mahindra Bank', code: 'KOTAK' },
    { name: 'Yes Bank', code: 'YES' },
    { name: 'IndusInd Bank', code: 'INDUSIND' },
    { name: 'Union Bank of India', code: 'UNION' },
    { name: 'Canara Bank', code: 'CANARA' },
    { name: 'Bank of India', code: 'BOI' },
    { name: 'Indian Bank', code: 'INDIAN' },
    { name: 'Central Bank of India', code: 'CENTRAL' },
    { name: 'IDBI Bank', code: 'IDBI' },
];

// Default user for prototype
export const DEFAULT_USER: User = {
    id: 'user-001',
    fullName: 'Sudip S Jamwal',
    email: 'sudip@sentra.com',
    phone: '+91 9876543210',
    dateOfBirth: '1995-06-15',
    address: 'Bangalore, Karnataka, India',
    country: 'IN',
    kycStatus: 'verified',
    createdAt: '2025-01-15T10:00:00Z',
};

// Default virtual accounts
export const DEFAULT_VIRTUAL_ACCOUNTS: VirtualAccount[] = [
    {
        id: 'va-usd-001',
        userId: 'user-001',
        currency: 'USD',
        balance: 12450.00,
        accountNumber: '8829104756',
        routingNumber: '026009593',
        bankName: 'JPMorgan Chase',
        swiftBic: 'CHASUS33',
        accountHolderName: 'Sudip S Jamwal',
    },
    {
        id: 'va-eur-001',
        userId: 'user-001',
        currency: 'EUR',
        balance: 8320.00,
        accountNumber: '4421098763',
        iban: 'DE89370400440532013000',
        bankName: 'Deutsche Bank',
        swiftBic: 'DEUTDEFF',
        accountHolderName: 'Sudip S Jamwal',
    },
];

// Default local bank accounts
export const DEFAULT_LOCAL_BANK_ACCOUNTS: LocalBankAccount[] = [
    {
        id: 'lba-001',
        userId: 'user-001',
        bankName: 'HDFC Bank',
        accountNumber: '50100123456789',
        ifscCode: 'HDFC0001234',
        accountHolderName: 'Sudip S Jamwal',
        accountType: 'savings',
        isDefault: true,
        createdAt: '2025-01-20T10:00:00Z',
    },
    {
        id: 'lba-002',
        userId: 'user-001',
        bankName: 'State Bank of India',
        accountNumber: '30987654321012',
        ifscCode: 'SBIN0005678',
        accountHolderName: 'Sudip S Jamwal',
        accountType: 'savings',
        isDefault: false,
        createdAt: '2025-02-10T10:00:00Z',
    },
];

// Default transactions
export const DEFAULT_TRANSACTIONS: Transaction[] = [
    {
        id: 'txn-001',
        userId: 'user-001',
        type: 'received',
        sourceAccountId: 'va-usd-001',
        amountSource: 2500.00,
        currencySource: 'USD',
        fee: 0,
        status: 'completed',
        description: 'Client XYZ Corp',
        createdAt: '2025-12-10T14:30:00Z',
        completedAt: '2025-12-10T14:35:00Z',
    },
    {
        id: 'txn-002',
        userId: 'user-001',
        type: 'withdrawal',
        sourceAccountId: 'va-usd-001',
        destinationAccountId: 'lba-001',
        amountSource: 1000.00,
        currencySource: 'USD',
        amountDestination: 87560.00,
        currencyDestination: 'INR',
        exchangeRate: 88,
        fee: 6.00,
        status: 'completed',
        description: 'HDFC Bank',
        createdAt: '2025-12-08T10:15:00Z',
        completedAt: '2025-12-09T09:00:00Z',
    },
    {
        id: 'txn-003',
        userId: 'user-001',
        type: 'received',
        sourceAccountId: 'va-usd-001',
        amountSource: 850.00,
        currencySource: 'USD',
        fee: 0,
        status: 'completed',
        description: 'Upwork',
        createdAt: '2025-12-05T16:45:00Z',
        completedAt: '2025-12-05T16:50:00Z',
    },
    {
        id: 'txn-004',
        userId: 'user-001',
        type: 'withdrawal',
        sourceAccountId: 'va-usd-001',
        destinationAccountId: 'lba-002',
        amountSource: 500.00,
        currencySource: 'USD',
        amountDestination: 43736.00,
        currencyDestination: 'INR',
        exchangeRate: 88,
        fee: 3.50,
        status: 'pending',
        description: 'State Bank of India',
        createdAt: '2025-12-03T11:20:00Z',
    },
    {
        id: 'txn-005',
        userId: 'user-001',
        type: 'received',
        sourceAccountId: 'va-eur-001',
        amountSource: 1200.00,
        currencySource: 'EUR',
        fee: 0,
        status: 'completed',
        description: 'Toptal EU',
        createdAt: '2025-11-28T09:00:00Z',
        completedAt: '2025-11-28T09:10:00Z',
    },
    {
        id: 'txn-006',
        userId: 'user-001',
        type: 'received',
        sourceAccountId: 'va-eur-001',
        amountSource: 3500.00,
        currencySource: 'EUR',
        fee: 0,
        status: 'completed',
        description: 'Freelance Project',
        createdAt: '2025-11-20T12:00:00Z',
        completedAt: '2025-11-20T12:05:00Z',
    },
];

// Competitor rates for comparison (hypothetical)
export const COMPETITOR_RATES = {
    USD_INR: {
        wise: 86.5,
        paypal: 85.2,
        westernUnion: 84.8,
        sentra: 88,
    },
    EUR_INR: {
        wise: 90.5,
        paypal: 89.2,
        westernUnion: 88.5,
        sentra: 92,
    },
};

// Countries supported (for future expansion)
export const SUPPORTED_COUNTRIES = [
    { code: 'IN', name: 'India', currency: 'INR', flag: '🇮🇳' },
    // Future: UK, US, Germany, etc.
];

// Generate unique ID
export const generateId = (prefix: string): string => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
