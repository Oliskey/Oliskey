import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { findSchoolPage, PLANS, TRIAL_NOTE, SCHOOL_PAGES } from '../../data/schoolPages';
import { APP_ORIGIN } from '../../seo/publicRoutes';
import { findPublicRoute } from '../../seo/publicRoutes';

const APP_SIGNUP = `${APP_ORIGIN}/signup`;
const APP_DEMO = `${APP_ORIGIN}/demo`;

export const AppCtas: React.FC<{ compact?: boolean }> = ({ compact }) => (
    <div className={`flex flex-col xs:flex-row gap-3 ${compact ? '' : 'sm:gap-4'} justify-center items-center`}>
        <a href={APP_SIGNUP} className="w-full xs:w-auto px-6 py-3.5 rounded-full bg-blue-600 text-white font-medium text-sm sm:text-base hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center">
            Get Started <ArrowRight size={18} className="ml-2" />
        </a>
        <a href={APP_DEMO} className="w-full xs:w-auto px-6 py-3.5 rounded-full border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center">
            Try Demo
        </a>
        <a href={APP_ORIGIN} className="w-full xs:w-auto px-6 py-3.5 rounded-full text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center">
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
        <div className="pt-24 pb-24 bg-white dark:bg-slate-950 transition-colors duration-300">
            <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">{page.eyebrow}</p>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">{page.h1}</h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">{page.intro}</p>
                <AppCtas />
            </header>

            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid gap-6 md:grid-cols-2">
                {page.sections.map((s) => (
                    <article key={s.heading} className="rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
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
                <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
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

            <nav aria-label="Related pages" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Explore more</h2>
                <div className="flex flex-wrap gap-2">
                    {related.map((r) => (
                        <Link key={r.path} to={r.path} className="px-4 py-2 rounded-full border border-gray-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {r.label}
                        </Link>
                    ))}
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
                <AppCtas compact />
            </div>
        </div>
    );
};

export default SchoolFeaturePage;

/** For App.tsx: every school page path, so routes stay in sync with the data. */
export const SCHOOL_PAGE_PATHS = SCHOOL_PAGES.map((p) => p.path);
