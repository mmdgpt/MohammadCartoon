import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import {
  NonFullScreenPageMode,
  PDFArray,
  PDFDocument,
  PDFName,
  ReadingDirection,
} from 'pdf-lib';
import {
  buildOfflineCatalogHtml,
  warmOfflineBundleShell,
} from './server/offlineHtmlBuilder.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const PDF_FILE_PATH = path.join(PUBLIC_DIR, 'mohammad-carton-catalog.pdf');
const STATE_FILE_PATH = path.join(PUBLIC_DIR, 'catalog-state.json');
const STORAGE_KEY = 'mohammad_carton_catalog_state_v1';

let currentCatalogState: unknown = null;
try {
  if (fs.existsSync(STATE_FILE_PATH)) {
    currentCatalogState = JSON.parse(fs.readFileSync(STATE_FILE_PATH, 'utf-8'));
  }
} catch {
  currentCatalogState = null;
}

let pdfDirty = false;
let isGeneratingPdf = false;
let lastGeneratedAt = Date.now();
let lastPdfError: string | null = null;
let activePdfPromise: Promise<void> | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// Keep a reusable headless Chromium instance for fast PDF regeneration
let sharedBrowserPromise: Promise<any> | null = null;

async function getChromiumBrowser() {
  if (!sharedBrowserPromise) {
    sharedBrowserPromise = (async () => {
      const pwPaths = [
        '/usr/local/share/bun-global/node_modules/playwright-core',
        'playwright-core',
      ];
      let pw: any = null;
      for (const p of pwPaths) {
        try {
          pw = require(p);
          break;
        } catch {
          // try next path
        }
      }
      if (!pw) {
        throw new Error('playwright-core not found');
      }
      return await pw.chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    })().catch((err) => {
      sharedBrowserPromise = null;
      throw err;
    });
  }
  return sharedBrowserPromise;
}

async function applyCatalogOnlySinglePagePdfSettings(
  rawPdfBuffer: Buffer
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(rawPdfBuffer);
  const catalog = pdfDoc.catalog;
  const context = pdfDoc.context;

  // Lock continuous scrolling: show strictly one single page at a time
  catalog.set(PDFName.of('PageLayout'), PDFName.of('SinglePage'));
  // Hide navigation panes / thumbnails / outlines so only the catalog page is displayed
  catalog.set(PDFName.of('PageMode'), PDFName.of('UseNone'));

  // Hide viewer toolbars, menubars, and window chrome/scroll UI and fit catalog cleanly
  const viewerPrefs = catalog.getOrCreateViewerPreferences();
  viewerPrefs.setHideToolbar(true);
  viewerPrefs.setHideMenubar(true);
  viewerPrefs.setHideWindowUI(true);
  viewerPrefs.setFitWindow(true);
  viewerPrefs.setCenterWindow(true);
  viewerPrefs.setDisplayDocTitle(true);
  viewerPrefs.setNonFullScreenPageMode(NonFullScreenPageMode.UseNone);
  viewerPrefs.setReadingDirection(ReadingDirection.R2L);

  // Open directly on cover page fitted completely in the viewer window
  const pages = pdfDoc.getPages();
  if (pages.length > 0) {
    const openAction = PDFArray.withContext(context);
    openAction.push(pages[0].ref);
    openAction.push(PDFName.of('Fit'));
    catalog.set(PDFName.of('OpenAction'), openAction);
  }

  const savedBytes = await pdfDoc.save({ useObjectStreams: false });
  return Buffer.from(savedBytes);
}

async function rebuildClickablePdfNow(): Promise<void> {
  if (activePdfPromise) {
    return activePdfPromise;
  }

  activePdfPromise = (async () => {
    while (pdfDirty) {
      pdfDirty = false;
      isGeneratingPdf = true;
      lastPdfError = null;
      const snapshotState = currentCatalogState;

      let context: any = null;
      try {
        const browser = await getChromiumBrowser();
        context = await browser.newContext({
          viewport: { width: 486, height: 864 },
        });

        // Inject the exact latest Admin Panel catalogState into localStorage before the print page loads
        await context.addInitScript(
          ({ key, stateJson }: { key: string; stateJson: string | null }) => {
            try {
              if (stateJson) {
                window.localStorage.setItem(key, stateJson);
              } else {
                window.localStorage.removeItem(key);
              }
            } catch {
              // ignore storage errors
            }
          },
          {
            key: STORAGE_KEY,
            stateJson: snapshotState ? JSON.stringify(snapshotState) : null,
          }
        );

        const page = await context.newPage();
        await page.goto(`http://127.0.0.1:${PORT}/?print=1`, {
          waitUntil: 'networkidle',
          timeout: 30000,
        });

        await page.waitForSelector('#printroot .pp', { timeout: 15000 });
        await page.evaluate(async () => {
          if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
          }
        });

        const rawPdfBuffer: Buffer = await page.pdf({
          width: '486px',
          height: '864px',
          printBackground: true,
          margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        });

        const lockedPdfBuffer = await applyCatalogOnlySinglePagePdfSettings(rawPdfBuffer);

        fs.mkdirSync(PUBLIC_DIR, { recursive: true });
        fs.writeFileSync(PDF_FILE_PATH, lockedPdfBuffer);
        lastGeneratedAt = Date.now();
      } catch (err: any) {
        lastPdfError = err?.message || 'PDF regeneration failed';
        console.error('PDF regeneration error:', err);
      } finally {
        if (context) {
          await context.close().catch(() => {});
        }
        isGeneratingPdf = false;
      }
    }
  })().finally(() => {
    activePdfPromise = null;
  });

  return activePdfPromise;
}

