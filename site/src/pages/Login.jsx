import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import usePageMeta from '../hooks/usePageMeta';
import Nav from '../components/Nav';
import './Auth.css';

export default function Login() {
  usePageMeta({ title: 'Log In', description: 'Log in to your Slancha account to access your dashboard, API keys, and model management tools.' });
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(form.email, form.password);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <div className="page">
      <Nav backLink />
      <main className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Sign in to Slancha</h1>
          <p className="auth-subtitle">Access your dashboard and API keys</p>

          <button className="auth-oauth-btn" onClick={handleGoogle} type="button">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div className="auth-divider"><span>or</span></div>

          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error" role="alert">{error}</div>}

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email</label>
              <input className="auth-input" id="email" name="email" type="email" placeholder="you@company.com" required value={form.email} onChange={handleChange} />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <input className="auth-input" id="password" name="password" type="password" placeholder="Your password" required value={form.password} onChange={handleChange} />
            </div>

            <div className="auth-forgot">
              <Link to="/reset-password">Forgot password?</Link>
            </div>

            <button className="btn-primary btn-lg auth-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/signup">Sign up free</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
