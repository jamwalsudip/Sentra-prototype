import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-slate-100">
            <Sidebar />
            <div className="ml-60">
                <Header title={title} subtitle={subtitle} />
                <main className="p-6">
                    <div className="max-w-6xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
