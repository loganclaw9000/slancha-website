import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
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
const Webhooks = lazy(() => import('./components/dashboard/Webhooks'));
const RequestLogs = lazy(() => import('./components/dashboard/RequestLogs'));
const ModelsRouting = lazy(() => import('./components/dashboard/ModelsRouting'));
const Evaluations = lazy(() => import('./components/dashboard/Evaluations'));
const FineTuning = lazy(() => import('./components/dashboard/FineTuning'));
const Optimization = lazy(() => import('./components/dashboard/Optimization'));
const TeamManagement = lazy(() => import('./components/dashboard/TeamManagement'));
const Deployments = lazy(() => import('./components/dashboard/Deployments'));
const Datasets = lazy(() => import('./components/dashboard/Datasets'));
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
const VerticalLanding = lazy(() => import('./pages/VerticalLanding'));
const CompetitorCompare = lazy(() => import('./pages/CompetitorCompare'));
const Resources = lazy(() => import('./pages/Resources'));
const Glossary = lazy(() => import('./pages/Glossary'));
const Developers = lazy(() => import('./pages/Developers'));
const PilotProgram = lazy(() => import('./pages/PilotProgram'));
const Architecture = lazy(() => import('./pages/Architecture'));
const SdkReference = lazy(() => import('./pages/SdkReference'));
const ApiReference = lazy(() => import('./pages/ApiReference'));

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
      <ScrollToTop />
      <ErrorBoundary>
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
          <Route path="/solutions/:vertical" element={<VerticalLanding />} />
          <Route path="/vs/:competitor" element={<CompetitorCompare />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/pilot" element={<PilotProgram />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/developers/sdk" element={<SdkReference />} />
          <Route path="/developers/api" element={<ApiReference />} />

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
            <Route path="logs" element={<RequestLogs />} />
            <Route path="models" element={<ModelsRouting />} />
            <Route path="evals" element={<Evaluations />} />
            <Route path="fine-tuning" element={<FineTuning />} />
            <Route path="optimization" element={<Optimization />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="deployments" element={<Deployments />} />
            <Route path="datasets" element={<Datasets />} />
            <Route path="webhooks" element={<Webhooks />} />
            <Route path="settings" element={<AccountSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </Router>
  </AuthProvider>
);

export default App;
