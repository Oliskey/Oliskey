import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { ThemeProvider } from './lib/theme';
import { AuthProvider } from './lib/auth';
import { routeFor, SITE } from './lib/routes';

const Home = lazy(() => import('./pages/Home'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const Products = lazy(() => import('./pages/Products'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Industries = lazy(() => import('./pages/Industries'));
const Resources = lazy(() => import('./pages/Resources'));
const About = lazy(() => import('./pages/About'));
const Pricing = lazy(() => import('./pages/Pricing'));
const AuthPage = lazy(() => import('./pages/Auth').then((m) => ({ default: m.AuthPage })));
const Account = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Account })));
const NotFound = lazy(() => import('./pages/NotFound'));

/** New pages start at the top; Back/Forward keeps the browser's own scroll restoration. Head tags follow the route. */
const RouteEffects: React.FC = () => {
  const { pathname } = useLocation();
  const type = useNavigationType();
  // only a real page change starts at the top — changing ?room= on the same page must never jump the visitor back
  const last = React.useRef(pathname);
  useEffect(() => {
    if (last.current !== pathname && type !== 'POP') window.scrollTo(0, 0);
    last.current = pathname;
  }, [pathname, type]);
  useEffect(() => {
    const r = routeFor(pathname);
    document.title = r?.title ?? 'Oliskey';
    const set = (sel: string, attr: string, val: string) => { const el = document.head.querySelector(sel); if (el) el.setAttribute(attr, val); };
    if (r) { set('meta[name="description"]', 'content', r.description); set('link[rel="canonical"]', 'href', SITE + (r.path === '/' ? '/' : r.path)); }
  }, [pathname]);
  return null;
};

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  return <main key={pathname} className="route-enter min-h-[100svh]">{children}</main>;
};

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <RouteEffects />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-raised focus:px-4 focus:py-2">Skip to content</a>
        <Nav />
        <div id="main">
          <Suspense fallback={<div className="min-h-[100svh]" />}>
            <Page>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/school" element={<ProductPage id="school" />} />
                <Route path="/fleet" element={<ProductPage id="fleet" />} />
                <Route path="/alpha" element={<ProductPage id="alpha" />} />
                <Route path="/labs" element={<ProductPage id="labs" />} />
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/industries" element={<Industries />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/get-started" element={<AuthPage mode="signup" />} />
                <Route path="/sign-in" element={<AuthPage mode="signin" />} />
                <Route path="/account" element={<Account />} />
                {/* old addresses */}
                <Route path="/school-management" element={<Navigate to="/school" replace />} />
                <Route path="/fleet-operations" element={<Navigate to="/fleet" replace />} />
                <Route path="/trading-app" element={<Navigate to="/alpha" replace />} />
                <Route path="/login" element={<Navigate to="/sign-in" replace />} />
                <Route path="/signup" element={<Navigate to="/get-started" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Page>
          </Suspense>
        </div>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);
export default App;