function schedulePdfRegeneration(delayMs = 300) {
  pdfDirty = true;
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void rebuildClickablePdfNow();
  }, delayMs);
}

async function ensureFreshPdf(): Promise<void> {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  while (pdfDirty || activePdfPromise) {
    await rebuildClickablePdfNow();
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  // 1. Get current server-persisted catalog state & PDF build status
  app.get('/api/catalog-state', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      catalogState: currentCatalogState,
      isGeneratingPdf: isGeneratingPdf || pdfDirty,
      lastGeneratedAt,
    });
  });

  // 2. Update catalog state from Admin Panel and trigger immediate PDF update
  app.post('/api/catalog-state', async (req, res) => {
    const nextState = req.body?.catalogState;
    const rebuildNow = Boolean(req.body?.rebuildNow);
    if (nextState && typeof nextState === 'object') {
      currentCatalogState = nextState;
      try {
        fs.mkdirSync(PUBLIC_DIR, { recursive: true });
        fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(nextState), 'utf-8');
      } catch {
        // ignore disk write issues
      }
      if (rebuildNow) {
        pdfDirty = true;
        await ensureFreshPdf();
        res.json({
          ok: true,
          pdfUpdated: !lastPdfError,
          isGeneratingPdf: false,
          lastGeneratedAt,
          pdfError: lastPdfError,
        });
        return;
      }
      schedulePdfRegeneration(250);
    }
    res.json({
      ok: true,
      pdfUpdated: false,
      isGeneratingPdf: isGeneratingPdf || pdfDirty,
      lastGeneratedAt,
    });
  });

  // 3. Reset catalog state to defaults and regenerate default PDF
  app.delete('/api/catalog-state', async (req, res) => {
    const rebuildNow = req.query.rebuildNow === '1';
    currentCatalogState = null;
    try {
      if (fs.existsSync(STATE_FILE_PATH)) {
        fs.unlinkSync(STATE_FILE_PATH);
      }
    } catch {
      // ignore
    }
    if (rebuildNow) {
      pdfDirty = true;
      await ensureFreshPdf();
      res.json({
        ok: true,
        pdfUpdated: !lastPdfError,
        lastGeneratedAt,
      });
      return;
    }
    schedulePdfRegeneration(100);
    res.json({ ok: true, lastGeneratedAt });
  });

  // 4. Serve always-up-to-date interactive clickable PDF (SinglePage, chrome-free, scroll-locked)
  const handleServePdf = async (req: express.Request, res: express.Response) => {
    try {
      if (!fs.existsSync(PDF_FILE_PATH)) {
        pdfDirty = true;
      }
      await ensureFreshPdf();
    } catch {
      // fallback to existing PDF on disk if any
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.query.inline !== '1') {
      res.setHeader(
        'Content-Disposition',
        "attachment; filename=\"mohammad-carton-catalog.pdf\"; filename*=UTF-8''%DA%A9%D8%A7%D8%AA%D8%A7%D9%84%D9%88%DA%AF-%D9%87%D9%88%D8%B4%D9%85%D9%86%D8%AF-%DA%A9%D8%A7%D8%B1%D8%AA%D9%86-%D9%85%D8%AD%D9%85%D8%AF.pdf"
      );
    }

    if (fs.existsSync(PDF_FILE_PATH)) {
      res.sendFile(PDF_FILE_PATH);
    } else {
      res.status(404).send('PDF file not found');
    }
  };

  app.get('/mohammad-carton-catalog.pdf', handleServePdf);
  app.get('/api/catalog.pdf', handleServePdf);

  // 4b. Serve always-up-to-date self-contained single-file offline interactive HTML catalog
  const handleServeOfflineHtml = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const html = await buildOfflineCatalogHtml(currentCatalogState);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      );
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      if (req.query.inline !== '1') {
        res.setHeader(
          'Content-Disposition',
          "attachment; filename=\"mohammad-carton-catalog.html\"; filename*=UTF-8''%DA%A9%D8%A7%D8%AA%D8%A7%D9%84%D9%88%DA%AF-%D8%A2%D9%81%D9%84%D8%A7%DB%8C%D9%86-%DA%A9%D8%A7%D8%B1%D8%AA%D9%86-%D9%85%D8%AD%D9%85%D8%AF.html"
        );
      }

      res.send(html);
    } catch (err) {
      console.error('Offline HTML generation error:', err);
      res.status(500).send('Failed to generate offline HTML catalog');
    }
  };

  app.get('/mohammad-carton-catalog.html', handleServeOfflineHtml);
  app.get('/api/catalog-offline.html', handleServeOfflineHtml);

  // 5. Vite middleware in development, static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(PUBLIC_DIR));
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    warmOfflineBundleShell();
    // Ensure existing PDF on disk is upgraded with SinglePage scroll-lock + chrome-free ViewerPreferences
    try {
      if (fs.existsSync(PDF_FILE_PATH)) {
        const existing = fs.readFileSync(PDF_FILE_PATH);
        if (!existing.includes(Buffer.from('/SinglePage'))) {
          schedulePdfRegeneration(500);
        }
      } else {
        schedulePdfRegeneration(500);
      }
    } catch {
      // ignore startup check errors
    }
  });
}

void startServer();
