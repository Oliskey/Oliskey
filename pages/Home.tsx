import React, { useEffect, useState } from 'react';
import { ArrowRight, Layers, Users, Zap, ChevronRight, ExternalLink, ShieldCheck, Smile, PenTool, LayoutGrid, Building, Loader2, Check, Bell, User, Truck, ArrowUpRight } from 'lucide-react';
// @ts-ignore
import { Link, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Logo from '../components/Logo';
import OptimizedImage from '../components/OptimizedImage';
import { supabase } from '../supabase';
import { useTheme } from '../context/ThemeContext';

const Home: React.FC = () => {
  const location = useLocation();
  const { ecosystem, faqs } = useData(); // Use Data Context
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { theme } = useTheme();

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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // SPAM CHECK: Honeypot
    if (website) {
      // Pretend success
      setSubscribeStatus('success');
      setEmail('');
      setWebsite('');
      return;
    }

    setSubscribing(true);
    setSubscribeStatus('idle');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{
          email,
          website // Send empty field to DB
        }]);

      if (error) {
        // 23505 is Unique Violation (Email already exists). Treat as success to prevent enumeration.
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

  // Logo variant based on theme
  const logoVariant = theme === 'dark' ? 'light' : 'dark';

  return (
    <div className="flex flex-col w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 overflow-hidden transition-colors duration-300">

      {/* Brand-first, outcome-led hero */}
      <section className="relative isolate overflow-hidden px-4 pb-14 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-28 lg:pt-36">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[30rem] max-w-5xl rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-24 -z-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="min-w-0 text-center lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/75 px-3.5 py-2 text-xs font-semibold tracking-wide text-blue-800 shadow-sm backdrop-blur-xl dark:border-blue-900/70 dark:bg-slate-900/75 dark:text-blue-300 sm:text-sm"><span className="h-2 w-2 rounded-full bg-blue-600" /> SOFTWARE · AUTOMATION · AI</div>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-5xl md:text-6xl lg:mx-0 lg:text-7xl">Make your business run with <span className="text-blue-600 dark:text-blue-400">less manual work.</span></h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8 lg:mx-0">Oliskey builds practical software, automated workflows and AI-powered tools that help businesses simplify operations, reduce repetitive tasks and work with greater control.</p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 lg:mx-0">From ready-made products to software designed around your business, we start with the problem—not the technology.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link to="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:min-h-14 sm:px-8 sm:text-base">Explore our solutions <ArrowRight size={18} /></Link>
              <Link to="/contact" className="liquid-glass-control inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/60 px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-white sm:min-h-14 sm:px-8 sm:text-base">Tell us what to automate <ArrowUpRight size={17} /></Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400 lg:justify-start sm:text-sm">
              <span className="inline-flex items-center gap-2"><Check size={15} className="text-blue-600 dark:text-blue-400" /> Built around real workflows</span>
              <span className="inline-flex items-center gap-2"><Check size={15} className="text-blue-600 dark:text-blue-400" /> Designed for people</span>
              <span className="inline-flex items-center gap-2"><Check size={15} className="text-blue-600 dark:text-blue-400" /> AI with a purpose</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div aria-hidden="true" className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-blue-500/15 via-cyan-400/10 to-violet-500/10 blur-2xl" />
            <div className="oliskey-liquid-glass relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-slate-700/80 dark:bg-slate-900/80 sm:p-7">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 pb-5 dark:border-slate-700"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">The Oliskey approach</p><h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">From busywork to better workflows.</h2></div><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><Zap size={22} /></span></div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/75 p-4 dark:border-slate-700 dark:bg-slate-950/50"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"><Layers size={20} /></span><div className="min-w-0 flex-1"><p className="font-semibold text-slate-900 dark:text-white">Understand the work</p><p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">Find the tasks, handoffs and bottlenecks that slow you down.</p></div><ChevronRight size={18} className="shrink-0 text-slate-400" /></div>
                <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/80 p-4 dark:border-blue-900/70 dark:bg-blue-950/40"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white"><Zap size={20} /></span><div className="min-w-0 flex-1"><p className="font-semibold text-slate-900 dark:text-white">Build a better system</p><p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">Connect software, automation and AI to the actual need.</p></div><ArrowRight size={18} className="shrink-0 text-blue-700 dark:text-blue-300" /></div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/75 p-4 dark:border-slate-700 dark:bg-slate-950/50"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"><Check size={20} /></span><div className="min-w-0 flex-1"><p className="font-semibold text-slate-900 dark:text-white">Give people time back</p><p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">Make routine work clearer, more consistent and easier to manage.</p></div></div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">{["Business software", "Workflow automation", "Useful AI"].map((item) => <span key={item} className="rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">{item}</span>)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Manifesto */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-950 relative z-10 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-lg sm:text-2xl md:text-3xl leading-relaxed text-slate-800 dark:text-slate-200 font-light">
            <span className="font-semibold text-blue-600 dark:text-blue-400">Oliskey</span> is a global infrastructure brand powering products that scale. We combine rigor and imagination through our S.C.C framework — System, Culture, Creativity — to build platforms, education tools, AI services, and media that endure.
          </p>
        </div>
      </section>

      {/* Founder Spotlight */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900 border-y border-gray-200 dark:border-slate-800 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-20">
            <div className="md:w-5/12 relative w-full max-w-sm md:max-w-none">
              <div className="absolute inset-0 bg-blue-600 rounded-2xl transform rotate-3 scale-[1.02] opacity-10"></div>
              {/* Optimized Image Component */}
              <OptimizedImage
                src="/co-founder.jpg"
                alt="Oliskey Lee - Co-Founder"
                className="relative rounded-2xl shadow-2xl w-full aspect-[3/4] bg-gray-200 dark:bg-slate-800"
                priority={true}
              />
            </div>
            <div className="md:w-7/12 text-center md:text-left">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">Leadership</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">Meet the Creator</h2>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6 sm:mb-8 italic">
                "I started Oliskey with a single mission: to bridge the gap between complex engineering and human creativity. We aren't just building software; we are building the infrastructure for the next generation of African innovation."
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="border-l-4 border-blue-600 dark:border-blue-500 pl-4 text-left">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Oliskey Lee</h3>
                  <p className="text-slate-500 dark:text-slate-400">Co-Founder & Lead Architect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Pillars (S.C.C.) */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-12">

            <div className="group bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-500 border border-transparent hover:border-gray-200 dark:hover:border-slate-800">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                <Layers size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight uppercase text-sm text-blue-600 dark:text-blue-400">System</h3>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-2">Reliable, scalable platforms engineered for real-world use.</p>
            </div>

            <div className="group bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-500 border border-transparent hover:border-gray-200 dark:hover:border-slate-800">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                <Users size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight uppercase text-sm text-blue-600 dark:text-blue-400">Culture</h3>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-2">Designs and communities that outlast trends.</p>
            </div>

            <div className="group bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-500 border border-transparent hover:border-gray-200 dark:hover:border-slate-800">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                <Zap size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight uppercase text-sm text-blue-600 dark:text-blue-400">Creativity</h3>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-2">Endless innovation that moves people and product forward.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Products Overview (Ecosystem) */}
      <section id="products" className="py-16 sm:py-24 bg-gray-50/50 dark:bg-slate-900/30 relative z-10 scroll-mt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-6">Our Products</h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400">
              A diverse family of brands working together to innovate, educate, and build the future.
            </p>
            <div className="mt-6 flex justify-center">
              <Link to="/products" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-blue-800">
                Explore all products <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystem.map((item) => (
              <div
                key={item.id}
                className={`relative flex flex-col p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-300 ${item.status === 'Live'
                  ? 'border-blue-100 dark:border-blue-900 ring-4 ring-blue-50/50 dark:ring-blue-900/20 shadow-xl sm:scale-[1.02] z-10'
                  : 'border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 hover:shadow-lg'
                  }`}
              >
                <div className="flex justify-between items-start mb-6">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${item.color} text-white flex items-center justify-center shadow-md transform -rotate-3 transition-transform group-hover:rotate-0`}>
                    {item.icon}
                  </div>

                  {/* Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${item.status === 'Live'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                    }`}>
                    {item.status}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-auto">
                  {item.status === 'Live' && item.link ? (
                    <Link
                      to={item.title.toLowerCase().includes('school') ? '/school-management' : '/products'}
                      className="w-full py-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium text-center text-sm hover:bg-blue-600 dark:hover:bg-blue-300 transition-all shadow-lg shadow-slate-900/10 dark:shadow-white/5 flex items-center justify-center gap-2 group"
                    >
                      Learn more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <div className="w-full py-3 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 font-medium text-center text-sm border border-gray-100 dark:border-slate-700 select-none">
                      Coming Soon
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* Featured fleet product: intentionally explicit so it cannot disappear when the CMS catalogue is incomplete. */}
            <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400" aria-hidden="true" />
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <Truck size={24} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300">Fleet product</span>
              </div>
              <div className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-300">Transport &amp; operations</p>
                <Link to="/fleet-operations" className="mb-2 inline-block text-xl font-bold text-slate-900 transition hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-white dark:hover:text-violet-300">Oliskey Fleet</Link>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">Manage tricycles, drivers, staff, daily collections, remittances, maintenance schedules and partner balances in one workspace.</p>
              </div>
              <div className="mt-auto">
                <Link to="/fleet-operations" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 active:scale-[.99] dark:bg-white dark:text-slate-900 dark:hover:bg-violet-100">
                  Learn about Oliskey Fleet <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">View product details before opening the app</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Feature Blurbs */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            <div className="flex flex-col items-start">
              <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Built for reliability</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">Production-ready systems that handle growth without compromising performance.</p>
            </div>
            <div className="flex flex-col items-start">
              <Smile className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Human-centered</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">Product decisions driven by real human needs, not just technical capabilities.</p>
            </div>
            <div className="flex flex-col items-start">
              <PenTool className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Creative-first</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">Delivering elegant solutions where form meets function seamlessly.</p>
            </div>
            <div className="flex flex-col items-start">
              <LayoutGrid className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Modular architecture</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">Our products plug into the Oliskey platform for a unified experience.</p>
            </div>
            <div className="flex flex-col items-start">
              <Building className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Enterprise-ready</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">Simple onboarding for schools and businesses with complex needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investor / Partners Hero */}
      <section className="py-16 sm:py-24 bg-slate-900 dark:bg-black text-white relative overflow-hidden transition-colors duration-300">
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
      <section className="py-16 bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by</p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>

          <div className="mt-12 sm:mt-16 max-w-2xl mx-auto">
            <blockquote className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 italic px-4">
              "Oliskey transformed our workflow. The reliability and design are unmatched."
            </blockquote>
            <cite className="block mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400 not-italic">— Early Pilot Partner</cite>
          </div>
        </div>
      </section>

      {/* Blog / Media CTA */}
      <section className="py-16 sm:py-24 bg-blue-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Learn with Oliskey</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Tutorials, case studies, and product deep dives from our Labs. Subscribe for weekly insights.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300"
            >
              Explore the Blog <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-blue-100 dark:border-slate-700 transition-colors duration-300">
              {/* Visible Announcement for everyone */}
              <div className="mb-6 bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3 items-start animate-fade-in">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-300 shrink-0">
                  <Bell size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Coming Soon: All-in-one School App</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    We're building the ultimate SaaS platform for schools. Launching <span className="font-semibold text-slate-900 dark:text-white">February 15, 2026</span>. Subscribe below for updates.
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Subscribe to our newsletter</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Get the latest updates directly to your inbox.</p>
              {subscribeStatus === 'success' ? (
                <div className="flex flex-col gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg animate-fade-in">
                  <div className="flex items-center text-green-700 dark:text-green-400 font-bold">
                    <Check size={20} className="mr-2" /> Subscribed successfully!
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  {/* Honeypot Field */}
                  <input
                    type="text"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="hidden"
                    autoComplete="off"
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:border-transparent transition-all"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-slate-900/10 dark:shadow-blue-500/20 transition-all"
                  >
                    {subscribing ? <Loader2 size={18} className="animate-spin" /> : 'Subscribe'}
                  </button>
                </form>
              )}
              {subscribeStatus === 'error' && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2">Something went wrong. Please try again.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 dark:border-slate-800 pb-8 last:border-0">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{faq.question}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
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