import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    User,
    Lock,
    Bell,
    Shield,
    ChevronRight,
    Check,
    Camera,
    Mail,
    Key,
    Smartphone,
    Globe,
    CreditCard,
    ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'billing'>('profile');
    const [saved, setSaved] = useState(false);

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'security', label: 'Security', icon: <Lock size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-24 pb-12 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Navigation */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/dashboard" className="p-2 hover:bg-white dark:hover:bg-slate-900 rounded-full transition-all text-slate-500 shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-slate-800">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h1>
                        <p className="text-xs text-slate-500 font-medium">Manage your personal command center.</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <aside className="lg:w-64 space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]'
                                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-400'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {tab.icon}
                                    {tab.label}
                                </div>
                                {activeTab === tab.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </button>
                        ))}
                    </aside>

                    {/* Content Area */}
                    <main className="flex-1">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-8 lg:p-10">

                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-gray-100 dark:border-slate-800">
                                        <div className="relative">
                                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                                                {displayName.charAt(0)}
                                            </div>
                                            <button className="absolute -bottom-2 -right-2 p-2.5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 text-blue-600 hover:scale-110 transition-transform">
                                                <Camera size={18} />
                                            </button>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Public Profile</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Updates will be visible across the Oliskey ecosystem.</p>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Display Name</label>
                                            <input
                                                type="text"
                                                defaultValue={displayName}
                                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    defaultValue={user?.email || ''}
                                                    disabled
                                                    className="w-full bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 pl-10 text-sm font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                                />
                                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Bio (Professional Strategist)</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Tell us about your 2030 career goals..."
                                            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            onClick={handleSave}
                                            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
                                        >
                                            {saved ? <><Check size={18} /> Saved</> : 'Update Profile'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Security & Resilience</h3>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 group hover:border-blue-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-blue-600 shadow-sm">
                                                    <Key size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">Change Password</p>
                                                    <p className="text-xs text-slate-500">Update your account credentials.</p>
                                                </div>
                                            </div>
                                            <button className="p-2 hover:bg-blue-600 hover:text-white rounded-full transition-all group-hover:px-4 flex items-center gap-2">
                                                <span className="hidden group-hover:inline text-xs font-bold">Update</span>
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 group hover:border-emerald-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-emerald-600 shadow-sm">
                                                    <Smartphone size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">Multi-Factor Auth (MFA)</p>
                                                    <p className="text-xs text-slate-500">Add an extra layer of platform security.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest">Off</span>
                                                <button className="w-10 h-5 bg-gray-200 dark:bg-slate-700 rounded-full relative transition-all">
                                                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-orange-600 shadow-sm">
                                                    <Globe size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">Connected Devices</p>
                                                    <p className="text-xs text-slate-500">Manage your active sessions.</p>
                                                </div>
                                            </div>
                                            <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Notification Preferences</h3>

                                    <div className="space-y-6">
                                        {[
                                            { title: 'Email Updates', desc: 'Receive newsletters and platform announcements.', icon: <Mail size={18} /> },
                                            { title: 'Learning Alerts', desc: 'Get notified when new roadmap modules are unlocked.', icon: <Bell size={18} /> },
                                            { title: 'Security Alerts', desc: 'Immediate notification on login from new devices.', icon: <Shield size={18} /> }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 border-gray-100 dark:border-slate-800 transition-all hover:translate-x-1">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-slate-400">{item.icon}</div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</p>
                                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <button className="w-12 h-6 bg-blue-600 rounded-full relative shadow-inner">
                                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Billing Tab */}
                            {activeTab === 'billing' && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Billing & Subscription</h3>

                                    <div className="p-8 bg-blue-600 rounded-3xl text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-125 transition-transform"></div>

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-8">
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-1">Current Plan</p>
                                                    <h4 className="text-2xl font-black">Free Strategist</h4>
                                                </div>
                                                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase border border-white/20">Active</div>
                                            </div>
                                            <Link to="/pricing" className="px-6 py-3 bg-white text-blue-600 rounded-xl text-xs font-black hover:scale-105 transition-all shadow-xl shadow-black/10 inline-block">
                                                Upgrade to Pro Hub
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Payment History</p>
                                        <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800 p-8 text-center">
                                            <CreditCard className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={32} strokeWidth={1.5} />
                                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No payment records found.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Settings;
