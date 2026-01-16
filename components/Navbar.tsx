import React, { useState, useEffect } from 'react';
import { Menu, X, Search, User, LogOut, LayoutDashboard } from 'lucide-react';
// @ts-ignore
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchModal from './SearchModal';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

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
      // In v6, pass state via the second argument
      navigate('/', { state: { scrollToProducts: true } });
    } else {
      const element = document.getElementById('products');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Force a full page reload to the root URL if we are deep in the app
    if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        navigate('/');
    }
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
  };

  const isActive = (path: string) => location.pathname === path;

  // Don't show navbar on login/signup pages for cleaner look
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isOpen ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm' : 'bg-white/0 backdrop-blur-none border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <a 
              href="/" 
              onClick={handleLogoClick} 
              className="flex items-center flex-shrink-0 mr-8 z-50 cursor-pointer select-none"
            >
              <Logo className="h-10 md:h-12" variant="dark" animated={true} />
            </a>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center px-4 py-2 bg-slate-100/80 hover:bg-slate-100 text-slate-500 rounded-full border border-transparent hover:border-gray-200 transition-all duration-200 group"
              >
                <Search size={18} className="mr-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-sm font-medium">Search products, courses...</span>
                <span className="ml-auto text-xs bg-white px-2 py-0.5 rounded border border-gray-200 text-slate-400">Ctrl K</span>
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
                    className="text-sm font-medium tracking-wide text-slate-600 hover:text-blue-600 transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                      isActive(link.path)
                        ? 'text-slate-900'
                        : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              
              {user ? (
                <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                    <Link to="/dashboard" className="flex items-center gap-2 group" aria-label="Dashboard">
                        {user.user_metadata?.avatar_url ? (
                           <img 
                              src={user.user_metadata.avatar_url} 
                              alt={user.user_metadata?.full_name || "User Profile"}
                              className="w-10 h-10 rounded-full border-2 border-gray-100 hover:border-blue-500 transition-all object-cover shadow-sm"
                           />
                        ) : (
                           <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-gray-100 flex items-center justify-center text-slate-600 group-hover:border-blue-500 group-hover:text-blue-600 transition-all shadow-sm">
                              <span className="font-bold text-sm">
                                {user.email?.charAt(0).toUpperCase()}
                              </span>
                           </div>
                        )}
                    </Link>
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold tracking-wide hover:bg-blue-600 transition-colors duration-300 shadow-lg shadow-slate-900/20"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Actions - High Z-Index to ensure clickability */}
            <div className="md:hidden flex items-center gap-4 z-[60] relative">
               <button
                onClick={openSearch}
                className="p-2 text-slate-600 hover:text-blue-600 transition-colors active:scale-95 touch-manipulation"
                aria-label="Search"
              >
                <Search size={24} strokeWidth={2} />
              </button>
              
              <button
                onClick={toggleMenu}
                className="p-2 text-slate-900 hover:text-blue-600 transition-colors focus:outline-none active:scale-95 touch-manipulation"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 px-6 py-8 shadow-xl animate-fade-in h-[calc(100vh-5rem)] overflow-y-auto z-40">
            <div className="flex flex-col space-y-6 text-center pt-8">
              {navLinks.map((link) => (
                link.name === 'Products' ? (
                  <a
                    key={link.name}
                    href="#products"
                    onClick={handleProductClick}
                    className="text-2xl font-medium text-slate-800 hover:text-blue-600 transition-colors"
                  >
                     {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-2xl font-medium text-slate-800 hover:text-blue-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              
              <div className="pt-8 pb-12 border-t border-gray-100 mt-6">
                {user ? (
                   <div className="space-y-6">
                      <div className="flex flex-col items-center gap-2 mb-4">
                         {user.user_metadata?.avatar_url ? (
                           <img 
                              src={user.user_metadata.avatar_url} 
                              alt="Profile"
                              className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover mb-2"
                           />
                         ) : (
                           <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-2">
                              <span className="font-bold text-2xl">
                                {user.email?.charAt(0).toUpperCase()}
                              </span>
                           </div>
                         )}
                         <p className="font-medium text-slate-900">{user.user_metadata?.full_name || user.email}</p>
                      </div>
                      <Link 
                        to="/dashboard"
                        className="flex items-center justify-center gap-2 w-full px-8 py-4 rounded-full bg-blue-600 text-white text-lg font-semibold tracking-wide hover:bg-blue-700 transition-colors"
                      >
                        <LayoutDashboard size={20} /> Dashboard
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="flex items-center justify-center gap-2 w-full px-8 py-4 rounded-full bg-slate-100 text-slate-700 text-lg font-semibold tracking-wide hover:bg-slate-200 transition-colors"
                      >
                        <LogOut size={20} /> Sign Out
                      </button>
                   </div>
                ) : (
                  <div className="space-y-4">
                    <Link 
                      to="/login"
                      className="inline-block w-full max-w-xs px-8 py-4 rounded-full bg-slate-900 text-white text-lg font-semibold tracking-wide hover:bg-blue-600 transition-colors"
                    >
                      Sign In
                    </Link>
                     <Link 
                      to="/signup"
                      className="inline-block w-full max-w-xs px-8 py-4 rounded-full bg-white border border-gray-200 text-slate-900 text-lg font-semibold tracking-wide hover:bg-gray-50 transition-colors"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;