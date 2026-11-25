/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Download,
  FileCode2,
  Maximize2,
  Minimize2,
  Share2,
  Search,
  Phone,
  UserCheck,
  Settings,
} from 'lucide-react';
import {
  CatalogProduct,
  parseCatalogRoute,
  getProductById,
} from './data/catalogData';
import {
  CatalogCustomState,
  getDefaultCatalogState,
  loadCatalogState,
  normalizeCatalogState,
  saveCatalogState,
  resetCatalogState,
} from './data/catalogStore';
import {
  CoverPage,
  MenuPage,
  GroupsPage,
  GroupDetailPage,
  ProductDetailPage,
  AboutPage,
  ContactPage,
} from './components/CatalogPages';
import {
  SearchModal,
  FullSpecTableModal,
  TechnicalFeaturesModal,
  OrderInquiryModal,
  ShareModal,
} from './components/CatalogModals';
import {
  AdminLoginModal,
  AdminPanelModal,
} from './components/AdminPanelModal';
import { PrintCatalogBook } from './components/PrintCatalogBook';
import { CatalogSheetViewport } from './components/CatalogSheetViewport';

export default function App() {
  const [hash, setHash] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash || '#/cover';
    }
    return '#/cover';
  });

  const [catalogState, setCatalogState] = useState<CatalogCustomState>(() =>
    loadCatalogState()
  );
  const [catalogVersion, setCatalogVersion] = useState<string>(() =>
    String(Date.now())
  );
  const [isUpdatingOutputs, setIsUpdatingOutputs] = useState<boolean>(false);

  // Admin Bearer token kept strictly in JS/React memory (never persisted to localStorage)
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const isAdminAuthenticated = Boolean(adminToken);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastKind, setToastKind] = useState<'pdf' | 'html' | 'saved' | 'live' | null>(null);
  const [fullTableProduct, setFullTableProduct] = useState<CatalogProduct | null>(null);
  const [specsModalProduct, setSpecsModalProduct] = useState<CatalogProduct | null>(null);
  const [orderModalState, setOrderModalState] = useState<{
    product: CatalogProduct | null;
    variantId: string;
  }>({ product: null, variantId: '' });

  const lastServerVersionRef = useRef<number>(0);
  const isAdminPanelOpenRef = useRef<boolean>(false);
  isAdminPanelOpenRef.current = isAdminPanelOpen;

  const showToast = useCallback(
    (
      message: string,
      kind: 'pdf' | 'html' | 'saved' | 'live' | null,
      durationMs = 4500
    ) => {
      setToastKind(kind);
      setToastMessage(message);
      window.setTimeout(() => {
        setToastMessage((curr) => (curr === message ? null : curr));
        setToastKind((curr) => (curr === kind ? null : curr));
      }, durationMs);
    },
    []
  );

  useEffect(() => {
    if (!window.location.hash) {
      try {
        window.history.replaceState(null, '', '#/cover');
      } catch {
        window.location.hash = '#/cover';
      }
    }
    const onHashChange = () => {
      setHash(window.location.hash || '#/cover');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Server SQLite database is always the authoritative single source of truth
  const syncCatalogFromServer = useCallback(
    async (notifyVisitor = false) => {
      try {
        const res = await fetch(`/api/catalog-state?t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        if (!data) return;

        const nextVersionNum =
          typeof data.version === 'number' ? data.version : 1;
        const nextUpdatedAt =
          typeof data.updatedAt === 'number' ? data.updatedAt : Date.now();
        const prevVersionNum = lastServerVersionRef.current;

        const nextState = data.catalogState
          ? normalizeCatalogState(data.catalogState)
          : getDefaultCatalogState();

        // Never store adminPassword on client
        delete nextState.adminPassword;

        setCatalogState(nextState);
        saveCatalogState(nextState);
        setCatalogVersion(`${nextVersionNum}-${nextUpdatedAt}`);
        lastServerVersionRef.current = nextVersionNum;

        if (
          notifyVisitor &&
          prevVersionNum > 0 &&
          nextVersionNum > prevVersionNum &&
          !isAdminPanelOpenRef.current
        ) {
          showToast(
            'کاتالوگ، محصولات و فایل‌های PDF و HTML به‌صورت آنی به‌روزرسانی شدند.',
            'live',
            4000
          );
        }
      } catch {
        // Keep current cached state when offline or restarting
      }
    },
    [showToast]
  );

  // Initial load + real-time WebSocket (with SSE fallback) live sync for ALL visitors
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('print') === '1'
    ) {
      return;
    }

    void syncCatalogFromServer(false);

    let disposed = false;
    let ws: WebSocket | null = null;
    let sse: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectDelay = 1500;
    let wsEverConnected = false;

    const handleIncomingEvent = (raw: string) => {
      try {
        const msg = JSON.parse(raw);
        if (
          msg &&
          (msg.type === 'catalog:updated' || msg.type === 'catalog:hello') &&
          typeof msg.version === 'number'
        ) {
          if (msg.version > lastServerVersionRef.current) {
            void syncCatalogFromServer(msg.type === 'catalog:updated');
          }
        }
      } catch {
        // ignore malformed frame
      }
    };

    const startSseFallback = () => {
      if (disposed || sse || typeof EventSource === 'undefined') return;
      try {
        sse = new EventSource('/api/catalog-events');
        sse.addEventListener('catalog-updated', (ev) => {
          handleIncomingEvent((ev as MessageEvent).data);
        });
        sse.addEventListener('catalog-hello', (ev) => {
          handleIncomingEvent((ev as MessageEvent).data);
        });
      } catch {
        // ignore SSE unavailability
      }
    };

    const connectWs = () => {
      if (disposed || typeof WebSocket === 'undefined') {
        startSseFallback();
        return;
      }
      try {
        const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws = new WebSocket(`${proto}//${window.location.host}/ws/catalog`);

        ws.onopen = () => {
          wsEverConnected = true;
          reconnectDelay = 1500;
          if (sse) {
            sse.close();
            sse = null;
          }
        };

        ws.onmessage = (event) => {
          if (typeof event.data === 'string') {
            handleIncomingEvent(event.data);
          }
        };

        ws.onerror = () => {
          if (!wsEverConnected) {
            startSseFallback();
          }
        };

        ws.onclose = () => {
          ws = null;
          if (disposed) return;
          if (!wsEverConnected) {
            startSseFallback();
          }
          reconnectTimer = setTimeout(() => {
            reconnectDelay = Math.min(reconnectDelay * 1.6, 10000);
            connectWs();
          }, reconnectDelay);
        };
      } catch {
        startSseFallback();
      }
    };

    connectWs();

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void syncCatalogFromServer(false);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        try {
          ws.close();
        } catch {
          // ignore
        }
      }
      if (sse) {
        try {
          sse.close();
        } catch {
          // ignore
        }
      }
    };
  }, [syncCatalogFromServer]);

  const handleSaveCatalogState = useCallback(
    async (
      nextState: CatalogCustomState
    ): Promise<{ pdfUpdated: boolean; htmlUpdated: boolean }> => {
      if (!adminToken) {
        setIsAdminPanelOpen(false);
        setIsLoginModalOpen(true);
        throw new Error('لطفاً ابتدا مجدداً وارد پنل مدیریت شوید.');
      }

      const payloadState: CatalogCustomState = { ...nextState };
      delete payloadState.adminPassword;

      setIsUpdatingOutputs(true);
      try {
        const res = await fetch('/api/catalog-state', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            catalogState: payloadState,
            rebuildNow: true,
          }),
        });

        const data = await res.json().catch(() => null);
        if (res.status === 401) {
          setAdminToken(null);
          setIsAdminPanelOpen(false);
          setIsLoginModalOpen(true);
          throw new Error(
            data?.error || 'نشست مدیریت منقضی شده است. لطفاً مجدداً وارد شوید.'
          );
        }
        if (!res.ok || !data?.ok) {
          throw new Error(
            data?.error || 'ذخیره اطلاعات در دیتابیس سرور با خطا مواجه شد.'
          );
        }

        setCatalogState(payloadState);
        saveCatalogState(payloadState);
        const nextVer = typeof data.version === 'number' ? data.version : lastServerVersionRef.current + 1;
        const nextTs = typeof data.updatedAt === 'number' ? data.updatedAt : Date.now();
        lastServerVersionRef.current = nextVer;
        setCatalogVersion(`${nextVer}-${nextTs}`);

        showToast(
          'تغییرات در دیتابیس ذخیره شد و همزمان برای تمام کاربران، PDF و فایل HTML آفلاین به‌روزرسانی گردید.',
          'saved',
          5000
        );
        return {
          pdfUpdated: Boolean(data.pdfUpdated),
          htmlUpdated: Boolean(data.htmlUpdated),
        };
      } finally {
        setIsUpdatingOutputs(false);
      }
    },
    [adminToken, showToast]
  );

  const handleResetCatalogState =
    useCallback(async (): Promise<CatalogCustomState> => {
      if (!adminToken) {
        setIsAdminPanelOpen(false);
        setIsLoginModalOpen(true);
        throw new Error('لطفاً ابتدا مجدداً وارد پنل مدیریت شوید.');
      }

      setIsUpdatingOutputs(true);
      try {
        const res = await fetch('/api/catalog-state?rebuildNow=1', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        const data = await res.json().catch(() => null);
        if (res.status === 401) {
          setAdminToken(null);
          setIsAdminPanelOpen(false);
          setIsLoginModalOpen(true);
          throw new Error(
            data?.error || 'نشست مدیریت منقضی شده است. لطفاً مجدداً وارد شوید.'
          );
        }
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || 'خطا در بازنشانی دیتابیس کاتالوگ.');
        }

        const defaults = resetCatalogState();
        delete defaults.adminPassword;
        setCatalogState(defaults);
        const nextVer = typeof data.version === 'number' ? data.version : lastServerVersionRef.current + 1;
        const nextTs = typeof data.updatedAt === 'number' ? data.updatedAt : Date.now();
        lastServerVersionRef.current = nextVer;
        setCatalogVersion(`${nextVer}-${nextTs}`);
        return defaults;
      } finally {
        setIsUpdatingOutputs(false);
      }
    }, [adminToken]);

  const handleAdminLogout = useCallback(() => {
    const tokenToRevoke = adminToken;
    setAdminToken(null);
    setIsAdminPanelOpen(false);
    if (tokenToRevoke) {
      void fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenToRevoke}`,
        },
      }).catch(() => {});
    }
  }, [adminToken]);

  const navigate = useCallback((nextHash: string) => {
    if (typeof window !== 'undefined') {
      window.location.hash = nextHash;
      setHash(nextHash);
    }
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleDownloadPdf = () => {
    showToast(
      'فایل PDF تعاملی کاتالوگ (هماهنگ با آخرین نسخه دیتابیس) در حال دانلود است…',
      'pdf',
      6000
    );
  };

  const handleDownloadOfflineHtml = () => {
    showToast(
      'فایل HTML آفلاین و تعاملی کاتالوگ (هماهنگ با آخرین نسخه دیتابیس) در حال دانلود است…',
      'html',
      6000
    );
  };

  const handleAdminButtonClick = () => {
    if (isAdminAuthenticated) {
      setIsAdminPanelOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const isPrintPreviewMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('print') === '1';

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isPrintPreviewMode) {
      document.documentElement.classList.add('print-preview-mode');
      document.body.classList.add('print-preview-mode');
    } else {
      document.documentElement.classList.remove('print-preview-mode');
      document.body.classList.remove('print-preview-mode');
    }
  }, [isPrintPreviewMode]);

  if (isPrintPreviewMode) {
    return <PrintCatalogBook visibleOnScreen catalogState={catalogState} />;
  }

  const route = parseCatalogRoute(
    hash,
    typeof window !== 'undefined' ? window.location.search : '',
    catalogState.products
  );

  const routeKey =
    route.page === 'product'
      ? `product-${route.productId}`
      : route.page === 'group-detail'
      ? `group-${route.groupId}-${route.pageNum}`
      : route.page;

  return (
    <div
      dir="rtl"
      className="h-dvh w-screen bg-[#EFECE4] text-[#1C1917] flex flex-col justify-between relative overflow-hidden overscroll-none"
    >
      {/* Top Workspace Utility Bar */}
      <header className="no-print shrink-0 w-full max-w-[1400px] mx-auto px-4 sm:px-6 pt-3 pb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xs sm:text-sm font-extrabold text-[#1C1917] tracking-tight whitespace-nowrap inline-flex items-center">
          {catalogState.elements.headerTitle}
          <span className="font-normal text-[#78716C] mx-1.5">·</span>
          <span className="font-normal text-xs text-[#57534E]">
            {catalogState.elements.headerSubtitle}
          </span>

          {/* Login / Admin Panel Button placed right in front of the subtitle text */}
          <button
            type="button"
            onClick={handleAdminButtonClick}
            aria-label="ورود"
            title={isAdminAuthenticated ? 'پنل ادمین کاتالوگ' : 'ورود به پنل ادمین'}
            className={`mr-2.5 h-8 px-[5px] rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer whitespace-nowrap ${
              isAdminAuthenticated
                ? 'bg-[#92400E] text-white border-[#92400E]'
                : 'bg-white hover:bg-[#FFFBEB] border-[#E2D8C5] text-[#92400E]'
            }`}
          >
            {isAdminAuthenticated ? (
              <>
                <Settings className="w-3.5 h-3.5" />
                <span>پنل ادمین</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>ورود</span>
              </>
            )}
          </button>
        </h1>

        <div className="flex items-center gap-2">
          <a
            id="bpdf"
            href={`/mohammad-carton-catalog.pdf?v=${catalogVersion}`}
            download="کاتالوگ-هوشمند-کارتن-محمد.pdf"
            onClick={handleDownloadPdf}
            aria-label="دانلود PDF"
            title="دانلود کاتالوگ PDF تعاملی با قابلیت کلیک (هماهنگ با آخرین تغییرات دیتابیس)"
            className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#FFFBEB] border border-[#E2D8C5] text-[#92400E] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isUpdatingOutputs ? 'بروزرسانی PDF…' : 'دانلود PDF'}</span>
          </a>

          <a
            id="bhtml"
            href={`/mohammad-carton-catalog.html?v=${catalogVersion}`}
            download="کاتالوگ-آفلاین-کارتن-محمد.html"
            onClick={handleDownloadOfflineHtml}
            aria-label="دانلود HTML آفلاین"
            title="دانلود کاتالوگ کامل در قالب یک فایل HTML آفلاین و تعاملی (هماهنگ با آخرین تغییرات دیتابیس)"
            className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#FFFBEB] border border-[#E2D8C5] text-[#92400E] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>{isUpdatingOutputs ? 'بروزرسانی HTML…' : 'دانلود HTML آفلاین'}</span>
          </a>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="تمام‌صفحه"
            title="نمایش تمام‌صفحه"
            className="w-9 h-9 rounded-xl bg-white hover:bg-[#FFFBEB] border border-[#E2D8C5] text-[#92400E] flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            aria-label="اشتراک‌گذاری"
            title="اشتراک‌گذاری کاتالوگ"
            className="w-9 h-9 rounded-xl bg-white hover:bg-[#FFFBEB] border border-[#E2D8C5] text-[#92400E] flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="جست‌وجو"
            title="جست‌وجو در محصولات"
            className="w-9 h-9 rounded-xl bg-white hover:bg-[#FFFBEB] border border-[#E2D8C5] text-[#92400E] flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => navigate('#/contact')}
            aria-label="تماس"
            title="تماس با کارتن محمد"
            className="w-9 h-9 rounded-xl bg-white hover:bg-[#FFFBEB] border border-[#E2D8C5] text-[#92400E] flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Centered Interactive Catalog Sheet — 9:16 Fixed-Viewport Non-Scrollable Canvas */}
      <CatalogSheetViewport routeKey={routeKey}>
        {route.page === 'cover' && (
          <CoverPage onNavigate={navigate} catalogState={catalogState} />
        )}

        {route.page === 'menu' && (
          <MenuPage
            onNavigate={navigate}
            onOpenSearch={() => setIsSearchOpen(true)}
            catalogState={catalogState}
          />
        )}

        {route.page === 'groups' && (
          <GroupsPage onNavigate={navigate} catalogState={catalogState} />
        )}

        {route.page === 'group-detail' && (
          <GroupDetailPage
            groupId={route.groupId}
            pageNum={route.pageNum}
            onNavigate={navigate}
            catalogState={catalogState}
          />
        )}

        {route.page === 'product' && (() => {
          const product = getProductById(
            route.productId,
            catalogState.products
          );
          if (!product) {
            return (
              <GroupsPage onNavigate={navigate} catalogState={catalogState} />
            );
          }
          return (
            <ProductDetailPage
              product={product}
              onNavigate={navigate}
              onOpenFullTable={(p) => setFullTableProduct(p)}
              onOpenSpecsModal={(p) => setSpecsModalProduct(p)}
              onOpenOrderModal={(p, vId) =>
                setOrderModalState({ product: p, variantId: vId })
              }
              catalogState={catalogState}
            />
          );
        })()}

        {route.page === 'about' && (
          <AboutPage onNavigate={navigate} catalogState={catalogState} />
        )}

        {route.page === 'contact' && (
          <ContactPage onNavigate={navigate} catalogState={catalogState} />
        )}
      </CatalogSheetViewport>

      {/* Toast Notification */}
      <div
        id="toast"
        role="status"
        aria-live="polite"
        className={`no-print fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1C1917]/95 text-white text-xs font-bold shadow-xl flex flex-wrap items-center justify-center gap-2.5 transition-all duration-200 ${
          toastMessage
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <span>{toastMessage || 'در حال آماده‌سازی خروجی؛ چند لحظه صبر کنید…'}</span>
        {toastMessage && toastKind !== 'live' && (
          <div className="flex items-center gap-1.5">
            {toastKind === 'html' ? (
              <a
                href={`/mohammad-carton-catalog.html?v=${catalogVersion}&inline=1`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-[#B45309] hover:bg-[#92400E] text-white text-[11px] font-bold whitespace-nowrap"
              >
                پیش‌نمایش در تب جدید
              </a>
            ) : (
              <>
                <a
                  href={`/mohammad-carton-catalog.pdf?v=${catalogVersion}&inline=1#view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#B45309] hover:bg-[#92400E] text-white text-[11px] font-bold whitespace-nowrap"
                >
                  باز کردن PDF در تب جدید
                </a>
                <a
                  href={`/mohammad-carton-catalog.html?v=${catalogVersion}&inline=1`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold whitespace-nowrap"
                >
                  پیش‌نمایش HTML
                </a>
              </>
            )}
          </div>
        )}
      </div>

      {/* Full Interactive Print Book (#printroot) with 9:16 pages */}
      <PrintCatalogBook catalogState={catalogState} />

      {/* Modals */}
      <div className="no-print">
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectProduct={(productId) => navigate(`#/p/${productId}`)}
          customProducts={catalogState.products}
        />

        <FullSpecTableModal
          product={fullTableProduct}
          onClose={() => setFullTableProduct(null)}
          onSelectVariant={() => {}}
        />

        <TechnicalFeaturesModal
          product={specsModalProduct}
          onClose={() => setSpecsModalProduct(null)}
        />

        <OrderInquiryModal
          product={orderModalState.product}
          selectedVariantId={orderModalState.variantId}
          onClose={() => setOrderModalState({ product: null, variantId: '' })}
        />

        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
        />

        <AdminLoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={(token) => {
            setAdminToken(token);
            setIsLoginModalOpen(false);
            setIsAdminPanelOpen(true);
          }}
        />

        <AdminPanelModal
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
          catalogState={catalogState}
          adminToken={adminToken}
          onSaveState={handleSaveCatalogState}
          onResetState={handleResetCatalogState}
          onLogout={handleAdminLogout}
          onNavigateToRoute={(targetHash) => navigate(targetHash)}
        />
      </div>
    </div>
  );
}
