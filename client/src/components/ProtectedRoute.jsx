import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Route protection wrapper.
 * Prevents access to dashboard and results for unauthenticated sessions.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-darkBg flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Animated spinner */}
          <div className="relative flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-brand-600 dark:text-brand-400 animate-spin" />
            <div className="absolute h-16 w-16 rounded-full border border-dashed border-brand-500/20 animate-pulse-slow"></div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide animate-pulse">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
