import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Layers, Users, Zap, ChevronRight, ShieldCheck, Smile, PenTool, LayoutGrid, Building, Loader2, Check, ArrowUpRight, ExternalLink } from 'lucide-react';
// @ts-ignore
import { Link, useLocation } from 'react-router-dom';
import OptimizedImage from '../components/OptimizedImage';
import { supabase } from '../supabase';
import { PRODUCTS } from '../data/products';
import { Reveal, prefersReducedMotion, useScrollProgress } from '../components/motion/Reveal';
import DigitalStory from '../components/home/DigitalStory';
import BusinessFilm from '../components/home/BusinessFilm';
import HeroScreens from '../components/home/HeroScreens';
import DataTerrain from '../components/home/DataTerrain';
import Tilt3D from '../components/motion/Tilt3D';
import ThemedShot from '../components/ThemedShot';

// Home, rebuilt 2026-11-10 around one story: a business moving from manual work to software, automation and useful AI.
// All the earlier content is kept; it is ordered so the scroll itself tells the story. Motion: index.css tokens.

const TICKER = ['Records', 'Attendance', 'Fees', 'Report cards', 'Collections', 'Remittances', 'Maintenance', 'Reminders', 'Reports', 'Workflows', 'Automation', 'Useful AI', 'Trading practice', 'Messages'];

const PILLARS = [
  { icon: Layers, name: 'System', body: 'Build dependable systems that fit real work, scale with demand and keep important operations organised.' },
  { icon: Users, name: 'Culture', body: 'Design for people first: make everyday tasks easier to understand, learn and complete.' },
  { icon: Zap, name: 'Creativity', body: 'Use automation and AI where they solve a real problem—not just because the technology is new.' },
];

const BENEFITS = [
  { icon: ShieldCheck, title: 'Less repetitive work', body: 'Automate routine steps and reduce the amount of work your team has to repeat manually.' },
  { icon: Smile, title: 'Designed around people', body: 'Clear, responsive experiences that help staff and customers get things done without unnecessary complexity.' },
  { icon: PenTool, title: 'AI with a clear purpose', body: 'Apply AI to useful tasks such as drafting, sorting, summarising and assisting decisions when it genuinely helps.' },
  { icon: LayoutGrid, title: 'Connected workflows', body: 'Bring scattered information, tools and handoffs into a more consistent way of working.' },
  { icon: Building, title: 'Built to grow with you', body: 'Start with the problem that matters most, then expand the system as your needs change.' },
];

const STEPS = [
  { number: '01', title: 'Understand', body: 'We learn how the work happens today, where it gets stuck and what a better outcome looks like.' },
  { number: '02', title: 'Design and build', body: 'We choose the right path: a ready-made product, a focused automation or custom software.' },
  { number: '03', title: 'Improve over time', body: 'We keep usability, reliability, security and the people using the system at the centre.' },
];

const FAQS = [
  { question: 'What does Oliskey build?', answer: 'We build practical software products, business-specific systems, workflow automations and AI-enabled tools. The right solution depends on the problem you want to solve.' },
  { question: 'Does Oliskey only work with schools?', answer: 'No. School software is one of our products; Oliskey Fleet and Oliskey Alpha are others. Our wider focus is helping organisations simplify work through useful software and automation.' },
  { question: 'Can you build something for my business?', answer: 'Tell us about your current process, the repetitive work you want to reduce and the outcome you need. We will discuss the problem and whether a ready-made product, automation or custom software is the best fit.' },
  { question: 'Do I need to know exactly what technology I need?', answer: 'No. Start by explaining what is taking too much time or causing problems. We can help clarify the workflow before discussing the technology.' },
  { question: 'Can I explore existing products first?', answer: 'Yes. Browse our products to see what is available and read about each product before opening its application.' },
];

