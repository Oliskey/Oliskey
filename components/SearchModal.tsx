import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, BookOpen, Layers, Briefcase, FileText } from 'lucide-react';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { servicesData, coursesData, portfolioData, blogPostsData } from '../data';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string | number;
  title: string;
  description: string;
  type: 'Service' | 'Course' | 'Project' | 'Blog';
  url: string;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle Search Logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const matchedServices = servicesData
      .filter(s => s.title.toLowerCase().includes(lowerQuery) || s.description.toLowerCase().includes(lowerQuery))
      .map(s => ({ id: s.title, title: s.title, description: s.description, type: 'Service' as const, url: '/services' }));

    const matchedCourses = coursesData
      .filter(c => c.title.toLowerCase().includes(lowerQuery) || c.description.toLowerCase().includes(lowerQuery))
      .map(c => ({ id: c.id, title: c.title, description: c.description, type: 'Course' as const, url: '/courses' }));

    const matchedProjects = portfolioData
      .filter(p => p.title.toLowerCase().includes(lowerQuery) || p.category.toLowerCase().includes(lowerQuery) || (p.description && p.description.toLowerCase().includes(lowerQuery)))
      .map(p => ({ id: p.id, title: p.title, description: p.category, type: 'Project' as const, url: '/portfolio' }));

    const matchedPosts = blogPostsData
      .filter(b => b.title.toLowerCase().includes(lowerQuery) || b.excerpt.toLowerCase().includes(lowerQuery))
      .map(b => ({ id: b.id, title: b.title, description: b.excerpt, type: 'Blog' as const, url: '/blog' }));

    setResults([...matchedServices, ...matchedCourses, ...matchedProjects, ...matchedPosts]);
  }, [query]);

  const handleNavigate = (url: string) => {
    navigate(url);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Service': return <Layers size={16} className="text-blue-500" />;
      case 'Course': return <BookOpen size={16} className="text-green-500" />;
      case 'Project': return <Briefcase size={16} className="text-purple-500" />;
      case 'Blog': return <FileText size={16} className="text-orange-500" />;
      default: return <Search size={16} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="flex min-h-full items-start justify-center p-4 sm:p-6 mt-16 sm:mt-24">
        <div className="relative w-full max-w-2xl transform rounded-2xl bg-white shadow-2xl transition-all ring-1 ring-slate-900/5">
          
          {/* Search Header */}
          <div className="flex items-center border-b border-gray-100 p-4">
            <Search className="h-5 w-5 text-slate-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent text-lg text-slate-900 placeholder-slate-400 focus:outline-none"
              placeholder="Search services, courses, projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              onClick={onClose}
              className="ml-2 rounded-lg p-1 text-slate-400 hover:bg-gray-100 hover:text-slate-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Results List */}
          {query && (
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length > 0 ? (
                <ul className="space-y-1">
                  {results.map((result, idx) => (
                    <li key={`${result.type}-${result.id}-${idx}`}>
                      <button
                        onClick={() => handleNavigate(result.url)}
                        className="flex w-full items-center rounded-xl p-3 text-left hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-white border border-gray-100 shadow-sm group-hover:border-primary-200 group-hover:shadow-md transition-all">
                          {getIcon(result.type)}
                        </div>
                        <div className="ml-4 flex-auto">
                          <p className="font-semibold text-slate-900">
                            {result.title}
                            <span className="ml-2 text-xs font-medium text-slate-400 px-2 py-0.5 rounded-full bg-slate-100">
                              {result.type}
                            </span>
                          </p>
                          <p className="text-sm text-slate-500 line-clamp-1">{result.description}</p>
                        </div>
                        <ChevronRight className="ml-3 h-5 w-5 flex-none text-slate-300" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-500">No results found for "{query}"</p>
                </div>
              )}
            </div>
          )}
          
          {/* Default State / Quick Links */}
          {!query && (
            <div className="p-4 border-t border-gray-50 bg-gray-50/50 rounded-b-2xl">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Links</p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => handleNavigate('/services')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-colors">Web Development</button>
                <button onClick={() => handleNavigate('/courses')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-colors">Courses</button>
                <button onClick={() => handleNavigate('/contact')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-colors">Contact Us</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;