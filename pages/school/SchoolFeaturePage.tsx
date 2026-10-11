import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { findSchoolPage, PLANS, TRIAL_NOTE, SCHOOL_PAGES } from '../../data/schoolPages';
import { APP_ORIGIN } from '../../seo/publicRoutes';
import { findPublicRoute } from '../../seo/publicRoutes';

const APP_SIGNUP = `${APP_ORIGIN}/signup`;
const APP_DEMO = `${APP_ORIGIN}/demo`;

export const AppCtas: React.FC<{ compact?: boolean }> = ({ compact }) => (
    <div className={`grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:items-center sm:justify-center ${compact ? 'sm:gap-3' : 'sm:gap-4'}`}>
        <a href={APP_SIGNUP} className="col-span-2 flex min-h-12 w-full items-center justify-center whitespace-nowrap rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:col-span-1 sm:w-auto sm:px-6 sm:text-base">
            Get Started <ArrowRight size={18} className="ml-2 shrink-0" aria-hidden="true" />
        </a>
        <a href={APP_DEMO} className="flex min-h-12 w-full items-center justify-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 sm:w-auto sm:px-6 sm:text-base">
            Try Demo
        </a>
        <a href={APP_ORIGIN} className="flex min-h-12 w-full items-center justify-center whitespace-nowrap rounded-full border border-transparent px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-slate-200 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-blue-400 sm:w-auto sm:text-base">
            Open App
        </a>
    </div>
);

export const PlansSection: React.FC = () => (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center">Plans</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8">{TRIAL_NOTE}</p>
        <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((p) => (
                <div key={p.name} className="rounded-3xl p-6 border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{p.name}</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{p.price}</p>
                    {p.unit && <p className="text-xs text-slate-500 dark:text-slate-400">{p.unit}</p>}
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">{p.note}</p>
                </div>
            ))}
        </div>
    </section>
);

/** One component renders every school-product page from data/schoolPages.ts. */
const SchoolFeaturePage: React.FC = () => {
    const { pathname } = useLocation();
    const page = findSchoolPage(pathname.replace(/\/+$/, '') || '/');
    if (!page) return <Navigate to="/features" replace />;
    const related = page.related.map((p) => ({ path: p, label: findPublicRoute(p)?.label || p }));
    const showPlans = page.path === '/features' || page.path === '/school-management' || page.path === '/fees';

    return (
        <div className="bg-white pb-16 pt-10 transition-colors duration-300 dark:bg-slate-950 sm:pb-24 sm:pt-20">
            <header className="mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 sm:text-sm">{page.eyebrow}</p>
                <h1 className="text-[2rem] leading-[1.12] sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-6">{page.h1}</h1>
                <p className="text-base leading-relaxed sm:text-xl text-slate-600 dark:text-slate-400 mb-6 sm:mb-8">{page.intro}</p>
                <AppCtas />
            </header>

            <section className="mx-auto mt-10 grid max-w-6xl gap-4 px-5 sm:mt-16 sm:gap-6 sm:px-6 lg:px-8 md:grid-cols-2">
                {page.sections.map((s) => (
                    <article key={s.heading} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{s.heading}</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{s.body}</p>
                        {s.bullets && (
                            <ul className="mt-4 space-y-2">
                                {s.bullets.map((b) => (
                                    <li key={b} className="flex items-start text-sm text-slate-700 dark:text-slate-200">
                                        <Check size={16} className="mt-0.5 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" />{b}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </article>
                ))}
            </section>

            {showPlans && <PlansSection />}

            {page.faqs && (
                <section className="mx-auto mt-14 max-w-3xl px-5 sm:mt-20 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">Questions</h2>
                    <dl className="space-y-6">
                        {page.faqs.map((f) => (
                            <div key={f.q}>
                                <dt className="font-semibold text-slate-900 dark:text-white">{f.q}</dt>
                                <dd className="text-slate-600 dark:text-slate-300 mt-1">{f.a}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}

            <nav aria-label="Related pages" className="mx-auto mt-14 max-w-6xl px-5 sm:mt-20 sm:px-6 lg:px-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Explore more</h2>
                <div className="flex flex-wrap gap-2">
                    {related.map((r) => (
                        <Link key={r.path} to={r.path} className="px-4 py-2 rounded-full border border-gray-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {r.label}
                        </Link>
                    ))}
                </div>
            </nav>

            <div className="mx-auto mt-14 max-w-4xl px-5 text-center sm:mt-20 sm:px-6">
                <AppCtas compact />
            </div>
        </div>
    );
};

export default SchoolFeaturePage;

/** For App.tsx: every school page path, so routes stay in sync with the data. */
export const SCHOOL_PAGE_PATHS = SCHOOL_PAGES.map((p) => p.path);
