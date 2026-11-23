import { createRoot } from 'react-dom/client';
import OfflineCatalogApp from './components/OfflineCatalogApp.tsx';
import './index.css';

function mountOfflineCatalog() {
  const rootEl = document.getElementById('root');
  if (rootEl) {
    createRoot(rootEl).render(<OfflineCatalogApp />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountOfflineCatalog, { once: true });
} else {
  mountOfflineCatalog();
}
