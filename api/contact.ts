// POST /api/contact — the Contact & Support form.
// 1) validates the message and filters obvious spam, 2) saves it in Supabase (table contact_messages, row-level security
// applies: the anon key can only insert), 3) emails it to Oliskey's Gmail and sends the customer a short confirmation.
//
// Vercel environment variables (Project → Settings → Environment Variables):
//   GMAIL_USER          the Gmail address that sends and receives the notifications (e.g. oliskeylee@gmail.com)
//   GMAIL_APP_PASSWORD  a Google "App password" for that account (Google Account → Security → App passwords)
//   NOTIFY_TO           optional: where notifications go (defaults to GMAIL_USER)
//   SUPABASE_URL / SUPABASE_ANON_KEY  optional: default to the website's public project values
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { randomUUID } from 'node:crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://rwbbjotykxktcnotvsvc.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YmJqb3R5a3hrdGNub3R2c3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDMxNjYsImV4cCI6MjA4Mzk3OTE2Nn0.V9Ovw0Rv8WX846iwu9J8CfnWrPNOLa2MygMnxvNeyCQ';

export const TOPICS = { sales: 'Sales enquiry', support: 'Support request', quote: 'Quote request', partnership: 'Partnership', other: 'Other' } as const;
export const PRODUCTS = { school: 'Oliskey School', fleet: 'Oliskey Fleet', alpha: 'Oliskey Alpha', labs: 'Oliskey Labs' } as const;

export interface ContactInput { name: string; email: string; phone?: string; topic: keyof typeof TOPICS; product?: keyof typeof PRODUCTS | ''; message: string; page?: string; company?: string; startedAt?: number }

