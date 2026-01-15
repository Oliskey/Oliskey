import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Settings, BookOpen, Bell, CreditCard } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{getGreeting()}, {displayName}</h1>
            <p className="text-slate-500">Welcome to your Oliskey command center.</p>
          </div>
          <button 
            onClick={signOut}
            className="self-start md:self-auto flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-gray-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} className="mr-2" /> Sign Out
          </button>
        </div>

        {/* Stats / Quick Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <BookOpen size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Active Courses</p>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <CreditCard size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Billing Status</p>
                    <p className="text-xl font-bold text-slate-900">Free Tier</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <User size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Profile Completion</p>
                    <p className="text-2xl font-bold text-slate-900">80%</p>
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column (Content) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Recommended Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-bold text-lg text-slate-900">Recommended for You</h2>
                        <a href="#" className="text-sm text-blue-600 font-medium hover:underline">View All</a>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="w-16 h-16 bg-slate-200 rounded-lg flex-shrink-0"></div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900">React Performance Masterclass</h3>
                                <p className="text-sm text-slate-500">Learn how to optimize your applications for scale.</p>
                            </div>
                            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors">
                                Start
                            </button>
                        </div>
                    </div>
                </div>

                 {/* Notifications */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                             Notifications
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="p-6 flex gap-4">
                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                            <div>
                                <p className="text-sm text-slate-800 font-medium">Welcome to the Oliskey Ecosystem!</p>
                                <p className="text-xs text-slate-500 mt-1">We're glad to have you here. Explore our products and services.</p>
                                <p className="text-xs text-slate-400 mt-2">Just now</p>
                            </div>
                        </div>
                    </div>
                 </div>

            </div>

            {/* Right Column (Sidebar) */}
            <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/30 blur-2xl rounded-full pointer-events-none"></div>
                     <h3 className="font-bold text-lg mb-2 relative z-10">Upgrade to Pro</h3>
                     <p className="text-slate-300 text-sm mb-6 relative z-10">Get access to premium courses, priority support, and cloud tools.</p>
                     <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-blue-50 transition-colors relative z-10">
                        View Plans
                     </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
                    <nav className="space-y-1">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
                            <User size={18} /> Account Settings
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors">
                            <Settings size={18} /> Preferences
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors">
                            <Bell size={18} /> Notifications
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