import React, { useEffect, Suspense, lazy, useState } from 'react';
// @ts-ignore
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useSeo } from './seo/useSeo';
import SchoolFeaturePage, { SCHOOL_PAGE_PATHS } from './pages/school/SchoolFeaturePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import PageLoader from './components/PageLoader';
import SplashScreen from './components/SplashScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

// Lazy load pages for performance optimization
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Courses = lazy(() => import('./pages/Courses'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const AppShowcase = lazy(() => import('./pages/AppShowcase'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const Investors = lazy(() => import('./pages/Investors'));
const GetStarted = lazy(() => import('./pages/GetStarted'));
const Pricing = lazy(() => import('./pages/Pricing'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const CareerRoadmap = lazy(() => import('./pages/CareerRoadmap'));
const LearningHub = lazy(() => import('./pages/LearningHub'));
const Settings = lazy(() => import('./pages/Settings'));

// Handle route changes: scroll to top, keep <head> in sync, and migrate
// legacy HashRouter links (/#/about) to real paths (/about). Path routing is
// what lets each public page have its own URL, title and canonical for search
// engines and social previews — with HashRouter the whole site was one URL.
const RouteListener = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === '/' && hash.startsWith('#/')) {
      navigate(hash.slice(1), { replace: true });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, navigate]);

  useSeo(pathname);

  return null;
};

// Internal component to handle the loading check
const AppContent: React.FC = () => {
  const { loading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  // Fallback timeout: if the auth check hangs, show the app anyway.
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Every public page renders without the catalogue data (pages that use it
  // handle their own loading state), so the splash only waits for the auth
  // check — holding first paint for a Supabase round-trip cost seconds of LCP
  // on marketing pages.
  const isAppReady = !authLoading || timedOut;

  return (
    <>
      {/* Splash Screen Overlay - Stays mounted until onComplete triggers (after fade out) */}
      {showSplash && (
        <SplashScreen
          isReady={isAppReady}
          onComplete={() => setShowSplash(false)}
        />
      )}

      {/* Main Application Structure - Rendered immediately so it's ready behind the splash */}
      <Router>
        <RouteListener />
        <div
          className={`flex flex-col min-h-screen relative bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 ${showSplash ? 'h-screen overflow-hidden' : ''}`}
        >
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950"></div>}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/app" element={<AppShowcase />} />
                <Route path="/school-app" element={<Navigate to="/school-management" replace />} />
                {SCHOOL_PAGE_PATHS.map((p) => <Route key={p} path={p} element={<SchoolFeaturePage />} />)}
                <Route path="/roadmap-2030" element={<CareerRoadmap />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPostDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/investors" element={<Investors />} />
                <Route path="/get-started" element={<GetStarted />} />
                <Route path="/pricing" element={<Pricing />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />

                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />

                <Route path="/learning-hub" element={
                  <ProtectedRoute>
                    <LearningHub />
                  </ProtectedRoute>
                } />

                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/admin" element={<Navigate to="/admin" replace />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ChatBot />
        </div>
      </Router>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;