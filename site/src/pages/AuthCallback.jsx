import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.exchangeCodeForSession(window.location.href).then(({ error }) => {
      if (error) {
        if (import.meta.env.DEV) console.error('Auth callback error:', error);
        navigate('/login', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="auth-loading" role="status" aria-label="Signing in">
      <div className="auth-spinner" aria-hidden="true" />
      <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>Signing you in...</p>
    </div>
  );
}
