import React, { useEffect, Suspense, lazy, useState } from 'react';
// @ts-ignore
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import PageLoader from './components/PageLoader';
import SplashScreen from './components/SplashScreen'; 
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext'; 
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Lazy load pages for performance optimization
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Courses = lazy(() => import('./pages/Courses'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const AppShowcase = lazy(() => import('./pages/AppShowcase'));
const SchoolApp = lazy(() => import('./pages/SchoolApp')); // New Page
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const Investors = lazy(() => import('./pages/Investors'));
const GetStarted = lazy(() => import('./pages/GetStarted'));
const Pricing = lazy(() => import('./pages/Pricing'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Internal component to handle the loading check
const AppContent: React.FC = () => {
  const { loading: authLoading } = useAuth();
  const { loading: dataLoading } = useData();
  const [showSplash, setShowSplash] = useState(true);

  // Determine if the app is fully ready
  const isAppReady = !authLoading && !dataLoading;

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
        <ScrollToTop />
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
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/app" element={<AppShowcase />} />
                <Route path="/school-app" element={<SchoolApp />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/investors" element={<Investors />} />
                <Route path="/get-started" element={<GetStarted />} />
                <Route path="/pricing" element={<Pricing />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

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