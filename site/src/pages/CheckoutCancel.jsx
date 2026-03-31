import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';

export default function CheckoutCancel() {
  usePageMeta({ title: 'Checkout Cancelled', description: 'Your checkout was cancelled. No charges were made. Return to pricing whenever you\'re ready.' });
  return (
    <div className="page">
      <Nav />
      <main style={{ paddingTop: 80, minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 520, padding: '0 24px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>
            Checkout cancelled
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.7 }}>
            No worries — nothing was charged. You can return to pricing whenever you're ready, or talk to our team if you have questions.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/pricing" className="btn-primary btn-lg">Back to Pricing</Link>
            <Link to="/contact" className="btn-secondary btn-lg">Talk to Sales</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
