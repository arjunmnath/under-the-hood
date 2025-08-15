'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import LogsDashboard from '@/components/LogsDashboard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <LogsDashboard /> : <LoginForm />;
}