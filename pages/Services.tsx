import React from 'react';
// @ts-ignore
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Server, Workflow, BrainCircuit, ArrowRight } from 'lucide-react';

const Services: React.FC = () => {
   const { services } = useData();

   return (
      <div className="pt-28 pb-24 bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Our Services</h1>
               <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  Comprehensive digital solutions tailored to your unique business needs. From concept to launch, we are with you.
               </p>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
               {services.map((service, index) => (
                  <div key={index} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-800 group">
                     <div className={`w-14 h-14 ${service.color} text-white rounded-xl flex items-center justify-center mb-6 shadow-md transform group-hover:-translate-y-1 transition-transform`}>
                        {service.icon}
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{service.title}</h3>
                     <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                        {service.description}
                     </p>
                  </div>
               ))}
            </div>

            {/* Business-wide software and automation capabilities */}
            <section className="mb-20">
              <div className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">What we can build</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">The right technology for the work you need to do.</h2><p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">We start by understanding your workflow, then recommend a practical mix of software, automation and AI.</p></div>
              <div className="grid gap-5 md:grid-cols-3">
                <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"><Server size={23} /></span><h3 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">Custom business software</h3><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Build internal tools, customer portals and business systems around your team’s real processes, users and data.</p></article>
                <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"><Workflow size={23} /></span><h3 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">Workflow automation</h3><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Reduce repetitive handoffs, reminders, data entry and follow-ups by connecting steps into clearer workflows.</p></article>
                <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"><BrainCircuit size={23} /></span><h3 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">Practical AI tools</h3><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Use AI for tasks where it can help—such as summarising information, preparing drafts, finding patterns or assisting a workflow—with human oversight where needed.</p></article>
              </div>
              <div className="mt-8 rounded-3xl border border-slate-200/80 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900/50 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">Ready-made products</p><h3 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">You can start with a product we already built.</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Explore the product details first, then open the live app when you are ready.</p></div><Link to="/products" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-100">Explore products <ArrowRight size={16} /></Link></div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Link to="/school-management" className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"><span className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">Education</span><span className="mt-2 flex items-center justify-between gap-3 font-bold text-slate-950 dark:text-white">Oliskey School App <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></span><span className="mt-2 block text-sm leading-6 text-slate-600 dark:text-slate-300">School administration, communication, assessment and learning workflows.</span></Link>
                  <Link to="/fleet-operations" className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-violet-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-700 dark:bg-slate-950"><span className="text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">Fleet &amp; transport</span><span className="mt-2 flex items-center justify-between gap-3 font-bold text-slate-950 dark:text-white">Oliskey Fleet <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></span><span className="mt-2 block text-sm leading-6 text-slate-600 dark:text-slate-300">Vehicle, driver, collection, maintenance and operational finance records.</span></Link>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="bg-slate-900 dark:bg-slate-900 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full"></div>
               <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-4">Ready to start your project?</h2>
                  <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg">
                     Let's discuss how we can help your business grow with technology.
                  </p>
                  <Link
                     to="/contact"
                     className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-blue-600/30"
                  >
                     Get a Quote
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Services;