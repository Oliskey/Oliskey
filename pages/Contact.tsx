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
    const submission = {
      full_name: formData.get('full_name'),
      company: formData.get('company'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([submission]);

      if (error) throw error;

      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      console.error('Error submitting form:', err);
      setStatus('error');
      // Safer error message extraction
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Get in touch with Oliskey</h1>
          <p className="text-xl text-slate-600">Have a project in mind or want to learn more? We'd love to hear from you.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-lg text-primary-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Email</h3>
                  <p className="text-slate-600 break-all">oliskeylee@gmail.com</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-lg text-primary-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Phone</h3>
                  <p className="text-slate-600">09049417103</p>
                  <p className="text-slate-500 text-sm">Mon-Fri 9am-6pm</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-lg text-primary-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Office</h3>
                  <p className="text-slate-600">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-sm border border-gray-100/50">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
              
              {status === 'success' ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700">Thank you for contacting us. We will get back to you shortly.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-6 py-2 bg-white border border-green-200 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
                      <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input 
                        required 
                        name="full_name" 
                        id="full_name" 
                        type="text" 
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 text-slate-900 placeholder-slate-400 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-transparent outline-none transition-all" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                      <input 
                        name="company" 
                        id="company" 
                        type="text" 
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 text-slate-900 placeholder-slate-400 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-transparent outline-none transition-all" 
                        placeholder="Company Ltd" 
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input 
                      required 
                      name="email" 
                      id="email" 
                      type="email" 
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 text-slate-900 placeholder-slate-400 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-transparent outline-none transition-all" 
                      placeholder="john@example.com" 
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <textarea 
                      required 
                      name="message" 
                      id="message" 
                      rows={5} 
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 text-slate-900 placeholder-slate-400 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-transparent outline-none transition-all resize-none" 
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary-600 text-white font-bold py-4 rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
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