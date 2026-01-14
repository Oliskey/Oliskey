import React from 'react';
import { portfolioData } from '../data';

const Portfolio: React.FC = () => {
  return (
    <div className="pt-28 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Our Portfolio</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A selection of projects we've built for clients across various industries, showcasing our commitment to quality and innovation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioData.map((project) => (
            <div key={project.id} className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer aspect-[4/3]">
              <img 
                src={project.image} 
                alt={project.title}
                loading="lazy" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <h3 className="text-white text-2xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{project.title}</h3>
                <p className="text-blue-300 font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{project.category}</p>
                {project.description && (
                  <p className="text-slate-300 text-sm mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;