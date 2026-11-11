import React, { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, Mail, MessageCircle } from 'lucide-react';
import { PageTop, SectionHead } from '../components/Section';
import { CONTACT, PRODUCTS } from '../lib/products';
import { supabase } from '../lib/supabase';

const TOPICS = [
  ['support', 'I need support'], ['sales', 'I want to use a product'], ['quote', 'I want a price quote'], ['partnership', 'Partnership'], ['other', 'Something else'],
] as const;

const input = 'h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[16px] text-ink outline-none transition-shadow placeholder:text-faint focus:border-accent focus:shadow-[0_0_0_4px_rgb(var(--accent)/0.15)]';

// Contact & Support: one short form. Messages are saved in the database and emailed to the Oliskey team, and the sender
// gets a confirmation email. Signed-in customers see their requests on their account page.
const Contact: React.FC = () => {
  const [params] = useSearchParams();
  const started = useRef(Date.now());
  const [state, setState] = useState<{ kind: 'idle' | 'sending' | 'sent' | 'error'; text?: string; ref?: string }>({ kind: 'idle' });
  const initialTopic = useMemo(() => (TOPICS.some(([k]) => k === params.get('topic')) ? params.get('topic')! : 'support'), [params]);
  const initialProduct = PRODUCTS.some((p) => p.id === params.get('product')) ? params.get('product')! : '';

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = Object.fromEntries(['name', 'email', 'phone', 'topic', 'product', 'message', 'company'].map((k) => [k, String(f.get(k) || '')]));
    setState({ kind: 'sending' });
    try {
      const { data } = await supabase.auth.getSession();
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {}) },
        body: JSON.stringify({ ...body, page: location.pathname + location.search, startedAt: started.current }),
      });
      const j = await r.json().catch(() => ({ ok: false, error: 'Something went wrong. Please try again.' }));
      if (!r.ok || !j.ok) throw new Error(j.error || 'Something went wrong. Please try again.');
      setState({ kind: 'sent', ref: j.reference });
    } catch (err) {
      setState({ kind: 'error', text: err instanceof Error ? err.message : 'Something went wrong. Please try again.' });
    }
  };

  return (
    <PageTop>
      <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <SectionHead as="h1" eyebrow="Contact & support" title="How can we help?" lead="Send us a message about any Oliskey product. We reply by email." />
          <div className="mt-10 grid gap-3">
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-4 rounded-2xl border border-line bg-raised p-5 hover:bg-surface"><Mail className="text-accent" /><div><p className="font-semibold text-ink">Email</p><p className="text-[15px] text-muted">{CONTACT.email}</p></div></a>
            <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-line bg-raised p-5 hover:bg-surface"><MessageCircle className="text-accent" /><div><p className="font-semibold text-ink">WhatsApp</p><p className="text-[15px] text-muted">Message the Oliskey team</p></div></a>
          </div>
        </div>

        <div className="rounded-card border border-line bg-raised p-6 sm:p-8">
          {state.kind === 'sent' ? (
            <div role="status" className="py-8 text-center">
              <CheckCircle2 size={44} className="mx-auto text-[#12B76A]" />
              <h2 className="mt-4 text-[26px] font-bold tracking-tight text-ink">Message sent</h2>
              <p className="mx-auto mt-2 max-w-[380px] text-[16px] text-muted">Thank you. We’ll reply to your email soon.{state.ref && <> Your reference is <b className="text-ink">{state.ref}</b>.</>}</p>
              <div className="mt-7 flex justify-center gap-3"><Link to="/" className="btn-secondary">Back to home</Link><button type="button" className="btn-quiet" onClick={() => { started.current = Date.now(); setState({ kind: 'idle' }); }}>Send another</button></div>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4" noValidate={false}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5"><span className="text-[14px] font-medium text-ink">Your name</span><input name="name" required minLength={2} maxLength={100} autoComplete="name" className={input} /></label>
                <label className="grid gap-1.5"><span className="text-[14px] font-medium text-ink">Email</span><input name="email" type="email" required maxLength={200} autoComplete="email" className={input} /></label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5"><span className="text-[14px] font-medium text-ink">Phone <span className="text-faint">(optional)</span></span><input name="phone" type="tel" maxLength={40} autoComplete="tel" className={input} /></label>
                <label className="grid gap-1.5"><span className="text-[14px] font-medium text-ink">Product</span>
                  <select name="product" defaultValue={initialProduct} className={input}><option value="">Not sure / general</option>{PRODUCTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                </label>
              </div>
              <fieldset className="grid gap-2">
                <legend className="mb-1.5 text-[14px] font-medium text-ink">What is it about?</legend>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map(([k, label]) => (
                    <label key={k} className="cursor-pointer">
                      <input type="radio" name="topic" value={k} defaultChecked={k === initialTopic} className="peer sr-only" />
                      <span className="inline-flex min-h-[40px] items-center rounded-full border border-line px-4 text-[14px] font-medium text-ink transition-colors peer-checked:border-accent peer-checked:bg-accent/10 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent">{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="grid gap-1.5"><span className="text-[14px] font-medium text-ink">Message</span>
                <textarea name="message" required minLength={10} maxLength={4000} rows={6} className={`${input} h-auto py-3`} placeholder="Tell us what you need. For support, include your school or company name." />
              </label>
              {/* hidden from people; bots fill it in */}
              <label aria-hidden className="absolute -left-[9999px]" tabIndex={-1}>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
              {state.kind === 'error' && <p role="alert" className="rounded-2xl bg-[#E11D48]/10 px-4 py-3 text-[14px] text-[#BE123C] dark:text-[#FF8FA3]">{state.text}</p>}
              <button type="submit" className="btn-primary mt-1 w-full sm:w-auto sm:justify-self-start" disabled={state.kind === 'sending'}>
                {state.kind === 'sending' && <Loader2 size={17} className="animate-spin" />}Send message
              </button>
              <p className="text-[13px] text-muted">We use your details only to reply to you.</p>
            </form>
          )}
        </div>
      </div>
    </PageTop>
  );
};
export default Contact;
