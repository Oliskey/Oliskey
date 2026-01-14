import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Courses from './pages/Courses';
import Portfolio from './pages/Portfolio';
import AppShowcase from './pages/AppShowcase';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Investors from './pages/Investors';
import GetStarted from './pages/GetStarted';
import NotFound from './pages/NotFound';
import ChatBot from './components/ChatBot';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen relative">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/app" element={<AppShowcase />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <ChatBot />
      </div>
    </Router>
  );
};

export default App;