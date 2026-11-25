import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CornerUpLeft,
  Menu,
  Building2,
  LayoutGrid,
  Search,
  Phone,
  ShieldCheck,
  Truck,
  Award,
  MapPin,
  FileSpreadsheet,
  SlidersHorizontal,
  MessageCircle,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import {
  CatalogProduct,
  CategoryId,
  GROUP_PRODUCTS_PER_PAGE,
  buildProductMessengerLinks,
  getPaginatedPagesForGroup,
  getProductGroupPageRoute,
  getVariantEffectiveMedia,
  getVisibleProductVariants,
  hasAnyVisibleVariantSpec,
  isVariantSpecVisible,
  getGroupById,
  getAdjacentProducts,
  normalizeWhatsappNumber,
  toPersianDigits,
} from '../data/catalogData';
import {
  CatalogCustomState,
  getDefaultCatalogState,
} from '../data/catalogStore';
import { BrandEmblem } from './CatalogModals';
import { ProductDiagram, ZoomableImage } from './ProductDiagram';

interface InternalHeaderProps {
  onBack: () => void;
  onMenu?: () => void;
  showMenuButton?: boolean;
}

export const InternalCatalogHeader: React.FC<InternalHeaderProps> = ({
  onBack,
  onMenu,
  showMenuButton = true,
}) => {
  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-1.5 relative z-10 shrink-0">
      {showMenuButton && onMenu ? (
        <button
          type="button"
          onClick={onMenu}
          aria-label="فهرست"
          title="فهرست کاتالوگ"
          className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white border border-[#E5DEC9] flex items-center justify-center text-[#92400E] shadow-xs transition-all hover:scale-105 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>
      ) : (
        <div className="w-9 h-9" />
      )}

      <button
        type="button"
        onClick={onBack}
        aria-label="بازگشت"
        title="بازگشت به صفحه قبل"
        className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white border border-[#E5DEC9] flex items-center justify-center text-[#92400E] shadow-xs transition-all hover:scale-105 cursor-pointer"
      >
        <CornerUpLeft className="w-4 h-4" />
      </button>
    </div>
  );
};

// ==================== 1. COVER PAGE (#/cover) — LIGHT THEME (9:16) ====================
interface CoverPageProps {
  onNavigate: (hash: string) => void;
  catalogState?: CatalogCustomState;
}

const FEATURE_ICONS = [Award, ShieldCheck, LayoutGrid, Truck];

export const CoverPage: React.FC<CoverPageProps> = ({
  onNavigate,
  catalogState = getDefaultCatalogState(),
}) => {
  const { cover, logoUrl } = catalogState.elements;

  return (
    <div className="flex flex-col justify-between h-full w-full px-6 pb-5 pt-0 relative z-10 text-right overflow-hidden overscroll-none">
      {/* Top Row: Back button + Sculpted Brand Tab */}
      <div className="relative flex items-start justify-center pt-0 shrink-0">
        <button
          type="button"
          onClick={() => onNavigate('#/menu')}
          aria-label="بازگشت"
          className="absolute left-0 top-4 w-9 h-9 rounded-xl bg-white/90 hover:bg-white border border-[#E5DEC9] flex items-center justify-center text-[#92400E] shadow-xs transition-colors cursor-pointer"
        >
          <CornerUpLeft className="w-4 h-4" />
        </button>

        {/* Sculpted white header tab matching reference cover top badge */}
        <div className="w-[190px] bg-white border-x border-b border-[#E5DEC9] rounded-b-3xl px-7 pt-3.5 pb-3.5 shadow-[0_10px_28px_rgba(146,64,14,0.08)]">
          <div className="inline-flex flex-col items-center justify-center select-none">
            <img
              src={logoUrl}
              alt="لوگوی شرکت کارتن محمد"
              className="h-18 sm:h-20 w-[90px] pr-0 mr-[18px] object-contain drop-shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Main Hero & Value Proposition */}
      <div className="my-auto space-y-4 pt-2">
        <div className="text-center space-y-1.5 px-2">
          <h2
            className="text-xl sm:text-2xl font-black text-[#1C1917] leading-snug pb-0 pl-[1px] mb-[45px]"
            style={{ textWrap: 'balance' }}
          >
            {cover.heroTitle}
          </h2>
        </div>

        {/* Studio Light Hero Visual with Hover Zoom */}
        <div className="relative rounded-2xl overflow-hidden border border-[#E2D8C5] bg-[#F5EFE6] h-52 shadow-sm">
          <ZoomableImage
            src={cover.heroImage}
            alt={cover.heroTitle}
            containerClassName="w-full h-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#FAF8F3]/90 via-transparent to-transparent" />
          <div className="pointer-events-none absolute bottom-2.5 right-3 left-3 flex items-center justify-between text-[11px] font-semibold text-[#78350F]">
            <span className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#E5DEC9]">
              {cover.badgeRight}
            </span>
            <span className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#E5DEC9] font-mono-tech">
              {cover.badgeLeft}
            </span>
          </div>
        </div>

        {/* Feature Highlights in 2x2 grid */}
        {cover.features.length > 0 && (
          <div className="grid grid-cols-2 gap-2.5">
            {cover.features.map((featText, idx) => {
              const IconComp = FEATURE_ICONS[idx % FEATURE_ICONS.length];
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white/90 border border-[#E5DEC9] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#292524]"
                >
                  <IconComp className="w-4 h-4 text-[#B45309] shrink-0" />
                  <span className="truncate">{featText}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Primary CTA Button ("شروع کاتالوگ") + 2 Secondary Buttons ("درباره ما" / "تماس با ما") */}
        <div className="space-y-2.5 pt-1">
          <a
            href="#/menu"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#/menu');
            }}
            className="w-full relative flex items-center justify-center py-3.5 px-6 mt-[40px] bg-gradient-to-l from-[#B45309] via-[#C25E0E] to-[#92400E] hover:from-[#92400E] hover:to-[#78350F] text-white font-extrabold text-base rounded-full shadow-[0_10px_25px_rgba(180,83,9,0.28)] transition-all hover:scale-[1.01] cursor-pointer group"
          >
            <span>{cover.startButtonText}</span>
            <span className="absolute left-2 w-9 h-9 rounded-full bg-[#1C1917]/20 flex items-center justify-center transition-transform group-hover:-translate-x-1">
              <ChevronLeft className="w-5 h-5 text-white" />
            </span>
          </a>

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="#/about"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#/about');
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 mt-[80px] bg-white hover:bg-[#FFFBEB] border border-[#E2D8C5] hover:border-[#D97706] rounded-2xl text-xs font-bold text-[#1C1917] transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#B45309]" />
              <span>{cover.aboutButtonText}</span>
            </a>
            <a
              href="#/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#/contact');
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 mt-[80px] bg-white hover:bg-[#FFFBEB] border border-[#E2D8C5] hover:border-[#D97706] rounded-2xl text-xs font-bold text-[#1C1917] transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#B45309]" />
              <span>{cover.contactButtonText}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="pt-2 text-center space-y-1 shrink-0">
        <p className="text-[11px] text-[#78716C]">{cover.copyrightText}</p>
      </div>
    </div>
  );
};

// ==================== 2. MENU PAGE (#/menu) ====================
interface MenuPageProps {
  onNavigate: (hash: string) => void;
  onOpenSearch: () => void;
  catalogState?: CatalogCustomState;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  onNavigate,
  onOpenSearch,
  catalogState = getDefaultCatalogState(),
}) => {
  const { menu, logoUrl } = catalogState.elements;

  return (
    <div className="flex flex-col justify-between h-full w-full pb-5 relative z-10 text-right overflow-hidden overscroll-none">
      <InternalCatalogHeader
        onBack={() => onNavigate('#/cover')}
        showMenuButton={false}
      />

      <div className="px-6 my-auto space-y-6">
        <div className="flex justify-center py-2">
          <BrandEmblem size="lg" logoUrl={logoUrl} />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-[#57534E] px-1">
            {menu.promptText}
          </p>

          {menu.showAbout && (
            <a
              href="#/about"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#/about');
              }}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-[#FFFBEB] border border-[#E7E0D2] hover:border-[#D97706] rounded-2xl shadow-2xs transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-base font-extrabold text-[#1C1917] group-hover:text-[#92400E]">
                  {menu.aboutLabel}
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-[#92400E] transition-transform group-hover:-translate-x-1" />
            </a>
          )}

          {menu.showProducts && (
            <a
              href="#/groups/1"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#/groups/1');
              }}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-[#FFFBEB] border border-[#E7E0D2] hover:border-[#D97706] rounded-2xl shadow-2xs transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div className="text-base font-extrabold text-[#1C1917] group-hover:text-[#92400E]">
                  {menu.productsLabel}
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-[#92400E] transition-transform group-hover:-translate-x-1" />
            </a>
          )}

          {menu.showSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-[#FFFBEB] border border-[#E7E0D2] hover:border-[#D97706] rounded-2xl shadow-2xs transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <div className="text-base font-extrabold text-[#1C1917] group-hover:text-[#92400E]">
                  {menu.searchLabel}
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-[#92400E] transition-transform group-hover:-translate-x-1" />
            </button>
          )}

          {menu.showContact && (
            <a
              href="#/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#/contact');
              }}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-[#FFFBEB] border border-[#E7E0D2] hover:border-[#D97706] rounded-2xl shadow-2xs transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-base font-extrabold text-[#1C1917] group-hover:text-[#92400E]">
                  {menu.contactLabel}
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-[#92400E] transition-transform group-hover:-translate-x-1" />
            </a>
          )}
        </div>
      </div>

      <div className="px-6 text-center shrink-0">
        <span className="text-[11px] font-mono-tech text-[#A8A29E] tracking-wider">
          {menu.footerText}
        </span>
      </div>
    </div>
  );
};

// ==================== 3. GROUPS PAGE (#/groups/:page) ====================
interface GroupsPageProps {
  onNavigate: (hash: string) => void;
  catalogState?: CatalogCustomState;
}

export const GroupsPage: React.FC<GroupsPageProps> = ({
  onNavigate,
  catalogState = getDefaultCatalogState(),
}) => {
  const { groupsPage } = catalogState.elements;

  return (
    <div className="flex flex-col justify-between h-full w-full pb-5 relative z-10 text-right overflow-hidden overscroll-none">
      <InternalCatalogHeader
        onBack={() => onNavigate('#/menu')}
        onMenu={() => onNavigate('#/menu')}
      />

      <div className="px-6 space-y-4 my-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-[#92400E]">{groupsPage.title}</h2>
          <div className="w-16 h-1 bg-[#B45309] rounded-full mx-auto" />
        </div>

        <p className="text-xs font-semibold text-[#44403C]">
          {groupsPage.promptText}
        </p>

        <div className="space-y-3.5">
          {catalogState.groups.map((group) => (
            <a
              key={group.id}
              href={`#/g/${group.id}/1`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`#/g/${group.id}/1`);
              }}
              className="flex items-stretch bg-white hover:bg-[#FFFDF9] border border-[#E5DEC9] hover:border-[#D97706] rounded-3xl overflow-hidden shadow-[0_6px_20px_rgba(28,25,23,0.05)] transition-all hover:-translate-y-0.5 group cursor-pointer h-36"
            >
              {/* Right side content (in RTL) */}
              <div className="flex-1 p-4 flex flex-col justify-between text-right">
                <div>
                  <h3 className="text-[20px] font-extrabold text-[#1C1917] group-hover:text-[#92400E] transition-colors leading-snug">
                    {group.title}
                  </h3>
                </div>

                <div className="pt-3 flex justify-start text-[20px]">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#92400E] group-hover:bg-[#78350F] text-white text-xs font-bold transition-colors">
                    <span>{groupsPage.ctaButtonText}</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Left side studio image with hover zoom */}
              <div className="w-36 bg-[#F3EDE0] shrink-0 relative overflow-hidden">
                <ZoomableImage
                  src={group.image}
                  alt={group.title}
                  containerClassName="w-full h-full"
                />
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="px-6 pt-3 text-center shrink-0">
        <span className="text-[11px] text-[#78716C]">{groupsPage.footerText}</span>
      </div>
    </div>
  );
};

// ==================== 4. GROUP DETAIL PAGE (#/g/:groupId/:pageNum) ====================
interface GroupDetailPageProps {
  groupId: CategoryId;
  pageNum?: number;
  onNavigate: (hash: string) => void;
  catalogState?: CatalogCustomState;
}

export const GroupDetailPage: React.FC<GroupDetailPageProps> = ({
  groupId,
  pageNum = 1,
  onNavigate,
  catalogState = getDefaultCatalogState(),
}) => {
  const group = getGroupById(groupId, catalogState.groups);
  const { groupsPage } = catalogState.elements;

  const groupPages = getPaginatedPagesForGroup(
    groupId,
    catalogState.products,
    catalogState.groups
  );
  const clampedGroupPage = Math.min(
    Math.max(1, pageNum),
    Math.max(1, groupPages.length)
  );
  const currentEntry =
    groupPages.find((p) => p.groupPageNum === clampedGroupPage) ||
    groupPages[0];

  const pagedProducts = currentEntry ? currentEntry.products : [];
  const prevEntry =
    clampedGroupPage > 1 ? groupPages[clampedGroupPage - 2] : null;
  const nextEntry =
    clampedGroupPage < groupPages.length ? groupPages[clampedGroupPage] : null;

  return (
    <div className="flex flex-col justify-between h-full w-full pb-4 relative z-10 text-right overflow-hidden overscroll-none">
      <InternalCatalogHeader
        onBack={() => onNavigate('#/groups/1')}
        onMenu={() => onNavigate('#/menu')}
      />

      <div className="px-5 space-y-2.5 flex-1">
        {/* Category Header */}
        <div className="text-center space-y-1">
          <h2 className="text-base sm:text-lg font-black text-[#92400E]">
            {group.title}
            {currentEntry && (
              <span className="text-xs font-bold text-[#78716C] mr-1.5">
                (صفحه {toPersianDigits(currentEntry.groupPageNum)} از{' '}
                {toPersianDigits(currentEntry.totalGroupPages)})
              </span>
            )}
          </h2>
          <div className="w-12 h-1 bg-[#B45309] rounded-full mx-auto" />
        </div>

        {/* 2-Column Grid of Product Cards (strictly up to 8 products per page) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {pagedProducts.slice(0, GROUP_PRODUCTS_PER_PAGE).map((product) => {
            const visibleVariants = getVisibleProductVariants(product);
            const cardMedia = getVariantEffectiveMedia(
              product,
              visibleVariants[0] || product.variants[0]
            );
            return (
              <a
                key={product.id}
                href={`#/p/${product.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`#/p/${product.id}`);
                }}
                className="flex flex-col bg-white hover:bg-[#FFFDF9] border border-[#E5DEC9] hover:border-[#D97706] rounded-2xl overflow-hidden shadow-[0_4px_14px_rgba(28,25,23,0.04)] transition-all hover:-translate-y-0.5 group cursor-pointer"
              >
                <div className="p-1.5 pb-0">
                  <div className="h-19 w-full rounded-xl overflow-hidden bg-[#F5EFE6] border border-[#EDE6D6] group-hover:border-[#D97706]/50 transition-colors">
                    <img
                      src={cardMedia.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

              <div className="px-2.5 py-1.5 flex-1 flex flex-col justify-between text-right">
                <div>
                  <h3 className="text-[14.5px] font-extrabold text-[#1C1917] group-hover:text-[#92400E] transition-colors leading-snug truncate">
                    {product.name}
                  </h3>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] font-bold text-[#92400E]">
                  <span>{toPersianDigits(visibleVariants.length)} تیپ</span>
                  <span className="font-mono-tech text-[10px] text-[#78716C]">
                    {product.technicalCode.split(' ')[0]}
                  </span>
                </div>
              </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Bottom Category Pagination: 217x40 Previous & Next buttons above All Groups */}
      <div className="px-5 pt-2.5 flex flex-col items-center gap-2.5 shrink-0">
        <nav
          aria-label="جابه‌جایی بین صفحات محصولات"
          className="w-full flex items-center justify-between gap-2.5"
        >
          <button
            type="button"
            disabled={!prevEntry}
            onClick={() => prevEntry && onNavigate(prevEntry.routeHash)}
            className={`flex-1 h-[40px] min-w-0 rounded-xl border border-[#92400E] bg-[#92400E] text-white text-center font-bold flex items-center justify-center gap-1.5 transition-colors ${
              prevEntry
                ? 'hover:bg-[#78350F] cursor-pointer shadow-2xs'
                : 'cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span className="text-[18px]">قبلی</span>
          </button>

          <button
            type="button"
            disabled={!nextEntry}
            onClick={() => nextEntry && onNavigate(nextEntry.routeHash)}
            className={`flex-1 h-[40px] min-w-0 rounded-xl border border-[#92400E] bg-[#92400E] text-white text-center font-bold flex items-center justify-center gap-1.5 transition-colors ${
              nextEntry
                ? 'hover:bg-[#78350F] cursor-pointer shadow-2xs'
                : 'cursor-not-allowed'
            }`}
          >
            <span className="text-[18px]">بعدی</span>
            <ChevronLeft className="w-4 h-4 shrink-0" />
          </button>
        </nav>

        <button
          type="button"
          onClick={() => onNavigate('#/groups/1')}
          className="px-6 py-2 rounded-xl bg-white hover:bg-[#F5F2EB] border border-[#D8CFC0] text-xs font-bold text-[#44403C] cursor-pointer shrink-0 transition-colors"
        >
          {groupsPage.allGroupsButtonText}
        </button>
      </div>
    </div>
  );
};

// ==================== 5. PRODUCT DETAIL PAGE (#/p/:productId) ====================
interface ProductDetailPageProps {
  product: CatalogProduct;
  onNavigate: (hash: string) => void;
  onOpenFullTable: (product: CatalogProduct) => void;
  onOpenSpecsModal: (product: CatalogProduct) => void;
  onOpenOrderModal: (product: CatalogProduct, variantId: string) => void;
  catalogState?: CatalogCustomState;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onNavigate,
  onOpenFullTable,
  onOpenSpecsModal,
  onOpenOrderModal,
  catalogState = getDefaultCatalogState(),
}) => {
  const visibleVariants = getVisibleProductVariants(product);
  const [selectedVariantId, setSelectedVariantId] = useState(
    visibleVariants[0]?.id || product.variants[0]?.id || ''
  );
  const [visualMode, setVisualMode] = useState<'diagram' | 'photo'>('photo');

  const activeVariant =
    visibleVariants.find((v) => v.id === selectedVariantId) || visibleVariants[0];
  const activeMedia = getVariantEffectiveMedia(product, activeVariant);

  const { prev, next } = getAdjacentProducts(product.id, catalogState.products);
  const { productPage, contactPage } = catalogState.elements;

  const groupPageRoute = getProductGroupPageRoute(
    product.id,
    catalogState.products
  );

  const messengerLinks = buildProductMessengerLinks(
    product,
    activeVariant?.label || product.name,
    catalogState.groups,
    contactPage.whatsappNumber,
    productPage.messengers
  );
  const enabledMessengers = messengerLinks.filter((m) => m.enabled);

  const showSpecCard = hasAnyVisibleVariantSpec(activeVariant);
  const hasVisibleGridSpecs =
    isVariantSpecVisible(activeVariant, 'grammage') ||
    isVariantSpecVisible(activeVariant, 'thickness') ||
    isVariantSpecVisible(activeVariant, 'weightCapacity') ||
    isVariantSpecVisible(activeVariant, 'dimensions') ||
    isVariantSpecVisible(activeVariant, 'printType') ||
    isVariantSpecVisible(activeVariant, 'minOrder');

  return (
    <div className="flex flex-col justify-between h-full w-full pb-3 relative z-10 text-right overflow-hidden overscroll-none">
      <InternalCatalogHeader
        onBack={() => onNavigate(groupPageRoute)}
        onMenu={() => onNavigate('#/menu')}
      />

      <div className="px-5 space-y-2 flex-1">
        {/* Top Product Showcase Box (320px tall card, 422x250 schematic/photo frame) */}
        <div className="bg-white p-2.5 rounded-3xl border border-[#E5DEC9] shadow-xs h-[320px] flex flex-col justify-between">
          <div className="flex items-center justify-between px-1 shrink-0">
            <span className="text-[11px] font-mono-tech font-semibold text-[#92400E]">
              {product.technicalCode}
            </span>
            <div className="flex items-center gap-1 bg-[#F5F2EB] p-1 rounded-xl border border-[#E5DEC9]">
              <button
                type="button"
                onClick={() => setVisualMode('photo')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap ${
                  visualMode === 'photo'
                    ? 'bg-[#92400E] text-white'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>{productPage.photoTabLabel}</span>
              </button>
              <button
                type="button"
                onClick={() => setVisualMode('diagram')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap ${
                  visualMode === 'diagram'
                    ? 'bg-[#92400E] text-white'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>{productPage.diagramTabLabel}</span>
              </button>
            </div>
          </div>

          {visualMode === 'diagram' ? (
            <ProductDiagram
              diagramType={product.diagramType}
              customImage={activeMedia.schematicImage}
              className="w-[422px] max-w-full h-[250px] mx-auto shrink-0"
            />
          ) : (
            <div className="w-[422px] max-w-full h-[250px] mx-auto shrink-0 rounded-2xl overflow-hidden bg-[#F5EFE6]">
              <ZoomableImage
                src={activeMedia.image}
                alt={activeVariant ? `${product.name} - ${activeVariant.label}` : product.name}
                containerClassName="w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Category Breadcrumb & Product Title */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-start gap-2 text-xs">
            <a
              href={groupPageRoute}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(groupPageRoute);
              }}
              className="text-[#92400E] font-bold hover:underline"
            >
              {product.groupTitle}
            </a>
            <span className="text-[#A8A29E]" aria-hidden="true">
              ·
            </span>
            <span className="text-[#57534E] text-[11px]">{product.badgeText}</span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-[#1C1917] leading-snug">
            {product.name}
          </h2>
        </div>

        {/* Variant Selector Buttons (2x2 grid) */}
        {visibleVariants.length > 0 && activeVariant && (
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-[#57534E]">
              {product.variantPromptLabel} :
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {visibleVariants.map((variant) => {
                const isSelected = variant.id === activeVariant.id;
                const showSubLabel =
                  variant.showSubLabel !== false && variant.subLabel.trim().length > 0;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`py-1.5 px-2.5 rounded-2xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#92400E] border-[#92400E] text-white shadow-sm'
                        : 'bg-white border-[#E2D8C5] text-[#1C1917] hover:border-[#B45309]'
                    }`}
                  >
                    <div className="text-[11.5px] font-extrabold whitespace-nowrap truncate">
                      {variant.label}
                    </div>
                    {showSubLabel && (
                      <div
                        className={`text-[10px] whitespace-nowrap truncate ${
                          isSelected ? 'text-[#FEF3C7]' : 'text-[#78716C]'
                        }`}
                      >
                        {variant.subLabel}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Specification Box with top accent bar */}
        {activeVariant && showSpecCard && (
          <div className="bg-white rounded-3xl border border-[#E5DEC9] border-t-4 border-t-[#B45309] px-3 py-2.5 shadow-2xs">
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-right">
              {isVariantSpecVisible(activeVariant, 'grammage') && (
                <div>
                  <div className="text-[10px] text-[#78716C]">
                    {productPage.specLabels.grammage}
                  </div>
                  <div className="text-[11.5px] font-extrabold text-[#1C1917] tabular-nums">
                    {activeVariant.specs.grammage}
                  </div>
                </div>
              )}
              {isVariantSpecVisible(activeVariant, 'thickness') && (
                <div>
                  <div className="text-[10px] text-[#78716C]">
                    {productPage.specLabels.thickness}
                  </div>
                  <div className="text-[11.5px] font-extrabold text-[#1C1917] tabular-nums">
                    {activeVariant.specs.thickness}
                  </div>
                </div>
              )}
              {isVariantSpecVisible(activeVariant, 'weightCapacity') && (
                <div>
                  <div className="text-[10px] text-[#78716C]">
                    {productPage.specLabels.weightCapacity}
                  </div>
                  <div className="text-[11.5px] font-extrabold text-[#92400E] tabular-nums">
                    {activeVariant.specs.weightCapacity}
                  </div>
                </div>
              )}
              {isVariantSpecVisible(activeVariant, 'dimensions') && (
                <div>
                  <div className="text-[10px] text-[#78716C]">
                    {productPage.specLabels.dimensions}
                  </div>
                  <div className="text-[11.5px] font-extrabold text-[#1C1917] tabular-nums">
                    {activeVariant.specs.dimensions}
                  </div>
                </div>
              )}
              {isVariantSpecVisible(activeVariant, 'printType') && (
                <div>
                  <div className="text-[10px] text-[#78716C]">
                    {productPage.specLabels.printType}
                  </div>
                  <div className="text-[11.5px] font-bold text-[#1C1917]">
                    {activeVariant.specs.printType}
                  </div>
                </div>
              )}
              {isVariantSpecVisible(activeVariant, 'minOrder') && (
                <div>
                  <div className="text-[10px] text-[#78716C]">
                    {productPage.specLabels.minOrder}
                  </div>
                  <div className="text-[11.5px] font-extrabold text-[#1C1917] tabular-nums">
                    {activeVariant.specs.minOrder}
                  </div>
                </div>
              )}
              {isVariantSpecVisible(activeVariant, 'jointType') && (
                <div
                  className={`col-span-2 flex items-center justify-between ${
                    hasVisibleGridSpecs ? 'pt-1.5 border-t border-[#F5F2EB]' : ''
                  }`}
                >
                  <span className="text-[10px] text-[#78716C]">
                    {productPage.specLabels.jointType}
                  </span>
                  <span className="text-[11.5px] font-extrabold text-[#1C1917]">
                    {activeVariant.specs.jointType}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* End scrollable/flexible product info section */}
      </div>

      {/* Bottom Thumb-Zone Action Bars (consultation + table/specs/prev/next) */}
      <div className="px-5 pt-2 space-y-2 shrink-0">
        {/* Action Button Row 1: درخواست مشاوره در پیام‌رسان‌های فعال (واتساپ، ایتا، روبیکا) */}
        {enabledMessengers.length > 0 && (
          <div>
            <div className="bg-[#FAF5EB] border border-[#D8CFC0] rounded-2xl p-1.5 flex items-center justify-between gap-1.5 shadow-2xs">
              <div className="flex items-center gap-1 px-2 py-1 text-[#92400E] text-[11px] font-extrabold whitespace-nowrap shrink-0">
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{productPage.consultButtonText}:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-1">
                {enabledMessengers.map((m) => (
                  <a
                    key={m.id}
                    href={m.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard
                          .writeText(
                            `${m.messageText}\nشماره تماس پشتیبانی: ${m.phoneLocal}`
                          )
                          .catch(() => {});
                      }
                    }}
                    title={`${productPage.consultButtonText} در ${m.label} (${toPersianDigits(
                      m.phoneLocal
                    )})`}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-extrabold text-white text-center flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer whitespace-nowrap ${m.bgClass}`}
                  >
                    <MessageCircle className="w-3 h-3 shrink-0" />
                    <span>{m.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Row 2: جدول کامل + مشخصات + قبلی + بعدی */}
        <div className="grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => onOpenFullTable(product)}
            className="py-2.5 px-2 bg-white hover:bg-[#FFFBEB] border border-[#92400E]/40 rounded-2xl text-[11px] font-bold text-[#92400E] flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
            <span>{productPage.fullTableButtonText}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenSpecsModal(product)}
            className="py-2.5 px-2 bg-white hover:bg-[#FFFBEB] border border-[#92400E]/40 rounded-2xl text-[11px] font-bold text-[#92400E] flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
            <span>{productPage.specsButtonText}</span>
          </button>
          <button
            type="button"
            disabled={!prev}
            onClick={() => prev && onNavigate(`#/p/${prev.id}`)}
            className={`py-2.5 px-2 rounded-2xl border text-[11px] font-bold flex items-center justify-center gap-0.5 transition-colors whitespace-nowrap ${
              prev
                ? 'bg-white hover:bg-[#FFFBEB] border-[#92400E]/40 text-[#92400E] cursor-pointer'
                : 'bg-[#F5F2EB] border-[#E5DEC9] text-[#A8A29E] cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span>{productPage.prevButtonText}</span>
          </button>
          <button
            type="button"
            disabled={!next}
            onClick={() => next && onNavigate(`#/p/${next.id}`)}
            className={`py-2.5 px-2 rounded-2xl border text-[11px] font-bold flex items-center justify-center gap-0.5 transition-colors whitespace-nowrap ${
              next
                ? 'bg-white hover:bg-[#FFFBEB] border-[#92400E]/40 text-[#92400E] cursor-pointer'
                : 'bg-[#F5F2EB] border-[#E5DEC9] text-[#A8A29E] cursor-not-allowed'
            }`}
          >
            <span>{productPage.nextButtonText}</span>
            <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== 6. ABOUT PAGE (#/about) ====================
interface AboutPageProps {
  onNavigate: (hash: string) => void;
  catalogState?: CatalogCustomState;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  catalogState = getDefaultCatalogState(),
}) => {
  const { aboutPage, logoUrl } = catalogState.elements;

  return (
    <div className="flex flex-col justify-between h-full w-full pb-5 relative z-10 text-right overflow-hidden overscroll-none">
      <InternalCatalogHeader
        onBack={() => onNavigate('#/menu')}
        onMenu={() => onNavigate('#/menu')}
      />

      <div className="px-6 space-y-4 my-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-[#92400E]">{aboutPage.title}</h2>
          <div className="w-16 h-1 bg-[#B45309] rounded-full mx-auto" />
        </div>

        <div className="flex justify-center">
          <BrandEmblem size="md" logoUrl={logoUrl} />
        </div>

        <div className="bg-white/90 border border-[#E5DEC9] rounded-2xl p-4 shadow-2xs">
          <p className="text-xs sm:text-[13px] leading-7 text-[#292524] text-justify">
            {aboutPage.aboutText}
          </p>
        </div>

        {/* افتخارات و دستاوردها */}
        {catalogState.awards.length > 0 && (
          <div className="space-y-3 pt-1">
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-extrabold text-[#1C1917]">
                {aboutPage.awardsTitle}
              </h3>
              <div className="w-12 h-0.5 bg-[#B45309] rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {catalogState.awards.map((award, idx) => (
                <div
                  key={`${award.year}-${idx}`}
                  className="bg-white border border-[#E5DEC9] rounded-2xl p-2.5 flex flex-col items-center text-center shadow-2xs hover:border-[#D97706] transition-colors"
                >
                  <div className="h-24 w-full flex items-center justify-center p-1 overflow-hidden rounded-xl">
                    <ZoomableImage
                      src={award.image}
                      alt={`تندیس ${award.title} سال ${award.year}`}
                      objectFit="contain"
                      zoomScale={2.0}
                      containerClassName="w-full h-full flex items-center justify-center"
                    />
                  </div>
                  <div className="text-sm font-black text-[#1C1917] mt-1.5 tabular-nums">
                    {award.year}
                  </div>
                  <div className="text-[10px] font-semibold text-[#57534E] leading-snug mt-0.5">
                    {award.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pt-3 text-center shrink-0">
        <a
          href="#/groups/1"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('#/groups/1');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#92400E] hover:underline"
        >
          <span>{aboutPage.bottomLinkText}</span>
          <ChevronLeft className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

// ==================== 7. CONTACT PAGE (#/contact) ====================
interface ContactPageProps {
  onNavigate: (hash: string) => void;
  catalogState?: CatalogCustomState;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  catalogState = getDefaultCatalogState(),
}) => {
  const { contactPage, logoUrl } = catalogState.elements;

  const contactRows = [
    {
      label: contactPage.phoneLabel,
      value: contactPage.phoneFormatted,
      href: `tel:${contactPage.phoneTel}`,
    },
    {
      label: contactPage.salesMobileLabel,
      value: contactPage.mobileDisplay,
      href: `tel:${contactPage.mobileTel}`,
    },
    {
      label: contactPage.whatsappLabel,
      value: contactPage.mobileDisplay,
      href: `https://wa.me/${contactPage.whatsappNumber}`,
    },
    {
      label: contactPage.websiteLabel,
      value: contactPage.website,
      href: contactPage.websiteUrl,
    },
  ];

  return (
    <div className="flex flex-col justify-between h-full w-full pb-5 relative z-10 text-right overflow-hidden overscroll-none">
      <InternalCatalogHeader
        onBack={() => onNavigate('#/menu')}
        onMenu={() => onNavigate('#/menu')}
      />

      <div className="px-6 space-y-3 my-auto">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-black text-[#92400E]">{contactPage.title}</h2>
          <div className="w-16 h-1 bg-[#B45309] rounded-full mx-auto" />
        </div>

        <div className="flex flex-col items-center space-y-1 pt-0.5">
          <BrandEmblem size="sm" logoUrl={logoUrl} />
          <p className="text-xs font-bold text-[#57534E] text-center pt-1">
            {contactPage.subtitle}
          </p>
        </div>

        {/* Main Contact Links Card */}
        <div className="bg-white border border-[#E5DEC9] rounded-2xl divide-y divide-[#F0EAE0] overflow-hidden shadow-2xs">
          {contactRows.map((row, idx) => (
            <a
              key={idx}
              href={row.href}
              target={row.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="flex items-center justify-between px-4 py-2 hover:bg-[#FFFBEB] transition-colors"
            >
              <span className="text-xs text-[#57534E] font-semibold">{row.label}</span>
              <span
                dir="ltr"
                className="text-xs sm:text-sm font-bold text-[#92400E] tabular-nums"
              >
                {row.value}
              </span>
            </a>
          ))}
        </div>

        {/* Department Contacts Table */}
        <div className="bg-white border border-[#E5DEC9] rounded-2xl overflow-hidden shadow-2xs">
          <div className="px-4 py-1.5 bg-[#F5F0E6] border-b border-[#E5DEC9] text-xs font-extrabold text-[#1C1917]">
            {contactPage.departmentsTitle}
          </div>
          <table className="w-full text-right border-collapse text-xs tabular-nums">
            <thead>
              <tr className="border-b border-[#F0EAE0] text-[#78716C] text-[11px]">
                <th className="py-1.5 px-3 font-bold">واحد</th>
                <th className="py-1.5 px-3 font-bold">موبایل</th>
                <th className="py-1.5 px-3 font-bold text-center">داخلی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {catalogState.departments.map((dept, idx) => (
                <tr key={idx} className="hover:bg-[#FFFBEB] transition-colors">
                  <td className="py-1.5 px-3 font-bold text-[#1C1917]">{dept.unit}</td>
                  <td className="py-1.5 px-3">
                    <a
                      href={`tel:${dept.mobileTel}`}
                      className="font-bold text-[#92400E] hover:underline"
                    >
                      {dept.mobile}
                    </a>
                  </td>
                  <td className="py-1.5 px-3 text-center font-bold text-[#57534E]">
                    {dept.ext}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Address Banner Card */}
        <a
          href={contactPage.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="bg-[#92400E] hover:bg-[#78350F] text-white rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm transition-colors"
        >
          <div className="space-y-0.5 text-right">
            <div className="text-[11px] text-[#FDE68A] font-semibold">
              {contactPage.addressTitle}
            </div>
            <div className="text-xs font-bold leading-relaxed">{contactPage.address}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-[#FDE68A]" />
          </div>
        </a>
      </div>

      {/* Bottom Direct Call CTA */}
      <div className="px-6 pt-2 shrink-0">
        <a
          href={`tel:${contactPage.phoneTel}`}
          className="w-full py-3 px-6 bg-[#92400E] hover:bg-[#78350F] text-white text-sm font-extrabold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-colors"
        >
          <Phone className="w-4 h-4" />
          <span>{contactPage.directCallButtonText}</span>
        </a>
      </div>
    </div>
  );
};
