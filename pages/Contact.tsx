import React, { useState } from 'react';
import { Mail, MapPin, Phone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const full_name = formData.get('full_name') as string;
    const company = formData.get('company') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const website = formData.get('website') as string; // Honeypot field

    // --- SPAM CHECK (Client-side optimization) ---
    // If honeypot is filled, simulate success but do nothing.
    if (website) {
        // Pretend it worked to confuse bots
        setStatus('success');
        setLoading(false);
        (e.target as HTMLFormElement).reset();
        return;
    }

    // --- SECURITY: INPUT VALIDATION ---
    // Prevent payload stuffing or excessive data costs
    if (message.length > 2000) {
        setErrorMessage("Message exceeds 2000 characters limit.");
        setLoading(false);
        return;
    }
    if (full_name.length > 100) {
        setErrorMessage("Name is too long.");
        setLoading(false);
        return;
    }
    // Basic regex for email sanitization
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setErrorMessage("Please enter a valid email address.");
        setLoading(false);
        return;
    }

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{ 
            full_name: full_name.trim(), 
            company: company ? company.trim().substring(0, 100) : null,
            email: email.trim().toLowerCase(),
            message: message.trim(),
            website: website // Send empty string/null to pass DB spam check
        }]);

      if (error) throw error;

      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      console.error('Error submitting form:', err);
      setStatus('error');
      // Generic error message for security
      setErrorMessage('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-24 bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Get in touch with Oliskey</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">Have a project in mind or want to learn more? We'd love to hear from you.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-primary-600 dark:text-blue-400">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Email</h3>
                  <p className="text-slate-600 dark:text-slate-400 break-all">oliskeylee@gmail.com</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-primary-600 dark:text-blue-400">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Phone</h3>
                  <p className="text-slate-600 dark:text-slate-400">09049417103</p>
                  <p className="text-slate-500 dark:text-slate-500 text-sm">Mon-Fri 9am-6pm</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-primary-600 dark:text-blue-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Office</h3>
                  <p className="text-slate-600 dark:text-slate-400">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a message</h2>
              
              {status === 'success' ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mb-2">Message Sent!</h3>
                  <p className="text-green-700 dark:text-green-300">Thank you for contacting us. We will get back to you shortly.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-6 py-2 bg-white dark:bg-slate-800 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 font-semibold rounded-lg hover:bg-green-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-center">
                      <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  
                  {/* Honeypot Field - Hidden from humans, visible to bots */}
                  <div className="hidden">
                      <label htmlFor="website">Website</label>
                      <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                      <input 
                        required 
                        name="full_name" 
                        id="full_name" 
                        type="text" 
                        maxLength={100}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 focus:border-transparent outline-none transition-all" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company</label>
                      <input 
                        name="company" 
                        id="company" 
                        type="text" 
                        maxLength={100}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 focus:border-transparent outline-none transition-all" 
                        placeholder="Company Ltd" 
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input 
                      required 
                      name="email" 
                      id="email" 
                      type="email" 
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 focus:border-transparent outline-none transition-all" 
                      placeholder="john@example.com" 
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                    <textarea 
                      required 
                      name="message" 
                      id="message" 
                      rows={5} 
                      maxLength={2000}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 focus:border-transparent outline-none transition-all resize-none" 
                      placeholder="How can we help you?"
                    ></textarea>
                    <p className="text-right text-xs text-slate-400 dark:text-slate-500 mt-1">Max 2000 characters</p>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary-600 dark:bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-primary-700 dark:hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin mr-2" /> Sending...
                      </>
                    ) : (
                      'Submit Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;