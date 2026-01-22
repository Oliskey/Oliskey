import React from 'react';
import { TrendingUp, PieChart, Target, Mail } from 'lucide-react';
// @ts-ignore
import { Link } from 'react-router-dom';

const Investors: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">Investor Relations</span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">Invest in the Future</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          We are building the infrastructure brand for products that blend system reliability with cultural impact.
        </p>
      </div>

      {/* Vision Stats */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-24">
        <div className="bg-slate-900 dark:bg-black/60 rounded-[2.5rem] p-12 lg:p-20 text-white relative overflow-hidden border border-transparent dark:border-slate-800 shadow-2xl">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/30 blur-[100px] rounded-full pointer-events-none"></div>
           <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white">Our Vision</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  Become the infrastructure brand for products that blend system reliability with cultural impact. We operate at the intersection of proven engineering and creative exploration.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Target size={20} />
                    </div>
                    <span className="font-medium text-slate-200">Scalable Systems</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <TrendingUp size={20} />
                    </div>
                    <span className="font-medium text-slate-200">Sustainable Growth</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                    <div className="text-4xl font-bold text-blue-400 mb-2">3+</div>
                    <div className="text-sm text-slate-400">MVPs Launched</div>
                 </div>
                 <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                    <div className="text-4xl font-bold text-green-400 mb-2">10k+</div>
                    <div className="text-sm text-slate-400">Waitlist Users</div>
                 </div>
                 <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 col-span-2">
                    <div className="text-4xl font-bold text-purple-400 mb-2">5</div>
                    <div className="text-sm text-slate-400">Pilot Partnerships</div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Use of Funds */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Use of Funds</h2>
          <p className="text-slate-500 dark:text-slate-400">How we plan to deploy capital to accelerate growth.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 border border-gray-100 dark:border-slate-800 rounded-2xl bg-gray-50/50 dark:bg-slate-900 transition-colors hover:border-gray-200 dark:hover:border-slate-700">
             <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-slate-900 dark:text-white mb-6 font-bold text-lg">40%</div>
             <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Product Dev</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Accelerating the roadmap for Oliskey Systems and AI tools.</p>
          </div>
          <div className="p-8 border border-gray-100 dark:border-slate-800 rounded-2xl bg-gray-50/50 dark:bg-slate-900 transition-colors hover:border-gray-200 dark:hover:border-slate-700">
             <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-slate-900 dark:text-white mb-6 font-bold text-lg">35%</div>
             <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Go-to-Market</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Sales, marketing, and partnership acquisition for Education products.</p>
          </div>
          <div className="p-8 border border-gray-100 dark:border-slate-800 rounded-2xl bg-gray-50/50 dark:bg-slate-900 transition-colors hover:border-gray-200 dark:hover:border-slate-700">
             <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-slate-900 dark:text-white mb-6 font-bold text-lg">25%</div>
             <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Team & Infra</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Expanding engineering team and cloud infrastructure.</p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-blue-600 dark:bg-blue-700 text-white py-20 px-6 transition-colors">
         <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start the conversation?</h2>
            <p className="text-blue-100 mb-10 text-lg">
               We are currently open to discussions with strategic partners and angel investors. Request our full investor deck below.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <a 
                 href="mailto:oliskeylee@gmail.com"
                 className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-full font-bold hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors shadow-lg"
               >
                 <Mail className="mr-2" size={20}/> Email Us
               </a>
               <Link 
                 to="/contact"
                 className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 dark:bg-blue-800 text-white rounded-full font-bold hover:bg-blue-800 dark:hover:bg-blue-900 transition-colors border border-blue-500 dark:border-blue-600"
               >
                 Schedule Meeting
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Investors;