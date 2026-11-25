import express from 'express';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
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
import {
  CatalogSnapshotRecord,
  changeAdminPassword,
  getAdminAuthStatus,
  getCatalogSnapshot,
  initCatalogDb,
  resetCatalogSnapshot,
  revokeAdminBearerToken,
  saveCatalogSnapshot,
  setupInitialAdmin,
  validateAdminBearerToken,
  verifyAdminLogin,
} from './server/catalogDb.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const PDF_FILE_PATH = path.join(PUBLIC_DIR, 'mohammad-carton-catalog.pdf');
const HTML_FILE_PATH = path.join(PUBLIC_DIR, 'mohammad-carton-catalog.html');
const STORAGE_KEY = 'mohammad_carton_catalog_state_v1';

// Initialize SQLite database (auto-migrating any legacy catalog-state.json)
const initialSnapshot = initCatalogDb();

let pdfDirty = false;
let isGeneratingPdf = false;
let pdfSyncedVersion = 0;
let lastGeneratedAt = initialSnapshot.updatedAt;
let lastPdfError: string | null = null;
let activePdfPromise: Promise<void> | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// Version-tagged offline HTML cache so downloads are instant and 100% synced with DB
let cachedOfflineHtml: { version: number; html: string } | null = null;
let activeHtmlPromise: Promise<string> | null = null;

// Real-time connected clients (WebSocket + SSE fallback)
const wsClients = new Set<WebSocket>();
const sseClients = new Set<express.Response>();

// Lightweight in-memory brute-force rate limiter for admin login/setup
const authAttempts = new Map<string, { count: number; resetAt: number }>();
const AUTH_WINDOW_MS = 15 * 60 * 1000;
const MAX_AUTH_ATTEMPTS = 20;

function checkAuthRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = authAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    authAttempts.set(ip, { count: 1, resetAt: now + AUTH_WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_AUTH_ATTEMPTS;
}

function broadcastCatalogUpdate(snapshot: CatalogSnapshotRecord): void {
  const payload = JSON.stringify({
    type: 'catalog:updated',
    version: snapshot.version,
    updatedAt: snapshot.updatedAt,
    productCount: snapshot.productCount,
  });

  for (const client of wsClients) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(payload);
      } catch {
        // ignore broken socket
      }
    }
  }

  for (const res of sseClients) {
    try {
      res.write(`event: catalog-updated\ndata: ${payload}\n\n`);
    } catch {
      sseClients.delete(res);
    }
  }
}

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

