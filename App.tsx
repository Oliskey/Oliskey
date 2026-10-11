import React, { useEffect, Suspense, lazy, useState } from 'react';
// @ts-ignore
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate, useNavigationType } from 'react-router-dom';
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
const Products = lazy(() => import('./pages/Products'));
const FleetProductPage = lazy(() => import('./pages/FleetProductPage'));
const ProductOperations = lazy(() => import('./pages/ProductOperations'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const CareerRoadmap = lazy(() => import('./pages/CareerRoadmap'));
const LearningHub = lazy(() => import('./pages/LearningHub'));
const Settings = lazy(() => import('./pages/Settings'));

// Handle legacy HashRouter links (/#/about) and keep <head> in sync.
// Ordinary route changes intentionally preserve the visitor's scroll position.
// Path routing gives each public page its own URL, title and canonical for SEO.
// Keep scroll positions per history entry so Back/Forward restores where the visitor left off.
const routeScrollPositions = new Map<string, number>();

const RouteListener = () => {
  const location = useLocation();
  const { pathname, hash, key } = location;
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  // Keep legacy HashRouter links working (for example, /#/about -> /about).
  useEffect(() => {
    if (pathname === '/' && hash.startsWith('#/')) {
      navigate(hash.slice(1), { replace: true });
    }
  }, [pathname, hash, navigate]);

  // Remember the current entry's position, including while the user scrolls.
  useEffect(() => {
    const saveScrollPosition = () => {
      routeScrollPositions.set(key, window.scrollY);
    };

    window.addEventListener('scroll', saveScrollPosition, { passive: true });
    saveScrollPosition();

    return () => {
      saveScrollPosition();
      window.removeEventListener('scroll', saveScrollPosition);
    };
  }, [key]);

  // New navigation starts at the top. Back/Forward restores only after the
  // destination has enough layout height, including when its route is lazy-loaded.
  useEffect(() => {
    const targetY = navigationType === 'POP' ? routeScrollPositions.get(key) ?? 0 : 0;

    if (targetY <= 0) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    let settled = false;
    let cancelledByUser = false;
    let timeoutId = 0;

    const getMaxScrollY = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const restoreWhenReady = () => {
      if (settled || cancelledByUser) return;

      if (getMaxScrollY() >= targetY) {
        settled = true;
        window.scrollTo({ top: targetY, left: 0, behavior: 'auto' });
        window.clearTimeout(timeoutId);
      }
    };

    const cancelForUserInput = (event: Event) => {
      if (event.type === 'keydown') {
        const keyEvent = event as KeyboardEvent;
        if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(keyEvent.key)) return;
      }
      cancelledByUser = true;
      window.clearTimeout(timeoutId);
      observer.disconnect();
    };

    const observer = new ResizeObserver(restoreWhenReady);
    observer.observe(document.documentElement);
    if (document.body) observer.observe(document.body);

    window.addEventListener('wheel', cancelForUserInput, { passive: true, once: true });
    window.addEventListener('touchstart', cancelForUserInput, { passive: true, once: true });
    window.addEventListener('keydown', cancelForUserInput, { once: true });

    // A page whose content has genuinely become shorter restores to its nearest valid position.
    timeoutId = window.setTimeout(() => {
      if (!settled && !cancelledByUser) {
        settled = true;
        window.scrollTo({ top: Math.min(targetY, getMaxScrollY()), left: 0, behavior: 'auto' });
      }
      observer.disconnect();
    }, 1200);

    const firstFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(restoreWhenReady);
    });

    return () => {
      settled = true;
      window.cancelAnimationFrame(firstFrame);
      window.clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('wheel', cancelForUserInput);
      window.removeEventListener('touchstart', cancelForUserInput);
      window.removeEventListener('keydown', cancelForUserInput);
    };
  }, [key, navigationType]);

  // Use our history-entry positions instead of browser-dependent automatic restoration.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      const previousRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';
      return () => {
        window.history.scrollRestoration = previousRestoration;
      };
    }
  }, []);

  useSeo(pathname);

  return null;
};

// Route content is keyed by pathname so each destination gets a restrained entrance transition.
// RouteListener starts new visits at the top and restores saved positions for Back/Forward.
const RouteContent: React.FC = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const transitionClass = navigationType === 'POP' ? 'route-content-restore' : 'route-content-enter';
  return (
      <main className="flex-grow">
        <div key={pathname} className={transitionClass}>
            <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950"></div>}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/products" element={<Products />} />
                <Route path="/fleet-operations" element={<FleetProductPage />} />
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
                <Route path="/admin/products" element={
                  <AdminRoute>
                    <ProductOperations />
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
                  </div>
      </main>
  );
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
          <RouteContent />
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