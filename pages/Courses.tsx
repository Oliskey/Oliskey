import React from 'react';
import { Clock, BarChart, Star } from 'lucide-react';
import { useData } from '../context/DataContext';

const Courses: React.FC = () => {
  const { courses } = useData();

  return (
    <div className="pt-28 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Master New Skills</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Practical, project-based coding courses designed to get you hired or help you build your own startup.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10"></div>
                <img 
                  src={course.image} 
                  alt={course.title}
                  loading="lazy" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 uppercase tracking-wide">
                    {course.level}
                  </span>
                  <span className="flex items-center text-yellow-500 text-sm font-bold">
                    <Star size={14} className="fill-current mr-1" /> 4.9
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">{course.description}</p>
                
                <div className="flex items-center text-slate-500 text-xs font-medium space-x-4 mb-6">
                  <div className="flex items-center"><Clock size={14} className="mr-1.5"/> 20h Content</div>
                  <div className="flex items-center"><BarChart size={14} className="mr-1.5"/> {course.tags[0]}</div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-2xl font-bold text-slate-900">{course.price}</span>
                  <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/10">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
