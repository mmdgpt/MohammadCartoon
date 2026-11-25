import React from 'react';
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
  MessageCircle,
  FileSpreadsheet,
  SlidersHorizontal,
  Layers,
  Image as ImageIcon,
  Package,
  X,
} from 'lucide-react';
import {
  GROUP_PRODUCTS_PER_PAGE,
  buildProductMessengerLinks,
  getPaginatedPagesForGroup,
  getProductGroupPageRoute,
  getVariantEffectiveMedia,
  getVisibleProductVariants,
  hasAnyVisibleVariantSpec,
  isVariantSpecVisible,
  buildPdfCatalogManifest,
  getGroupById,
  getProductById,
  getAdjacentProducts,
  toPersianDigits,
} from '../data/catalogData';
import {
  CatalogCustomState,
  loadCatalogState,
} from '../data/catalogStore';
import { ProductDiagram } from './ProductDiagram';

interface PrintHeaderProps {
  menuHref?: string;
  backHref: string;
}

const PrintInternalHeader: React.FC<PrintHeaderProps> = ({ menuHref, backHref }) => {
  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-1.5 relative z-10 shrink-0">
      {menuHref ? (
        <a
          href={menuHref}
          aria-label="فهرست"
          className="w-9 h-9 rounded-xl bg-white border border-[#E5DEC9] flex items-center justify-center text-[#92400E]"
        >
          <Menu className="w-4 h-4" />
        </a>
      ) : (
        <div className="w-9 h-9" />
      )}

      <a
        href={backHref}
        aria-label="بازگشت"
        className="w-9 h-9 rounded-xl bg-white border border-[#E5DEC9] flex items-center justify-center text-[#92400E]"
      >
        <CornerUpLeft className="w-4 h-4" />
      </a>
    </div>
  );
};

interface PrintCatalogBookProps {
  visibleOnScreen?: boolean;
  catalogState?: CatalogCustomState;
}

const FEATURE_ICONS = [Award, ShieldCheck, LayoutGrid, Truck];

