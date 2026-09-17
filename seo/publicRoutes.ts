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
    /** Lower priority for secondary pages in the sitemap. */
    priority?: number;
}

export const PUBLIC_ROUTES: PublicRoute[] = [
    {
        path: '/',
        label: 'Home',
        title: 'Oliskey School App — All-in-One School Management Platform',
        description: 'Oliskey is an all-in-one school management platform: students, teachers, attendance, timetable, fees, exams and results, CBT, e-learning, messaging and AI-assisted workflows in one app. Try the demo free.',
        product: true,
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
    { path: '/about', label: 'About', title: 'About Oliskey', description: 'Oliskey builds practical software for schools and learners, starting with the Oliskey School App.', priority: 0.5 },
    { path: '/contact', label: 'Contact', title: 'Contact Oliskey', description: 'Talk to the Oliskey team about the School App, onboarding your school, or partnership.', priority: 0.5 },
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
