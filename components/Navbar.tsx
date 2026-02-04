import React, { useState, useEffect } from 'react';
import { Search, User, LogOut, LayoutDashboard, ChevronRight, ArrowRight, Sun, Moon } from 'lucide-react';
// @ts-ignore
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchModal from './SearchModal';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Detect scroll for subtle border effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Products', path: '/#products' },
    { name: 'About', path: '/about' },
    { name: 'Investors', path: '/investors' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToProducts: true } });
    } else {
      const element = document.getElementById('products');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
    setIsOpen(false);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const openSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSearchOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Don't show navbar on login/signup pages for cleaner look
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  // Determine Logo variant based on theme
  const logoVariant = theme === 'dark' ? 'light' : 'dark';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${scrolled || isOpen
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 shadow-sm'
          : 'bg-white/0 dark:bg-slate-950/0 backdrop-blur-none border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <a
              href="/"
              onClick={handleLogoClick}
              className="flex items-center flex-shrink-0 mr-8 z-[70] cursor-pointer select-none relative"
            >
              <Logo className="h-10 md:h-12" variant={logoVariant} animated={true} />
            </a>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center px-4 py-2 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all duration-200 group"
              >
                <Search size={18} className="mr-3 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors" />
                <span className="text-sm font-medium">Search products, courses...</span>
                <span className="ml-auto text-xs bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-gray-200 dark:border-slate-700 text-slate-400 dark:text-slate-500">Ctrl K</span>
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8 ml-4">
              {navLinks.map((link) => (
                link.name === 'Products' ? (
                  <a
                    key={link.name}
                    href="#products"
                    onClick={handleProductClick}
                    className="text-sm font-medium tracking-wide text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium tracking-wide transition-colors duration-300 ${isActive(link.path)
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {user ? (
                <div className="flex items-center gap-4 border-l border-gray-200 dark:border-slate-800 pl-6">
                  <Link to="/dashboard" className="flex items-center gap-2 group" aria-label="Dashboard">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata?.full_name || "User Profile"}
                        className="w-10 h-10 rounded-full border-2 border-gray-100 dark:border-slate-700 hover:border-blue-500 transition-all object-cover shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:border-blue-500 group-hover:text-blue-600 transition-all shadow-sm">
                        <span className="font-bold text-sm">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold tracking-wide hover:bg-blue-600 dark:hover:bg-blue-300 transition-colors duration-300 shadow-lg shadow-slate-900/20"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-4 z-[70]">
              {/* Search Button Mobile */}
              <button
                onClick={openSearch}
                className={`p-2 transition-all duration-300 active:scale-95 touch-manipulation ${isOpen ? 'opacity-0 translate-x-4 pointer-events-none' : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 opacity-100 translate-x-0'}`}
                aria-label="Search"
              >
                <Search size={24} strokeWidth={2} />
              </button>

              {/* Animated Hamburger Icon */}
              <button
                onClick={toggleMenu}
                className="p-2 text-slate-900 dark:text-white focus:outline-none active:scale-95 touch-manipulation"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                <div className="w-6 h-5 relative flex flex-col justify-between">
                  <span className={`w-full h-[2.5px] bg-slate-900 dark:bg-white rounded-full transform transition-all duration-300 ease-in-out origin-center ${isOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
                  <span className={`w-full h-[2.5px] bg-slate-900 dark:bg-white rounded-full transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 translate-x-4' : 'opacity-100'}`} />
                  <span className={`w-full h-[2.5px] bg-slate-900 dark:bg-white rounded-full transform transition-all duration-300 ease-in-out origin-center ${isOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Full Screen Overlay */}
      <div
        className={`fixed inset-0 bg-white dark:bg-slate-950 z-[55] md:hidden flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen
          ? 'opacity-100 translate-y-0 visible'
          : 'opacity-0 -translate-y-4 invisible pointer-events-none'
          }`}
      >
        {/* Menu Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-[0.02] pointer-events-none z-0">
          <Logo showText={false} className="w-full h-full text-slate-900 dark:text-white" animated={true} />
        </div>

        <div className="flex flex-col h-full relative z-10 overflow-y-auto">
          {/* Spacer for Header */}
          <div className="h-24 flex-shrink-0"></div>

          {/* Search in Menu */}
          <div className="px-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <button
              onClick={() => { setIsOpen(false); setIsSearchOpen(true); }}
              className="w-full flex items-center px-5 py-4 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-blue-200 transition-colors"
            >
              <Search size={20} className="mr-3 text-slate-400 dark:text-slate-500" />
              <span className="text-base">Search...</span>
            </button>
          </div>

          {/* Main Links */}
          <div className="px-6 flex flex-col space-y-4 flex-grow">
            {navLinks.map((link, index) => (
              <div
                key={link.name}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
              >
                {link.name === 'Products' ? (
                  <a
                    href="#products"
                    onClick={handleProductClick}
                    className="group flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-800"
                  >
                    <span className="text-3xl font-bold text-slate-900 dark:text-white group-active:text-blue-600 dark:group-active:text-blue-400 tracking-tight transition-colors">{link.name}</span>
                    <ChevronRight size={24} className="text-slate-300 dark:text-slate-700 group-active:text-blue-600 transition-colors" />
                  </a>
                ) : (
                  <Link
                    to={link.path}
                    className={`group flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-800 ${isActive(link.path) ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'
                      }`}
                  >
                    <span className="text-3xl font-bold tracking-tight group-active:text-blue-600 transition-colors">{link.name}</span>
                    {isActive(link.path) && <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-400 rounded-full shadow-sm"></div>}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-white dark:bg-slate-950 mt-auto animate-fade-in-up border-t border-gray-50 dark:border-slate-800" style={{ animationDelay: '0.4s' }}>

            {/* Theme Toggle in Menu */}
            <div className="flex items-center justify-between mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
              <span className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span
                  className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>

            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-800 shadow-sm object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm">
                      <span className="font-bold text-xl">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-base">{user.user_metadata?.full_name || 'User'}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-base tracking-wide active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                  >
                    <LayoutDashboard size={20} /> Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-base border-2 border-gray-100 dark:border-slate-800 tracking-wide active:scale-95 transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <LogOut size={20} /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    className="flex items-center justify-center w-full py-4 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-gray-100 dark:border-slate-800 font-bold text-base tracking-wide active:scale-95 transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-base tracking-wide active:scale-95 transition-all shadow-xl shadow-slate-900/20 group"
                  >
                    Sign Up <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0; /* Start hidden for stagger */
        }
      `}</style>
    </>
  );
};

export default Navbar;