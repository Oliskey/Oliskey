// Post-build: give every indexable public route its own static HTML shell with
// the right <title>, description, canonical, Open Graph and JSON-LD baked in,
// and emit sitemap.xml + robots.txt. The shells load the same SPA bundle, so
// the app behaves exactly as before — but crawlers that do not execute JS
// (WhatsApp, Facebook, LinkedIn link previews) and search engines see the
// per-page metadata on the first byte. Vercel serves a matching static file
// before applying the SPA rewrite in vercel.json.
//
// Route metadata comes from seo/publicRoutes.ts — one source of truth shared
// with the runtime hook — loaded here through a tiny TS→JS transpile step.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const tsSource = readFileSync(join(root, 'seo', 'publicRoutes.ts'), 'utf8');
const { code } = transformSync(tsSource, { loader: 'ts', format: 'esm' });
const mod = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const { PUBLIC_ROUTES, SITE_ORIGIN, SITE_NAME, DEFAULT_OG_IMAGE, canonicalFor, jsonLdFor } = mod;

const template = readFileSync(join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const headFor = (route) => {
    const canonical = canonicalFor(route.path);
    const tags = [
        `<title>${esc(route.title)}</title>`,
        `<meta name="description" content="${esc(route.description)}" />`,
        `<meta name="robots" content="index, follow" />`,
        `<link rel="canonical" href="${canonical}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
        `<meta property="og:title" content="${esc(route.title)}" />`,
        `<meta property="og:description" content="${esc(route.description)}" />`,
        `<meta property="og:url" content="${canonical}" />`,
        `<meta property="og:image" content="${DEFAULT_OG_IMAGE}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        ...jsonLdFor(route).map((block) => `<script type="application/ld+json" data-seo-jsonld>${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`),
    ];
    return tags.join('\n  ');
};

// Strip the template's generic title/description so each shell carries exactly one.
const base = template
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta name="description"[\s\S]*?\/>\s*/i, '');

let written = 0;
for (const route of PUBLIC_ROUTES) {
    const html = base.replace('<head>', `<head>\n  ${headFor(route)}`);
    const outDir = route.path === '/' ? dist : join(dist, route.path.replace(/^\//, ''));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html);
    written++;
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PUBLIC_ROUTES.map((r) => `  <url>
    <loc>${canonicalFor(r.path)}</loc>
    <lastmod>${today}</lastmod>
    <priority>${(r.priority ?? 0.5).toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);

writeFileSync(join(dist, 'robots.txt'), `# www.oliskey.com — public marketing site. Signed-in areas are excluded
# from crawling here; authentication is what actually protects them.
User-agent: *
Allow: /
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /dashboard
Disallow: /admin
Disallow: /profile
Disallow: /settings
Disallow: /learning-hub
Disallow: /get-started

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`);

console.log(`[prerender] ${written} route shells, sitemap.xml (${PUBLIC_ROUTES.length} urls), robots.txt`);
