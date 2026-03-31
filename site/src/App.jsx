import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Overview from './components/dashboard/Overview';
import ApiKeys from './components/dashboard/ApiKeys';
import UsageStats from './components/dashboard/UsageStats';
import Billing from './components/dashboard/Billing';
import AccountSettings from './components/dashboard/AccountSettings';
import NotFound from './pages/NotFound';

const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Docs = lazy(() => import('./pages/Docs'));
const FAQ = lazy(() => import('./pages/FAQ'));
const VsCompetitors = lazy(() => import('./pages/VsCompetitors'));

function Loading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="auth-spinner" />
    </div>
  );
}

const App = () => (
  <AuthProvider>
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public marketing */}
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />

          {/* Blog & Docs (lazy loaded) */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/docs/:slug" element={<Docs />} />

          {/* FAQ & Comparison pages */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/vs-competitors" element={<VsCompetitors />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected dashboard with nested routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          }>
            <Route index element={<Overview />} />
            <Route path="keys" element={<ApiKeys />} />
            <Route path="usage" element={<UsageStats />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<AccountSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  </AuthProvider>
);

export default App;
