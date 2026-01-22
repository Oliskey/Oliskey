import React from 'react';
import { BookOpen, Rocket, Briefcase, TrendingUp, ArrowRight } from 'lucide-react';
// @ts-ignore
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const GetStarted: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 relative overflow-hidden transition-colors duration-300">
        {/* Background Logo Watermark - Centered & Animated */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]">
             <Logo showText={false} animated={true} className="w-[800px] h-[800px] dark:text-white" variant="dark" />
        </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">Choose your path</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Welcome to the ecosystem. Select how you want to engage with Oliskey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card 1: Education */}
          <Link to="/courses" className="group bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-slate-700 p-8 rounded-2xl transition-all duration-300 hover:shadow-xl flex flex-col items-start">
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">I want to learn</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 flex-grow">
              Master coding, design, and system thinking with our project-based courses.
            </p>
            <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center text-sm">
              Browse Courses <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Card 2: Business */}
          <Link to="/services" className="group bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-slate-700 p-8 rounded-2xl transition-all duration-300 hover:shadow-xl flex flex-col items-start">
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <Briefcase size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">I need a solution</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 flex-grow">
              Hire us to build your website, app, or enterprise software system.
            </p>
            <span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center text-sm">
              View Services <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Card 3: Developer */}
          <Link to="/app" className="group bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-slate-700 p-8 rounded-2xl transition-all duration-300 hover:shadow-xl flex flex-col items-start">
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-green-600 dark:text-green-400 mb-6 group-hover:scale-110 transition-transform">
              <Rocket size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">I am a developer</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 flex-grow">
              Use our tools, snippets, and app to accelerate your development workflow.
            </p>
            <span className="text-green-600 dark:text-green-400 font-semibold flex items-center text-sm">
              Get the App <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

           {/* Card 4: Investor */}
           <Link to="/investors" className="group bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-slate-700 p-8 rounded-2xl transition-all duration-300 hover:shadow-xl flex flex-col items-start">
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">I want to invest</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 flex-grow">
              Partner with us to build the infrastructure of tomorrow.
            </p>
            <span className="text-orange-600 dark:text-orange-400 font-semibold flex items-center text-sm">
              Investor Relations <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;