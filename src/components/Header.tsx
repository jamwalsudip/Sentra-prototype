import React from 'react';
import { Bell } from 'lucide-react';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    return (
        <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">{title}</h1>
                    {subtitle && (
                        <p className="text-[13px] text-slate-500 mt-0.5">{subtitle}</p>
                    )}
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
