import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CreditCard,
    Send,
    History,
    Settings,
    User,
    LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const SENTRA_LOGO = 'https://media.licdn.com/dms/image/v2/D560BAQHjI7tQ8oVfeA/company-logo_100_100/B56ZccO1rmG0AQ-/0/1748525342204/sentrapay_logo?e=1767225600&v=beta&t=r4MrSr8uA10ejGK3sLP-72eJah-yY1ASAZEnrOOZwV8';

interface NavItem {
    icon: React.ReactNode;
    label: string;
    path: string;
}

const mainNavItems: NavItem[] = [
    { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <CreditCard className="w-4 h-4" />, label: 'Virtual Accounts', path: '/virtual-accounts' },
    { icon: <Send className="w-4 h-4" />, label: 'Withdraw', path: '/withdrawal' },
    { icon: <History className="w-4 h-4" />, label: 'Transactions', path: '/transactions' },
];

const bottomNavItems: NavItem[] = [
    { icon: <Settings className="w-4 h-4" />, label: 'Settings', path: '/settings' },
    { icon: <User className="w-4 h-4" />, label: 'Profile', path: '/profile' },
];

const Sidebar: React.FC = () => {
    const { logout } = useApp();

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout();
            window.location.href = '/';
        }
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col z-40 shadow-sm">
            {/* Logo */}
            <div className="p-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <img
                        src={SENTRA_LOGO}
                        alt="Sentra"
                        className="w-10 h-10 rounded-lg object-cover shadow-sm"
                    />
                    <div>
                        <h1 className="text-[15px] font-bold text-slate-900">Sentra</h1>
                        <span className="inline-block text-[9px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Prototype
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Menu</p>
                {mainNavItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${isActive
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Navigation */}
            <div className="p-3 border-t border-slate-100 space-y-1">
                <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account</p>
                {bottomNavItems.map((item) => {
                    const isDisabled = item.path === '/settings';

                    if (isDisabled) {
                        return (
                            <div key={item.path} className="relative group">
                                <button
                                    type="button"
                                    title="Not available in prototype"
                                    onClick={(e) => e.preventDefault()}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-400 bg-slate-50 cursor-not-allowed"
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded bg-slate-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                    Not available in prototype
                                </div>
                            </div>
                        );
                    }

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${isActive
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    );
                })}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
