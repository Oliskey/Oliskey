// After `vite build`: one HTML file per public page with its own title, description, canonical link and a short
// text summary for crawlers, plus sitemap.xml and robots.txt. The app takes over in the browser as usual.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

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
  `<link rel="preload" href="/hq/glb/${zone}.glb" as="fetch" crossorigin />`,
].join('\n    ');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

for (const r of routes) {
  const url = SITE + (r.path === '/' ? '/' : r.path);
  const head = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`, `<meta property="og:site_name" content="Oliskey" />`,
    `<meta property="og:title" content="${esc(r.title)}" />`, `<meta property="og:description" content="${esc(r.description)}" />`,
    `<meta property="og:url" content="${url}" />`, `<meta property="og:image" content="${SITE}/hq/stills/outside-day.webp" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ['/', '/school', '/fleet', '/alpha', '/labs'].includes(r.path) ? preload3d(r.path === '/' ? 'hq' : r.path.slice(1)) : '',
    r.path === '/' ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Oliskey', legalName: 'Oliskeylee Ltd.', url: SITE, logo: `${SITE}/apple-touch-icon.png`, address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressCountry: 'NG' } })}</script>` : '',
  ].join('\n    ');
  const html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(r.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(r.description)}" />`)
    .replace('<!--seo-->', head)
    .replace('<div id="root"></div>', `<div id="root"></div><noscript><h1>${esc(r.title)}</h1><p>${esc(r.description)}</p></noscript>`);
  const out = r.path === '/' ? 'dist/index.html' : join('dist', r.path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.filter((r) => !['/sign-in'].includes(r.path)).map((r) => `  <url><loc>${SITE}${r.path === '/' ? '/' : r.path}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /account\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`prerendered ${routes.length} pages`);