export const PrintCatalogBook: React.FC<PrintCatalogBookProps> = ({
  visibleOnScreen = false,
  catalogState,
}) => {
  const activeState = catalogState || loadCatalogState();
  const { elements, groups, products, awards, departments } = activeState;
  const { cover, menu, groupsPage, productPage, aboutPage, contactPage, logoUrl } =
    elements;

  const { pages, routeToPdfId } = buildPdfCatalogManifest(products, groups);

  const hrefFor = (routeHash: string) => `#${routeToPdfId[routeHash] || 'pdf-0'}`;

  return (
    <div
      id="printroot"
      dir="rtl"
      className={
        visibleOnScreen
          ? 'block mx-auto w-[486px] space-y-6 py-6'
          : 'print-book-root'
      }
    >
      {pages.map((entry) => {
        const { pdfId, target } = entry;

        return (
          <div
            key={pdfId}
            id={pdfId}
            style={{ aspectRatio: '9 / 16' }}
            className="pp w-[486px] h-[864px] aspect-[9/16] bg-gradient-to-b from-[#FAF8F3] via-[#F7F3EA] to-[#F3EDE0] text-[#1C1917] relative overflow-hidden flex flex-col justify-between border border-[#E2D8C5]"
          >
            {/* Corner dot patterns matching website catalog sheet */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 right-0 w-44 h-44 catalog-corner-pattern-tr"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 w-44 h-44 catalog-corner-pattern-bl"
            />

            {/* ==================== 1. COVER PAGE (pdf-0) — 9:16 EXACT WEBSITE MATCH ==================== */}
            {target.type === 'cover' && (
              <section className="pg cover flex flex-col justify-between h-full px-6 pb-5 pt-0 relative z-10 text-right">
                <div className="relative flex items-start justify-center pt-0">
                  <a
                    href={hrefFor('#/menu')}
                    aria-label="بازگشت"
                    className="absolute left-0 top-4 w-9 h-9 rounded-xl bg-white border border-[#E5DEC9] flex items-center justify-center text-[#92400E]"
                  >
                    <CornerUpLeft className="w-4 h-4" />
                  </a>

                  <div className="bg-white border-x border-b border-[#E5DEC9] rounded-b-3xl px-7 pt-3.5 pb-3.5">
                    <img
                      src={logoUrl}
                      alt="لوگوی شرکت کارتن محمد"
                      className="h-20 w-auto object-contain"
                    />
                  </div>
                </div>

                <div className="my-auto space-y-4 pt-2">
                  <div className="text-center space-y-1.5 px-2">
                    <h2 className="text-2xl font-black text-[#1C1917] leading-snug">
                      {cover.heroTitle}
                    </h2>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-[#E2D8C5] bg-[#F5EFE6] h-52">
                    <img
                      src={cover.heroImage}
                      alt={cover.heroTitle}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F3]/85 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 right-3 left-3 flex items-center justify-between text-[11px] font-semibold text-[#78350F]">
                      <span className="bg-white/95 px-2.5 py-1 rounded-lg border border-[#E5DEC9]">
                        {cover.badgeRight}
                      </span>
                      <span className="bg-white/95 px-2.5 py-1 rounded-lg border border-[#E5DEC9] font-mono-tech">
                        {cover.badgeLeft}
                      </span>
                    </div>
                  </div>

                  {cover.features.length > 0 && (
                    <div className="grid grid-cols-2 gap-2.5">
                      {cover.features.map((featText, idx) => {
                        const IconComp = FEATURE_ICONS[idx % FEATURE_ICONS.length];
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-white border border-[#E5DEC9] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#292524]"
                          >
                            <IconComp className="w-4 h-4 text-[#B45309] shrink-0" />
                            <span className="truncate">{featText}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="space-y-2.5 pt-1">
                    <a
                      href={hrefFor('#/menu')}
                      className="w-full relative flex items-center justify-center py-3.5 px-6 bg-gradient-to-l from-[#B45309] via-[#C25E0E] to-[#92400E] text-white font-extrabold text-base rounded-full"
                    >
                      <span>{cover.startButtonText}</span>
                      <span className="absolute left-2 w-9 h-9 rounded-full bg-[#1C1917]/20 flex items-center justify-center">
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </span>
                    </a>

                    <div className="grid grid-cols-2 gap-2.5">
                      <a
                        href={hrefFor('#/about')}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#E2D8C5] rounded-2xl text-xs font-bold text-[#1C1917]"
                      >
                        <Building2 className="w-4 h-4 text-[#B45309]" />
                        <span>{cover.aboutButtonText}</span>
                      </a>
                      <a
                        href={hrefFor('#/contact')}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#E2D8C5] rounded-2xl text-xs font-bold text-[#1C1917]"
                      >
                        <Phone className="w-4 h-4 text-[#B45309]" />
                        <span>{cover.contactButtonText}</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center space-y-1">
                  <p className="text-[11px] text-[#78716C]">{cover.copyrightText}</p>
                </div>
              </section>
            )}

            {/* ==================== 2. MENU PAGE (pdf-1) ==================== */}
            {target.type === 'menu' && (
              <section className="pg menu flex flex-col justify-between h-full pb-5 relative z-10 text-right">
                <PrintInternalHeader backHref={hrefFor('#/cover')} />

                <div className="px-6 my-auto space-y-6">
                  <div className="flex justify-center py-2">
                    <img
                      src={logoUrl}
                      alt="لوگوی شرکت کارتن محمد"
                      className="h-28 w-auto object-contain"
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-[#57534E] px-1">
                      {menu.promptText}
                    </p>

                    {menu.showAbout && (
                      <a
                        href={hrefFor('#/about')}
                        className="w-full flex items-center justify-between p-4 bg-white border border-[#E7E0D2] rounded-2xl"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div className="text-base font-extrabold text-[#1C1917]">
                            {menu.aboutLabel}
                          </div>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-[#92400E]" />
                      </a>
                    )}

                    {menu.showProducts && (
                      <a
                        href={hrefFor('#/groups/1')}
                        className="w-full flex items-center justify-between p-4 bg-white border border-[#E7E0D2] rounded-2xl"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center">
                            <LayoutGrid className="w-5 h-5" />
                          </div>
                          <div className="text-base font-extrabold text-[#1C1917]">
                            {menu.productsLabel}
                          </div>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-[#92400E]" />
                      </a>
                    )}

                    {menu.showSearch && (
                      <a
                        href={hrefFor('#/groups/1')}
                        className="w-full flex items-center justify-between p-4 bg-white border border-[#E7E0D2] rounded-2xl"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center">
                            <Search className="w-5 h-5" />
                          </div>
                          <div className="text-base font-extrabold text-[#1C1917]">
                            {menu.searchLabel}
                          </div>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-[#92400E]" />
                      </a>
                    )}

                    {menu.showContact && (
                      <a
                        href={hrefFor('#/contact')}
                        className="w-full flex items-center justify-between p-4 bg-white border border-[#E7E0D2] rounded-2xl"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div className="text-base font-extrabold text-[#1C1917]">
                            {menu.contactLabel}
                          </div>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-[#92400E]" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="px-6 text-center">
                  <span className="text-[11px] font-mono-tech text-[#A8A29E] tracking-wider">
                    {menu.footerText}
                  </span>
                </div>
              </section>
            )}

            {/* ==================== 3. ABOUT PAGE (pdf-2) ==================== */}
            {target.type === 'about' && (
              <section className="pg about flex flex-col justify-between h-full pb-5 relative z-10 text-right">
                <PrintInternalHeader
                  menuHref={hrefFor('#/menu')}
                  backHref={hrefFor('#/menu')}
                />

                <div className="px-6 space-y-4 my-auto">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-[#92400E]">{aboutPage.title}</h2>
                    <div className="w-16 h-1 bg-[#B45309] rounded-full mx-auto" />
                  </div>

                  <div className="flex justify-center">
                    <img
                      src={logoUrl}
                      alt="لوگوی شرکت کارتن محمد"
                      className="h-18 w-auto object-contain"
                    />
                  </div>

                  <div className="bg-white border border-[#E5DEC9] rounded-2xl p-4">
                    <p className="text-[12.5px] leading-7 text-[#292524] text-justify">
                      {aboutPage.aboutText}
                    </p>
                  </div>

                  {awards.length > 0 && (
                    <div className="space-y-3 pt-1">
                      <div className="text-center space-y-1.5">
                        <h3 className="text-base font-extrabold text-[#1C1917]">
                          {aboutPage.awardsTitle}
                        </h3>
                        <div className="w-12 h-0.5 bg-[#B45309] rounded-full mx-auto" />
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {awards.map((award, idx) => (
                          <div
                            key={`${award.year}-${idx}`}
                            className="bg-white border border-[#E5DEC9] rounded-2xl p-2 flex flex-col items-center text-center"
                          >
                            <div className="h-22 w-full flex items-center justify-center p-0.5">
                              <img
                                src={award.image}
                                alt={`تندیس ${award.title} سال ${award.year}`}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="text-sm font-black text-[#1C1917] mt-1 tabular-nums">
                              {award.year}
                            </div>
                            <div className="text-[9.5px] font-semibold text-[#57534E] leading-snug mt-0.5">
                              {award.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 pt-2 text-center">
                  <a
                    href={hrefFor('#/groups/1')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#92400E]"
                  >
                    <span>{aboutPage.bottomLinkText}</span>
                    <ChevronLeft className="w-4 h-4" />
                  </a>
                </div>
              </section>
            )}

            {/* ==================== 4. GROUPS PAGE (pdf-3) ==================== */}
            {target.type === 'groups' && (
              <section className="pg groups flex flex-col justify-between h-full pb-5 relative z-10 text-right">
                <PrintInternalHeader
                  menuHref={hrefFor('#/menu')}
                  backHref={hrefFor('#/menu')}
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
                    {groups.map((group) => (
                      <a
                        key={group.id}
                        href={hrefFor(`#/g/${group.id}`)}
                        className="flex items-stretch bg-white border border-[#E5DEC9] rounded-3xl overflow-hidden h-36"
                      >
                        <div className="flex-1 p-4 flex flex-col justify-between text-right">
                          <h3 className="text-[20px] font-extrabold text-[#1C1917] leading-snug">
                            {group.title}
                          </h3>

                          <div className="pt-3 flex justify-start text-[20px]">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#92400E] text-white text-xs font-bold">
                              <span>{groupsPage.ctaButtonText}</span>
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>

                        <div className="w-36 bg-[#F3EDE0] shrink-0 relative overflow-hidden">
                          <img
                            src={group.image}
                            alt={group.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="px-6 pt-3 text-center">
                  <span className="text-[11px] text-[#78716C]">{groupsPage.footerText}</span>
                </div>
              </section>
            )}

            {/* ==================== 5. GROUP DETAIL PAGES (pdf-4..pdf-6 + paginated) ==================== */}
            {target.type === 'group-detail' && (() => {
              const group = getGroupById(target.groupId, groups);
              const groupPages = getPaginatedPagesForGroup(
                target.groupId,
                products,
                groups
              );
              const targetPageNum = target.pageNum || 1;
              const clampedGroupPage = Math.min(
                Math.max(1, targetPageNum),
                Math.max(1, groupPages.length)
              );
              const currentEntry =
                groupPages.find((p) => p.groupPageNum === clampedGroupPage) ||
                groupPages[0];

              const pagedProds = currentEntry ? currentEntry.products : [];
              const prevEntry =
                clampedGroupPage > 1 ? groupPages[clampedGroupPage - 2] : null;
              const nextEntry =
                clampedGroupPage < groupPages.length
                  ? groupPages[clampedGroupPage]
                  : null;

              return (
                <section className="pg group-detail flex flex-col justify-between h-full pb-4 relative z-10 text-right">
                  <PrintInternalHeader
                    menuHref={hrefFor('#/menu')}
                    backHref={hrefFor('#/groups/1')}
                  />

                  <div className="px-5 space-y-2.5 flex-1">
                    <div className="text-center space-y-1">
                      <h2 className="text-base font-black text-[#92400E]">
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

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      {pagedProds.slice(0, GROUP_PRODUCTS_PER_PAGE).map((product) => {
                        const visibleVariants = getVisibleProductVariants(product);
                        const cardMedia = getVariantEffectiveMedia(
                          product,
                          visibleVariants[0] || product.variants[0]
                        );
                        return (
                          <a
                            key={product.id}
                            href={hrefFor(`#/p/${product.id}`)}
                            className="flex flex-col bg-white border border-[#E5DEC9] rounded-2xl overflow-hidden"
                          >
                            <div className="p-1.5 pb-0">
                              <div className="h-19 w-full rounded-xl overflow-hidden bg-[#F5EFE6] border border-[#EDE6D6]">
                                <img
                                  src={cardMedia.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            <div className="px-2.5 py-1.5 flex-1 flex flex-col justify-between text-right">
                              <h3 className="text-[14.5px] font-extrabold text-[#1C1917] leading-snug truncate">
                                {product.name}
                              </h3>

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

                  <div className="px-5 pt-2.5 flex flex-col items-center gap-2.5">
                    <div className="w-full flex items-center justify-between gap-2.5">
                      {prevEntry ? (
                        <a
                          href={hrefFor(prevEntry.routeHash)}
                          className="w-[217px] h-[40px] shrink-0 rounded-xl bg-[#92400E] border border-[#92400E] text-white text-center font-bold flex items-center justify-center gap-1.5"
                        >
                          <ChevronRight className="w-4 h-4 shrink-0" />
                          <span className="text-[18px]">قبلی</span>
                        </a>
                      ) : (
                        <span className="w-[217px] h-[40px] shrink-0 rounded-xl bg-[#92400E] border border-[#92400E] text-white text-center font-bold flex items-center justify-center gap-1.5">
                          <ChevronRight className="w-4 h-4 shrink-0" />
                          <span className="text-[18px]">قبلی</span>
                        </span>
                      )}

                      {nextEntry ? (
                        <a
                          href={hrefFor(nextEntry.routeHash)}
                          className="w-[217px] h-[40px] shrink-0 rounded-xl bg-[#92400E] border border-[#92400E] text-white text-center font-bold flex items-center justify-center gap-1.5"
                        >
                          <span className="text-[18px]">بعدی</span>
                          <ChevronLeft className="w-4 h-4 shrink-0" />
                        </a>
                      ) : (
                        <span className="w-[217px] h-[40px] shrink-0 rounded-xl bg-[#92400E] border border-[#92400E] text-white text-center font-bold flex items-center justify-center gap-1.5">
                          <span className="text-[18px]">بعدی</span>
                          <ChevronLeft className="w-4 h-4 shrink-0" />
                        </span>
                      )}
                    </div>

                    <a
                      href={hrefFor('#/groups/1')}
                      className="px-6 py-2 rounded-xl bg-white border border-[#D8CFC0] text-xs font-bold text-[#44403C]"
                    >
                      {groupsPage.allGroupsButtonText}
                    </a>
                  </div>
                </section>
              );
            })()}

            {/* ==================== 6. PRODUCT DETAIL PAGES ==================== */}
            {target.type === 'product' && (() => {
              const product = getProductById(target.productId, products);
              if (!product) return null;
              const visibleVariants = getVisibleProductVariants(product);
              const candidateVariant = product.variants[target.variantIndex];
              const activeVariant =
                candidateVariant && candidateVariant.enabled !== false
                  ? candidateVariant
                  : visibleVariants[0];
              const activeMedia = getVariantEffectiveMedia(product, activeVariant);
              const { prev, next } = getAdjacentProducts(product.id, products);
              const groupPageRoute = getProductGroupPageRoute(product.id, products);
              const groupHref = hrefFor(groupPageRoute);
              const specModalHref = hrefFor(`#/p/${product.id}?modal=spec`);
              const diagramHref =
                target.variantIndex > 0 && activeVariant?.schematicImage
                  ? hrefFor(`#/p/${product.id}?v=${target.variantIndex}&mode=diagram`)
                  : hrefFor(`#/p/${product.id}?mode=diagram`);
              const messengerLinks = buildProductMessengerLinks(
                product,
                activeVariant?.label || product.name,
                groups,
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
                <section className="pg prod flex flex-col justify-between h-full pb-3 relative z-10 text-right">
                  <PrintInternalHeader
                    menuHref={hrefFor('#/menu')}
                    backHref={groupHref}
                  />

                  <div className="px-5 space-y-2 flex-1">
                    <div className="bg-white p-2.5 rounded-3xl border border-[#E5DEC9] h-[320px] flex flex-col justify-between">
                      <div className="flex items-center justify-between px-1 shrink-0">
                        <span className="text-[11px] font-mono-tech font-semibold text-[#92400E]">
                          {product.technicalCode}
                        </span>
                        <div className="flex items-center gap-1 bg-[#F5F2EB] p-1 rounded-xl border border-[#E5DEC9]">
                          <a
                            href={hrefFor(`#/p/${product.id}?v=${target.variantIndex}`)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 whitespace-nowrap ${
                              target.visualMode === 'photo'
                                ? 'bg-[#92400E] text-white'
                                : 'text-[#57534E]'
                            }`}
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>{productPage.photoTabLabel}</span>
                          </a>
                          <a
                            href={diagramHref}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 whitespace-nowrap ${
                              target.visualMode === 'diagram'
                                ? 'bg-[#92400E] text-white'
                                : 'text-[#57534E]'
                            }`}
                          >
                            <Layers className="w-3 h-3" />
                            <span>{productPage.diagramTabLabel}</span>
                          </a>
                        </div>
                      </div>

                      {target.visualMode === 'diagram' ? (
                        <ProductDiagram
                          diagramType={product.diagramType}
                          customImage={activeMedia.schematicImage}
                          enableHoverZoom={false}
                          className="w-[422px] max-w-full h-[250px] mx-auto shrink-0"
                        />
                      ) : (
                        <div className="w-[422px] max-w-full h-[250px] mx-auto shrink-0 rounded-2xl overflow-hidden bg-[#F5EFE6]">
                          <img
                            src={activeMedia.image}
                            alt={
                              activeVariant
                                ? `${product.name} - ${activeVariant.label}`
                                : product.name
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-start gap-2 text-xs">
                        <a href={groupHref} className="text-[#92400E] font-bold">
                          {product.groupTitle}
                        </a>
                        <span className="text-[#A8A29E]" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-[#57534E] text-[11px]">
                          {product.badgeText}
                        </span>
                      </div>

                      <h2 className="text-base font-black text-[#1C1917] leading-snug">
                        {product.name}
                      </h2>
                    </div>

                    {visibleVariants.length > 0 && activeVariant && (
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold text-[#57534E]">
                          {product.variantPromptLabel} :
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {product.variants.map((variant, vIdx) => {
                            if (variant.enabled === false) return null;
                            const isSelected = variant.id === activeVariant.id;
                            const showSubLabel =
                              variant.showSubLabel !== false &&
                              variant.subLabel.trim().length > 0;
                            return (
                              <a
                                key={variant.id}
                                href={hrefFor(`#/p/${product.id}?v=${vIdx}`)}
                                className={`py-1.5 px-2.5 rounded-2xl border text-right block ${
                                  isSelected
                                    ? 'bg-[#92400E] border-[#92400E] text-white'
                                    : 'bg-white border-[#E2D8C5] text-[#1C1917]'
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
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {activeVariant && showSpecCard && (
                      <div className="bg-white rounded-3xl border border-[#E5DEC9] border-t-4 border-t-[#B45309] px-3 py-2.5">
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

                    {enabledMessengers.length > 0 && (
                      <div className="pt-0.5">
                        <div className="bg-[#FAF5EB] border border-[#D8CFC0] rounded-2xl p-1.5 flex items-center justify-between gap-1.5">
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
                                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-extrabold text-white text-center flex items-center justify-center gap-1 whitespace-nowrap ${m.bgClass}`}
                              >
                                <MessageCircle className="w-3 h-3 shrink-0" />
                                <span>{m.label}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-4 gap-1.5">
                      <a
                        href={specModalHref}
                        className="py-2.5 px-2 bg-white border border-[#92400E]/40 rounded-2xl text-[11px] font-bold text-[#92400E] flex items-center justify-center gap-1 whitespace-nowrap"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                        <span>{productPage.fullTableButtonText}</span>
                      </a>
                      <a
                        href={specModalHref}
                        className="py-2.5 px-2 bg-white border border-[#92400E]/40 rounded-2xl text-[11px] font-bold text-[#92400E] flex items-center justify-center gap-1 whitespace-nowrap"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                        <span>{productPage.specsButtonText}</span>
                      </a>
                      {prev ? (
                        <a
                          href={hrefFor(`#/p/${prev.id}`)}
                          className="py-2.5 px-2 bg-white border border-[#92400E]/40 rounded-2xl text-[11px] font-bold text-[#92400E] flex items-center justify-center gap-0.5 whitespace-nowrap"
                        >
                          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                          <span>{productPage.prevButtonText}</span>
                        </a>
                      ) : (
                        <span className="py-2.5 px-2 bg-[#F5F2EB] border border-[#E5DEC9] rounded-2xl text-[11px] font-bold text-[#A8A29E] flex items-center justify-center gap-0.5 whitespace-nowrap">
                          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                          <span>{productPage.prevButtonText}</span>
                        </span>
                      )}
                      {next ? (
                        <a
                          href={hrefFor(`#/p/${next.id}`)}
                          className="py-2.5 px-2 bg-white border border-[#92400E]/40 rounded-2xl text-[11px] font-bold text-[#92400E] flex items-center justify-center gap-0.5 whitespace-nowrap"
                        >
                          <span>{productPage.nextButtonText}</span>
                          <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      ) : (
                        <span className="py-2.5 px-2 bg-[#F5F2EB] border border-[#E5DEC9] rounded-2xl text-[11px] font-bold text-[#A8A29E] flex items-center justify-center gap-0.5 whitespace-nowrap">
                          <span>{productPage.nextButtonText}</span>
                          <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                        </span>
                      )}
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* ==================== 7. PRODUCT FULL TABLE & TECHNICAL SPECS MODAL PAGE ==================== */}
            {target.type === 'product-spec' && (() => {
              const product = getProductById(target.productId, products);
              if (!product) return null;
              const productBackHref = hrefFor(`#/p/${product.id}`);
              const visibleSpecVariants = getVisibleProductVariants(product);
              const showGrammageCol = visibleSpecVariants.some((v) =>
                isVariantSpecVisible(v, 'grammage')
              );
              const showThicknessCol = visibleSpecVariants.some((v) =>
                isVariantSpecVisible(v, 'thickness')
              );
              const showWeightCol = visibleSpecVariants.some((v) =>
                isVariantSpecVisible(v, 'weightCapacity')
              );
              const showDimensionsCol = visibleSpecVariants.some((v) =>
                isVariantSpecVisible(v, 'dimensions')
              );
              const showMinOrderCol = visibleSpecVariants.some((v) =>
                isVariantSpecVisible(v, 'minOrder')
              );

              return (
                <section className="pg prod-spec flex flex-col justify-between h-full pb-4 relative z-10 text-right">
                  <div className="flex items-center justify-between px-5 pt-4 pb-2.5 border-b border-[#ECE6D8] bg-white/90">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-[#B45309]" />
                      <div>
                        <h2 className="text-xs font-black text-[#1C1917]">
                          جدول کامل و مشخصات فنی — {product.name}
                        </h2>
                        <p className="text-[10px] text-[#78716C] mt-0.5">
                          کد استاندارد: {product.technicalCode}
                        </p>
                      </div>
                    </div>
                    <a
                      href={productBackHref}
                      aria-label="بستن و بازگشت به محصول"
                      className="w-8 h-8 rounded-full bg-[#F5F2EB] border border-[#E5DEC9] flex items-center justify-center text-[#57534E]"
                    >
                      <X className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="px-5 space-y-2.5 my-auto">
                    {visibleSpecVariants.length > 0 && (
                      <div className="bg-white rounded-2xl border border-[#E5DEC9] overflow-hidden">
                        <table className="w-full text-right border-collapse text-[10px] tabular-nums">
                          <thead>
                            <tr className="bg-[#F5F0E6] text-[#57534E] border-b border-[#E5DEC9]">
                              <th className="py-1.5 px-2 font-bold">مدل / تیپ</th>
                              {showGrammageCol && (
                                <th className="py-1.5 px-1.5 font-bold">گرماژ</th>
                              )}
                              {showThicknessCol && (
                                <th className="py-1.5 px-1.5 font-bold">ضخامت</th>
                              )}
                              {showWeightCol && (
                                <th className="py-1.5 px-1.5 font-bold">تحمل وزن</th>
                              )}
                              {showDimensionsCol && (
                                <th className="py-1.5 px-1.5 font-bold">ابعاد</th>
                              )}
                              {showMinOrderCol && (
                                <th className="py-1.5 px-1.5 font-bold">تیراژ</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#EFECE4]">
                            {product.variants.map((v, vIdx) => {
                              if (v.enabled === false) return null;
                              return (
                                <tr key={v.id}>
                                  <td className="py-1.5 px-2 font-bold text-[#92400E]">
                                    <a
                                      href={hrefFor(`#/p/${product.id}?v=${vIdx}`)}
                                      className="block"
                                    >
                                      <div>{v.label}</div>
                                      {v.showSubLabel !== false &&
                                        v.subLabel.trim().length > 0 && (
                                          <div className="text-[9px] font-normal text-[#78716C]">
                                            {v.subLabel}
                                          </div>
                                        )}
                                    </a>
                                  </td>
                                  {showGrammageCol && (
                                    <td className="py-1.5 px-1.5 text-[#1C1917]">
                                      {isVariantSpecVisible(v, 'grammage')
                                        ? v.specs.grammage
                                        : '—'}
                                    </td>
                                  )}
                                  {showThicknessCol && (
                                    <td className="py-1.5 px-1.5 text-[#1C1917]">
                                      {isVariantSpecVisible(v, 'thickness')
                                        ? v.specs.thickness
                                        : '—'}
                                    </td>
                                  )}
                                  {showWeightCol && (
                                    <td className="py-1.5 px-1.5 font-semibold text-[#1C1917]">
                                      {isVariantSpecVisible(v, 'weightCapacity')
                                        ? v.specs.weightCapacity
                                        : '—'}
                                    </td>
                                  )}
                                  {showDimensionsCol && (
                                    <td className="py-1.5 px-1.5 text-[#57534E]">
                                      {isVariantSpecVisible(v, 'dimensions')
                                        ? v.specs.dimensions
                                        : '—'}
                                    </td>
                                  )}
                                  {showMinOrderCol && (
                                    <td className="py-1.5 px-1.5 text-[#57534E]">
                                      {isVariantSpecVisible(v, 'minOrder')
                                        ? v.specs.minOrder
                                        : '—'}
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="bg-white p-3 rounded-2xl border border-[#E7E0D2]">
                      <h3 className="text-[11px] font-bold text-[#92400E] mb-1">
                        معرفی و مهندسی ساختار
                      </h3>
                      <p className="text-[10.5px] leading-relaxed text-[#44403C]">
                        {product.description}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-[#E7E0D2]">
                      <h3 className="text-[11px] font-bold text-[#92400E] mb-1 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>ویژگی‌های فنی و مزایا</span>
                      </h3>
                      <ul className="space-y-0.5 text-[10.5px] text-[#292524]">
                        {product.structuralFeatures.map((feat, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#B45309] font-bold">•</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-[#E7E0D2]">
                      <h3 className="text-[11px] font-bold text-[#92400E] mb-1 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5" />
                        <span>کاربردهای اصلی در صنایع</span>
                      </h3>
                      <ul className="space-y-0.5 text-[10.5px] text-[#292524]">
                        {product.applications.map((app, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#B45309] font-bold">•</span>
                            <span>{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-2.5 rounded-2xl border border-[#E7E0D2]">
                      <h3 className="text-[10.5px] font-bold text-[#92400E] mb-0.5">
                        ترکیب لایه‌ها و کاغذهای قابل سفارش
                      </h3>
                      <div className="text-[10px] text-[#44403C] leading-relaxed">
                        {product.paperCombinations.join('  ·  ')}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pt-1.5">
                    <a
                      href={productBackHref}
                      className="w-full py-2.5 px-4 bg-[#92400E] text-white text-xs font-extrabold rounded-2xl text-center block"
                    >
                      بازگشت به صفحه محصول «{product.name}»
                    </a>
                  </div>
                </section>
              );
            })()}

            {/* ==================== 8. CONTACT PAGE (pdf-27) ==================== */}
            {target.type === 'contact' && (() => {
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
                <section className="pg contact flex flex-col justify-between h-full pb-5 relative z-10 text-right">
                  <PrintInternalHeader
                    menuHref={hrefFor('#/menu')}
                    backHref={hrefFor('#/menu')}
                  />

                  <div className="px-6 space-y-3 my-auto">
                    <div className="text-center space-y-1.5">
                      <h2 className="text-2xl font-black text-[#92400E]">
                        {contactPage.title}
                      </h2>
                      <div className="w-16 h-1 bg-[#B45309] rounded-full mx-auto" />
                    </div>

                    <div className="flex flex-col items-center space-y-1 pt-0.5">
                      <img
                        src={logoUrl}
                        alt="لوگوی شرکت کارتن محمد"
                        className="h-12 w-auto object-contain"
                      />
                      <p className="text-xs font-bold text-[#57534E] text-center pt-1">
                        {contactPage.subtitle}
                      </p>
                    </div>

                    <div className="bg-white border border-[#E5DEC9] rounded-2xl divide-y divide-[#F0EAE0] overflow-hidden">
                      {contactRows.map((row, idx) => (
                        <a
                          key={idx}
                          href={row.href}
                          target={row.href.startsWith('http') ? '_blank' : undefined}
                          rel="noreferrer"
                          className="flex items-center justify-between px-4 py-2"
                        >
                          <span className="text-xs text-[#57534E] font-semibold">
                            {row.label}
                          </span>
                          <span
                            dir="ltr"
                            className="text-xs sm:text-sm font-bold text-[#92400E] tabular-nums"
                          >
                            {row.value}
                          </span>
                        </a>
                      ))}
                    </div>

                    <div className="bg-white border border-[#E5DEC9] rounded-2xl overflow-hidden">
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
                          {departments.map((dept, idx) => (
                            <tr key={idx}>
                              <td className="py-1.5 px-3 font-bold text-[#1C1917]">
                                {dept.unit}
                              </td>
                              <td className="py-1.5 px-3">
                                <a
                                  href={`tel:${dept.mobileTel}`}
                                  className="font-bold text-[#92400E]"
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

                    <a
                      href={contactPage.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#92400E] text-white rounded-2xl p-3 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 text-right">
                        <div className="text-[11px] text-[#FDE68A] font-semibold">
                          {contactPage.addressTitle}
                        </div>
                        <div className="text-xs font-bold leading-relaxed">
                          {contactPage.address}
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-[#FDE68A]" />
                      </div>
                    </a>
                  </div>

                  <div className="px-6 pt-2">
                    <a
                      href={`tel:${contactPage.phoneTel}`}
                      className="w-full py-3 px-6 bg-[#92400E] text-white text-sm font-extrabold rounded-2xl flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{contactPage.directCallButtonText}</span>
                    </a>
                  </div>
                </section>
              );
            })()}
          </div>
        );
      })}
    </div>
  );
};
