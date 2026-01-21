import React from 'react';
// @ts-ignore
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Server, School, ArrowRight } from 'lucide-react';

const Services: React.FC = () => {
  const { services } = useData();

  return (
    <div className="pt-28 pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Our Services</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Comprehensive digital solutions tailored to your unique business needs. From concept to launch, we are with you.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className={`w-14 h-14 ${service.color} text-white rounded-xl flex items-center justify-center mb-6 shadow-md transform group-hover:-translate-y-1 transition-transform`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* SaaS Spotlight - Schools App */}
        <div className="mb-20">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
             <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

             <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                      <Server size={14} /> SaaS Spotlight
                   </div>
                   <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Scalable SaaS Architectures</h2>
                   <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                      We don't just build websites; we engineer complex, multi-tenant SaaS platforms. Our flagship upcoming product, the <span className="font-bold text-indigo-600">Oliskey Schools App</span>, demonstrates our ability to create all-in-one management ecosystems.
                   </p>
                   
                   <div className="space-y-4">
                      <div className="flex items-start gap-4">
                         <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0">
                            <School size={20} />
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900">Schools App (Coming Soon)</h4>
                            <p className="text-sm text-slate-500">An all-in-one platform for student data, grading, attendance, and finance.</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0">
                            <Server size={20} />
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900">Custom SaaS Development</h4>
                            <p className="text-sm text-slate-500">We can build your startup's MVP or your enterprise's internal tool.</p>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="lg:w-1/2 w-full">
                   <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                      <div className="flex items-center gap-2 mb-4">
                         <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                         </div>
                         <div className="h-6 w-2/3 bg-slate-800 rounded-md"></div>
                      </div>
                      <div className="space-y-3">
                         <div className="h-32 bg-slate-800 rounded-lg w-full"></div>
                         <div className="grid grid-cols-2 gap-3">
                            <div className="h-20 bg-slate-800 rounded-lg"></div>
                            <div className="h-20 bg-slate-800 rounded-lg"></div>
                         </div>
                      </div>
                      <div className="mt-6 text-center">
                         <p className="text-slate-400 text-sm font-mono">Building the future of EdTech...</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
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