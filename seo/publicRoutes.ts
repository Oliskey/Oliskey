// Single source of truth for every INDEXABLE public page on www.oliskey.com.
// Used at runtime (useSeo) and at build time (scripts/prerender.mjs writes one
// static HTML shell per route, plus sitemap.xml and robots.txt) so titles,
// descriptions, canonicals, Open Graph and JSON-LD are identical in both.
// Anything not listed here is either private (login, dashboards) or a
// parameterised page and is not put in the sitemap.

export const SITE_ORIGIN = 'https://www.oliskey.com';
export const APP_ORIGIN = 'https://app.oliskey.com';
export const SITE_NAME = 'Oliskey';
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og/oliskey-school-app.png`;

export interface PublicRoute {
    path: string;
    title: string;
    description: string;
    /** Short label for breadcrumbs / nav. */
    label: string;
    /** Set for the school-product pages so they get SoftwareApplication data. */
    product?: boolean;
    /** Fleet-specific structured data, separate from the school application schema. */
    fleetProduct?: boolean;
    /** Lower priority for secondary pages in the sitemap. */
    priority?: number;
}

export const PUBLIC_ROUTES: PublicRoute[] = [
    {
        path: '/',
        label: 'Home',
        title: 'Oliskey — Business Software, Automation & AI',
        description: 'Oliskey builds practical business software, workflow automation and AI-powered tools that help organisations reduce repetitive work, simplify operations and grow with greater control. Explore products or discuss a custom solution.',
        priority: 1,
    },
    {
        path: '/features',
        label: 'Features',
        title: 'Features — Oliskey School Management Software',
        description: 'Everything a school runs on, in one place: admissions, student and teacher records, attendance, timetable, fees, exams, report cards, CBT, e-learning, messaging and AI tools for every role.',
        product: true,
        priority: 0.9,
    },
    {
        path: '/school-management',
        label: 'School Management',
        title: 'School Management System for Nigerian Schools — Oliskey',
        description: 'Run every branch of your school from one system: enrolment, staff, classes, attendance, fees, exams, results, communication and compliance — with strict per-school data isolation.',
        product: true,
        priority: 0.9,
    },
    {
        path: '/teachers',
        label: 'Teachers',
        title: 'Teacher Management & Teaching Tools — Oliskey',
        description: 'Teachers mark attendance, build lesson plans and notes, set assignments, enter results and get AI help with lesson content — all from a phone or laptop.',
        product: true,
        priority: 0.8,
    },
    {
        path: '/students',
        label: 'Students',
        title: 'Student Management System & Student Portal — Oliskey',
        description: 'One record per student from admission to graduation: profile, class, attendance, fees, results, report cards, assignments, CBT and a study assistant.',
        product: true,
        priority: 0.8,
    },
    {
        path: '/parents',
        label: 'Parents',
        title: 'Parent Portal & School–Parent Communication — Oliskey',
        description: 'Parents see attendance, results, fees and school notices for every child — across branches — and message the school directly.',
        product: true,
        priority: 0.8,
    },
    {
        path: '/attendance',
        label: 'Attendance',
        title: 'School Attendance Management — Oliskey',
        description: 'Daily class attendance in seconds, with records by student, class and term, parent visibility and admin reports.',
        product: true,
        priority: 0.8,
    },
    {
        path: '/fees',
        label: 'Fees',
        title: 'School Fees Management & Online Payments — Oliskey',
        description: 'Fee structures per class and term, invoices, instalments, online payment via Paystack and Flutterwave, receipts and outstanding-balance tracking.',
        product: true,
        priority: 0.8,
    },
    {
        path: '/exams-results',
        label: 'Exams & Results',
        title: 'Exam & Result Management with Report Cards — Oliskey',
        description: 'Set up exams, enter scores by subject, compute grades and positions, and publish report cards students and parents can view online.',
        product: true,
        priority: 0.8,
    },
    {
        path: '/cbt',
        label: 'CBT',
        title: 'CBT Software for Schools — Computer-Based Testing — Oliskey',
        description: 'Create and run computer-based tests with question banks, timers, automatic marking and instant results — for in-school assessment and exam practice.',
        product: true,
        priority: 0.8,
    },
    {
        path: '/e-learning',
        label: 'E-Learning',
        title: 'E-Learning Platform for Schools — Oliskey',
        description: 'Lesson plans, lesson notes, schemes of work, assignments and learning resources shared with students online, with offline-friendly access on mobile.',
        product: true,
        priority: 0.8,
    },
    {
        path: '/ai',
        label: 'AI',
        title: 'AI School Management Tools — Oliskey',
        description: 'AI assistance built into the school workflow: lesson notes and schemes of work, quiz and exam question drafts, explanations for students, and summaries for administrators.',
        product: true,
        priority: 0.8,
    },
    {
        path: '/demo',
        label: 'Demo',
        title: 'Try the Oliskey School App Demo — No Sign-Up',
        description: 'Open a fully working demo school as Admin, Teacher, Student or Parent and switch roles instantly. No sign-up, nothing to install.',
        product: true,
        priority: 0.9,
    },
    {
        path: '/fleet-operations',
        label: 'Oliskey Fleet',
        title: 'Tricycle Fleet Management Software — Oliskey Fleet',
        description: 'Manage tricycles, drivers, staff, collections, remittances, maintenance schedules and partner balances in one fleet operations workspace. Explore Oliskey Fleet before opening the app.',
        fleetProduct: true,
        priority: 0.9,
    },
    {
        path: '/products',
        label: 'Products',
        title: 'Oliskey Products — Business Software, Automation & AI',
        description: 'Explore Oliskey software products for education, fleet operations and business workflows. Start with a ready-made product or talk to us about software and automation designed around your organisation.',
        priority: 0.95,
    },
    { path: '/services', label: 'Services', title: 'Business Software Development & Workflow Automation — Oliskey', description: 'Explore Oliskey services for custom business software, workflow automation, system integration and practical AI tools. Start with the operational problem you need to solve.', priority: 0.8 },
    { path: '/about', label: 'About Oliskey', title: 'Our Story — Oliskey Business Software & Automation', description: 'Oliskey exists to make work easier through useful software, automation and AI. Learn about the thinking behind our products and our people-first approach to solving real operational problems.', priority: 0.5 },
    { path: '/contact', label: 'Contact', title: 'Discuss Your Business Software or Automation Project — Oliskey', description: 'Tell Oliskey what is slowing your team down. Discuss a ready-made product, business workflow automation, AI assistance or custom software for your organisation.', priority: 0.6 },
    { path: '/pricing', label: 'Pricing', title: 'Pricing — Oliskey', description: 'Oliskey plans and pricing.', priority: 0.6 },
];

export const findPublicRoute = (pathname: string): PublicRoute | undefined => {
    const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    return PUBLIC_ROUTES.find((r) => r.path === clean);
};

/** Absolute canonical URL for a route path. */
export const canonicalFor = (path: string) => `${SITE_ORIGIN}${path === '/' ? '/' : path}`;

/** JSON-LD for a route. Only facts we can stand behind — no ratings, counts or awards. */
export function jsonLdFor(route: PublicRoute): object[] {
    const organization = {
        '@type': 'Organization',
        '@id': `${SITE_ORIGIN}/#organization`,
        name: SITE_NAME,
        url: SITE_ORIGIN,
        logo: `${APP_ORIGIN}/icons/app-icon-512.png`,
    };
    const website = {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: SITE_NAME,
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    };
    const graph: object[] = [organization, website];
    if (route.product) {
        graph.push({
            '@type': 'SoftwareApplication',
            name: 'Oliskey School App',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web, Android, iOS',
            url: APP_ORIGIN,
            description: PUBLIC_ROUTES[0].description,
            offers: [
                { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'NGN' },
                { '@type': 'Offer', name: 'Basic', price: '1000', priceCurrency: 'NGN', description: 'Per student per term' },
                { '@type': 'Offer', name: 'Advanced (with AI)', price: '3000', priceCurrency: 'NGN', description: 'Per student per term' },
            ],
            publisher: { '@id': `${SITE_ORIGIN}/#organization` },
        });
    }
    if (route.fleetProduct) {
        graph.push({
            '@type': 'SoftwareApplication',
            name: 'Oliskey Fleet',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            url: 'https://tricycles.oliskey.com/',
            description: route.description,
            featureList: [
                'Tricycle and vehicle records',
                'Driver and staff management',
                'Daily collections and remittance tracking',
                'Maintenance scheduling and reminders',
                'Partner balances and finance records',
            ],
            publisher: { '@id': `${SITE_ORIGIN}/#organization` },
        });
    }
    if (route.path === '/products') {
        graph.push(
            {
                '@type': 'SoftwareApplication',
                name: 'Oliskey School App',
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Web, Android, iOS',
                url: APP_ORIGIN,
                description: 'School management, communication, assessment and learning tools for schools.',
                publisher: { '@id': `${SITE_ORIGIN}/#organization` },
            },
            {
                '@type': 'SoftwareApplication',
                name: 'Oliskey Fleet',
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Web',
                url: 'https://tricycles.oliskey.com/',
                description: 'Fleet operations software for tricycle businesses, including vehicle, driver, collections, maintenance and finance workflows.',
                publisher: { '@id': `${SITE_ORIGIN}/#organization` },
            }
        );
    }
    if (route.path !== '/') {
        graph.push({
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN + '/' },
                { '@type': 'ListItem', position: 2, name: route.label, item: canonicalFor(route.path) },
            ],
        });
    }
    return [{ '@context': 'https://schema.org', '@graph': graph }];
}
