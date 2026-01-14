import React from 'react';
import { BookOpen, Rocket, Briefcase, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GetStarted: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 relative overflow-hidden">
        {/* Background Logo Watermark - Centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none z-0">
             <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-slate-900">
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="35" cy="62" r="22" />
                  <circle cx="65" cy="62" r="22" />
                  <circle cx="50" cy="36" r="22" />
                </g>
                <path d="M 65.55 20.44 A 22 22 0 0 1 72 36" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              </svg>
        </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">Choose your path</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Welcome to the ecosystem. Select how you want to engage with Oliskey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card 1: Education */}
          <Link to="/courses" className="group bg-slate-50 hover:bg-white border border-gray-100 hover:border-blue-100 p-8 rounded-2xl transition-all duration-300 hover:shadow-xl flex flex-col items-start">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">I want to learn</h3>
            <p className="text-slate-500 mb-6 flex-grow">
              Master coding, design, and system thinking with our project-based courses.
            </p>
            <span className="text-blue-600 font-semibold flex items-center text-sm">
              Browse Courses <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Card 2: Business */}
          <Link to="/services" className="group bg-slate-50 hover:bg-white border border-gray-100 hover:border-blue-100 p-8 rounded-2xl transition-all duration-300 hover:shadow-xl flex flex-col items-start">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
              <Briefcase size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">I need a solution</h3>
            <p className="text-slate-500 mb-6 flex-grow">
              Hire us to build your website, app, or enterprise software system.
            </p>
            <span className="text-purple-600 font-semibold flex items-center text-sm">
              View Services <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Card 3: Developer */}
          <Link to="/app" className="group bg-slate-50 hover:bg-white border border-gray-100 hover:border-blue-100 p-8 rounded-2xl transition-all duration-300 hover:shadow-xl flex flex-col items-start">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
              <Rocket size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">I am a developer</h3>
            <p className="text-slate-500 mb-6 flex-grow">
              Use our tools, snippets, and app to accelerate your development workflow.
            </p>
            <span className="text-green-600 font-semibold flex items-center text-sm">
              Get the App <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

           {/* Card 4: Investor */}
           <Link to="/investors" className="group bg-slate-50 hover:bg-white border border-gray-100 hover:border-blue-100 p-8 rounded-2xl transition-all duration-300 hover:shadow-xl flex flex-col items-start">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">I want to invest</h3>
            <p className="text-slate-500 mb-6 flex-grow">
              Partner with us to build the infrastructure of tomorrow.
            </p>
            <span className="text-orange-600 font-semibold flex items-center text-sm">
              Investor Relations <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;