/** Returns a clean message or an error a visitor can act on. Pure: unit-tested in scripts/contact.test.mjs. */
export function validate(body: unknown, now = Date.now()): { ok: true; value: Omit<ContactInput, 'company' | 'startedAt'> } | { ok: false; error: string; spam?: boolean } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Send the form as JSON.' };
  const b = body as Record<string, unknown>;
  const str = (k: string) => (typeof b[k] === 'string' ? (b[k] as string).trim() : '');
  if (str('company')) return { ok: false, error: 'Rejected.', spam: true };                                  // hidden honeypot field
  const started = Number(b.startedAt);
  if (Number.isFinite(started) && now - started < 2500) return { ok: false, error: 'Rejected.', spam: true };   // filled in faster than a person can
  const name = str('name'), email = str('email').toLowerCase(), phone = str('phone'), message = str('message'), page = str('page').slice(0, 200);
  const topic = str('topic') as keyof typeof TOPICS, product = str('product') as keyof typeof PRODUCTS | '';
  if (name.length < 2 || name.length > 100) return { ok: false, error: 'Please enter your name.' };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) return { ok: false, error: 'Please enter a valid email address.' };
  if (phone.length > 40) return { ok: false, error: 'That phone number is too long.' };
  if (!(topic in TOPICS)) return { ok: false, error: 'Please choose what your message is about.' };
  if (product && !(product in PRODUCTS)) return { ok: false, error: 'Please choose a product from the list.' };
  if (message.length < 10) return { ok: false, error: 'Please write a little more (at least 10 characters).' };
  if (message.length > 4000) return { ok: false, error: 'Please keep your message under 4,000 characters.' };
  if ((message.match(/https?:\/\//g) || []).length > 3) return { ok: false, error: 'Please include fewer links.' };
  return { ok: true, value: { name, email, phone: phone || undefined, topic, product: product || undefined, message, page: page || undefined } };
}

/** A name that is safe inside an email header (no quotes, angle brackets or line breaks). */
const headerName = (s: string) => s.replace(/["<>\r\n]/g, '').slice(0, 80);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

// Best-effort throttle per IP (each serverless instance keeps its own small memory).
const hits = new Map<string, number[]>();
function throttled(ip: string, now = Date.now()) {
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  recent.push(now); hits.set(ip, recent);
  return recent.length > 5;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'Use POST.' }); }
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (throttled(ip)) return res.status(429).json({ ok: false, error: 'Too many messages. Please try again in a few minutes.' });

  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return null; } })() : req.body;
  const v = validate(body);
  if (!v.ok) return v.spam ? res.status(200).json({ ok: true }) : res.status(400).json({ ok: false, error: v.error });   // don't tell bots why
  const m = v.value;
  const id = randomUUID();

  // 1) save — as the visitor (anon key + their session token if signed in), so row-level security decides
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false }, global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined });
  let userId: string | null = null;
  if (token) { const { data } = await db.auth.getUser(token); userId = data.user?.id ?? null; }
  const { error: dbError } = await db.from('contact_messages').insert({ id, name: m.name, email: m.email, phone: m.phone ?? null, topic: m.topic, product: m.product ?? null, message: m.message, user_id: userId, page: m.page ?? null });
  if (dbError) console.error('[contact] save failed', dbError.message);

  // 2) email
  let emailed = false;
  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD;
  if (user && pass) {
    try {
      const port = Number(process.env.SMTP_PORT || 465);   // SMTP_HOST/SMTP_PORT only for local testing; Gmail by default
      const mail = nodemailer.createTransport({ host: process.env.SMTP_HOST || 'smtp.gmail.com', port, secure: port === 465, auth: { user, pass }, tls: process.env.SMTP_HOST ? { rejectUnauthorized: false } : undefined });
      const subject = `${TOPICS[m.topic]}${m.product ? ` · ${PRODUCTS[m.product]}` : ''} — ${m.name}`;
      const rows: [string, string][] = [['Name', m.name], ['Email', m.email], ['Phone', m.phone || '—'], ['About', TOPICS[m.topic]], ['Product', m.product ? PRODUCTS[m.product] : '—'], ['Signed-in customer', userId ? 'Yes' : 'No'], ['Sent from', m.page || '—'], ['Reference', id]];
      await mail.sendMail({
        from: `"Oliskey website" <${user}>`, to: process.env.NOTIFY_TO || user, replyTo: { name: headerName(m.name), address: m.email }, subject,
        text: `${rows.map(([k, val]) => `${k}: ${val}`).join('\n')}\n\n${m.message}\n\nReply to this email to answer ${m.name} directly.`,
        html: `<div style="font-family:Inter,Arial,sans-serif;color:#0A1A3A;max-width:620px"><h2 style="margin:0 0 12px">${esc(subject)}</h2>
          <table style="border-collapse:collapse;font-size:14px">${rows.map(([k, val]) => `<tr><td style="padding:4px 16px 4px 0;color:#485676">${k}</td><td style="padding:4px 0"><b>${esc(val)}</b></td></tr>`).join('')}</table>
          <p style="white-space:pre-wrap;font-size:15px;line-height:1.55;border-left:3px solid #1F6BFF;padding-left:12px;margin:18px 0">${esc(m.message)}</p>
          <p style="font-size:13px;color:#485676">Reply to this email to answer ${esc(m.name)} directly.</p></div>`,
      });
      await mail.sendMail({
        from: `"Oliskey" <${user}>`, to: m.email, replyTo: process.env.NOTIFY_TO || user, subject: 'We received your message — Oliskey',
        text: `Hello ${m.name},\n\nThanks for contacting Oliskey. We received your ${TOPICS[m.topic].toLowerCase()} and will reply to this email address.\n\nYour reference: ${id.slice(0, 8)}\n\n— The Oliskey team\nhttps://www.oliskey.com`,
      });
      emailed = true;
    } catch (e) { console.error('[contact] email failed', e instanceof Error ? e.message : e); }
  } else {
    console.warn('[contact] GMAIL_USER / GMAIL_APP_PASSWORD not set: message saved but not emailed');
  }

  if (dbError && !emailed) return res.status(502).json({ ok: false, error: 'We could not send your message right now. Please email us or use WhatsApp.' });
  return res.status(200).json({ ok: true, reference: id.slice(0, 8), saved: !dbError, emailed });
}
