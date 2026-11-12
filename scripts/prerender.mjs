// After `vite build`: one HTML file per public page with its own title, description, canonical link and a short
// text summary for crawlers, plus sitemap.xml and robots.txt. The app takes over in the browser as usual.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
const HQ = JSON.parse(readFileSync(new URL('../src/three/hqManifest.json', import.meta.url), 'utf8'));
const hq = (p) => (HQ[p] ? `${p}?v=${HQ[p]}` : p);

const src = readFileSync('src/lib/routes.ts', 'utf8');
const SITE = /SITE = '([^']+)'/.exec(src)[1];
const routes = [...src.matchAll(/\{ path: '([^']+)', title: '([^']+)', description: '([^']+)' \}/g)].map((m) => ({ path: m[1], title: m[2], description: m[3] }));
const shell = readFileSync('dist/index.html', 'utf8');
// Preload what the 3D scene needs, so it downloads alongside the page instead of after it.
let manifest = {};
try { manifest = JSON.parse(readFileSync('dist/.vite/manifest.json', 'utf8')); } catch { /* no manifest */ }
const chunkFiles = (key, seen = new Set()) => {
  const m = manifest[key]; if (!m || seen.has(key)) return [];
  seen.add(key);
  return [m.file, ...(m.imports || []).flatMap((k) => chunkFiles(k, seen))];
};
const worldKey = Object.keys(manifest).find((k) => k === 'src/three/World.tsx') || Object.keys(manifest).find((k) => /World/.test(k));
const worldJs = worldKey ? [...new Set(chunkFiles(worldKey))] : [];
const preload3d = (zone) => [
  ...worldJs.map((f) => `<link rel="modulepreload" href="/${f}" />`),
  `<link rel="preload" href="${hq(`/hq/glb/${zone}.glb`)}" as="fetch" crossorigin />`,
].join('\n    ');
// The products, for search engines: each one is its own named app, published by Oliskey (keep in step with src/lib/products.ts).
const PRODUCTS = [
  { path: '/school', name: 'Oliskey School', app: 'https://app.oliskey.com/', cat: 'EducationalApplication', sub: 'School management software', os: 'Web, Android, iOS', free: true },
  { path: '/fleet', name: 'Oliskey Fleet', app: 'https://tricycles.oliskey.com/', cat: 'BusinessApplication', sub: 'Tricycle and fleet management software', os: 'Web' },
  { path: '/alpha', name: 'Oliskey Alpha', app: 'https://alpha.oliskey.com/', cat: 'FinanceApplication', sub: 'Trading practice and market learning app', os: 'Web, Android, iOS' },
  { path: '/labs', name: 'Oliskey Labs', cat: null, sub: 'Research and new technology' },
];
const ORG = { '@type': 'Organization', '@id': 'https://www.oliskey.com/#organization', name: 'Oliskey', legalName: 'Oliskeylee Ltd.', url: 'https://www.oliskey.com/',
  slogan: 'Bring your business to the world and reach more customers. Work smarter. Grow your business.',
  description: 'Oliskey helps businesses reach more customers, work smarter and grow, with apps for schools, transport operators and traders.',
  logo: 'https://www.oliskey.com/apple-touch-icon.png', email: 'oliskeylee@gmail.com', address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressCountry: 'NG' },
  sameAs: PRODUCTS.filter((p) => p.app).map((p) => p.app) };
const ld = (o) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...o }).replace(/</g, '\\u003c')}</script>`;
const jsonLd = (r, url) => {
  if (r.path === '/') return ld({ '@graph': [ORG,
    { '@type': 'WebSite', '@id': 'https://www.oliskey.com/#site', name: 'Oliskey', url: 'https://www.oliskey.com/', publisher: { '@id': ORG['@id'] } },
    { '@type': 'ItemList', name: 'Oliskey products', itemListElement: PRODUCTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: SITE + p.path })) }] });
  const p = PRODUCTS.find((x) => x.path === r.path);
  const crumbs = { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Oliskey', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: p ? p.name : r.title.split(' — ')[0], item: url }] };
  if (!p) return ld(crumbs);
  const thing = p.cat
    ? { '@type': 'SoftwareApplication', name: p.name, alternateName: p.sub, description: r.description, url, applicationCategory: p.cat, operatingSystem: p.os,
        ...(p.app ? { sameAs: [p.app], installUrl: p.app } : {}), image: `${SITE}/products${p.path}-light.webp`, publisher: ORG,
        ...(p.free ? { offers: { '@type': 'Offer', price: '0', priceCurrency: 'NGN', description: 'Free plan' } } : {}) }
    : { '@type': 'Organization', name: p.name, description: r.description, url, parentOrganization: ORG };
  return ld({ '@graph': [thing, crumbs] });
};
// A readable page for crawlers and slow connections; the app replaces it when it starts.
const NAV = [['/', 'Oliskey'], ...PRODUCTS.map((p) => [p.path, p.name]), ['/pricing', 'Pricing'], ['/about', 'About'], ['/contact', 'Contact & support']];
const body = (r) => `<main style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap"><h1>${esc(r.title.split(' — ')[0])}</h1><p>${esc(r.description)}</p><nav aria-label="Oliskey"><ul>${NAV.map(([h, t]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul></nav></main>`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

for (const r of routes) {
  const url = SITE + (r.path === '/' ? '/' : r.path);
  const head = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`, `<meta property="og:site_name" content="Oliskey" />`,
    `<meta property="og:title" content="${esc(r.title)}" />`, `<meta property="og:description" content="${esc(r.description)}" />`,
    `<meta property="og:url" content="${url}" />`, `<meta property="og:image" content="${SITE}${PRODUCTS.some((p) => p.path === r.path && p.cat) ? `/products${r.path}-light.webp` : '/hq/stills/outside-day.webp'}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ['/', '/school', '/fleet', '/alpha', '/labs'].includes(r.path) ? preload3d(r.path === '/' ? 'hq' : r.path.slice(1)) : '',
    jsonLd(r, url),
  ].join('\n    ');
  const html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(r.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(r.description)}" />`)
    .replace('<!--seo-->', head)
    .replace('<div id="root"></div>', `<div id="root">${body(r)}</div>`);
  const out = r.path === '/' ? 'dist/index.html' : join('dist', r.path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.filter((r) => !['/sign-in'].includes(r.path)).map((r) => `  <url><loc>${SITE}${r.path === '/' ? '/' : r.path}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /account\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`prerendered ${routes.length} pages`);
