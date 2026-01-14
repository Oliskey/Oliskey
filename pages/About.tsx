import React from 'react';
import { Target, Users, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Built by engineers, designers, and storytellers.</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Oliskey’s leadership combines product engineering, academic partnerships, and creative media experience.
        </p>
      </div>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://picsum.photos/800/600" 
              alt="Team collaborating" 
              className="rounded-2xl shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
               Oliskey is a global infrastructure brand powering products that scale. We combine rigor and imagination through our S.C.C framework — System, Culture, Creativity — to build platforms, education tools, AI services, and media that endure.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Whether it's a small business needing a digital presence or a student wanting to learn code, we provide the tools and expertise to make it happen. We believe in reliability, human-centered design, and endless innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">System</h3>
              <p className="text-slate-600">Reliable, scalable platforms engineered for real-world use.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Culture</h3>
              <p className="text-slate-600">Designs and communities that outlast trends.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Creativity</h3>
              <p className="text-slate-600">Endless innovation that moves people and product forward.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;