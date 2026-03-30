import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';

const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Docs = lazy(() => import('./pages/Docs'));

function Loading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="auth-spinner" />
    </div>
  );
}

function DashboardPlaceholder() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text-secondary)' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', color: 'var(--text-primary)', marginBottom: '12px' }}>Dashboard</h1>
        <p>Your workspace is being built. Check back soon.</p>
      </div>
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
          <Route path="/contact" element={<Contact />} />

          {/* Blog & Docs (lazy loaded) */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/docs/:slug" element={<Docs />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected dashboard */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Dashboard child routes */}
          <Route path="/dashboard/overview" element={<Overview />} />
          <Route path="/dashboard/api-keys" element={<ApiKeys />} />
          <Route path="/dashboard/usage" element={<UsageStats />} />
          <Route path="/dashboard/settings" element={<AccountSettings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  </AuthProvider>
);

export default App;
