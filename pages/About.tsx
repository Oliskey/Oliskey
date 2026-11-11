import React from 'react';
import { Target, Users, Award } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

const About: React.FC = () => {

  return (
    <div className="pt-24 pb-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">We build technology around real human problems.</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Oliskey builds practical software, workflow automation and AI-enabled tools to help organisations make everyday work simpler and more reliable.
        </p>
      </div>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <OptimizedImage
              src="/creativity.png"
              alt="Brand Creativity"
              className="rounded-2xl shadow-lg aspect-[4/3]"
              priority={true}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Our Mission</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Oliskey began with a simple belief: technology should make difficult work easier for the people doing it. We build useful software products and business systems by combining strong engineering, thoughtful design and a clear understanding of real workflows.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The idea grew from personal experience with how challenging education can feel and from seeing, while teaching, how much time schools lose to repetitive administration. We also saw how much parents need clear visibility into progress. Those experiences shaped our approach: solve a real problem first, make the system understandable, and use automation or AI only where it creates practical value. Today, that approach extends beyond education to businesses with workflows that can be made clearer, faster and easier to manage.
            </p>
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
              <p className="text-slate-600 dark:text-slate-400">Build dependable systems that fit real workflows and grow with changing needs.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-primary-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Culture</h3>
              <p className="text-slate-600 dark:text-slate-400">Create clear, accessible experiences that respect people’s time and attention.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-primary-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Creativity</h3>
              <p className="text-slate-600 dark:text-slate-400">Explore new technology with purpose, and measure it by the problems it helps solve.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;