const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300 sm:text-sm ${className}`}>{children}</p>
);

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
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // SPAM CHECK: Honeypot
    if (website) {
      setSubscribeStatus('success');
      setEmail('');
      setWebsite('');
      return;
    }
    setSubscribing(true);
    setSubscribeStatus('idle');
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert([{ email, website }]);
      if (error) {
        // 23505 is Unique Violation (Email already exists). Treat as success to prevent enumeration.
        if (error.code === '23505') setSubscribeStatus('success');
        else throw error;
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

  // "How we work": a line draws through the three steps as they pass
  const stepsBox = useRef<HTMLDivElement>(null);
  const stepsLine = useRef<HTMLDivElement>(null);
  const [still] = useState(prefersReducedMotion);
  const drawSteps = useCallback((p: number) => { if (stepsLine.current) stepsLine.current.style.transform = `scaleX(${Math.min(1, Math.max(0, (p - 0.2) / 0.45))})`; }, []);
  useScrollProgress(stepsBox, still ? () => {} : drawSteps, 'pass');

  return (
    <div className="flex w-full flex-col overflow-x-clip bg-white font-sans text-slate-900 transition-colors duration-300 selection:bg-blue-100 selection:text-blue-900 dark:bg-slate-950 dark:text-slate-50 dark:selection:bg-blue-900 dark:selection:text-blue-100">

      {/* ── Hero: the outcome, and the real products that deliver it ── */}
      <section className="relative isolate px-5 pb-10 pt-28 sm:px-8 sm:pt-32 lg:pb-20 lg:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[34rem] max-w-6xl rounded-full bg-blue-500/10 blur-3xl" />
        {/* a 3D field of data rolling under the hero: the business, running on software */}
        <DataTerrain className="absolute inset-x-0 bottom-0 -z-10 h-[58%] [mask-image:linear-gradient(to_bottom,transparent,black_45%,black_80%,transparent)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-10">
          <div className="min-w-0 text-center lg:text-left">
            <Reveal><span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3.5 py-2 text-xs font-semibold tracking-wide text-blue-800 shadow-sm dark:border-blue-900/70 dark:bg-slate-900/80 dark:text-blue-300 sm:text-sm"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-500 opacity-60 motion-reduce:hidden" /><span className="relative inline-flex size-2 rounded-full bg-blue-600" /></span> SOFTWARE · AUTOMATION · AI</span></Reveal>
            <Reveal delay={80}><h1 className="mx-auto mt-6 max-w-3xl text-[2.6rem] font-bold leading-[1.04] tracking-[-0.035em] text-slate-950 dark:text-white sm:text-6xl lg:mx-0 lg:text-7xl">Make your business run with <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-violet-300">less manual work.</span></h1></Reveal>
            <Reveal delay={160}><p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8 lg:mx-0">Oliskey builds practical software, automated workflows and AI-powered tools that help businesses simplify operations, reduce repetitive tasks and work with greater control.</p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 lg:mx-0">From ready-made products to software designed around your business, we start with the problem—not the technology.</p></Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Link to="/products" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:bg-blue-700 active:scale-[.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:min-h-14 sm:text-base">Explore our solutions <ArrowRight size={18} className="transition-transform duration-150 group-hover:translate-x-0.5" /></Link>
                <Link to="/contact" className="liquid-glass-control inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/60 px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-white sm:min-h-14 sm:text-base">Tell us what to automate <ArrowUpRight size={17} /></Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm lg:justify-start">
                {['Built around real workflows', 'Designed for people', 'AI with a purpose'].map((t) => <span key={t} className="inline-flex items-center gap-2"><Check size={15} className="text-blue-600 dark:text-blue-400" /> {t}</span>)}
              </div>
            </Reveal>
          </div>
          <Reveal delay={200} className="min-w-0"><HeroScreens /></Reveal>
        </div>
      </section>

      {/* ── What the products take care of, drifting by ── */}
      <div aria-label="What Oliskey software handles" className="ticker relative border-y border-slate-100 py-4 dark:border-white/5 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="ticker-track flex w-max gap-3">
          {[...TICKER, ...TICKER].map((w, i) => <span key={i} aria-hidden={i >= TICKER.length} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"><span className="size-1.5 rounded-full bg-blue-500" />{w}</span>)}
        </div>
      </div>

      {/* ── The film: a business without software, then online (played by scrolling) ── */}
      <BusinessFilm />

      {/* ── Why Oliskey ── */}
      <section className="px-5 pb-4 pt-16 sm:px-8 sm:pt-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end lg:gap-16">
          <Reveal><Eyebrow>Why Oliskey</Eyebrow><h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-5xl">Technology should make work feel lighter.</h2></Reveal>
          <Reveal delay={120}><p className="text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl sm:leading-9">Every business has work that is harder than it needs to be: repeated data entry, scattered records, missed follow-ups and processes that depend on memory. We turn those everyday frustrations into clearer systems people can actually use.</p></Reveal>
        </div>
      </section>

      {/* ── The story: scattered work becomes a system (pinned while scrolling) ── */}
      <DigitalStory />
      <div className="mx-auto -mt-4 flex max-w-7xl flex-wrap justify-center gap-2 px-5 pb-6 sm:px-8 lg:justify-start">
        {['Business software', 'Workflow automation', 'Useful AI'].map((item) => <span key={item} className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">{item}</span>)}
      </div>

      {/* ── The pillars: System, Culture, Creativity ── */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
            {PILLARS.map(({ icon: Icon, name, body }, i) => (
              <Reveal key={name} delay={i * 110} className="flex">
               <Tilt3D as="article" className="group relative w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-50/70 p-7 transition-colors duration-300 hover:border-blue-200 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-500/30 sm:p-9">
                <span aria-hidden className="absolute -right-4 -top-6 text-[7rem] font-bold leading-none text-slate-900/[0.04] dark:text-white/[0.04]">0{i + 1}</span>
                <span className="grid size-12 place-items-center rounded-2xl bg-white text-slate-900 shadow-sm transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white dark:bg-white/10 dark:text-white"><Icon size={24} strokeWidth={1.6} /></span>
                <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">{name}</h3>
                <p className="mt-3 text-xl font-bold leading-snug tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">{body}</p>
               </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section id="products" className="scroll-mt-20 bg-slate-50/70 px-5 py-16 dark:bg-white/[0.02] sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Eyebrow>The Oliskey product ecosystem</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">Purpose-built software. One connected ecosystem.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">Explore our three active products: Oliskey Education for schools, Oliskey Fleet for transport operations and Oliskey Alpha for learning to trade.</p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PRODUCTS.map(({ id, name, eyebrow, short, shots, appUrl, appLabel, detailsUrl, icon: Icon, tint }, i) => (
              <Reveal key={id} delay={i * 120} className="flex">
               <Tilt3D as="article" className="group flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_30px_60px_-25px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900 dark:hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]">
                <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${tint}`}>
                  <ThemedShot shots={shots} alt={`${name} screen`} className="absolute inset-0 h-full w-full object-cover object-left-top transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]" />
                  <span className="absolute left-4 top-4 grid size-10 place-items-center rounded-xl border border-white/30 bg-black/20 text-white backdrop-blur-md"><Icon size={20} /></span>
                </div>
                <div className="flex flex-1 flex-col p-6 [transform:translateZ(24px)]">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{eyebrow}</p>
                  <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950 dark:text-white">{name}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{short}</p>
                  <div className="mt-6 flex gap-2">
                    <a href={appUrl} target="_blank" rel="noopener" className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-blue-600 active:scale-[.97] dark:bg-white dark:text-slate-950 dark:hover:bg-blue-100">{appLabel} <ExternalLink size={14} /></a>
                    <Link to={detailsUrl} aria-label={`About ${name}`} className="inline-flex min-h-11 items-center justify-center gap-1 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5">Learn more</Link>
                  </div>
                </div>
               </Tilt3D>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Link to="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-100">Explore all products <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </Reveal>
        </div>
      </section>

      {/* ── What changes for your team ── */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {BENEFITS.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={(i % 3) * 100} className={`flex ${i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
             <Tilt3D as="article" max={5} className={`w-full rounded-[1.75rem] border border-slate-200/80 p-7 dark:border-white/10 ${i === 0 ? 'bg-blue-600 text-white dark:border-blue-500/40' : 'bg-white dark:bg-white/[0.03]'}`}>
              <Icon className={`size-8 ${i === 0 ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
              <h3 className={`mt-5 text-lg font-bold ${i === 0 ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{title}</h3>
              <p className={`mt-2 text-sm leading-relaxed sm:text-base ${i === 0 ? 'text-blue-50' : 'text-slate-500 dark:text-slate-400'}`}>{body}</p>
             </Tilt3D>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── The reason we build ── */}
      <section className="relative overflow-hidden border-y border-slate-200 bg-slate-50 px-5 py-16 dark:border-white/5 dark:bg-white/[0.02] sm:px-8 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-100 opacity-50 blur-[100px] dark:bg-blue-900/20" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 md:flex-row lg:gap-20">
          <Reveal className="relative w-full max-w-sm md:w-5/12 md:max-w-none">
            <div className="absolute inset-0 rotate-3 scale-[1.02] rounded-2xl bg-blue-600 opacity-10" />
            <OptimizedImage src="/co-founder.jpg" alt="Oliskey Lee - Co-Founder" className="relative aspect-[3/4] w-full rounded-2xl bg-gray-200 shadow-2xl dark:bg-slate-800" priority={false} />
          </Reveal>
          <Reveal delay={120} className="text-center md:w-7/12 md:text-left">
            <span className="mb-5 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">The reason we build</span>
            <h2 className="mb-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">Built from a real problem</h2>
            <blockquote className="mb-8 text-lg italic leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">"Growing up, education often felt difficult and boring, and I had to push myself to keep going. Later, while teaching, I saw how much time schools lost to repetitive administration—and how much parents wanted to understand their children’s progress. That showed me how technology could make work and learning easier. Oliskey grew from that idea: build useful software around real human problems, then take the same thinking to businesses beyond education."</blockquote>
            <div className="flex items-center justify-center gap-4 md:justify-start"><div className="border-l-4 border-blue-600 pl-4 text-left dark:border-blue-500"><h3 className="text-xl font-bold text-slate-900 dark:text-white">Oliskey Lee</h3><p className="text-slate-500 dark:text-slate-400">Founder, Oliskey</p></div></div>
          </Reveal>
        </div>
      </section>

      {/* ── How we work: a line draws through the steps ── */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Eyebrow>A clear way forward</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">Start with the problem. Build what helps.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">No unnecessary complexity and no technology for technology’s sake. We focus on what your team needs to do better.</p>
          </Reveal>
          <div ref={stepsBox} className="relative mt-14">
            <div aria-hidden className="absolute left-[16.6%] right-[16.6%] top-6 hidden h-0.5 bg-slate-100 dark:bg-white/10 md:block"><div ref={stepsLine} className="h-full origin-left bg-blue-600 dark:bg-blue-400" style={{ transform: still ? 'none' : 'scaleX(0)' }} /></div>
            <div className="grid gap-4 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <Reveal key={step.number} delay={i * 140} as="article" className="relative text-center">
                  <span className="relative mx-auto grid size-12 place-items-center rounded-full border-2 border-blue-600 bg-white text-sm font-bold tracking-wider text-blue-700 dark:border-blue-400 dark:bg-slate-950 dark:text-blue-300">{step.number}</span>
                  <Tilt3D className="mt-5 rounded-[1.75rem] border border-slate-200/80 bg-slate-50/70 p-6 dark:border-white/10 dark:bg-white/[0.03] sm:p-8"><h3 className="text-xl font-bold text-slate-950 dark:text-white">{step.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.body}</p></Tilt3D>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Invitation ── */}
      <section className="px-5 sm:px-8">
        <Reveal className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] bg-slate-950 px-6 py-16 text-center text-white dark:bg-black dark:ring-1 dark:ring-white/10 sm:px-12 sm:py-24">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 -z-10 h-96 w-96 rounded-full bg-blue-600/30 blur-[100px]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-20 -z-10 h-80 w-80 rounded-full bg-violet-600/20 blur-[100px]" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(closest-side,black,transparent)]" />
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">Have a workflow in mind?</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">Your business is unique. Your software can be, too.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">Tell us what takes too much time, creates confusion or keeps your team stuck doing things manually. We’ll explore whether a product, an automation or a custom-built system is the right fit.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-blue-50 active:scale-[.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">Tell us what you need <ArrowRight size={18} /></Link>
            <Link to="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Explore ready-made products <ChevronRight size={18} /></Link>
          </div>
        </Reveal>
      </section>

      {/* ── Field notes ── */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 md:flex-row">
          <Reveal className="text-center md:w-1/2 md:text-left">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Practical ideas for better work</h2>
            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">Useful ideas on business automation, practical software and AI—without the hype. Get updates and examples you can apply to your work.</p>
            <Link to="/blog" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 font-bold text-blue-700 transition hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">Explore the Blog <ArrowRight size={18} /></Link>
          </Reveal>
          <Reveal delay={120} className="w-full md:w-1/2">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-8">
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Get the Oliskey field notes</h3>
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Occasional practical insights on software, workflows and useful AI. Unsubscribe any time.</p>
              {subscribeStatus === 'success' ? (
                <div className="flex items-center rounded-xl border border-green-100 bg-green-50 p-4 font-bold text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"><Check size={20} className="mr-2" /> Subscribed successfully!</div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
                  <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" autoComplete="off" tabIndex={-1} aria-hidden="true" />
                  <label htmlFor="newsletter-email" className="sr-only">Your email address</label>
                  <input id="newsletter-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="min-h-12 w-full flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 text-slate-900 transition placeholder:text-slate-500 focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-slate-950 dark:text-white" />
                  <button type="submit" disabled={subscribing} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-slate-900 px-6 font-semibold text-white transition hover:bg-slate-800 active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-700 sm:w-auto">{subscribing ? <Loader2 size={18} className="animate-spin" /> : 'Send me useful ideas'}</button>
                </form>
              )}
              {subscribeStatus === 'error' && <p className="mt-2 text-sm text-red-500 dark:text-red-400">Something went wrong. Please try again.</p>}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-3xl">
          <Reveal><h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Questions about working with Oliskey?</h2></Reveal>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <Reveal key={faq.question} delay={i * 60}>
                <details className="group rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 transition-colors open:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:open:bg-slate-900 sm:p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-slate-900 marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white sm:text-lg">{faq.question}<ChevronRight size={18} className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-90" /></summary>
                  <p className="mt-4 pr-2 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
