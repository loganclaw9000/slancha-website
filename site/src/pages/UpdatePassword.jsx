import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import usePageMeta from '../hooks/usePageMeta';
import Nav from '../components/Nav';
import './Auth.css';

export default function UpdatePassword() {
  usePageMeta({ title: 'Update Password', description: 'Set a new password for your Slancha account.' });
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(form.password);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="page">
      <Nav backLink />
      <main id="main-content" className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Set new password</h1>
          <p className="auth-subtitle">Choose a strong password for your account.</p>

          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error" role="alert">{error}</div>}

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">New password</label>
              <input className="auth-input" id="password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" required minLength={8} value={form.password} onChange={handleChange} />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="confirmPassword">Confirm password</label>
              <input className="auth-input" id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Confirm your password" required value={form.confirmPassword} onChange={handleChange} />
            </div>

            <button className="btn-primary btn-lg auth-submit" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
