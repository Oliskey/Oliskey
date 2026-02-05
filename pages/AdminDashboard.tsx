import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import {
    Loader2,
    ShieldAlert,
    Mail,
    Users,
    FileText,
    CheckCircle,
    TrendingUp,
    TrendingDown,
    Search,
    Filter,
    Download,
    BarChart3,
    Package,
    LayoutDashboard
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

interface ContactSubmission {
    id: string;
    full_name: string;
    email: string;
    company: string;
    message: string;
    created_at: string;
}

interface NewsletterSubscriber {
    id: string;
    email: string;
    created_at: string;
}

const AdminDashboard: React.FC = () => {
    const { user, isAdmin, loading: authLoading, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'newsletter' | 'products' | 'settings'>('overview');

    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
    const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user || !isAdmin) {
                return;
            }
            fetchData();
        }
    }, [user, isAdmin, authLoading]);

    const fetchData = async () => {
        setLoadingData(true);
        setError(null);
        try {
            const { data: contactData, error: contactError } = await supabase
                .from('contact_submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (contactError) throw contactError;
            setContacts(contactData || []);

            const { data: subData, error: subError } = await supabase
                .from('newsletter_subscribers')
                .select('*')
                .order('created_at', { ascending: false });

            if (subError) throw subError;
            setSubscribers(subData || []);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to load admin data');
        } finally {
            setLoadingData(false);
        }
    };

    if (authLoading) return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen pt-24 bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 mb-6">
                    <ShieldAlert size={40} />
                </div>
                <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Authorized Access Only</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">This area is reserved for administrators. Please log in with an admin account or return to the main dashboard.</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-lg"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex transition-colors duration-300">
            {/* Professional Sidebar */}
            <AdminSidebar
                onSignOut={signOut}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-20 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{activeTab.replace('-', ' ')}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage your platform resources and communication.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-medium text-slate-500 dark:text-slate-400">
                            Last Refreshed: {new Date().toLocaleTimeString()}
                        </div>
                        <button
                            onClick={fetchData}
                            className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Refresh Data"
                        >
                            <Loader2 className={loadingData ? "animate-spin" : ""} size={20} />
                        </button>
                    </div>
                </header>

                {/* Dashboard Scrollable Area */}
                <main className="p-8 overflow-y-auto h-[calc(100vh-80px)]">
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* KPI Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <KPICard
                                    title="Contact Requests"
                                    value={contacts.length.toString()}
                                    icon={<Mail size={24} />}
                                    color="text-blue-600"
                                    bgColor="bg-blue-50 dark:bg-blue-900/30"
                                    trend="up"
                                    percentage="+12%"
                                />
                                <KPICard
                                    title="Newsletter Subs"
                                    value={subscribers.length.toString()}
                                    icon={<Users size={24} />}
                                    color="text-green-600"
                                    bgColor="bg-green-50 dark:bg-green-900/30"
                                    trend="up"
                                    percentage="+5%"
                                />
                                <KPICard
                                    title="Active Products"
                                    value="7"
                                    icon={<Package size={24} />}
                                    color="text-orange-600"
                                    bgColor="bg-orange-50 dark:bg-orange-900/30"
                                    trend="stable"
                                    percentage="Stable"
                                />
                            </div>

                            {/* Recent Activity Mini Table */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900 dark:text-white">Recent Contact Inquiries</h3>
                                    <button onClick={() => setActiveTab('contacts')} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                                            <tr>
                                                <th className="py-3 px-6 text-[10px] font-bold text-slate-500 uppercase">From</th>
                                                <th className="py-3 px-6 text-[10px] font-bold text-slate-500 uppercase">Date</th>
                                                <th className="py-3 px-6 text-[10px] font-bold text-slate-500 uppercase text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                            {contacts.slice(0, 5).map(contact => (
                                                <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <div className="font-bold text-slate-900 dark:text-white text-sm">{contact.full_name}</div>
                                                        <div className="text-xs text-slate-500">{contact.email}</div>
                                                    </td>
                                                    <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                                                        {new Date(contact.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <button className="text-blue-600 hover:text-blue-700 text-xs font-bold">Reply</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contacts' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                                <div className="relative flex-1 max-w-sm w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search messages..."
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-100 transition-all">
                                        <Filter size={16} /> Filter
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all">
                                        <Download size={16} /> Export
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                                            <tr>
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Details</th>
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Inquiry</th>
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                            {contacts.map(contact => (
                                                <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                    <td className="py-6 px-6 align-top">
                                                        <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tighter">
                                                            {new Date(contact.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 mt-1">
                                                            {new Date(contact.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </td>
                                                    <td className="py-6 px-6 align-top">
                                                        <div className="font-bold text-slate-900 dark:text-white mb-1">{contact.full_name}</div>
                                                        <div className="text-xs text-blue-600 hover:underline cursor-pointer">{contact.email}</div>
                                                        <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">{contact.company || "Personal"}</div>
                                                    </td>
                                                    <td className="py-6 px-6 align-top">
                                                        <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 max-w-sm" title={contact.message}>
                                                            {contact.message}
                                                        </div>
                                                        <button className="text-[10px] text-blue-600 font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Read Full Message</button>
                                                    </td>
                                                    <td className="py-6 px-6 align-top text-right">
                                                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] font-bold rounded-full uppercase">New</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {contacts.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="py-20 text-center text-slate-400">
                                                        <Mail size={48} className="mx-auto mb-4 opacity-10" />
                                                        <p>No messages received yet.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'newsletter' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* Subscribers View */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 max-w-4xl">
                                <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Platform Subscribers</h3>
                                    <p className="text-xs text-slate-500 mt-1">Users who signed up for news and updates.</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                                            <tr>
                                                <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase">Status</th>
                                                <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase">Email Address</th>
                                                <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase text-right">Join Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
                                            {subscribers.map(sub => (
                                                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    </td>
                                                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                                                        {sub.email}
                                                    </td>
                                                    <td className="py-4 px-6 text-slate-500 text-right whitespace-nowrap">
                                                        {new Date(sub.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </td>
                                                </tr>
                                            ))}
                                            {subscribers.length === 0 && (
                                                <tr>
                                                    <td colSpan={3} className="py-12 text-center text-slate-400">No subscribers found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for Mock Tabs */}
                    {(activeTab === 'products' || activeTab === 'settings') && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-400 mb-6">
                                <LayoutDashboard size={48} strokeWidth={1} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Advanced Feature Coming Soon</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">Platform Management and Fine-grained Settings are slated for the Phase 2 Admin rollout.</p>
                            <button onClick={() => setActiveTab('overview')} className="text-blue-600 font-bold hover:underline">Return to Overview</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, icon, color, bgColor, trend, percentage }: {
    title: string,
    value: string,
    icon: React.ReactNode,
    color: string,
    bgColor: string,
    trend: 'up' | 'down' | 'stable',
    percentage: string
}) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-all hover:shadow-md group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 ${bgColor} ${color} rounded-xl transition-transform group-hover:scale-110 duration-500`}>
                {icon}
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${trend === 'up' ? 'text-green-600 bg-green-50' :
                trend === 'down' ? 'text-red-600 bg-red-50' :
                    'text-slate-600 bg-slate-50'
                }`}>
                {trend === 'up' && <TrendingUp size={10} />}
                {trend === 'down' && <TrendingDown size={10} />}
                {percentage}
            </div>
        </div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
    </div>
);

export default AdminDashboard;
