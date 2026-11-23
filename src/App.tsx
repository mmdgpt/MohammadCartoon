/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from 'react';
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
  loadCatalogState,
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
  const [pdfVersion, setPdfVersion] = useState<number>(() => Date.now());
  const [isUpdatingPdf, setIsUpdatingPdf] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastKind, setToastKind] = useState<'pdf' | 'html' | 'saved' | null>(null);
  const [fullTableProduct, setFullTableProduct] = useState<CatalogProduct | null>(null);
  const [specsModalProduct, setSpecsModalProduct] = useState<CatalogProduct | null>(null);
  const [orderModalState, setOrderModalState] = useState<{
    product: CatalogProduct | null;
    variantId: string;
  }>({ product: null, variantId: '' });

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#/cover');
    }
    const onHashChange = () => {
      setHash(window.location.hash || '#/cover');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Sync initial catalogState with backend PDF generator when not in headless print mode
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('print') === '1'
    ) {
      return;
    }
    const hasLocalCustom = Boolean(
      window.localStorage?.getItem('mohammad_carton_catalog_state_v1')
    );
    if (hasLocalCustom) {
      void fetch('/api/catalog-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalogState }),
      }).catch(() => {});
    } else {
      void fetch('/api/catalog-state')
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.catalogState) {
            setCatalogState(data.catalogState);
            saveCatalogState(data.catalogState);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleSaveCatalogState = useCallback(
    async (nextState: CatalogCustomState): Promise<{ pdfUpdated: boolean }> => {
      setCatalogState(nextState);
      saveCatalogState(nextState);
      setIsUpdatingPdf(true);
      try {
        const res = await fetch('/api/catalog-state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ catalogState: nextState, rebuildNow: true }),
        });
        const data = res.ok ? await res.json().catch(() => null) : null;
        setPdfVersion(data?.lastGeneratedAt || Date.now());
        setToastKind('saved');
        setToastMessage('تغییرات همزمان روی اپلیکیشن، نسخه PDF و فایل HTML آفلاین ذخیره شد.');
        setTimeout(() => {
          setToastMessage(null);
          setToastKind(null);
        }, 4500);
        return { pdfUpdated: Boolean(data?.pdfUpdated ?? res.ok) };
      } catch {
        setPdfVersion(Date.now());
        return { pdfUpdated: false };
      } finally {
        setIsUpdatingPdf(false);
      }
    },
    []
  );

  const handleResetCatalogState = useCallback(async (): Promise<CatalogCustomState> => {
    const defaults = resetCatalogState();
    setCatalogState(defaults);
    setIsUpdatingPdf(true);
    try {
      const res = await fetch('/api/catalog-state?rebuildNow=1', {
        method: 'DELETE',
      });
      const data = res.ok ? await res.json().catch(() => null) : null;
      setPdfVersion(data?.lastGeneratedAt || Date.now());
    } catch {
      setPdfVersion(Date.now());
    } finally {
      setIsUpdatingPdf(false);
    }
    return defaults;
  }, []);

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
    setToastKind('pdf');
    setToastMessage('فایل PDF تعاملی کاتالوگ (شامل تمام صفحات با قابلیت کلیک) در حال دانلود است…');
    setTimeout(() => {
      setToastMessage(null);
      setToastKind(null);
    }, 6000);
  };

  const handleDownloadOfflineHtml = () => {
    setToastKind('html');
    setToastMessage('فایل HTML آفلاین و تعاملی کاتالوگ (تک‌فایلی و قابل کلیک بدون نیاز به اینترنت) در حال دانلود است…');
    setTimeout(() => {
      setToastMessage(null);
      setToastKind(null);
    }, 6000);
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
            href={`/mohammad-carton-catalog.pdf?v=${pdfVersion}`}
            download="کاتالوگ-هوشمند-کارتن-محمد.pdf"
            onClick={handleDownloadPdf}
            aria-label="دانلود PDF"
            title="دانلود کاتالوگ PDF تعاملی با قابلیت کلیک روی تمامی صفحات و تیپ‌ها (بروزرسانی خودکار با تغییرات پنل ادمین)"
            className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#FFFBEB] border border-[#E2D8C5] text-[#92400E] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isUpdatingPdf ? 'بروزرسانی PDF…' : 'دانلود PDF'}</span>
          </a>

          <a
            id="bhtml"
            href={`/mohammad-carton-catalog.html?v=${pdfVersion}`}
            download="کاتالوگ-آفلاین-کارتن-محمد.html"
            onClick={handleDownloadOfflineHtml}
            aria-label="دانلود HTML آفلاین"
            title="دانلود کاتالوگ کامل در قالب یک فایل HTML آفلاین و کاملاً تعاملی (قابل ارائه و کلیک بدون نیاز به اینترنت)"
            className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#FFFBEB] border border-[#E2D8C5] text-[#92400E] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>دانلود HTML آفلاین</span>
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
        <span>{toastMessage || 'در حال آماده‌سازی PDF؛ چند لحظه صبر کنید…'}</span>
        {toastMessage && (
          <div className="flex items-center gap-1.5">
            {toastKind === 'html' ? (
              <a
                href={`/mohammad-carton-catalog.html?v=${pdfVersion}&inline=1`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-[#B45309] hover:bg-[#92400E] text-white text-[11px] font-bold whitespace-nowrap"
              >
                پیش‌نمایش در تب جدید
              </a>
            ) : (
              <>
                <a
                  href={`/mohammad-carton-catalog.pdf?v=${pdfVersion}&inline=1#view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#B45309] hover:bg-[#92400E] text-white text-[11px] font-bold whitespace-nowrap"
                >
                  باز کردن در تب جدید
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold cursor-pointer whitespace-nowrap"
                >
                  چاپ / ذخیره از مرورگر
                </button>
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
          expectedPassword={catalogState.adminPassword}
          onLoginSuccess={() => {
            setIsAdminAuthenticated(true);
            setIsLoginModalOpen(false);
            setIsAdminPanelOpen(true);
          }}
        />

        <AdminPanelModal
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
          catalogState={catalogState}
          onSaveState={handleSaveCatalogState}
          onResetState={handleResetCatalogState}
          onLogout={() => {
            setIsAdminAuthenticated(false);
            setIsAdminPanelOpen(false);
          }}
          onNavigateToRoute={(targetHash) => navigate(targetHash)}
        />
      </div>
    </div>
  );
}
