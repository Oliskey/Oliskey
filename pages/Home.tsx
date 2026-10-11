import React, { useEffect, useState } from 'react';
import { ArrowRight, Layers, Users, Zap, ChevronRight, ShieldCheck, Smile, PenTool, LayoutGrid, Building, Loader2, Check, ArrowUpRight } from 'lucide-react';
// @ts-ignore
import { Link, useLocation } from 'react-router-dom';
import OptimizedImage from '../components/OptimizedImage';
import { supabase } from '../supabase';

const Home: React.FC = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot
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

      {/* What Oliskey stands for */}
      <section className="relative z-10 bg-white py-14 transition-colors duration-300 dark:bg-slate-950 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end lg:gap-16 lg:px-12">
          <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">Why Oliskey</p><h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl">Technology should make work feel lighter.</h2></div>
          <p className="text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">Every business has work that is harder than it needs to be: repeated data entry, scattered records, missed follow-ups and processes that depend on memory. We turn those everyday frustrations into clearer systems people can actually use.</p>
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
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">The reason we build</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">Built from a real problem</h2>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6 sm:mb-8 italic">
                "Growing up, education often felt difficult and boring, and I had to push myself to keep going. Later, while teaching, I saw how much time schools lost to repetitive administration—and how much parents wanted to understand their children’s progress. That showed me how technology could make work and learning easier. Oliskey grew from that idea: build useful software around real human problems, then take the same thinking to businesses beyond education."
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="border-l-4 border-blue-600 dark:border-blue-500 pl-4 text-left">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Oliskey Lee</h3>
                  <p className="text-slate-500 dark:text-slate-400">Founder, Oliskey</p>
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
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-2">Build dependable systems that fit real work, scale with demand and keep important operations organised.</p>
            </div>

            <div className="group bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-500 border border-transparent hover:border-gray-200 dark:hover:border-slate-800">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                <Users size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight uppercase text-sm text-blue-600 dark:text-blue-400">Culture</h3>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-2">Design for people first: make everyday tasks easier to understand, learn and complete.</p>
            </div>

            <div className="group bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-500 border border-transparent hover:border-gray-200 dark:hover:border-slate-800">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                <Zap size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight uppercase text-sm text-blue-600 dark:text-blue-400">Creativity</h3>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-2">Use automation and AI where they solve a real problem—not just because the technology is new.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Product discovery: keep the homepage concise and send visitors to the dedicated product hub. */}
      <section id="products" className="relative z-10 scroll-mt-20 bg-slate-50/70 py-14 transition-colors duration-300 dark:bg-slate-900/30 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">The Oliskey product ecosystem</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Purpose-built software. One connected ecosystem.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            Explore our two active products: Oliskey Education for schools and Oliskey Fleet for transport operations.
          </p>
          <Link to="/products" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-100">
            Explore all products <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Feature Blurbs */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            <div className="flex flex-col items-start">
              <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Less repetitive work</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">Automate routine steps and reduce the amount of work your team has to repeat manually.</p>
            </div>
            <div className="flex flex-col items-start">
              <Smile className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Designed around people</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">Clear, responsive experiences that help staff and customers get things done without unnecessary complexity.</p>
            </div>
            <div className="flex flex-col items-start">
              <PenTool className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI with a clear purpose</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">Apply AI to useful tasks such as drafting, sorting, summarising and assisting decisions when it genuinely helps.</p>
            </div>
            <div className="flex flex-col items-start">
              <LayoutGrid className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Connected workflows</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">Bring scattered information, tools and handoffs into a more consistent way of working.</p>
            </div>
            <div className="flex flex-col items-start">
              <Building className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Built to grow with you</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">Start with the problem that matters most, then expand the system as your needs change.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion-focused invitation */}
      <section className="relative isolate overflow-hidden bg-slate-950 px-4 py-16 text-white transition-colors duration-300 dark:bg-black sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 -z-10 h-96 w-96 rounded-full bg-blue-600/25 blur-[100px]" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">Have a workflow in mind?</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">Your business is unique. Your software can be, too.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">Tell us what takes too much time, creates confusion or keeps your team stuck doing things manually. We’ll explore whether a product, an automation or a custom-built system is the right fit.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">Tell us what you need <ArrowRight size={18} /></Link>
            <Link to="/products" className="liquid-glass-control inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Explore ready-made products <ChevronRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* Trust through transparency, not invented testimonials */}
      <section className="border-b border-slate-100 bg-white py-16 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">A clear way forward</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Start with the problem. Build what helps.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">No unnecessary complexity and no technology for technology’s sake. We focus on what your team needs to do better.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { number: "01", title: "Understand", body: "We learn how the work happens today, where it gets stuck and what a better outcome looks like." },
              { number: "02", title: "Design and build", body: "We choose the right path: a ready-made product, a focused automation or custom software." },
              { number: "03", title: "Improve over time", body: "We keep usability, reliability, security and the people using the system at the centre." },
            ].map((step) => <article key={step.number} className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900/60 sm:p-8"><p className="text-sm font-bold tracking-widest text-blue-700 dark:text-blue-300">{step.number}</p><h3 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">{step.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.body}</p></article>)}
          </div>
        </div>
      </section>

      {/* Blog / Media CTA */}
      <section className="py-16 sm:py-24 bg-blue-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Practical ideas for better work</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Useful ideas on business automation, practical software and AI—without the hype. Get updates and examples you can apply to your work.
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
              <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Get the Oliskey field notes</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Occasional practical insights on software, workflows and useful AI. Unsubscribe any time.</p>
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
                    placeholder="Your email address"
                    className="flex-1 w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:border-transparent transition-all"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-slate-900/10 dark:shadow-blue-500/20 transition-all"
                  >
                    {subscribing ? <Loader2 size={18} className="animate-spin" /> : 'Send me useful ideas'}
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
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Questions about working with Oliskey?</h2>
          <div className="space-y-4">
            {[
              { question: 'What does Oliskey build?', answer: 'We build practical software products, business-specific systems, workflow automations and AI-enabled tools. The right solution depends on the problem you want to solve.' },
              { question: 'Does Oliskey only work with schools?', answer: 'No. School software is one of our products, and Oliskey Fleet is another. Our wider focus is helping organisations simplify work through useful software and automation.' },
              { question: 'Can you build something for my business?', answer: 'Tell us about your current process, the repetitive work you want to reduce and the outcome you need. We will discuss the problem and whether a ready-made product, automation or custom software is the best fit.' },
              { question: 'Do I need to know exactly what technology I need?', answer: 'No. Start by explaining what is taking too much time or causing problems. We can help clarify the workflow before discussing the technology.' },
              { question: 'Can I explore existing products first?', answer: 'Yes. Browse our products to see what is available and read about each product before opening its application.' },
            ].map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 open:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:open:bg-slate-900 sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-slate-900 marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white sm:text-lg">
                  {faq.question}
                  <ChevronRight size={18} className="shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-4 max-w-3xl pr-2 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">{faq.answer}</p>
              </details>
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