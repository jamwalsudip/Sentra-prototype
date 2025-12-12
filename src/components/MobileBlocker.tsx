import React, { useState, useEffect } from 'react';

const MobileBlocker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px',
                textAlign: 'center',
                zIndex: 9999,
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    backdropFilter: 'blur(10px)',
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                </div>
                <h1 style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 700,
                    marginBottom: '12px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}>
                    Desktop Only
                </h1>
                <p style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '16px',
                    lineHeight: 1.6,
                    maxWidth: '320px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}>
                    This prototype is optimized for desktop viewing. Please switch to a laptop or desktop computer for the best experience.
                </p>
                <div style={{
                    marginTop: '32px',
                    padding: '12px 24px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                }}>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '13px',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}>
                        Minimum width: 768px
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default MobileBlocker;
