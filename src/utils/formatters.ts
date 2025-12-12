// Format currency with symbol
export const formatCurrency = (amount: number, currency: 'USD' | 'EUR' | 'INR'): string => {
    const symbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        INR: '₹',
    };

    return `${symbols[currency]}${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

// Format date
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// Format date with time
export const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Mask account number (show last 4 digits)
export const maskAccountNumber = (accountNumber: string): string => {
    if (accountNumber.length <= 4) return accountNumber;
    return '****' + accountNumber.slice(-4);
};

// Validate IFSC code (Indian format: 4 letters + 0 + 6 alphanumeric)
export const validateIFSC = (ifsc: string): boolean => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc.toUpperCase());
};

// Validate account number (numeric, 9-18 digits)
export const validateAccountNumber = (accountNumber: string): boolean => {
    const accountRegex = /^\d{9,18}$/;
    return accountRegex.test(accountNumber);
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
};

// Generate transaction ID
export const generateTransactionId = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN${timestamp}${random}`;
};

// Calculate withdrawal details
export const calculateWithdrawal = (
    amount: number,
    currency: 'USD' | 'EUR',
    exchangeRates: { USD_INR: number; EUR_INR: number }
) => {
    const baseFee = 1;
    const variableFee = amount * 0.005;
    const totalFee = baseFee + variableFee;
    const netAmount = amount - totalFee;
    const rate = currency === 'USD' ? exchangeRates.USD_INR : exchangeRates.EUR_INR;
    const amountInINR = netAmount * rate;

    return {
        amount,
        currency,
        baseFee,
        variableFee,
        totalFee,
        netAmount,
        exchangeRate: rate,
        amountInINR,
    };
};
