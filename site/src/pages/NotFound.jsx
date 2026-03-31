import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './NotFound.css';

export default function NotFound() {
  usePageMeta({ title: 'Page Not Found', description: 'The page you are looking for does not exist. Return to Slancha to explore our AI inference platform.' });
  return (
    <div className="page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <main id="main-content" className="notfound">
        <div className="notfound__inner">
          <span className="notfound__code">404</span>
          <h1 className="notfound__heading">Page not found</h1>
          <p className="notfound__body">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="notfound__btn">Back to home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
