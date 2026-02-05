import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Course } from '../types';
import { Clock, BarChart, Star, CheckCircle, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import { supabase } from '../supabase';

const CourseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { courses, loading: dataLoading } = useData();
    const { user } = useAuth();
    const [course, setCourse] = useState<Course | null>(null);
    const [enrolling, setEnrolling] = useState(false);
    const [enrolled, setEnrolled] = useState(false);

    useEffect(() => {
        if (courses.length > 0 && id) {
            const found = courses.find(c => c.id === id);
            setCourse(found || null);
            checkEnrollment();
        }
    }, [courses, id, user]);

    const checkEnrollment = async () => {
        if (!user || !id) return;
        const { data } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', id)
            .single();
        if (data) setEnrolled(true);
    };

    const handleEnroll = async () => {
        if (!user) {
            // Redirect to login (simple alert for now)
            alert("Please sign in to enroll.");
            return;
        }
        setEnrolling(true);
        try {
            const { error } = await supabase.from('enrollments').insert({
                user_id: user.id,
                course_id: id
            });
            if (error) throw error;
            setEnrolled(true);
        } catch (error) {
            console.error('Enrollment failed:', error);
            alert('Failed to enroll. Please try again.');
        } finally {
            setEnrolling(false);
        }
    };

    if (dataLoading) {
        return <div className="min-h-screen pt-24 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }

    if (!course) {
        return (
            <div className="min-h-screen pt-24 text-center">
                <h2 className="text-2xl font-bold">Course not found</h2>
                <Link to="/courses" className="text-blue-600 hover:underline">Back to Courses</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-20 transition-colors duration-300">
            {/* Hero Section */}
            <div className="bg-slate-900 border-b border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10 blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-500/20">
                                    {course.level}
                                </span>
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-bold uppercase tracking-wider rounded-full border border-yellow-500/20 flex items-center gap-1">
                                    <Star size={12} className="fill-current" /> 4.9
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-400">
                                <div className="flex items-center gap-2"><Clock size={18} /> {course.duration || '4 Weeks'}</div>
                                <div className="flex items-center gap-2"><BarChart size={18} /> {course.level}</div>
                                <div className="flex items-center gap-2"><BookOpen size={18} /> {course.curriculum?.length || 0} Modules</div>
                            </div>

                            <div className="pt-4 flex items-center gap-4">
                                {enrolled ? (
                                    <button disabled className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl flex items-center gap-2 cursor-default">
                                        <CheckCircle size={20} /> Enrolled
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleEnroll}
                                        disabled={enrolling}
                                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        {enrolling ? <Loader2 size={20} className="animate-spin" /> : <>Enroll Now <ArrowRight size={20} /></>}
                                    </button>
                                )}
                                <span className="text-2xl font-bold text-white ml-2">{enrolled ? 'Paid' : course.price}</span>
                            </div>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5 bg-slate-800">
                            <OptimizedImage
                                src={course.image}
                                alt={course.title}
                                className="w-full aspect-video"
                                imgClassName="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Curriculum</h2>
                    <div className="space-y-4">
                        {course.curriculum && Array.isArray(course.curriculum) ? (
                            course.curriculum.map((item: any, idx: number) => (
                                <div key={idx} className="bg-gray-50 dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Week {item.week}: {item.topic}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 mt-1">Detailed breakdown of concepts covered in week {item.week}.</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500">Curriculum details coming soon.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CourseDetail;
