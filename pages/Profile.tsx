import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { User, Mail, Save, Loader2, Camera, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [website, setWebsite] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            getProfile();
        }
    }, [user]);

    const getProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, website, avatar_url')
                .eq('id', user?.id)
                .single();

            if (error) {
                // If profile doesn't exist, it handled by trigger, but just in case
                console.warn('Error loading profile', error);
            }

            if (data) {
                setFullName(data.full_name || '');
                setWebsite(data.website || '');
                setAvatarUrl(data.avatar_url);
            } else if (user?.user_metadata) {
                // Fallback to auth metadata
                setFullName(user.user_metadata.full_name || '');
                setAvatarUrl(user.user_metadata.avatar_url || '');
            }
        } catch (error) {
            console.error('Error loading user data!', error);
        } finally {
            setLoading(false);
        }
    };

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user?.id || 'unknown'}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                if (uploadError.message.includes("bucket not found")) {
                    throw new Error("The 'avatars' storage bucket is missing in Supabase.");
                }
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(data.publicUrl);
            setMessage({ type: 'success', text: 'Image uploaded! Click Save to apply.' });

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setUploading(false);
        }
    };

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const updates = {
            id: user?.id,
            full_name: fullName,
            website,
            avatar_url: avatarUrl, // In a real app, handle file upload separately
            updated_at: new Date(),
        };

        try {
            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-24 pb-12 transition-colors duration-300">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account information and preferences.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 sm:p-8">

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${message.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800'
                            }`}>
                            {message.type === 'error' && <AlertCircle size={20} className="mt-0.5" />}
                            <span className="font-medium">{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={updateProfile} className="space-y-8">

                        {/* Avatar Section */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100 dark:border-slate-800">
                            <div className="relative group">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md" />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 border-4 border-white dark:border-slate-800 shadow-md">
                                        <User size={40} />
                                    </div>
                                )}
                                <label className={`absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg cursor-pointer ${uploading ? 'opacity-70 cursor-wait' : ''}`}>
                                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={uploadAvatar}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Photo</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    {uploading ? 'Uploading...' : 'Accepts .jpg, .png, or .gif (Max 2MB)'}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        disabled
                                        value={user?.email || ''}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-1.5">Email address cannot be changed.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Website</label>
                                <input
                                    type="url"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                            <Link to="/dashboard" className="px-6 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
