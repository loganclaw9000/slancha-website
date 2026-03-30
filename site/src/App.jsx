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
import Dashboard from './pages/Dashboard';
import Overview from './components/dashboard/Overview';
import ApiKeys from './components/dashboard/ApiKeys';
import UsageStats from './components/dashboard/UsageStats';
import AccountSettings from './components/dashboard/AccountSettings';
import NotFound from './pages/NotFound';

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

          {/* Protected dashboard with nested routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          }>
            <Route index element={<Overview />} />
            <Route path="keys" element={<ApiKeys />} />
            <Route path="usage" element={<UsageStats />} />
            <Route path="settings" element={<AccountSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  </AuthProvider>
);

export default App;
