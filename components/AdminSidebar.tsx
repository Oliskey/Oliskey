import React from 'react';
import {
    LayoutDashboard,
    Mail,
    Users,
    Settings,
    LogOut,
    ShieldCheck,
    BarChart3,
    Package,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
    onSignOut: () => void;
    activeTab: string;
    setActiveTab: (tab: any) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onSignOut, activeTab, setActiveTab }) => {
    const location = useLocation();

    const menuItems = [
        { id: 'overview', name: 'Overview', icon: <BarChart3 size={20} />, color: 'text-blue-500' },
        { id: 'contacts', name: 'Messages', icon: <Mail size={20} />, color: 'text-purple-500' },
        { id: 'newsletter', name: 'Subscribers', icon: <Users size={20} />, color: 'text-green-500' },
        { id: 'products', name: 'Products', icon: <Package size={20} />, color: 'text-orange-500' }, // Mock
        { id: 'settings', name: 'Admin Settings', icon: <Settings size={20} />, color: 'text-slate-500' }, // Mock
    ];

    return (
        <div className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex flex-col min-h-[calc(100vh-80px)]">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-blue-600 mb-2">
                    <ShieldCheck size={24} />
                    <span className="font-bold tracking-tight">Admin Console</span>
                </div>
                <Link
                    to="/dashboard"
                    className="flex items-center text-xs text-slate-500 hover:text-blue-600 transition-colors gap-1"
                >
                    <ArrowLeft size={12} /> Back to Dashboard
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${activeTab === item.id
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`${activeTab === item.id ? 'text-blue-600' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600'}`}>
                                {item.icon}
                            </span>
                            {item.name}
                        </div>
                        {activeTab === item.id && <ChevronRight size={14} />}
                    </button>
                ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-slate-800">
                <button
                    onClick={onSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
