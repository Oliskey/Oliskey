import React, { useState } from 'react';
import { Check, HelpCircle, ArrowLeft, X as XIcon, Minus } from 'lucide-react';
// @ts-ignore
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pt-24 pb-20 transition-colors duration-300">
      
      {/* Back to Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Link>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Simple, transparent pricing</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Choose the plan that fits your growth. Upgrade to access premium courses, advanced tools, and priority support.
        </p>
        
        {/* Toggle */}
        <div className="flex justify-center items-center mt-10 gap-4">
            <span className={`text-sm font-bold ${!annual ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'} transition-colors`}>Monthly</span>
            <button 
                onClick={() => setAnnual(!annual)}
                className="w-16 h-8 bg-slate-900 dark:bg-blue-600 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:focus:ring-blue-500"
            >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm ${annual ? 'left-9' : 'left-1'}`}></div>
            </button>
            <span className={`text-sm font-bold ${annual ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'} transition-colors flex items-center gap-2`}>
                Yearly <span className="text-green-700 dark:text-green-300 text-[10px] font-extrabold uppercase bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full tracking-wider">-20%</span>
            </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* Free Tier */}
            <div className="p-8 rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 relative group">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Starter</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">Perfect for exploring the ecosystem and learning basics.</p>
                <div className="mb-8">
                    <span className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">$0</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium ml-1">/mo</span>
                </div>
                <Link to="/signup" className="block w-full py-4 px-6 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700">
                    Current Plan
                </Link>
                <div className="mt-10 space-y-5">
                    <Feature text="Access to free courses" />
                    <Feature text="Basic community support" />
                    <Feature text="Limited cloud snippets" />
                    <Feature text="Standard API access" />
                    <Feature text="1 Project" />
                </div>
            </div>

            {/* Pro Tier - Highlighted */}
            <div className="p-8 rounded-3xl bg-slate-900 dark:bg-black text-white shadow-2xl relative overflow-hidden transform lg:-translate-y-6 lg:scale-105 z-10 border border-slate-800">
                 {/* Decorative Blobs */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
                 
                 <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white">Pro</h3>
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-blue-500/20">Most Popular</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-8 leading-relaxed">For developers and creators who need more power and premium content.</p>
                    <div className="mb-8">
                        <div className="flex items-baseline">
                            <span className="text-5xl font-bold text-white tracking-tight">{annual ? '$19' : '$24'}</span>
                            <span className="text-slate-400 font-medium ml-1">/mo</span>
                        </div>
                        {annual && <p className="text-xs text-blue-300 mt-2 font-medium">Billed $228 yearly (Save $60)</p>}
                    </div>
                    <button className="block w-full py-4 px-6 bg-white text-slate-900 font-bold text-center rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-white/10">
                        Upgrade Now
                    </button>
                    <div className="mt-10 space-y-5">
                        <Feature text="Everything in Starter" dark />
                        <Feature text="Unlimited Premium Courses" dark />
                        <Feature text="Priority Email Support" dark />
                        <Feature text="Advanced Cloud Tools" dark />
                        <Feature text="Commercial Usage Rights" dark />
                        <Feature text="Early Access to Betas" dark />
                    </div>
                 </div>
            </div>

            {/* Enterprise Tier */}
            <div className="p-8 rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 relative">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Enterprise</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">For large teams and organizations requiring custom solutions.</p>
                <div className="mb-8 flex items-center h-[48px]">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Custom</span>
                </div>
                <Link to="/contact" className="block w-full py-4 px-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-center rounded-xl hover:border-slate-900 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    Contact Sales
                </Link>
                <div className="mt-10 space-y-5">
                    <Feature text="Unlimited Team Members" />
                    <Feature text="Dedicated Account Manager" />
                    <Feature text="SSO & Advanced Security" />
                    <Feature text="Custom Contracts & SLA" />
                    <Feature text="On-premise deployment options" />
                </div>
            </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Compare Plans</h2>
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr>
                          <th className="py-6 px-4 text-sm font-semibold text-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800 w-1/4">Features</th>
                          <th className="py-6 px-4 text-sm font-bold text-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800 w-1/4 text-center">Starter</th>
                          <th className="py-6 px-4 text-sm font-bold text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-slate-800 w-1/4 text-center bg-blue-50/50 dark:bg-blue-900/10 rounded-t-xl">Pro</th>
                          <th className="py-6 px-4 text-sm font-bold text-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800 w-1/4 text-center">Enterprise</th>
                      </tr>
                  </thead>
                  <tbody>
                      <TableRow feature="Public Projects" starter="Unlimited" pro="Unlimited" ent="Unlimited" />
                      <TableRow feature="Private Projects" starter="1" pro="Unlimited" ent="Unlimited" />
                      <TableRow feature="Cloud Storage" starter="500MB" pro="20GB" ent="Unlimited" />
                      <TableRow feature="Premium Courses" starter={false} pro={true} ent={true} />
                      <TableRow feature="Custom Domain" starter={false} pro={true} ent={true} />
                      <TableRow feature="Analytics" starter="Basic" pro="Advanced" ent="Custom" />
                      <TableRow feature="Support" starter="Community" pro="Email (Priority)" ent="Dedicated Agent" />
                      <TableRow feature="SSO / SAML" starter={false} pro={false} ent={true} />
                      <TableRow feature="SLA Uptime" starter={false} pro="99.9%" ent="99.99%" />
                  </tbody>
              </table>
          </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 mt-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
             <FaqItem q="Can I cancel my subscription anytime?" a="Yes, you can cancel your subscription at any time via your account settings. Your access will continue until the end of your current billing period." />
             <FaqItem q="Do you offer student discounts?" a="Yes! Valid students can get 50% off the Pro plan for the first year. Contact our support team with your student ID to verify." />
             <FaqItem q="What payment methods do you accept?" a="We accept all major credit cards (Visa, Mastercard, Amex), PayPal. For Enterprise plans, we support invoice-based bank transfers." />
             <FaqItem q="Is there a trial period?" a="We offer a 7-day money-back guarantee. If you're not satisfied with the Pro plan features, we'll refund you in full, no questions asked." />
        </div>
      </div>

      {/* Trust Badge */}
      <div className="text-center mt-20 text-slate-400 dark:text-slate-500 text-sm font-medium flex items-center justify-center gap-2">
         <div className="flex -space-x-2">
            {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900"></div>
            ))}
         </div>
         Joined by 10,000+ developers and creators.
      </div>

    </div>
  );
};

