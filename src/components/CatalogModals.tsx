import React, { useState } from 'react';
import {
  Search,
  X,
  Check,
  Copy,
  Phone,
  MessageCircle,
  Layers,
  Package,
  Calculator,
  FileSpreadsheet,
  SlidersHorizontal,
  ArrowLeft,
} from 'lucide-react';
import {
  CatalogProduct,
  CategoryId,
  COMPANY_INFO,
  IMAGES,
  filterCatalogProducts,
  calculateOrderEstimate,
  formatToman,
  getVisibleProductVariants,
  isVariantSpecVisible,
  toPersianDigits,
} from '../data/catalogData';

export const BrandEmblem: React.FC<{ size?: 'sm' | 'md' | 'lg'; logoUrl?: string }> = ({
  size = 'md',
  logoUrl = IMAGES.logo,
}) => {
  const sizeClasses =
    size === 'lg'
      ? 'h-24 sm:h-28'
      : size === 'sm'
      ? 'h-12'
      : 'h-18 sm:h-20';

  return (
    <div className="inline-flex flex-col items-center justify-center select-none">
      <img
        src={logoUrl}
        alt="لوگوی شرکت کارتن محمد"
        className={`${sizeClasses} w-auto object-contain drop-shadow-xs`}
      />
    </div>
  );
};

