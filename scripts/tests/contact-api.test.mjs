// End-to-end test of api/contact.ts: a stand-in Supabase REST endpoint + a real local SMTP server receiving the emails.
import http from 'node:http';
import { SMTPServer } from 'smtp-server';
const inserted = [], mails = [];
const rest = http.createServer((req, res) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { if (req.method === 'POST' && req.url.startsWith('/rest/v1/contact_messages')) { inserted.push(JSON.parse(b)); res.writeHead(201).end(); } else { res.writeHead(404).end('{}'); } }); }).listen(54321);
const smtp = new SMTPServer({ authOptional: true, onAuth: (a, s, cb) => cb(null, { user: a.username }), onData: (stream, session, cb) => { let d = ''; stream.on('data', (c) => (d += c)); stream.on('end', () => { mails.push({ to: session.envelope.rcptTo.map((r) => r.address), data: d }); cb(); }); } }).listen(2525);
Object.assign(process.env, { SUPABASE_URL: 'http://127.0.0.1:54321', SUPABASE_ANON_KEY: 'anon', GMAIL_USER: 'oliskeylee@gmail.com', GMAIL_APP_PASSWORD: 'test', SMTP_HOST: '127.0.0.1', SMTP_PORT: '2525' });
const { default: handler, validate } = await import('/home/claude/web/oliskey/api/contact.ts');
const call = (method, body, headers = {}) => new Promise((resolve) => {
  const res = { code: 200, h: {}, setHeader(k, v) { this.h[k] = v; }, status(c) { this.code = c; return this; }, json(j) { resolve({ code: this.code, body: j }); } };
  handler({ method, body, headers: { 'x-forwarded-for': '10.0.0.' + Math.floor(Math.random() * 200), ...headers } }, res);
});
const ok = (cond, label) => console.log(cond ? 'PASS' : 'FAIL', label);
const good = { name: 'Ada Obi', email: 'Ada@Example.com', phone: '0803 000 0000', topic: 'support', product: 'school', message: 'Our attendance page is not loading since this morning.', page: '/contact', startedAt: Date.now() - 20000 };
ok((await call('GET')).code === 405, 'GET is refused (405)');
ok((await call('POST', { ...good, email: 'not-an-email' })).body.error.includes('valid email'), 'bad email gets a clear error');
ok((await call('POST', { ...good, message: 'hi' })).code === 400, 'too-short message rejected');
ok((await call('POST', { ...good, topic: 'hack' })).code === 400, 'unknown topic rejected');
const bot = await call('POST', { ...good, company: 'spam inc' }); ok(bot.code === 200 && inserted.length === 0 && mails.length === 0, 'honeypot bot: looks fine to the bot, nothing saved or sent');
const fast = await call('POST', { ...good, startedAt: Date.now() - 500 }); ok(fast.code === 200 && inserted.length === 0, 'instant submit (bot) ignored');
const r = await call('POST', JSON.stringify(good));
await new Promise((x) => setTimeout(x, 400));
ok(r.code === 200 && r.body.ok && r.body.saved && r.body.emailed, `real message accepted ${JSON.stringify(r.body)}`);
ok(inserted.length === 1 && inserted[0].email === 'ada@example.com' && inserted[0].product === 'school', 'saved to the database');
ok(mails.length === 2, `two emails sent (${mails.map((m) => m.to.join(',')).join(' | ')})`);
ok(mails[0].to[0] === 'oliskeylee@gmail.com' && /Support_request/.test(mails[0].data) && /Reply-To: Ada Obi <ada@example.com>/.test(mails[0].data), 'notification to Oliskey Gmail, reply goes straight to the customer');
ok(mails[1].to[0] === 'ada@example.com' && /We_received_your_message/.test(mails[1].data), 'confirmation sent to the customer');
const xss = await call('POST', { ...good, name: 'Eve <script>alert(1)</script>' }); await new Promise((x) => setTimeout(x, 300));
ok(!/<script>alert/.test(mails[2]?.data || '') && /&lt;script&gt;/.test((mails[2]?.data || '').replace(/=\r\n/g, '').replace(/=3D/g, '=')), 'HTML in a message is escaped (body and headers)');
// throttle: 6 messages from one address in 10 minutes
let last; for (let i = 0; i < 6; i++) last = await call('POST', good, { 'x-forwarded-for': '9.9.9.9' });
ok(last.code === 429, 'more than 5 messages in 10 minutes from one address is throttled');

rest.close(); smtp.close(() => process.exit(0));
