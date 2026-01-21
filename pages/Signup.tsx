import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight, User, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in (e.g. returned from Google Auth)
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName,
          },
          // This tells Supabase where to redirect after clicking the email link
          emailRedirectTo: window.location.origin, 
        },
      });

      if (error) throw error;

      // Check if session is null (implies email verification is required)
      if (data.session) {
          // If auto-confirm is enabled or session exists, go to dashboard
          navigate('/');
      } else {
          setSuccess(true);
      }
    } catch (err: any) {
      console.error("Signup Error:", err);
      
      // Handle specific SMTP configuration errors gracefully
      if (err.message && err.message.includes("Error sending confirmation email")) {
        setError("System Error: Unable to send verification email. This is often due to invalid SMTP configuration (e.g., missing App Password).");
      } else {
        setError(err.message || 'Failed to sign up');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Using origin only prevents mismatch errors if /dashboard isn't explicitly whitelisted
          redirectTo: window.location.origin,
          // Force the account selection screen every time
          queryParams: {
            prompt: 'select_account',
          }
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Google Signup Error:", err);
      setError(err.message || 'Failed to sign up with Google. Please ensure Google Auth is enabled in your Supabase dashboard.');
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    setResendStatus('idle');
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      if (error) throw error;
      setResendStatus('sent');
    } catch (err) {
      console.error(err);
      setResendStatus('error');
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Check your email</h2>
                <p className="text-slate-600 mb-6 text-lg">
                    We've sent a verification link to <span className="font-semibold text-slate-900">{email}</span>.
                </p>
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 text-sm text-blue-800 text-left">
                  <strong>Tip:</strong> If you don't see the email in your inbox, please check your spam folder.
                </div>

                <div className="flex flex-col gap-3">
                    <Link to="/login" className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors">
                        Proceed to Login
                    </Link>
                    
                    <button 
                      onClick={handleResendEmail} 
                      disabled={resending || resendStatus === 'sent'}
                      className="text-sm text-slate-500 hover:text-slate-900 mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {resending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                        {resendStatus === 'sent' ? 'Email Resent!' : 'Resend Verification Email'}
                    </button>
                    {resendStatus === 'error' && <span className="text-xs text-red-500">Failed to resend. Please try again.</span>}
                    
                    <button onClick={() => setSuccess(false)} className="text-sm text-slate-400 hover:text-slate-600">
                        Use a different email
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Right Side - Visual (Swapped for Signup) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative items-center justify-center overflow-hidden order-2">
        <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 p-12 text-center text-white">
            <div className="mb-8 flex justify-center">
                <Logo variant="light" className="h-24 w-24" showText={false} />
            </div>
            <h2 className="text-4xl font-bold mb-6">Build the Future</h2>
            <p className="text-blue-100 text-lg max-w-md mx-auto">
                Join a community of developers, creators, and innovators building on the Oliskey platform.
            </p>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 relative order-1">
        {/* Changed from absolute to flow-based for mobile to prevent overlap */}
        <div className="lg:hidden mb-10 self-start">
             <Logo variant="dark" className="h-8" />
        </div>
        
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500 mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full bg-white text-slate-700 font-bold py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 mb-6 shadow-sm"
          >
             <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
             </svg>
             Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  placeholder="Create a password"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">Must be at least 6 characters long.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-400">
            By creating an account, you agree to our <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center text-sm text-slate-400 hover:text-slate-600 transition-colors">
                 <ArrowRight className="rotate-180 mr-2" size={16} /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;