async function ensureFreshOfflineHtml(
  snapshotOverride?: CatalogSnapshotRecord
): Promise<string> {
  const snapshot = snapshotOverride || getCatalogSnapshot();
  if (cachedOfflineHtml && cachedOfflineHtml.version === snapshot.version) {
    return cachedOfflineHtml.html;
  }

  if (activeHtmlPromise) {
    await activeHtmlPromise;
    const latest = getCatalogSnapshot();
    if (cachedOfflineHtml && cachedOfflineHtml.version === latest.version) {
      return cachedOfflineHtml.html;
    }
  }

  activeHtmlPromise = (async () => {
    const current = getCatalogSnapshot();
    const html = await buildOfflineCatalogHtml(current.catalogState);
    cachedOfflineHtml = { version: current.version, html };
    try {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
      fs.writeFileSync(HTML_FILE_PATH, html, 'utf-8');
    } catch {
      // ignore disk write issues; in-memory cache still serves the fresh file
    }
    return html;
  })().finally(() => {
    activeHtmlPromise = null;
  });

  return activeHtmlPromise;
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
      const snapshot = getCatalogSnapshot();

      let context: any = null;
      try {
        const browser = await getChromiumBrowser();
        context = await browser.newContext({
          viewport: { width: 486, height: 864 },
        });

        // Inject exact authoritative SQLite catalog snapshot before print page loads
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
            stateJson: snapshot.catalogState
              ? JSON.stringify(snapshot.catalogState)
              : null,
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
        pdfSyncedVersion = snapshot.version;
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
  const snapshot = getCatalogSnapshot();
  if (!fs.existsSync(PDF_FILE_PATH) || pdfSyncedVersion !== snapshot.version) {
    pdfDirty = true;
  }
  while (pdfDirty || activePdfPromise) {
    await rebuildClickablePdfNow();
  }
}

function requireAdminAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const session = validateAdminBearerToken(req.headers.authorization);
  if (!session) {
    res.status(401).json({
      ok: false,
      error: 'احراز هویت مدیر انجام نشده یا نشست منقضی شده است. لطفاً مجدداً وارد شوید.',
    });
    return;
  }
  (req as express.Request & { adminUser?: string }).adminUser = session.username;
  next();
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '25mb' }));

  // Health check endpoint for server/container deployments
  app.get('/api/health', (_req, res) => {
    const snap = getCatalogSnapshot();
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      ok: true,
      version: snap.version,
      updatedAt: snap.updatedAt,
      productCount: snap.productCount,
      connectedClients: wsClients.size + sseClients.size,
    });
  });

  // ==================== ADMIN AUTH ENDPOINTS ====================

  app.get('/api/admin/status', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json(getAdminAuthStatus());
  });

  app.post('/api/admin/setup', (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkAuthRateLimit(ip)) {
      res.status(429).json({
        ok: false,
        error: 'تعداد تلاش‌ها بیش از حد مجاز است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.',
      });
      return;
    }

    const username = typeof req.body?.username === 'string' ? req.body.username : 'admin';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    try {
      const session = setupInitialAdmin(username, password);
      res.json({
        ok: true,
        token: session.token,
        username: session.username,
        expiresAt: session.expiresAt,
      });
    } catch (err: any) {
      res.status(400).json({
        ok: false,
        error: err?.message || 'خطا در تنظیم رمز عبور مدیر',
      });
    }
  });

  app.post('/api/admin/login', (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkAuthRateLimit(ip)) {
      res.status(429).json({
        ok: false,
        error: 'تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً چند دقیقه صبر کنید.',
      });
      return;
    }

    const username = typeof req.body?.username === 'string' ? req.body.username : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const session = verifyAdminLogin(username, password);
    if (!session) {
      res.status(401).json({
        ok: false,
        error: 'نام کاربری یا رمز عبور اشتباه است.',
      });
      return;
    }

    res.json({
      ok: true,
      token: session.token,
      username: session.username,
      expiresAt: session.expiresAt,
    });
  });

  app.post('/api/admin/logout', (req, res) => {
    revokeAdminBearerToken(req.headers.authorization);
    res.json({ ok: true });
  });

  app.post('/api/admin/change-password', requireAdminAuth, (req, res) => {
    const currentPassword =
      typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
    const newPassword =
      typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
    try {
      changeAdminPassword(currentPassword, newPassword);
      res.json({ ok: true });
    } catch (err: any) {
      res.status(400).json({
        ok: false,
        error: err?.message || 'خطا در تغییر رمز عبور',
      });
    }
  });

  // ==================== REAL-TIME CATALOG SYNC ENDPOINTS ====================

  // 1. Authoritative catalog state from SQLite database (for all visitors)
  app.get('/api/catalog-state', (_req, res) => {
    const snapshot = getCatalogSnapshot();
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json({
      catalogState: snapshot.catalogState,
      version: snapshot.version,
      updatedAt: snapshot.updatedAt,
      productCount: snapshot.productCount,
      isGeneratingPdf: isGeneratingPdf || pdfDirty,
      lastGeneratedAt: Math.max(lastGeneratedAt, snapshot.updatedAt),
    });
  });

  // 1b. Server-Sent Events fallback stream for real-time visitor updates
  app.get('/api/catalog-events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const snap = getCatalogSnapshot();
    res.write(
      `event: catalog-hello\ndata: ${JSON.stringify({
        type: 'catalog:hello',
        version: snap.version,
        updatedAt: snap.updatedAt,
      })}\n\n`
    );

    sseClients.add(res);
    const keepAlive = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch {
        clearInterval(keepAlive);
        sseClients.delete(res);
      }
    }, 25000);

    req.on('close', () => {
      clearInterval(keepAlive);
      sseClients.delete(res);
    });
  });

  // 2. Save catalog state to SQLite, rebuild PDF & Offline HTML, and broadcast to ALL visitors
  app.post('/api/catalog-state', requireAdminAuth, async (req, res) => {
    const nextState = req.body?.catalogState;
    const rebuildNow = req.body?.rebuildNow !== false;
    if (!nextState || typeof nextState !== 'object' || Array.isArray(nextState)) {
      res.status(400).json({ ok: false, error: 'ساختار اطلاعات کاتالوگ نامعتبر است.' });
      return;
    }

    try {
      const snapshot = saveCatalogSnapshot(nextState);
      cachedOfflineHtml = null;

      // Refresh Offline HTML immediately (<100ms once shell is warm)
      let htmlUpdated = false;
      try {
        await ensureFreshOfflineHtml(snapshot);
        htmlUpdated = true;
      } catch (err) {
        console.error('Offline HTML sync error:', err);
      }

      // Broadcast real-time update to ALL connected visitors immediately (<200ms)
      broadcastCatalogUpdate(snapshot);

      if (rebuildNow) {
        pdfDirty = true;
        await ensureFreshPdf();
        // Broadcast again once PDF finishes regenerating so PDF download links refresh cleanly
        broadcastCatalogUpdate(snapshot);
      } else {
        schedulePdfRegeneration(150);
      }

      res.json({
        ok: true,
        version: snapshot.version,
        updatedAt: snapshot.updatedAt,
        pdfUpdated: rebuildNow ? !lastPdfError : false,
        htmlUpdated,
        isGeneratingPdf: isGeneratingPdf || pdfDirty,
        lastGeneratedAt: snapshot.updatedAt,
        pdfError: lastPdfError,
      });
    } catch (err: any) {
      console.error('Catalog save error:', err);
      res.status(500).json({
        ok: false,
        error: err?.message || 'خطا در ذخیره اطلاعات در دیتابیس سرور',
      });
    }
  });

  // 3. Reset catalog state in SQLite to defaults, rebuild PDF & Offline HTML, and broadcast
  app.delete('/api/catalog-state', requireAdminAuth, async (req, res) => {
    const rebuildNow = req.query.rebuildNow === '1';
    try {
      const snapshot = resetCatalogSnapshot();
      cachedOfflineHtml = null;

      let htmlUpdated = false;
      try {
        await ensureFreshOfflineHtml(snapshot);
        htmlUpdated = true;
      } catch (err) {
        console.error('Offline HTML reset sync error:', err);
      }

      if (rebuildNow) {
        pdfDirty = true;
        await ensureFreshPdf();
      } else {
        schedulePdfRegeneration(100);
      }

      broadcastCatalogUpdate(snapshot);

      res.json({
        ok: true,
        version: snapshot.version,
        updatedAt: snapshot.updatedAt,
        pdfUpdated: rebuildNow ? !lastPdfError : false,
        htmlUpdated,
        lastGeneratedAt: snapshot.updatedAt,
      });
    } catch (err: any) {
      res.status(500).json({
        ok: false,
        error: err?.message || 'خطا در بازنشانی دیتابیس کاتالوگ',
      });
    }
  });

  // 4. Serve always-up-to-date interactive clickable PDF (SinglePage, chrome-free, synced with DB)
  const handleServePdf = async (req: express.Request, res: express.Response) => {
    try {
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

  // 4b. Serve always-up-to-date self-contained single-file offline interactive HTML (synced with DB)
  const handleServeOfflineHtml = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const html = await ensureFreshOfflineHtml();
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
    app.use(
      express.static(PUBLIC_DIR, {
        index: false,
      })
    );
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Create HTTP server and attach WebSocket server on the same port (/ws/catalog)
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws/catalog' });

  wss.on('connection', (ws) => {
    wsClients.add(ws);
    const snap = getCatalogSnapshot();
    try {
      ws.send(
        JSON.stringify({
          type: 'catalog:hello',
          version: snap.version,
          updatedAt: snap.updatedAt,
          productCount: snap.productCount,
        })
      );
    } catch {
      // ignore initial send failure
    }

    ws.on('close', () => {
      wsClients.delete(ws);
    });
    ws.on('error', () => {
      wsClients.delete(ws);
    });
  });

  // Periodic heartbeat to clear stale sockets cleanly
  const wsPingTimer = setInterval(() => {
    for (const client of wsClients) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.ping();
        } catch {
          wsClients.delete(client);
        }
      } else {
        wsClients.delete(client);
      }
    }
  }, 30000);
  wsPingTimer.unref();

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    warmOfflineBundleShell();

    // Ensure PDF on disk matches current DB version and has SinglePage lock
    try {
      const snap = getCatalogSnapshot();
      if (fs.existsSync(PDF_FILE_PATH)) {
        const existing = fs.readFileSync(PDF_FILE_PATH);
        if (existing.includes(Buffer.from('/SinglePage'))) {
          pdfSyncedVersion = snap.version;
        } else {
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
