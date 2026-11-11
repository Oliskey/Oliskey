import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

const Field: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...rest }) => (
  <label htmlFor={id} className="grid gap-1.5">
    <span className="text-[14px] font-medium text-ink">{label}</span>
    <input id={id} {...rest} className="h-12 rounded-2xl border border-line bg-surface px-4 text-[16px] text-ink outline-none transition-shadow placeholder:text-faint focus:border-accent focus:shadow-[0_0_0_4px_rgb(var(--accent)/0.15)]" />
  </label>
);

// Sign in and Create account share one calm layout: logo, title, form, one primary action.
export const AuthPage: React.FC<{ mode: 'signin' | 'signup' }> = ({ mode }) => {
  const { session, ready } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null);
  const signup = mode === 'signup';
  if (ready && session) return <Navigate to="/account" replace />;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') || '').trim(), password = String(f.get('password') || '');
    if (signup && password.length < 8) { setMsg({ kind: 'error', text: 'Use at least 8 characters for your password.' }); return; }
    setBusy(true); setMsg(null);
    try {
      if (signup) {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: String(f.get('name') || '').trim() }, emailRedirectTo: `${location.origin}/account` } });
        if (error) throw error;
        if (data.session) nav('/account');
        else setMsg({ kind: 'ok', text: `Check ${email} for a link to confirm your account.` });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav('/account');
      }
    } catch (err) {
      const m = err instanceof Error ? err.message : '';
      setMsg({ kind: 'error', text: /invalid login/i.test(m) ? 'That email and password don’t match. Try again.' : m || 'Something went wrong. Try again.' });
    } finally { setBusy(false); }
  };

  return (
    <section className="page-x flex min-h-[100svh] items-center justify-center pb-16 pt-[120px]">
      <div className="w-full max-w-[420px]">
        <Logo className="h-9 text-ink" showText={false} />
        <h1 className="mt-6 text-[32px] font-bold tracking-tight text-ink">{signup ? 'Create your Oliskey account' : 'Sign in to Oliskey'}</h1>
        <p className="mt-2 text-[16px] text-muted">{signup ? 'One account for Oliskey. It takes a minute.' : 'Welcome back.'}</p>
        <form onSubmit={submit} className="mt-8 grid gap-4" noValidate={false}>
          {signup && <Field label="Full name" id="name" name="name" autoComplete="name" required placeholder="Your name" />}
          <Field label="Email" id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          <Field label="Password" id="password" name="password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} required minLength={signup ? 8 : undefined} placeholder={signup ? 'At least 8 characters' : 'Your password'} />
          {msg && <p role={msg.kind === 'error' ? 'alert' : 'status'} className={`rounded-2xl px-4 py-3 text-[14px] ${msg.kind === 'error' ? 'bg-[#E11D48]/10 text-[#BE123C] dark:text-[#FF8FA3]' : 'bg-[#12B76A]/10 text-[#0A7A45] dark:text-[#5BE3A5]'}`}>{msg.text}</p>}
          <button type="submit" className="btn-primary mt-2 w-full" disabled={busy}>{busy && <Loader2 size={17} className="animate-spin" />}{signup ? 'Create account' : 'Sign in'}</button>
        </form>
        <p className="mt-6 text-[15px] text-muted">{signup ? <>Already have an account? <Link to="/sign-in" className="font-semibold text-accent-ink hover:underline">Sign in</Link></> : <>New to Oliskey? <Link to="/get-started" className="font-semibold text-accent-ink hover:underline">Create an account</Link></>}</p>
      </div>
    </section>
  );
};

export const Account: React.FC = () => {
  const { session, ready } = useAuth();
  if (!ready) return <div className="min-h-[100svh]" />;
  if (!session) return <Navigate to="/sign-in" replace />;
  const name = (session.user.user_metadata?.full_name as string) || session.user.email;
  return (
    <section className="page-x min-h-[80svh] pb-20 pt-[140px]">
      <p className="eyebrow">Your account</p>
      <h1 className="mt-3 text-title text-ink">Hello, {name}</h1>
      <p className="mt-3 text-lead text-muted">Signed in as {session.user.email}. Choose where to go next.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/products" className="btn-primary">See the products</Link>
        <button type="button" className="btn-secondary" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
    </section>
  );
};
