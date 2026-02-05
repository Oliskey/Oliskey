import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Settings, BookOpen, Bell, CreditCard, ChevronRight, Shield, Zap, Calendar, Play } from 'lucide-react';
// @ts-ignore
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { user, signOut } = useAuth();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

    // Learning Progress State
    const completedLessons = JSON.parse(localStorage.getItem('oliskey_progress') || '[0]');
    const curriculum = [
        { title: "Introduction to 2030 Strategy", week: 1 },
        { title: "Understanding Model Context Protocol", week: 1 },
        { title: "Agentic vs Generic AI Systems", week: 2 },
        { title: "Implementation: MCP Server Setup", week: 2 },
        { title: "Multi-Agent Orchestration Patterns", week: 3 },
        { title: "Security & Neural Privacy", week: 3 },
        { title: "Monetization: Launching your AAA", week: 4 },
        { title: "Capstone Project: The Autonomous Agent", week: 5 },
    ];

    // Calculate current progress
    const progressPercentage = Math.min(100, Math.round((completedLessons.length / curriculum.length) * 100));
    const nextLessonIndex = Math.min(curriculum.length - 1, Math.max(...completedLessons) + 1);
    const nextLesson = curriculum[nextLessonIndex] || curriculum[0];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-24 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div className="flex-1">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">{getGreeting()}, {displayName}</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm md:text-base">Welcome to your Oliskey command center.</p>
                    </div>
                    <button
                        onClick={signOut}
                        className="self-start md:self-auto flex items-center px-4 py-2 sm:px-5 sm:py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-full text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-400 transition-colors shadow-sm"
                    >
                        <LogOut size={16} className="mr-2" /> Sign Out
                    </button>
                </div>

                {/* Stats / Quick Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-5 hover:shadow-md transition-all">
                        <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                            <BookOpen size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Active Courses</p>
                            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">0</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-5 hover:shadow-md transition-all">
                        <div className="p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl">
                            <CreditCard size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Billing Status</p>
                            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Free Tier</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col justify-center gap-4 hover:shadow-md transition-all sm:col-span-2 md:col-span-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                                    <User size={20} strokeWidth={1.5} className="sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Profile Completion</p>
                                    <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">80%</p>
                                </div>
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column (Content) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Recommended Section / Active Course */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all">
                            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                                <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Oliskey Learning Hub</h2>
                                <Link to="/roadmap-2030" className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300">View Roadmap</Link>
                            </div>
                            <div className="p-5 sm:p-6">
                                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center bg-blue-50/30 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
                                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex-shrink-0 shadow-lg shadow-blue-600/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                        <Play size={28} fill="currentColor" />
                                    </div>
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Active</span>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg truncate">Agentic AI Architect</h3>
                                        </div>
                                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-4 whitespace-nowrap overflow-hidden text-ellipsis">Next: {nextLesson.title} (Week {nextLesson.week})</p>
                                        <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${progressPercentage}%` }}></div>
                                        </div>
                                    </div>
                                    <Link
                                        to="/learning-hub"
                                        className="w-full sm:w-auto px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
                                    >
                                        Continue Learning <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-all">
                            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-slate-800">
                                <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                    Notifications
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-slate-800">
                                {/* New School App Announcement */}
                                <div className="p-5 sm:p-6 flex gap-4 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-colors cursor-pointer border-l-4 border-green-500">
                                    <div className="mt-1.5 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0">
                                        <Calendar size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-900 dark:text-white font-bold">Product Roadmap Update</p>
                                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                                            <strong>Announcement:</strong> I'll be publishing my School app on <strong>February 15, 2026</strong>.
                                        </p>
                                        <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">Pinned • Today</p>
                                    </div>
                                </div>

                                <div className="p-5 sm:p-6 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                    <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 animate-pulse"></div>
                                    <div>
                                        <p className="text-sm text-slate-800 dark:text-slate-200 font-semibold">Welcome to the Oliskey Ecosystem!</p>
                                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">We're glad to have you here. Explore our products and services to get started.</p>
                                        <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">Just now</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-6">

                        {/* Upgrade to Pro - Professional Card */}
                        <div className="bg-slate-900 dark:bg-black text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden group border border-transparent dark:border-slate-800">
                            {/* Abstract Shapes */}
                            <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-600 rounded-full blur-[60px] opacity-70 group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-600 rounded-full blur-[60px] opacity-70 group-hover:scale-110 transition-transform duration-700"></div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 border border-white/10 text-yellow-300">
                                    <Shield size={24} />
                                </div>
                                <h3 className="font-bold text-xl mb-2">Upgrade to Pro</h3>
                                <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                                    Unlock premium courses, priority support, and advanced cloud tools.
                                </p>
                                <Link to="/pricing" className="w-full py-3.5 bg-white text-slate-900 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-white/10 flex items-center justify-center gap-2">
                                    View Plans <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>

                        {/* Account Settings Menu */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-2 transition-all">
                            <nav className="space-y-1">
                                <Link to="/settings" className="flex items-center justify-between px-4 py-3.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-semibold group">
                                    <div className="flex items-center gap-3">
                                        <div className="text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            <User size={18} />
                                        </div>
                                        Account Settings
                                    </div>
                                    <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                </Link>

                                <a href="#" className="flex items-center justify-between px-4 py-3.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-xl text-sm font-medium transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            <Settings size={18} />
                                        </div>
                                        Preferences
                                    </div>
                                </a>

                                <a href="#" className="flex items-center justify-between px-4 py-3.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-xl text-sm font-medium transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            <Bell size={18} />
                                        </div>
                                        Notifications
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;