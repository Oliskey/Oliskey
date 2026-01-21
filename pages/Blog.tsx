import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ImageOff, FileText } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

const Blog: React.FC = () => {
  const { blogPosts } = useData();

  return (
    <div className="pt-28 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">The Oliskey Blog</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Insights, tutorials, and industry news crafted by our team.</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.id} className="flex flex-col group cursor-pointer">
              <div className="overflow-hidden rounded-2xl mb-6 shadow-sm bg-gray-100 relative h-56">
                <OptimizedImage
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full"
                    imgClassName="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <div className="flex items-center text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">
                  <span>{post.category}</span>
                  <span className="mx-2 text-slate-300">•</span>
                  <span className="text-slate-500">{post.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-100 rounded-full mr-3 flex-shrink-0 flex items-center justify-center text-slate-500 text-xs font-bold">
                     {post.author.charAt(0)}
                  </div>
                  <div>
                     <p className="text-sm font-bold text-slate-900">{post.author}</p>
                     <p className="text-xs text-slate-500">Editor</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;