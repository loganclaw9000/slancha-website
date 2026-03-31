import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';

// Lazy load all non-landing pages for smaller initial bundle
const Contact = lazy(() => import('./pages/Contact'));
const Pricing = lazy(() => import('./pages/Pricing'));
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'));
const CheckoutCancel = lazy(() => import('./pages/CheckoutCancel'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Overview = lazy(() => import('./components/dashboard/Overview'));
const ApiKeys = lazy(() => import('./components/dashboard/ApiKeys'));
const UsageStats = lazy(() => import('./components/dashboard/UsageStats'));
const Billing = lazy(() => import('./components/dashboard/Billing'));
const AccountSettings = lazy(() => import('./components/dashboard/AccountSettings'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Docs = lazy(() => import('./pages/Docs'));
const FAQ = lazy(() => import('./pages/FAQ'));
const VsCompetitors = lazy(() => import('./pages/VsCompetitors'));
const UseCases = lazy(() => import('./pages/UseCases'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const Integrations = lazy(() => import('./pages/Integrations'));
const RoiCalculator = lazy(() => import('./pages/RoiCalculator'));
const Changelog = lazy(() => import('./pages/Changelog'));
const Playground = lazy(() => import('./pages/Playground'));
const Enterprise = lazy(() => import('./pages/Enterprise'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Security = lazy(() => import('./pages/Security'));
const Demo = lazy(() => import('./pages/Demo'));
const Benchmarks = lazy(() => import('./pages/Benchmarks'));
const Status = lazy(() => import('./pages/Status'));
const PricingCompare = lazy(() => import('./pages/PricingCompare'));

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
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/roi-calculator" element={<RoiCalculator />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/enterprise" element={<Enterprise />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/security" element={<Security />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/benchmarks" element={<Benchmarks />} />
          <Route path="/status" element={<Status />} />
          <Route path="/pricing/compare" element={<PricingCompare />} />

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
