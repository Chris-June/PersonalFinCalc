import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ROUTES } from './lib/constants';
import { Login } from './pages/auth/login';
import { Verify } from './pages/auth/verify';
import { Dashboard } from './pages/dashboard';
import { NetWorth } from './pages/net-worth';
import { Budget } from './pages/budget';
import { Investments } from './pages/investments';
import { Loans } from './pages/loans';
import { Amortization } from './pages/amortization';
import { Documents } from './pages/documents';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/verify" element={<Verify />} />
      <Route
        path={ROUTES.dashboard}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.netWorth}
        element={
          <ProtectedRoute>
            <NetWorth />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.budget}
        element={
          <ProtectedRoute>
            <Budget />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.investments}
        element={
          <ProtectedRoute>
            <Investments />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.loans}
        element={
          <ProtectedRoute>
            <Loans />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.amortization}
        element={
          <ProtectedRoute>
            <Amortization />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.documents}
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}