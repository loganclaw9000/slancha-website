import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import usePageMeta from '../hooks/usePageMeta';
import Nav from '../components/Nav';
import './Auth.css';

export default function ResetPassword() {
  usePageMeta({ title: 'Reset Password', description: 'Reset your Slancha account password.' });
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await resetPassword(email);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Nav backLink />
      <main id="main-content" className="auth-page">
        <div className="auth-card">
          {sent ? (
            <>
              <h1 className="auth-title">Check your email</h1>
              <p className="auth-subtitle">
                We sent a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.
              </p>
              <Link to="/login" className="btn-primary btn-lg auth-submit" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                Back to sign in
              </Link>
            </>
          ) : (
            <>
              <h1 className="auth-title">Reset your password</h1>
              <p className="auth-subtitle">Enter your email and we'll send you a reset link.</p>

              <form onSubmit={handleSubmit}>
                {error && <div className="auth-error" role="alert">{error}</div>}

                <div className="auth-field">
                  <label className="auth-label" htmlFor="email">Email</label>
                  <input className="auth-input" id="email" type="email" autoComplete="email" placeholder="you@company.com" required value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} />
                </div>

                <button className="btn-primary btn-lg auth-submit" type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="auth-footer-text">
                Remember your password? <Link to="/login">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
