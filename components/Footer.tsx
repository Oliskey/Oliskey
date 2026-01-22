import React from 'react';
// @ts-ignore
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  // Logo variant based on theme
  const logoVariant = theme === 'dark' ? 'light' : 'dark';

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
        
        {/* Minimal Logo */}
        <div className="mb-10">
          <Logo className="h-10" variant={logoVariant} />
        </div>

        {/* Minimal Links */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10">
          <a href="/#products" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Products</a>
          <Link to="/about" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
          <Link to="/investors" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Investors</Link>
          <Link to="/blog" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Media</Link>
          <Link to="/contact" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link>
        </nav>

        {/* Contact info */}
        <div className="flex gap-6 mb-10 text-sm text-slate-500 dark:text-slate-400">
           <a href="mailto:oliskeylee@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400">oliskeylee@gmail.com</a>
        </div>

        {/* Legal / Copyright */}
        <div className="text-center">
          <p className="text-xs text-slate-400 dark:text-slate-600 font-medium">
            &copy; {new Date().getFullYear()} Oliskey Inc. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
             <a href="#" className="text-xs text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors">Privacy Policy</a>
             <a href="#" className="text-xs text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;