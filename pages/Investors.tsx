import React from 'react';
import { TrendingUp, PieChart, Target, Mail } from 'lucide-react';
// @ts-ignore
import { Link } from 'react-router-dom';

const Investors: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-white text-slate-900">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">Investor Relations</span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">Invest in the Future</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          We are building the infrastructure brand for products that blend system reliability with cultural impact.
        </p>
      </div>

      {/* Vision Stats */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-24">
        <div className="bg-slate-900 rounded-[2.5rem] p-12 lg:p-20 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/30 blur-[100px] rounded-full pointer-events-none"></div>
           <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  Become the infrastructure brand for products that blend system reliability with cultural impact. We operate at the intersection of proven engineering and creative exploration.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Target size={20} />
                    </div>
                    <span className="font-medium">Scalable Systems</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <TrendingUp size={20} />
                    </div>
                    <span className="font-medium">Sustainable Growth</span>
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
          <h2 className="text-3xl font-bold mb-4">Use of Funds</h2>
          <p className="text-slate-500">How we plan to deploy capital to accelerate growth.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 border border-gray-100 rounded-2xl bg-gray-50/50">
             <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-900 mb-6 font-bold">40%</div>
             <h3 className="text-xl font-bold mb-3">Product Dev</h3>
             <p className="text-slate-500 text-sm">Accelerating the roadmap for Oliskey Systems and AI tools.</p>
          </div>
          <div className="p-8 border border-gray-100 rounded-2xl bg-gray-50/50">
             <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-900 mb-6 font-bold">35%</div>
             <h3 className="text-xl font-bold mb-3">Go-to-Market</h3>
             <p className="text-slate-500 text-sm">Sales, marketing, and partnership acquisition for Education products.</p>
          </div>
          <div className="p-8 border border-gray-100 rounded-2xl bg-gray-50/50">
             <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-900 mb-6 font-bold">25%</div>
             <h3 className="text-xl font-bold mb-3">Team & Infra</h3>
             <p className="text-slate-500 text-sm">Expanding engineering team and cloud infrastructure.</p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-blue-600 text-white py-20 px-6">
         <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start the conversation?</h2>
            <p className="text-blue-100 mb-10 text-lg">
               We are currently open to discussions with strategic partners and angel investors. Request our full investor deck below.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <a 
                 href="mailto:oliskeylee@gmail.com"
                 className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-colors"
               >
                 <Mail className="mr-2" size={20}/> Email Us
               </a>
               <Link 
                 to="/contact"
                 className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white rounded-full font-bold hover:bg-blue-800 transition-colors border border-blue-500"
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