import React, { useState, useEffect } from 'react';
import {
    Play,
    CheckCircle,
    Clock,
    ChevronRight,
    Lock,
    Video,
    FileText,
    MessageSquare,
    Trophy,
    ArrowLeft,
    Layout,
    Settings,
    MoreVertical,
    Volume2,
    Maximize2,
    List
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const LearningHub: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [activeLesson, setActiveLesson] = useState(0);
    const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
        const saved = localStorage.getItem('oliskey_progress');
        return saved ? JSON.parse(saved) : [0];
    });
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);

    useEffect(() => {
        localStorage.setItem('oliskey_progress', JSON.stringify(completedLessons));
    }, [completedLessons]);

    const curriculum = [
        { title: "Introduction to 2030 Strategy", duration: "12 min", week: 1, type: "video" },
        { title: "Understanding Model Context Protocol", duration: "45 min", week: 1, type: "video" },
        { title: "Agentic vs Generic AI Systems", duration: "30 min", week: 2, type: "video" },
        { title: "Implementation: MCP Server Setup", duration: "1 hour", week: 2, type: "lab" },
        { title: "Multi-Agent Orchestration Patterns", duration: "55 min", week: 3, type: "video" },
        { title: "Security & Neural Privacy", duration: "40 min", week: 3, type: "video" },
        { title: "Monetization: Launching your AAA", duration: "1.5 hours", week: 4, type: "guide" },
        { title: "Capstone Project: The Autonomous Agent", duration: "4 weeks", week: 5, type: "project" },
    ];

    const handleComplete = (index: number) => {
        if (!completedLessons.includes(index)) {
            setCompletedLessons([...completedLessons, index]);
        }
    };

    const progressPercentage = Math.round((completedLessons.length / curriculum.length) * 100);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col pt-16">
            {/* Top Navigation Bar */}
            <div className="h-14 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-16 z-30">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="h-6 w-px bg-gray-200 dark:bg-slate-700"></div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-md">
                            Agentic AI Architect (Workforce 2030)
                        </h1>
                        <p className="text-[10px] text-slate-500 font-medium">Week {curriculum[activeLesson].week} • Module {activeLesson + 1}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                        <div className="w-32 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-1000"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{progressPercentage}%</span>
                    </div>
                    <Link to="/settings" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
                        <Settings size={20} />
                    </Link>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Backdrop for Mobile Sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content Area: Video Player */}
                <div className={`flex-1 overflow-y-auto transition-all duration-500 ${sidebarOpen ? 'lg:mr-[350px]' : ''}`}>
                    <div className="max-w-5xl mx-auto p-4 md:p-8">
                        {/* Video Player Container */}
                        <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group border border-white/10">
                            {/* Virtual Video Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent">
                                <div className="flex flex-col items-center">
                                    <button className="w-20 h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-2xl active:scale-95 group">
                                        <Play size={40} className="ml-1 fill-white" />
                                    </button>
                                    <p className="mt-6 text-white/80 font-medium tracking-wide">Continue Learning: {curriculum[activeLesson].title}</p>
                                </div>
                            </div>

                            {/* Player Controls Mock */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                                <div className="w-full h-1 bg-white/20 rounded-full mb-4 overflow-hidden">
                                    <div className="h-full bg-blue-600 w-1/3"></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-white">
                                        <Play size={20} className="fill-white" />
                                        <Volume2 size={20} />
                                        <span className="text-xs font-medium">04:32 / {curriculum[activeLesson].duration}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white">
                                        <span className="text-xs font-bold px-2 py-0.5 border border-white/20 rounded">1.0x</span>
                                        <Maximize2 size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lesson Info */}
                        <div className="mt-12">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                                        {curriculum[activeLesson].title}
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5"><Clock size={16} /> {curriculum[activeLesson].duration}</span>
                                        <span className="flex items-center gap-1.5"><Video size={16} /> High Quality 4K</span>
                                        <span className="flex items-center gap-1.5"><Trophy size={16} className="text-orange-400" /> Milestone 1</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleComplete(activeLesson)}
                                    className={`w-full md:w-auto px-8 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${completedLessons.includes(activeLesson)
                                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                        : 'bg-blue-600 text-white shadow-blue-500/20 hover:scale-105 active:scale-95'
                                        }`}
                                >
                                    {completedLessons.includes(activeLesson) ? (
                                        <><CheckCircle size={20} /> Module Completed</>
                                    ) : (
                                        'Complete & Next'
                                    )}
                                </button>
                            </div>

                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                                    This module covers the core transition from simple prompt engineering to complex agentic orchestration.
                                    By the end of this session, you will understand how to build a multi-agent system that can autonomously execute
                                    high-level business objectives using the Model Context Protocol (MCP).
                                </p>

                                <div className="grid sm:grid-cols-2 gap-6 mb-12">
                                    <div className="p-6 bg-gray-50 dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800">
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <FileText size={18} className="text-blue-500" /> Resources
                                        </h4>
                                        <ul className="space-y-3">
                                            {['Module PDF Notes', 'MCP Server Boilerplate', 'Reference Architectures'].map(item => (
                                                <li key={item} className="flex items-center justify-between group cursor-pointer">
                                                    <span className="text-sm text-slate-500 group-hover:text-blue-500 transition-colors">{item}</span>
                                                    <ChevronRight size={14} className="text-slate-300" />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-6 bg-gray-50 dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800">
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <MessageSquare size={18} className="text-purple-500" /> Discussion
                                        </h4>
                                        <p className="text-xs text-slate-400 mb-4">Join 1,240 other students in this module's thread.</p>
                                        <button className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline">Open Community Hub</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Sidebar Toggle */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`fixed right-4 bottom-4 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-50 p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-110`}
                >
                    {sidebarOpen ? <ChevronRight size={24} /> : <List size={24} />}
                </button>

                {/* Curriculum Sidebar */}
                <div className={`fixed inset-y-0 right-0 w-full sm:w-[350px] bg-gray-50 dark:bg-slate-900 border-l border-gray-100 dark:border-slate-800 z-50 pt-32 lg:pt-32 pb-8 px-6 transition-transform duration-500 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full shadow-none'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-black text-xl text-slate-900 dark:text-white">Curriculum</h3>
                        <span className="text-[10px] font-black px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">8 MODULES</span>
                    </div>

                    <div className="space-y-2 h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                        {curriculum.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveLesson(idx)}
                                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border ${activeLesson === idx
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20 scale-[1.02]'
                                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-gray-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500/50'
                                    } group relative`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 flex-shrink-0 transition-colors ${activeLesson === idx ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`}>
                                        {completedLessons.includes(idx) ? (
                                            <CheckCircle size={18} />
                                        ) : (
                                            idx > completedLessons.length ? <Lock size={16} /> : <Play size={16} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Week {item.week}</div>
                                        <div className="text-sm font-bold leading-tight mb-1">{item.title}</div>
                                        <div className={`text-[10px] transition-opacity ${activeLesson === idx ? 'opacity-90' : 'opacity-40'}`}>
                                            {item.duration} • {item.type.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Footer of Sidebar: Badge Progress */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-800">
                        <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black opacity-80 uppercase tracking-widest">Next Unlock</div>
                                    <div className="text-xs font-bold">2030 Audit Certified</div>
                                </div>
                            </div>
                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                            <p className="mt-2 text-[10px] font-medium opacity-80">Finish Week 4 to earn your first platform badge.</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
        </div>
    );
};

export default LearningHub;
