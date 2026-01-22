import React, { useState } from 'react';
import { Target, Users, Award, User } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

const About: React.FC = () => {

  return (
    <div className="pt-24 pb-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Built by engineers, designers, and storytellers.</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Oliskey’s leadership combines product engineering, academic partnerships, and creative media experience.
        </p>
      </div>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <OptimizedImage
              src="https://picsum.photos/800/600" 
              alt="Team collaborating"
              className="rounded-2xl shadow-lg aspect-[4/3]"
              priority={true}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Our Mission</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
               Oliskey is a global infrastructure brand powering products that scale. We combine rigor and imagination through our S.C.C framework — System, Culture, Creativity — to build platforms, education tools, AI services, and media that endure.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Whether it's a small business needing a digital presence or a student wanting to learn code, we provide the tools and expertise to make it happen. We believe in reliability, human-centered design, and endless innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership / Co-Founder Section */}
      <section className="bg-white dark:bg-slate-950 py-16 border-t border-gray-100 dark:border-slate-800 transition-colors">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Leadership</h2>
               <p className="text-slate-500 dark:text-slate-400 mt-2">Visionaries driving the future of infrastructure.</p>
            </div>
            
            <div className="flex justify-center">
               <div className="group relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800 transition-all hover:shadow-2xl">
                  {/* Image Container - Aspect Ratio tailored for PORTRAIT photo (3:4) */}
                  <div className="aspect-[3/4] overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                     <OptimizedImage 
                         src="/co-founder.jpg" 
                         alt="Oliskey Lee"
                         className="w-full h-full"
                         imgClassName="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                     />
                     
                     {/* Gradient Overlay for text readability (Only if image loaded or just over placeholder for style) */}
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 pointer-events-none z-10"></div>
                     
                     {/* Text Content Overlay */}
                     <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
                        <h3 className="text-2xl font-bold mb-1">Oliskey Lee</h3>
                        <p className="text-blue-400 font-bold tracking-wide uppercase text-sm mb-3">Co-Founder</p>
                        <p className="text-slate-200 text-sm leading-relaxed opacity-90">
                           Architecting the systems and culture that drive our global vision.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 dark:bg-slate-900 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-primary-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">System</h3>
              <p className="text-slate-600 dark:text-slate-400">Reliable, scalable platforms engineered for real-world use.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-primary-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Culture</h3>
              <p className="text-slate-600 dark:text-slate-400">Designs and communities that outlast trends.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-primary-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Creativity</h3>
              <p className="text-slate-600 dark:text-slate-400">Endless innovation that moves people and product forward.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;