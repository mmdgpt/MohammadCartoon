import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as viteBuild } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SRC_ASSETS_DIR = path.join(ROOT_DIR, 'src', 'assets');

interface OfflineBundleShell {
  jsCode: string;
  cssCode: string;
}

let cachedShell: OfflineBundleShell | null = null;
let shellBuildPromise: Promise<OfflineBundleShell> | null = null;
let cachedFontCss: string | null = null;
const diskAssetBase64Cache = new Map<string, string>();

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.woff2':
      return 'font/woff2';
    default:
      return 'application/octet-stream';
  }
}

function readFileAsDataUri(absFilePath: string): string | null {
  const cached = diskAssetBase64Cache.get(absFilePath);
  if (cached) return cached;
  try {
    if (!fs.existsSync(absFilePath) || !fs.statSync(absFilePath).isFile()) {
      return null;
    }
    const buf = fs.readFileSync(absFilePath);
    const mime = getMimeType(absFilePath);
    const uri = `data:${mime};base64,${buf.toString('base64')}`;
    diskAssetBase64Cache.set(absFilePath, uri);
    return uri;
  } catch {
    return null;
  }
}

function getEmbeddedFontCss(): string {
  if (cachedFontCss !== null) return cachedFontCss;

  const fontsDir = path.join(PUBLIC_DIR, 'assets', 'fonts');
  const arabicFontPath = path.join(fontsDir, 'vazirmatn-arabic.woff2');
  const latinFontPath = path.join(fontsDir, 'vazirmatn-latin.woff2');

  const rules: string[] = [];

  const arabicUri = readFileAsDataUri(arabicFontPath);
  if (arabicUri) {
    rules.push(
      `@font-face{font-family:'Vazirmatn';font-style:normal;font-weight:300 900;font-display:swap;src:url(${arabicUri}) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+0870-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC;}`
    );
  }

  const latinUri = readFileAsDataUri(latinFontPath);
  if (latinUri) {
    rules.push(
      `@font-face{font-family:'Vazirmatn';font-style:normal;font-weight:300 900;font-display:swap;src:url(${latinUri}) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}`
    );
  }

  cachedFontCss = rules.join('\n');
  return cachedFontCss;
}

function collectDefaultLocalAssetMap(): Record<string, string> {
  const assetMap: Record<string, string> = {};

  // 1. Public AI Studio images (/assets/aistudio/*)
  const aistudioDir = path.join(PUBLIC_DIR, 'assets', 'aistudio');
  if (fs.existsSync(aistudioDir)) {
    for (const file of fs.readdirSync(aistudioDir)) {
      const abs = path.join(aistudioDir, file);
      const uri = readFileAsDataUri(abs);
      if (uri) {
        assetMap[`/assets/aistudio/${file}`] = uri;
      }
    }
  }

  // 2. Source images (/src/assets/images/*)
  const srcImagesDir = path.join(SRC_ASSETS_DIR, 'images');
  if (fs.existsSync(srcImagesDir)) {
    for (const file of fs.readdirSync(srcImagesDir)) {
      const abs = path.join(srcImagesDir, file);
      const uri = readFileAsDataUri(abs);
      if (uri) {
        assetMap[`/src/assets/images/${file}`] = uri;
      }
    }
  }

  return assetMap;
}

function resolveSafeLocalPath(urlPath: string): string | null {
  if (urlPath.startsWith('/assets/')) {
    const candidate = path.resolve(PUBLIC_DIR, `.${urlPath}`);
    if (candidate.startsWith(PUBLIC_DIR + path.sep)) {
      return candidate;
    }
  }
  if (urlPath.startsWith('/src/assets/')) {
    const rel = urlPath.slice('/src/assets/'.length);
    const candidate = path.resolve(SRC_ASSETS_DIR, rel);
    if (candidate.startsWith(SRC_ASSETS_DIR + path.sep)) {
      return candidate;
    }
  }
  return null;
}

function sanitizeAndDeduplicateCatalogState(
  rawState: unknown,
  assetMap: Record<string, string>
): unknown {
  if (!rawState || typeof rawState !== 'object') {
    return null;
  }

  // Clone and strip sensitive adminPassword so it is never shipped in client offline HTML
  const cloned = JSON.parse(JSON.stringify(rawState)) as Record<string, unknown>;
  delete cloned.adminPassword;

  // Count duplicate large data:image/... strings so repeated custom uploads are stored only once
  const dataUriCounts = new Map<string, number>();
  const countWalk = (val: unknown): void => {
    if (typeof val === 'string') {
      if (val.startsWith('data:image/') && val.length > 1024) {
        dataUriCounts.set(val, (dataUriCounts.get(val) || 0) + 1);
      } else if (
        (val.startsWith('/assets/') || val.startsWith('/src/assets/')) &&
        !assetMap[val]
      ) {
        const safePath = resolveSafeLocalPath(val);
        if (safePath) {
          const uri = readFileAsDataUri(safePath);
          if (uri) {
            assetMap[val] = uri;
          }
        }
      }
      return;
    }
    if (Array.isArray(val)) {
      for (const item of val) countWalk(item);
      return;
    }
    if (val && typeof val === 'object') {
      for (const v of Object.values(val as Record<string, unknown>)) {
        countWalk(v);
      }
    }
  };
  countWalk(cloned);

  const dataUriToToken = new Map<string, string>();
  let tokenIdx = 0;
  for (const [uri, count] of dataUriCounts.entries()) {
    if (count > 1) {
      const token = `__offline_img_${tokenIdx++}__`;
      dataUriToToken.set(uri, token);
      assetMap[token] = uri;
    }
  }

  if (dataUriToToken.size === 0) {
    return cloned;
  }

  const replaceWalk = (val: unknown): unknown => {
    if (typeof val === 'string') {
      return dataUriToToken.get(val) ?? val;
    }
    if (Array.isArray(val)) {
      return val.map(replaceWalk);
    }
    if (val && typeof val === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        out[k] = replaceWalk(v);
      }
      return out;
    }
    return val;
  };

  return replaceWalk(cloned);
}

function escapeJsonForInlineScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function escapeHtmlText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function getOfflineBundleShell(): Promise<OfflineBundleShell> {
  if (cachedShell) {
    return cachedShell;
  }
  if (shellBuildPromise) {
    return shellBuildPromise;
  }

  shellBuildPromise = (async () => {
    const result = await viteBuild({
      configFile: false,
      mode: 'production',
      root: ROOT_DIR,
      logLevel: 'silent',
      plugins: [react(), tailwindcss()],
      oxc: {
        jsx: {
          runtime: 'automatic',
          development: false,
        },
      },
      resolve: {
        alias: {
          '@': ROOT_DIR,
        },
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      build: {
        write: false,
        minify: true,
        sourcemap: false,
        cssCodeSplit: false,
        assetsInlineLimit: 100 * 1024 * 1024,
        rollupOptions: {
          input: path.resolve(ROOT_DIR, 'src', 'offlineEntry.tsx'),
          output: {
            format: 'iife',
            name: 'MohammadCartonOfflineCatalog',
            inlineDynamicImports: true,
            entryFileNames: 'offline-bundle.js',
            assetFileNames: 'offline-bundle.[ext]',
          },
        },
      },
    });

    const outputs = Array.isArray(result) ? result : [result];
    let jsCode = '';
    const cssParts: string[] = [];

    for (const out of outputs) {
      if (!('output' in out) || !Array.isArray(out.output)) continue;
      for (const item of out.output) {
        if (item.type === 'chunk' && item.isEntry) {
          jsCode = item.code;
        } else if (item.type === 'asset' && item.fileName.endsWith('.css')) {
          cssParts.push(
            typeof item.source === 'string'
              ? item.source
              : Buffer.from(item.source).toString('utf-8')
          );
        }
      }
    }

    if (!jsCode) {
      throw new Error('Failed to build offline interactive catalog JS bundle');
    }

    const shell: OfflineBundleShell = {
      jsCode,
      cssCode: cssParts.join('\n'),
    };
    cachedShell = shell;
    return shell;
  })().finally(() => {
    shellBuildPromise = null;
  });

  return shellBuildPromise;
}

export function warmOfflineBundleShell(): void {
  void getOfflineBundleShell().catch((err) => {
    console.error('Offline HTML shell pre-warm error:', err);
  });
}

export async function buildOfflineCatalogHtml(
  catalogState: unknown
): Promise<string> {
  const shell = await getOfflineBundleShell();
  const fontCss = getEmbeddedFontCss();
  const assetMap = collectDefaultLocalAssetMap();
  const cleanState = sanitizeAndDeduplicateCatalogState(catalogState, assetMap);

  const pageTitle =
    cleanState &&
    typeof cleanState === 'object' &&
    typeof (cleanState as any)?.elements?.headerTitle === 'string' &&
    (cleanState as any).elements.headerTitle.trim()
      ? `${(cleanState as any).elements.headerTitle.trim()} | نسخه آفلاین`
      : 'کاتالوگ هوشمند شرکت کارتن محمد | نسخه آفلاین';

  const safeCss = `${fontCss}\n${shell.cssCode}`.replace(/<\/style/gi, '<\\/style');
  const safeAssetMapJson = escapeJsonForInlineScript(assetMap);
  const safeStateJson = escapeJsonForInlineScript(cleanState);
  const safeJs = shell.jsCode.replace(/<\/script/gi, '<\\/script');

  return `<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#FAF8F3" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <title>${escapeHtmlText(pageTitle)}</title>
    <style>${safeCss}</style>
  </head>
  <body class="bg-[#FAF8F3] sm:bg-[#EFECE4] text-[#1C1917] antialiased selection:bg-[#B45309]/15 selection:text-[#92400E]">
    <div id="root"></div>
    <script>
      window.__OFFLINE_ASSET_MAP__ = ${safeAssetMapJson};
      window.__OFFLINE_CATALOG_STATE__ = ${safeStateJson};
    </script>
    <script>${safeJs}</script>
  </body>
</html>
`;
}
