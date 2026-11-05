import { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header, Footer, MobileActionBar } from './components/Layout.jsx';
import NotFound from './pages/NotFound.jsx';
import { routes } from './routes.jsx';
import { metaFor } from './meta.js';
import { SITE_URL } from './data/site.js';

/** Keeps title/description/canonical correct after client-side navigation (first load is pre-rendered). */
function useHeadSync() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const m = metaFor(pathname);
    document.title = m.title;
    const set = (sel, attr, val) => document.querySelector(sel)?.setAttribute(attr, val);
    set('meta[name="description"]', 'content', m.description);
    set('meta[property="og:title"]', 'content', m.title);
    set('meta[property="og:description"]', 'content', m.description);
    set('meta[property="og:url"]', 'content', `${SITE_URL}${m.path}`);
    set('link[rel="canonical"]', 'href', `${SITE_URL}${m.path}`);
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
}

export default function App() {
  useHeadSync();
  return (
    <>
      <Header />
      <main id="main" className="pb-16 sm:pb-0">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <Routes>
            {routes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component path={path} />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