const Feature = ({ text, dark = false }: { text: string, dark?: boolean }) => (
    <div className={`flex items-start gap-3 ${dark ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${dark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
            <Check size={12} strokeWidth={3} />
        </div>
        <span className="text-sm font-medium leading-tight">{text}</span>
    </div>
);

const FaqItem = ({ q, a }: { q: string, a: string }) => (
    <div className="border border-gray-100 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 hover:border-gray-200 dark:hover:border-slate-700 transition-colors shadow-sm">
        <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-start gap-3">
            <HelpCircle size={20} className="text-blue-500 mt-0.5 flex-shrink-0" /> {q}
        </h4>
        <p className="text-slate-600 dark:text-slate-400 text-sm ml-8 leading-relaxed">{a}</p>
    </div>
);

const TableRow = ({ feature, starter, pro, ent }: { feature: string, starter: string | boolean, pro: string | boolean, ent: string | boolean }) => {
    const renderCell = (val: string | boolean, isPro = false) => {
        if (val === true) return <Check size={20} className={`mx-auto ${isPro ? 'text-blue-600 dark:text-blue-400' : 'text-green-500 dark:text-green-400'}`} />;
        if (val === false) return <Minus size={20} className="mx-auto text-slate-300 dark:text-slate-600" />;
        return <span className={`text-sm font-medium ${isPro ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>{val}</span>;
    };

    return (
        <tr className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors border-b border-gray-100 dark:border-slate-800 last:border-0">
            <td className="py-4 px-4 text-sm font-medium text-slate-900 dark:text-white">{feature}</td>
            <td className="py-4 px-4 text-center">{renderCell(starter)}</td>
            <td className="py-4 px-4 text-center bg-blue-50/20 dark:bg-blue-900/5">{renderCell(pro, true)}</td>
            <td className="py-4 px-4 text-center">{renderCell(ent)}</td>
        </tr>
    );
};

export default Pricing;