import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  CatalogProduct,
  IMAGES,
  parseCatalogRoute,
  getProductById,
} from '../data/catalogData';
import {
  CatalogCustomState,
  normalizeCatalogState,
} from '../data/catalogStore';
import {
  CoverPage,
  MenuPage,
  GroupsPage,
  GroupDetailPage,
  ProductDetailPage,
  AboutPage,
  ContactPage,
} from './CatalogPages';
import {
  SearchModal,
  FullSpecTableModal,
  TechnicalFeaturesModal,
  OrderInquiryModal,
} from './CatalogModals';
import { PrintCatalogBook } from './PrintCatalogBook';
import { CatalogSheetViewport } from './CatalogSheetViewport';

declare global {
  interface Window {
    __OFFLINE_CATALOG_STATE__?: Partial<CatalogCustomState> | null;
    __OFFLINE_ASSET_MAP__?: Record<string, string>;
  }
}

function resolveAssetsDeep<T>(value: T, assetMap: Record<string, string>): T {
  if (typeof value === 'string') {
    return (assetMap[value] ?? value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveAssetsDeep(item, assetMap)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = resolveAssetsDeep(v, assetMap);
    }
    return out as T;
  }
  return value;
}

function hydrateOfflineCatalogState(): CatalogCustomState {
  const assetMap =
    typeof window !== 'undefined' && window.__OFFLINE_ASSET_MAP__
      ? window.__OFFLINE_ASSET_MAP__
      : {};

  // Patch fallback IMAGES references so any default prop uses inlined data URIs
  for (const key of Object.keys(IMAGES) as Array<keyof typeof IMAGES>) {
    const current = IMAGES[key];
    if (assetMap[current]) {
      (IMAGES as Record<string, string>)[key] = assetMap[current];
    }
  }

  const rawState =
    typeof window !== 'undefined' ? window.__OFFLINE_CATALOG_STATE__ : null;
  const normalized = normalizeCatalogState(rawState);
  // Ensure no admin password exists in offline memory
  const sanitized: CatalogCustomState = {
    ...normalized,
    adminPassword: undefined,
  };
  return resolveAssetsDeep(sanitized, assetMap);
}

export default function OfflineCatalogApp() {
  const catalogState = useMemo(() => hydrateOfflineCatalogState(), []);

  const [hash, setHash] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash || '#/cover';
    }
    return '#/cover';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [fullTableProduct, setFullTableProduct] = useState<CatalogProduct | null>(null);
  const [specsModalProduct, setSpecsModalProduct] = useState<CatalogProduct | null>(null);
  const [orderModalState, setOrderModalState] = useState<{
    product: CatalogProduct | null;
    variantId: string;
  }>({ product: null, variantId: '' });

  useEffect(() => {
    if (!window.location.hash) {
      try {
        window.history.replaceState(null, '', '#/cover');
      } catch {
        try {
          window.location.hash = '#/cover';
        } catch {
          // ignore file:// hash restrictions
        }
      }
    }
    const onHashChange = () => {
      setHash(window.location.hash || '#/cover');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((nextHash: string) => {
    setHash(nextHash);
    if (typeof window !== 'undefined') {
      try {
        if (window.location.hash !== nextHash) {
          window.location.hash = nextHash;
        }
      } catch {
        // React state fallback handles navigation even in restricted offline viewers
      }
    }
  }, []);

  const route = parseCatalogRoute(hash, '', catalogState.products);

  const routeKey =
    route.page === 'product'
      ? `product-${route.productId}`
      : route.page === 'group-detail'
      ? `group-${route.groupId}-${route.pageNum}`
      : route.page;

  return (
    <div
      dir="rtl"
      className="h-dvh w-screen bg-[#FAF8F3] sm:bg-[#EFECE4] text-[#1C1917] flex flex-col items-center justify-center relative overflow-hidden overscroll-none"
    >
      {/* Catalog-Only Centered Interactive Sheet — 9:16 Fixed-Viewport Non-Scrollable Canvas */}
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

        {route.page === 'product' &&
          (() => {
            const product = getProductById(
              route.productId,
              catalogState.products
            );
            if (!product) {
              return (
                <GroupsPage
                  onNavigate={navigate}
                  catalogState={catalogState}
                />
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

      {/* Full Printable Book (hidden on screen, used only if user prints from browser) */}
      <PrintCatalogBook catalogState={catalogState} />

      {/* Interactive Modals triggered strictly by buttons inside the catalog */}
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
      </div>
    </div>
  );
}
