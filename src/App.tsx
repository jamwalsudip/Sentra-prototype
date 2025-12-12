import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import MobileBlocker from './components/MobileBlocker';

// Pages
import Landing from './pages/Landing';
import KYC from './pages/KYC';
import Dashboard from './pages/Dashboard';
import VirtualAccounts from './pages/VirtualAccounts';
import BankAccounts from './pages/BankAccounts';
import Withdrawal from './pages/Withdrawal';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnboarded } = useApp();

  if (!isOnboarded) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// App Routes
const AppRoutes: React.FC = () => {
  const { isOnboarded } = useApp();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={isOnboarded ? <Navigate to="/dashboard" replace /> : <Landing />}
      />
      <Route path="/kyc" element={<KYC />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/virtual-accounts"
        element={
          <ProtectedRoute>
            <VirtualAccounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bank-accounts"
        element={
          <ProtectedRoute>
            <BankAccounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/withdrawal"
        element={
          <ProtectedRoute>
            <Withdrawal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to dashboard or landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <MobileBlocker>
      <BrowserRouter>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    </MobileBlocker>
  );
};

export default App;
