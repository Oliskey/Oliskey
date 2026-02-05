import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { BlogPost } from '../types';
import OptimizedImage from '../components/OptimizedImage';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';

const BlogPostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { blogPosts, loading: dataLoading } = useData();
    const [post, setPost] = useState<BlogPost | null>(null);

    useEffect(() => {
        if (blogPosts.length > 0 && id) {
            const found = blogPosts.find(p => p.id === id);
            setPost(found || null);
        }
    }, [blogPosts, id]);

    if (dataLoading) {
        return <div className="min-h-screen pt-24 text-center">Loading...</div>;
    }

    if (!post) {
        return (
            <div className="min-h-screen pt-24 text-center">
                <h2 className="text-2xl font-bold">Post not found</h2>
                <Link to="/blog" className="text-blue-600 hover:underline">Back to Blog</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-12 transition-colors duration-300">
            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Blog
                </Link>

                <header className="mb-10 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wide">
                            {post.category}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-6 text-slate-500 dark:text-slate-400 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {post.date}
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            {post.author}
                        </div>
                    </div>
                </header>

                <div className="rounded-2xl overflow-hidden shadow-lg mb-10 border border-gray-100 dark:border-slate-800">
                    <OptimizedImage
                        src={post.image}
                        alt={post.title}
                        className="w-full h-64 md:h-96"
                        imgClassName="object-cover"
                    />
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown>{post.content || post.excerpt}</ReactMarkdown>
                </div>

            </article>
        </div>
    );
};

export default BlogPostDetail;