// ==================== 1. SEARCH MODAL ====================
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
  customProducts?: CatalogProduct[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  customProducts,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | 'all'>('all');

  if (!isOpen) return null;

  const results = filterCatalogProducts(query, category, customProducts);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label="جست‌وجوی محصول در کاتالوگ"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF8F3] border border-[#E5DEC9] rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#ECE6D8]">
          <div className="flex items-center gap-2.5">
            <Search className="w-5 h-5 text-[#B45309]" />
            <h2 className="text-base font-bold text-[#1C1917]">جست‌وجوی هوشمند محصولات</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره جست‌وجو"
            className="w-8 h-8 rounded-full bg-[#F5F2EB] hover:bg-[#E7E0D2] flex items-center justify-center text-[#57534E] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="نام جعبه، کارتن یا فلوت را بنویسید (مثلاً: لاک باتم، کیبوردی، ذغال، فلوت CB)..."
              aria-label="عبارت جست‌وجو"
              autoFocus
              className="w-full bg-white border border-[#D8CFC0] focus:border-[#B45309] rounded-2xl px-4 py-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="پاک کردن جست‌وجو"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#78716C] hover:text-[#1C1917] px-2 py-1 cursor-pointer"
              >
                پاک کردن
              </button>
            )}
          </div>

          {/* Interactive category filter buttons */}
          <div className="flex items-center gap-1.5 bg-[#EFECE4] p-1 rounded-xl">
            {(
              [
                { id: 'all', label: 'همه (۲۰)' },
                { id: 'boxes', label: 'جعبه (۸)' },
                { id: 'cartons', label: 'کارتن (۶)' },
                { id: 'sheets', label: 'ورق و فلوت (۶)' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  category === tab.id
                    ? 'bg-white text-[#92400E] shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1">
            {results.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#78716C]">
                محصولی با عبارت «{query}» یافت نشد.
              </div>
            ) : (
              results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectProduct(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between gap-3 p-3.5 bg-white hover:bg-[#FFFBEB] border border-[#E7E0D2] hover:border-[#D97706] rounded-2xl text-right transition-all cursor-pointer group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[#78716C]">
                      <span>{item.groupTitle}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tech text-[11px] text-[#92400E]">
                        {item.technicalCode}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[#1C1917] group-hover:text-[#92400E] mt-0.5 truncate">
                      {item.name}
                    </div>
                    <div className="text-xs text-[#57534E] truncate mt-0.5">
                      {item.shortSubtitle}
                    </div>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-[#A8A29E] group-hover:text-[#B45309] shrink-0 transition-transform group-hover:-translate-x-1" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== 2. FULL SPECIFICATION TABLE MODAL ====================
interface FullSpecTableModalProps {
  product: CatalogProduct | null;
  onClose: () => void;
  onSelectVariant: (variantId: string) => void;
}

export const FullSpecTableModal: React.FC<FullSpecTableModalProps> = ({
  product,
  onClose,
  onSelectVariant,
}) => {
  if (!product) return null;

  const visibleVariants = getVisibleProductVariants(product);
  const showGrammageCol = visibleVariants.some((v) =>
    isVariantSpecVisible(v, 'grammage')
  );
  const showThicknessCol = visibleVariants.some((v) =>
    isVariantSpecVisible(v, 'thickness')
  );
  const showWeightCol = visibleVariants.some((v) =>
    isVariantSpecVisible(v, 'weightCapacity')
  );
  const showDimensionsCol = visibleVariants.some((v) =>
    isVariantSpecVisible(v, 'dimensions')
  );
  const showMinOrderCol = visibleVariants.some((v) =>
    isVariantSpecVisible(v, 'minOrder')
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`جدول کامل مشخصات ${product.name}`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FAF8F3] border border-[#E5DEC9] rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#ECE6D8]">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-[#B45309]" />
            <div>
              <h2 className="text-base font-bold text-[#1C1917]">
                جدول کامل مقایسه تیپ‌ها — {product.name}
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                کد استاندارد: {product.technicalCode} · روی هر ردیف کلیک کنید تا انتخاب شود
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن جدول کامل"
            className="w-8 h-8 rounded-full bg-[#F5F2EB] hover:bg-[#E7E0D2] flex items-center justify-center text-[#57534E] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-x-auto">
          {visibleVariants.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5DEC9] p-6 text-center text-xs text-[#78716C]">
              در حال حاضر هیچ تیپ فعالی برای نمایش در این جدول وجود ندارد.
            </div>
          ) : (
            <table className="w-full text-right border-collapse bg-white rounded-2xl overflow-hidden border border-[#E5DEC9]">
              <thead>
                <tr className="bg-[#F5F0E6] text-[#57534E] text-xs border-b border-[#E5DEC9]">
                  <th className="py-3 px-3 font-bold">مدل / تیپ</th>
                  {showGrammageCol && <th className="py-3 px-3 font-bold">گرماژ (GSM)</th>}
                  {showThicknessCol && <th className="py-3 px-3 font-bold">ضخامت</th>}
                  {showWeightCol && (
                    <th className="py-3 px-3 font-bold">تحمل وزن / مقاومت</th>
                  )}
                  {showDimensionsCol && <th className="py-3 px-3 font-bold">ابعاد (mm)</th>}
                  {showMinOrderCol && <th className="py-3 px-3 font-bold">حداقل سفارش</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE4] text-xs tabular-nums">
                {visibleVariants.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => {
                      onSelectVariant(v.id);
                      onClose();
                    }}
                    className="hover:bg-[#FFFBEB] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-bold text-[#92400E]">
                      <div>{v.label}</div>
                      {v.showSubLabel !== false && v.subLabel.trim().length > 0 && (
                        <div className="text-[11px] font-normal text-[#78716C]">
                          {v.subLabel}
                        </div>
                      )}
                    </td>
                    {showGrammageCol && (
                      <td className="py-3 px-3 text-[#1C1917]">
                        {isVariantSpecVisible(v, 'grammage') ? v.specs.grammage : '—'}
                      </td>
                    )}
                    {showThicknessCol && (
                      <td className="py-3 px-3 text-[#1C1917]">
                        {isVariantSpecVisible(v, 'thickness') ? v.specs.thickness : '—'}
                      </td>
                    )}
                    {showWeightCol && (
                      <td className="py-3 px-3 font-semibold text-[#1C1917]">
                        {isVariantSpecVisible(v, 'weightCapacity')
                          ? v.specs.weightCapacity
                          : '—'}
                      </td>
                    )}
                    {showDimensionsCol && (
                      <td className="py-3 px-3 text-[#57534E]">
                        {isVariantSpecVisible(v, 'dimensions') ? v.specs.dimensions : '—'}
                      </td>
                    )}
                    {showMinOrderCol && (
                      <td className="py-3 px-3 text-[#57534E]">
                        {isVariantSpecVisible(v, 'minOrder') ? v.specs.minOrder : '—'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== 3. TECHNICAL FEATURES MODAL ====================
interface TechnicalFeaturesModalProps {
  product: CatalogProduct | null;
  onClose: () => void;
}

export const TechnicalFeaturesModal: React.FC<TechnicalFeaturesModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`مشخصات فنی و کاربردهای ${product.name}`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF8F3] border border-[#E5DEC9] rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#ECE6D8]">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-[#B45309]" />
            <h2 className="text-base font-bold text-[#1C1917]">
              مشخصات ساختاری و کاربردها — {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره مشخصات"
            className="w-8 h-8 rounded-full bg-[#F5F2EB] hover:bg-[#E7E0D2] flex items-center justify-center text-[#57534E] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-right">
          <div className="bg-white p-4 rounded-2xl border border-[#E7E0D2]">
            <h3 className="text-xs font-bold text-[#92400E] mb-1.5">معرفی و مهندسی ساختار</h3>
            <p className="text-xs leading-relaxed text-[#44403C]">{product.description}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E7E0D2]">
            <h3 className="text-xs font-bold text-[#92400E] mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              ویژگی‌های فنی و مزایا
            </h3>
            <ul className="space-y-1.5 text-xs text-[#292524]">
              {product.structuralFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#B45309] font-bold">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E7E0D2]">
            <h3 className="text-xs font-bold text-[#92400E] mb-2 flex items-center gap-1.5">
              <Package className="w-4 h-4" />
              کاربردهای اصلی در صنایع
            </h3>
            <ul className="space-y-1.5 text-xs text-[#292524]">
              {product.applications.map((app, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#B45309] font-bold">•</span>
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E7E0D2]">
            <h3 className="text-xs font-bold text-[#92400E] mb-2">ترکیب لایه‌ها و کاغذهای قابل سفارش</h3>
            <div className="text-xs text-[#44403C] leading-relaxed">
              {product.paperCombinations.join('  ·  ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== 4. ORDER & ESTIMATE MODAL ====================
interface OrderInquiryModalProps {
  product: CatalogProduct | null;
  selectedVariantId: string;
  onClose: () => void;
}

export const OrderInquiryModal: React.FC<OrderInquiryModalProps> = ({
  product,
  selectedVariantId,
  onClose,
}) => {
  const [variantId, setVariantId] = useState(
    selectedVariantId || product?.variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1000);
  const [customPrint, setCustomPrint] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [dimensionsNote, setDimensionsNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedOrderCode, setSubmittedOrderCode] = useState<string | null>(null);

  if (!product) return null;

  const availableVariants = getVisibleProductVariants(product);
  const selectableVariants =
    availableVariants.length > 0 ? availableVariants : product.variants;
  const activeVariant =
    selectableVariants.find((v) => v.id === variantId) || selectableVariants[0];

  const estimate = calculateOrderEstimate(
    {
      productId: product.id,
      variantId: activeVariant.id,
      quantity,
      customPrint,
    },
    [product]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('لطفاً نام و شماره تماس خود را جهت ارسال پیش‌فاکتور وارد نمایید.');
      return;
    }
    if (!estimate.isValidQuantity) {
      setErrorMessage('حداقل تیراژ قابل ثبت ۱۰۰ عدد / مترمربع می‌باشد.');
      return;
    }
    setErrorMessage('');
    const code = `MC-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedOrderCode(code);
  };

  const whatsappText = encodeURIComponent(
    `سلام، وقت بخیر.\nاستعلام قیمت از کاتالوگ هوشمند کارتن محمد:\n• محصول: ${product.name}\n• تیپ: ${activeVariant.label} (${activeVariant.subLabel})\n• تیراژ: ${quantity} واحد\n• چاپ اختصاصی: ${customPrint ? 'بله' : 'خیر'}\n• نام: ${customerName || '-'}\n• تماس: ${customerPhone || '-'}`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`ثبت سفارش و استعلام قیمت ${product.name}`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF8F3] border border-[#E5DEC9] rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#ECE6D8]">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-[#B45309]" />
            <h2 className="text-base font-bold text-[#1C1917]">
              استعلام قیمت و ثبت سفارش — {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره ثبت سفارش"
            className="w-8 h-8 rounded-full bg-[#F5F2EB] hover:bg-[#E7E0D2] flex items-center justify-center text-[#57534E] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {submittedOrderCode ? (
            <div className="bg-white border border-[#D97706]/40 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#92400E] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#1C1917]">
                درخواست پیش‌فاکتور با کد «{toPersianDigits(submittedOrderCode)}» ثبت شد
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                کارشناسان فروش شرکت کارتن محمد در کوتاه‌ترین زمان با شماره{' '}
                <span className="font-bold text-[#1C1917]">{toPersianDigits(customerPhone)}</span>{' '}
                تماس خواهند گرفت.
              </p>
              <div className="bg-[#FAF8F3] rounded-xl p-3.5 text-xs text-right space-y-1.5 border border-[#ECE6D8]">
                <div className="flex justify-between">
                  <span className="text-[#78716C]">محصول انتخابی:</span>
                  <span className="font-bold text-[#1C1917]">
                    {product.name} ({activeVariant.label})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">تیراژ درخواستی:</span>
                  <span className="font-bold tabular-nums">{formatToman(quantity)} واحد</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">برآورد اولیه کل:</span>
                  <span className="font-extrabold text-[#92400E] tabular-nums">
                    {formatToman(estimate.totalPrice)} تومان
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${whatsappText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-4 bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  ارسال فوری در واتساپ
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 bg-[#EFECE4] hover:bg-[#E5DEC9] text-[#1C1917] text-xs font-semibold rounded-xl cursor-pointer"
                >
                  بازگشت به کاتالوگ
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-[#44403C] mb-1.5">
                  تیپ / مدل محصول
                </label>
                <select
                  value={activeVariant.id}
                  onChange={(e) => setVariantId(e.target.value)}
                  aria-label="انتخاب تیپ محصول"
                  className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1C1917] outline-none focus:border-[#B45309]"
                >
                  {selectableVariants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                      {v.showSubLabel !== false && v.subLabel ? ` — ${v.subLabel}` : ''}
                      {isVariantSpecVisible(v, 'dimensions')
                        ? ` (${v.specs.dimensions})`
                        : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1.5">
                    تیراژ سفارش (عدد / مترمربع)
                  </label>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    aria-label="تیراژ سفارش"
                    className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3.5 py-2.5 text-xs font-bold tabular-nums text-[#1C1917] outline-none focus:border-[#B45309]"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 bg-white border border-[#D8CFC0] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1C1917] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customPrint}
                      onChange={(e) => setCustomPrint(e.target.checked)}
                      className="accent-[#B45309] w-4 h-4"
                    />
                    <span>همراه با چاپ اختصاصی برند</span>
                  </label>
                </div>
              </div>

              {/* Real-time price calculator summary */}
              <div className="bg-white border border-[#E5DEC9] rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#78716C]">قیمت واحد تخمینی:</span>
                  <span className="font-bold text-[#1C1917] tabular-nums">
                    {formatToman(estimate.unitPrice)} تومان
                  </span>
                </div>
                {estimate.discountPercent > 0 && (
                  <div className="flex items-center justify-between text-xs text-[#92400E]">
                    <span>تخفیف تیراژ بالا:</span>
                    <span className="font-bold tabular-nums">
                      {toPersianDigits(estimate.discountPercent)}٪ کسر شد
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F5F2EB]">
                  <span className="font-bold text-[#44403C]">برآورد کل پیش‌فاکتور:</span>
                  <span className="text-sm font-extrabold text-[#B45309] tabular-nums">
                    {formatToman(estimate.totalPrice)} تومان
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1">
                    نام و نام خانوادگی / شرکت *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثلاً: شرکت صنایع غذایی بهاران"
                    aria-label="نام و نام خانوادگی یا شرکت"
                    className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] outline-none focus:border-[#B45309]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1">
                    شماره همراه / تلفن *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0912..."
                    aria-label="شماره تماس"
                    className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] outline-none focus:border-[#B45309]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#44403C] mb-1">
                  ابعاد دقیق یا توضیحات تکمیلی (اختیاری)
                </label>
                <input
                  type="text"
                  value={dimensionsNote}
                  onChange={(e) => setDimensionsNote(e.target.value)}
                  placeholder="مثلاً: طول ۳۰ × عرض ۲۰ × ارتفاع ۱۵ سانتی‌متر، چاپ ۲ رنگ..."
                  aria-label="ابعاد دقیق یا توضیحات"
                  className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] outline-none focus:border-[#B45309]"
                />
              </div>

              {errorMessage && (
                <p role="alert" className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-2 rounded-xl">
                  {errorMessage}
                </p>
              )}

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  ثبت استعلام و دریافت پیش‌فاکتور
                </button>
                <a
                  href={`tel:${COMPANY_INFO.phoneTel}`}
                  className="py-3 px-4 bg-white hover:bg-[#F5F2EB] border border-[#D8CFC0] text-[#1C1917] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5 text-[#B45309]" />
                  تماس مستقیم
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== 5. SHARE MODAL ====================
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label="اشتراک‌گذاری کاتالوگ هوشمند"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF8F3] border border-[#E5DEC9] rounded-3xl shadow-2xl overflow-hidden p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1C1917]">اشتراک‌گذاری کاتالوگ کارتن محمد</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره اشتراک‌گذاری"
            className="w-8 h-8 rounded-full bg-[#F5F2EB] hover:bg-[#E7E0D2] flex items-center justify-center text-[#57534E] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#57534E] leading-relaxed">
          لینک مستقیم صفحه فعلی کاتالوگ را کپی کرده یا برای همکاران خود ارسال نمایید:
        </p>

        <div className="flex items-center gap-2 bg-white border border-[#D8CFC0] rounded-xl p-2">
          <input
            type="text"
            readOnly
            value={currentUrl}
            aria-label="لینک کاتالوگ"
            dir="ltr"
            className="flex-1 text-xs font-mono-tech text-[#44403C] bg-transparent px-2 outline-none truncate"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'کپی شد' : 'کپی لینک'}
          </button>
        </div>
      </div>
    </div>
  );
};
