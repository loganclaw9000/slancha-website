import { Link, useLocation } from 'react-router-dom';
import Nav from '../components/Nav';
import usePageMeta from '../hooks/usePageMeta';
import './Auth.css';

export default function VerifyEmail() {
  usePageMeta({ title: 'Verify Your Email', description: 'Check your email for a confirmation link to activate your Slancha account.' });
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className="page">
      <Nav backLink />
      <main className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-icon">&#9993;</div>
          <h1 className="auth-title">Check your email</h1>
          <p className="auth-subtitle">
            We sent a confirmation link to{' '}
            {email ? <strong>{email}</strong> : 'your email address'}.
            Click the link to activate your account.
          </p>
          <p className="auth-subtitle" style={{ marginTop: '8px', fontSize: '14px' }}>
            Didn't receive it? Check your spam folder or try signing up again.
          </p>
          <Link to="/login" className="btn-secondary btn-lg auth-submit" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '24px' }}>
            Back to sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
