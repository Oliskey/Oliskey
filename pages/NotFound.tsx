import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <h1 className="text-9xl font-bold text-slate-200 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Page not found</h2>
      <p className="text-slate-500 text-lg mb-10 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
        >
          <Home size={18} className="mr-2" /> Go Home
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center px-6 py-3 bg-white text-slate-700 border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" /> Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;