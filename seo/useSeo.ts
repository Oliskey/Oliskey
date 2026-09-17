import { useEffect } from 'react';
import { DEFAULT_OG_IMAGE, SITE_NAME, canonicalFor, findPublicRoute, jsonLdFor } from './publicRoutes';

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute('content', content);
};

/**
 * Keeps <head> in sync with the current route for client-side navigation.
 * The prerendered HTML shell (scripts/prerender.mjs) already carries the same
 * tags for the first paint and for crawlers that don't run JS; this makes
 * them follow the user through the SPA. Private/unknown routes get noindex.
 */
export function useSeo(pathname: string) {
    useEffect(() => {
        const route = findPublicRoute(pathname);
        const canonical = route ? canonicalFor(route.path) : null;

        let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (canonical) {
            if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
            link.href = canonical;
        } else if (link) {
            link.remove();
        }

        upsertMeta('name', 'robots', route ? 'index, follow' : 'noindex, nofollow');
        if (route) {
            document.title = route.title;
            upsertMeta('name', 'description', route.description);
            upsertMeta('property', 'og:type', 'website');
            upsertMeta('property', 'og:site_name', SITE_NAME);
            upsertMeta('property', 'og:title', route.title);
            upsertMeta('property', 'og:description', route.description);
            upsertMeta('property', 'og:url', canonical!);
            upsertMeta('property', 'og:image', DEFAULT_OG_IMAGE);
            upsertMeta('name', 'twitter:card', 'summary_large_image');
        }

        document.head.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());
        if (route) {
            for (const block of jsonLdFor(route)) {
                const s = document.createElement('script');
                s.type = 'application/ld+json';
                s.setAttribute('data-seo-jsonld', '');
                s.text = JSON.stringify(block);
                document.head.appendChild(s);
            }
        }
    }, [pathname]);
}
