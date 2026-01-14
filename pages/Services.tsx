import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { servicesData } from '../data';

const Services: React.FC = () => {
  return (
    <div className="pt-28 pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Our Services</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Comprehensive digital solutions tailored to your unique business needs. From concept to launch, we are with you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
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

        {/* CTA */}
        <div className="mt-20 bg-slate-900 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
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