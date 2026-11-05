import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { routeFor } from './routes.jsx';
import './index.css';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Pages are pre-rendered at build time. Load the current page's chunk first, then hydrate,
// so React adopts the existing HTML instead of re-rendering it. `npm run dev` renders fresh.
if (root.hasChildNodes()) {
  const r = routeFor(window.location.pathname);
  (r ? r.load() : Promise.resolve()).finally(() => hydrateRoot(root, app));
} else {
  createRoot(root).render(app);
}
