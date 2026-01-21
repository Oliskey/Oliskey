import React, { useEffect, useState } from 'react';
import { ArrowRight, Layers, Users, Zap, ChevronRight, ExternalLink, ShieldCheck, Smile, PenTool, LayoutGrid, Building, Loader2, Check, Bell, User } from 'lucide-react';
// @ts-ignore
import { Link, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Logo from '../components/Logo';
import OptimizedImage from '../components/OptimizedImage';
import { supabase } from '../supabase';

const Home: React.FC = () => {
  const location = useLocation();
  const { ecosystem, faqs } = useData(); // Use Data Context
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (location.state && (location.state as any).scrollToProducts) {
      const element = document.getElementById('products');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Clean up state
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  const scrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setSubscribing(true);
    setSubscribeStatus('idle');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
            setSubscribeStatus('success');
        } else {
            throw error;
        }
      } else {
        setSubscribeStatus('success');
      }
      setEmail('');
    } catch (err) {
      console.error(err);
      setSubscribeStatus('error');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-12 sm:pt-40 sm:pb-20 lg:pt-52 lg:pb-32 px-4 sm:px-6 overflow-hidden">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-0 opacity-[0.03]">
          <div className="animate-slow-spin">
             <Logo showText={false} className="h-[250px] w-[250px] xs:h-[300px] xs:w-[300px] sm:h-[400px] sm:w-[400px] md:h-[800px] md:w-[800px]" />
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto text-center relative z-10">
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-8 mb-6 sm:mb-12 opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards]">
             <button 
                onClick={scrollToProducts}
                className="h-20 w-20 sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 flex-shrink-0 relative group cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-105"
                aria-label="Scroll to products"
             >
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 rounded-full transition-colors scale-125 duration-500"></div>
                <Logo className="h-full w-full" variant="dark" showText={false} />
             </button>
             {/* Scaled Text for Mobile */}
             <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-slate-900 leading-none text-center md:text-left">
                Oliskey
             </h1>
          </div>
          
          <p className="text-base xs:text-lg sm:text-xl md:text-3xl text-slate-600 font-normal max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed tracking-tight opacity-0 animate-[fadeIn_0.8s_ease-out_0.4s_forwards] px-2">
            Systems that work. Culture that lasts. Creativity that never ends.
          </p>
          
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center opacity-0 animate-[fadeIn_0.8s_ease-out_0.6s_forwards] px-4">
            <button 
              onClick={scrollToProducts}
              className="w-full xs:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-blue-600 text-white font-medium text-sm sm:text-base hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:scale-105 flex items-center justify-center"
            >
              Explore Products <ArrowRight size={18} className="ml-2"/>
            </button>
            <Link 
              to="/investors" 
              className="w-full xs:w-auto group flex items-center justify-center px-6 py-3.5 sm:px-8 sm:py-4 rounded-full text-slate-900 font-medium text-sm sm:text-base hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              Investor Info <ChevronRight size={18} className="ml-1 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Manifesto */}
      <section className="py-12 sm:py-16 bg-white relative z-10">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-lg sm:text-2xl md:text-3xl leading-relaxed text-slate-800 font-light">
              <span className="font-semibold text-blue-600">Oliskey</span> is a global infrastructure brand powering products that scale. We combine rigor and imagination through our S.C.C framework — System, Culture, Creativity — to build platforms, education tools, AI services, and media that endure.
            </p>
         </div>
      </section>

      {/* Founder Spotlight */}
      <section className="py-16 sm:py-24 bg-slate-50 border-y border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
           <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-20">
              <div className="md:w-5/12 relative w-full max-w-sm md:max-w-none">
                 <div className="absolute inset-0 bg-blue-600 rounded-2xl transform rotate-3 scale-[1.02] opacity-10"></div>
                 {/* Optimized Image Component */}
                 <OptimizedImage 
                    src="/co-founder.jpg" 
                    alt="Oliskey Lee - Co-Founder" 
                    className="relative rounded-2xl shadow-2xl w-full aspect-[3/4] bg-gray-200"
                    priority={true} 
                 />
              </div>
              <div className="md:w-7/12 text-center md:text-left">
                 <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">Leadership</span>
                 <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">Meet the Creator</h2>
                 <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-6 sm:mb-8 italic">
                    "I started Oliskey with a single mission: to bridge the gap between complex engineering and human creativity. We aren't just building software; we are building the infrastructure for the next generation of African innovation."
                 </p>
                 <div className="flex items-center justify-center md:justify-start gap-4">
                    <div className="border-l-4 border-blue-600 pl-4 text-left">
                       <h3 className="text-xl font-bold text-slate-900">Oliskey Lee</h3>
                       <p className="text-slate-500">Co-Founder & Lead Architect</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* The Pillars (S.C.C.) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-12">
            
            <div className="group bg-slate-50/50 rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-500 border border-transparent hover:border-gray-200">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white text-slate-900 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                <Layers size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 tracking-tight uppercase text-sm text-blue-600">System</h3>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-2">Reliable, scalable platforms engineered for real-world use.</p>
            </div>

            <div className="group bg-slate-50/50 rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-500 border border-transparent hover:border-gray-200">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white text-slate-900 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                <Users size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 tracking-tight uppercase text-sm text-blue-600">Culture</h3>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-2">Designs and communities that outlast trends.</p>
            </div>

            <div className="group bg-slate-50/50 rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-500 border border-transparent hover:border-gray-200">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white text-slate-900 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                <Zap size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 tracking-tight uppercase text-sm text-blue-600">Creativity</h3>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-2">Endless innovation that moves people and product forward.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Products Overview (Ecosystem) */}
      <section id="products" className="py-16 sm:py-24 bg-gray-50/50 relative z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
           <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4 sm:mb-6">Our Products</h2>
            <p className="text-base sm:text-lg text-slate-500">
              A diverse family of brands working together to innovate, educate, and build the future. 
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystem.map((item) => (
              <div 
                key={item.id} 
                className={`relative flex flex-col p-6 sm:p-8 rounded-2xl bg-white border transition-all duration-300 ${
                  item.status === 'Live' 
                    ? 'border-blue-100 ring-4 ring-blue-50/50 shadow-xl scale-[1.02] z-10' 
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-lg'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${item.color} text-white flex items-center justify-center shadow-md transform -rotate-3 transition-transform group-hover:rotate-0`}>
                    {item.icon}
                  </div>
                  
                  {/* Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                    item.status === 'Live' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                </div>
                
                <div className="mt-auto">
                  {item.status === 'Live' && item.link ? (
                    <Link 
                      to={item.link}
                      className="w-full py-3 rounded-lg bg-slate-900 text-white font-medium text-center text-sm hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 group"
                    >
                      {item.actionText || 'Explore'} <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform"/>
                    </Link>
                  ) : (
                    <div className="w-full py-3 rounded-lg bg-gray-50 text-gray-400 font-medium text-center text-sm border border-gray-100 select-none">
                      Coming Soon
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Blurbs */}
      <section className="py-16 sm:py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
              <div className="flex flex-col items-start">
                 <ShieldCheck className="w-8 h-8 text-blue-600 mb-4" />
                 <h3 className="text-lg font-bold text-slate-900 mb-2">Built for reliability</h3>
                 <p className="text-slate-500 leading-relaxed text-sm sm:text-base">Production-ready systems that handle growth without compromising performance.</p>
              </div>
              <div className="flex flex-col items-start">
                 <Smile className="w-8 h-8 text-blue-600 mb-4" />
                 <h3 className="text-lg font-bold text-slate-900 mb-2">Human-centered</h3>
                 <p className="text-slate-500 leading-relaxed text-sm sm:text-base">Product decisions driven by real human needs, not just technical capabilities.</p>
              </div>
              <div className="flex flex-col items-start">
                 <PenTool className="w-8 h-8 text-blue-600 mb-4" />
                 <h3 className="text-lg font-bold text-slate-900 mb-2">Creative-first</h3>
                 <p className="text-slate-500 leading-relaxed text-sm sm:text-base">Delivering elegant solutions where form meets function seamlessly.</p>
              </div>
              <div className="flex flex-col items-start">
                 <LayoutGrid className="w-8 h-8 text-blue-600 mb-4" />
                 <h3 className="text-lg font-bold text-slate-900 mb-2">Modular architecture</h3>
                 <p className="text-slate-500 leading-relaxed text-sm sm:text-base">Our products plug into the Oliskey platform for a unified experience.</p>
              </div>
              <div className="flex flex-col items-start">
                 <Building className="w-8 h-8 text-blue-600 mb-4" />
                 <h3 className="text-lg font-bold text-slate-900 mb-2">Enterprise-ready</h3>
                 <p className="text-slate-500 leading-relaxed text-sm sm:text-base">Simple onboarding for schools and businesses with complex needs.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Investor / Partners Hero */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Invest in Oliskey</h2>
          <p className="text-base sm:text-lg text-slate-400 mb-8 sm:mb-10 leading-relaxed">
            Oliskey is building a platform ecosystem across SaaS, AI, EdTech, media, and venture. We’re launching MVPs, onboarding pilot customers, and preparing for growth. Join us as we scale systems and shape long-lasting culture.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/investors"
              className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-blue-50 transition-colors"
            >
              Investor Info
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Placeholder */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by</p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="h-8 w-24 bg-slate-200 rounded"></div>
             <div className="h-8 w-24 bg-slate-200 rounded"></div>
             <div className="h-8 w-24 bg-slate-200 rounded"></div>
             <div className="h-8 w-24 bg-slate-200 rounded"></div>
             <div className="h-8 w-24 bg-slate-200 rounded"></div>
          </div>
          
          <div className="mt-12 sm:mt-16 max-w-2xl mx-auto">
             <blockquote className="text-lg sm:text-xl font-medium text-slate-800 italic px-4">
               "Oliskey transformed our workflow. The reliability and design are unmatched."
             </blockquote>
             <cite className="block mt-4 text-sm font-semibold text-slate-500 not-italic">— Early Pilot Partner</cite>
          </div>
        </div>
      </section>

      {/* Blog / Media CTA */}
      <section className="py-16 sm:py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="md:w-1/2 text-center md:text-left">
             <h2 className="text-3xl font-bold text-slate-900 mb-4">Learn with Oliskey</h2>
             <p className="text-lg text-slate-600 mb-8">
               Tutorials, case studies, and product deep dives from our Labs. Subscribe for weekly insights.
             </p>
             <Link 
               to="/blog"
               className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700"
             >
               Explore the Blog <ArrowRight size={18} className="ml-2" />
             </Link>
           </div>
           <div className="md:w-1/2 w-full">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-blue-100">
                 {/* Visible Announcement for everyone */}
                 <div className="mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start animate-fade-in">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0">
                        <Bell size={16} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Coming Soon: All-in-one School App</p>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">
                          We're building the ultimate SaaS platform for schools. Launching <span className="font-semibold text-slate-900">February 15, 2026</span>. Subscribe below for updates.
                        </p>
                    </div>
                 </div>

                 <h3 className="font-bold text-lg mb-2">Subscribe to our newsletter</h3>
                 <p className="text-slate-500 text-sm mb-4">Get the latest updates directly to your inbox.</p>
                 {subscribeStatus === 'success' ? (
                   <div className="flex flex-col gap-3 p-4 bg-green-50 border border-green-100 rounded-lg animate-fade-in">
                      <div className="flex items-center text-green-700 font-bold">
                        <Check size={20} className="mr-2" /> Subscribed successfully!
                      </div>
                   </div>
                 ) : (
                   <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email" 
                        className="flex-1 w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all" 
                      />
                      <button 
                        type="submit" 
                        disabled={subscribing}
                        className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-slate-900/10 transition-all"
                      >
                        {subscribing ? <Loader2 size={18} className="animate-spin" /> : 'Subscribe'}
                      </button>
                   </form>
                 )}
                 {subscribeStatus === 'error' && (
                    <p className="text-red-500 text-sm mt-2">Something went wrong. Please try again.</p>
                 )}
              </div>
           </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 pb-8 last:border-0">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{faq.question}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Home;