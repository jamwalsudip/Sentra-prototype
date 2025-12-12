import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    onClose,
    duration = 4000,
}) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300);
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-600" />,
        error: <AlertCircle className="w-5 h-5 text-red-600" />,
        info: <Info className="w-5 h-5 text-indigo-600" />,
    };

    const styles = {
        success: 'bg-white border-l-4 border-l-emerald-500',
        error: 'bg-white border-l-4 border-l-red-500',
        info: 'bg-white border-l-4 border-l-indigo-500',
    };

    return (
        <div className="fixed top-6 right-6 z-[100]">
            <div
                className={`${styles[type]} ${isExiting ? 'toast-exit' : 'toast-enter'
                    } flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border border-slate-100 min-w-[280px] max-w-md`}
            >
                <div className="flex-shrink-0">
                    {icons[type]}
                </div>
                <p className="flex-1 text-[13px] text-slate-900 font-medium">{message}</p>
                <button
                    onClick={handleClose}
                    className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
