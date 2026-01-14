import React from 'react';
import { Download, Check, Star, Zap, Shield, Smartphone } from 'lucide-react';

const AppShowcase: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Product Hero */}
      <section className="pt-32 pb-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/50 text-blue-400 text-xs font-bold border border-blue-800 mb-6 uppercase tracking-wider">
                <Star size={12} className="mr-2 fill-current" /> #1 Coding Companion App
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Code smarter,<br/> not harder.
              </h1>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                The Oliskey App provides daily coding challenges, snippet management, and progress tracking for developers of all levels.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="flex items-center justify-center bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">
                  <Download size={20} className="mr-2" /> Download for iOS
                </button>
                <button className="flex items-center justify-center bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-full font-bold hover:bg-slate-700 transition-colors">
                  <Download size={20} className="mr-2" /> Download for Android
                </button>
              </div>
              <div className="mt-10 flex items-center justify-center lg:justify-start text-sm text-slate-500 font-medium">
                <div className="flex -space-x-2 mr-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900"></div>
                  ))}
                </div>
                <p>Trusted by 10,000+ developers</p>
              </div>
            </div>
            <div className="relative mt-12 lg:mt-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
              <img 
                src="https://picsum.photos/400/800" 
                alt="App Screenshot"
                loading="lazy" 
                className="relative mx-auto border-[12px] border-slate-800 rounded-[3rem] shadow-2xl w-[300px] lg:w-[350px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why use the Oliskey App?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to accelerate your learning and development workflow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <Zap size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Instant Reference</h3>
              <p className="text-slate-600 leading-relaxed">Access syntax guides and documentation offline, anywhere you go. Never lose your flow.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <Smartphone size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Mobile Editor</h3>
              <p className="text-slate-600 leading-relaxed">Write and test code snippets directly on your phone with our lightweight compiler.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <Shield size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Cloud Sync</h3>
              <p className="text-slate-600 leading-relaxed">Your progress and snippets are safely backed up and synced instantly to the web dashboard.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppShowcase;