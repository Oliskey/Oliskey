import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Settings, BookOpen, Bell, CreditCard, ChevronRight, Shield, Zap, Calendar } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{getGreeting()}, {displayName}</h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">Welcome to your Oliskey command center.</p>
          </div>
          <button 
            onClick={signOut}
            className="self-start md:self-auto flex items-center px-4 py-2 sm:px-5 sm:py-2.5 bg-white border border-gray-200 rounded-full text-slate-600 text-sm font-semibold hover:bg-gray-50 hover:text-red-600 transition-colors shadow-sm"
          >
            <LogOut size={16} className="mr-2" /> Sign Out
          </button>
        </div>

        {/* Stats / Quick Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="p-3 sm:p-4 bg-blue-50 text-blue-600 rounded-2xl">
                    <BookOpen size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
                </div>
                <div>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Active Courses</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">0</p>
                </div>
            </div>
            
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="p-3 sm:p-4 bg-purple-50 text-purple-600 rounded-2xl">
                    <CreditCard size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
                </div>
                <div>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Billing Status</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Free Tier</p>
                </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center gap-4 hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
                <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <User size={20} strokeWidth={1.5} className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">Profile Completion</p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900">80%</p>
                        </div>
                     </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column (Content) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Recommended Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 sm:p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-bold text-base sm:text-lg text-slate-900">Recommended for You</h2>
                        <Link to="/courses" className="text-xs sm:text-sm text-blue-600 font-semibold hover:text-blue-700">View All</Link>
                    </div>
                    <div className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center bg-slate-50 p-5 rounded-xl border border-gray-100 hover:border-blue-100 transition-colors">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-lg flex-shrink-0 shadow-sm flex items-center justify-center text-slate-300">
                                <Zap size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1">React Performance Masterclass</h3>
                                <p className="text-xs sm:text-sm text-slate-500">Learn how to optimize your applications for scale.</p>
                            </div>
                            <button className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/10">
                                Start
                            </button>
                        </div>
                    </div>
                </div>

                 {/* Notifications */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-5 sm:p-6 border-b border-gray-100">
                        <h2 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                             Notifications
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {/* New School App Announcement */}
                        <div className="p-5 sm:p-6 flex gap-4 hover:bg-green-50/50 transition-colors cursor-pointer border-l-4 border-green-500">
                            <div className="mt-1.5 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                <Calendar size={16} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-900 font-bold">Product Roadmap Update</p>
                                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                                    <strong>Announcement:</strong> I'll be publishing my School app on <strong>February 15, 2026</strong>. 
                                </p>
                                <p className="text-[10px] sm:text-xs text-slate-400 mt-2 font-medium">Pinned • Today</p>
                            </div>
                        </div>

                        <div className="p-5 sm:p-6 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 animate-pulse"></div>
                            <div>
                                <p className="text-sm text-slate-800 font-semibold">Welcome to the Oliskey Ecosystem!</p>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">We're glad to have you here. Explore our products and services to get started.</p>
                                <p className="text-[10px] sm:text-xs text-slate-400 mt-2 font-medium">Just now</p>
                            </div>
                        </div>
                    </div>
                 </div>

            </div>

            {/* Right Column (Sidebar) */}
            <div className="space-y-6">
                
                {/* Upgrade to Pro - Professional Card */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden group">
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
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
                    <nav className="space-y-1">
                        <a href="#" className="flex items-center justify-between px-4 py-3.5 bg-slate-50 text-slate-900 rounded-xl text-sm font-semibold group">
                            <div className="flex items-center gap-3">
                                <div className="text-slate-500 group-hover:text-blue-600 transition-colors">
                                    <User size={18} />
                                </div>
                                Account Settings
                            </div>
                            <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </a>
                        
                        <a href="#" className="flex items-center justify-between px-4 py-3.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-medium transition-colors group">
                             <div className="flex items-center gap-3">
                                <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
                                    <Settings size={18} />
                                </div>
                                Preferences
                            </div>
                        </a>

                        <a href="#" className="flex items-center justify-between px-4 py-3.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-medium transition-colors group">
                             <div className="flex items-center gap-3">
                                <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
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