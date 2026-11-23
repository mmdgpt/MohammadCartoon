import React, { useEffect, useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  Upload,
  RotateCcw,
  Check,
  Package,
  Layout,
  Settings,
  LogOut,
  Search,
  Lock,
  UserCheck,
  Image as ImageIcon,
  Award,
  Phone,
  Layers,
  ChevronLeft,
  MessageCircle,
  Download,
  Copy,
  Save,
  Loader2,
} from 'lucide-react';
import {
  ALL_SPEC_FIELD_KEYS,
  CatalogProduct,
  CategoryId,
  IMAGES,
  MessengerId,
  ProductVariant,
  SpecFieldKey,
  getProductMessengerConfig,
  isVariantSpecVisible,
  toPersianDigits,
} from '../data/catalogData';
import {
  CatalogCustomState,
  createBlankProduct,
  updateCategoryWhatsappInState,
  setGlobalMessengerEnabledInState,
  setProductMessengerEnabledInState,
  exportCatalogBackupJson,
  parseCatalogBackupJson,
} from '../data/catalogStore';
import { ProductDiagram } from './ProductDiagram';

const FieldVisibilitySwitch: React.FC<{
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel: string;
  size?: 'sm' | 'md';
  onLabel?: string;
  offLabel?: string;
}> = ({
  checked,
  onChange,
  ariaLabel,
  size = 'sm',
  onLabel = 'روشن',
  offLabel = 'خاموش',
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    onClick={() => onChange(!checked)}
    className={`inline-flex items-center gap-1.5 rounded-full border font-bold transition-colors cursor-pointer shrink-0 ${
      size === 'md' ? 'px-2.5 py-1 text-[11px]' : 'px-1.5 py-0.5 text-[10px]'
    } ${
      checked
        ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]'
        : 'bg-[#F5F2EB] border-[#D8CFC0] text-[#78716C]'
    }`}
  >
    <span
      className={`relative inline-flex items-center rounded-full transition-colors ${
        size === 'md' ? 'w-7 h-4' : 'w-6 h-3.5'
      } ${checked ? 'bg-[#15803D]' : 'bg-[#A8A29E]'}`}
    >
      <span
        className={`inline-block rounded-full bg-white shadow-xs transition-transform ${
          size === 'md' ? 'w-3 h-3' : 'w-2.5 h-2.5'
        } ${
          checked
            ? size === 'md'
              ? '-translate-x-3.5'
              : '-translate-x-3'
            : '-translate-x-0.5'
        }`}
      />
    </span>
    <span>{checked ? onLabel : offLabel}</span>
  </button>
);

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  expectedPassword?: string;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  expectedPassword = '1234',
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState(expectedPassword);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      username.trim().toLowerCase() === 'admin' &&
      (password === expectedPassword || password === '1234')
    ) {
      setError('');
      onLoginSuccess();
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است (پیش‌فرض: admin / 1234)');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label="ورود به پنل ادمین"
      onClick={onClose}
    >
      <div
        dir="rtl"
        className="w-full max-w-sm bg-[#FAF8F3] border border-[#E5DEC9] rounded-3xl shadow-2xl overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#ECE6D8]">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#B45309]" />
            <h2 className="text-base font-extrabold text-[#1C1917]">
              ورود به پنل مدیریت کاتالوگ
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره ورود"
            className="w-8 h-8 rounded-full bg-[#F5F2EB] hover:bg-[#E7E0D2] flex items-center justify-center text-[#57534E] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#44403C] mb-1.5">
              نام کاربری
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="نام کاربری ادمین"
              dir="ltr"
              className="w-full bg-white border border-[#D8CFC0] focus:border-[#B45309] rounded-xl px-3.5 py-2.5 text-xs font-mono-tech text-[#1C1917] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#44403C] mb-1.5">
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="رمز عبور ادمین"
              dir="ltr"
              className="w-full bg-white border border-[#D8CFC0] focus:border-[#B45309] rounded-xl px-3.5 py-2.5 text-xs font-mono-tech text-[#1C1917] outline-none"
            />
            <p className="text-[11px] text-[#78716C] mt-1.5">
              اطلاعات ورود پیش‌فرض آماده است: نام کاربری <span className="font-mono-tech font-bold">admin</span> و رمز <span className="font-mono-tech font-bold">1234</span>
            </p>
          </div>

          {error && (
            <p role="alert" className="text-xs font-bold text-red-700 bg-red-50 px-3 py-2 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#92400E] hover:bg-[#78350F] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>ورود به پنل ادمین</span>
          </button>
        </form>
      </div>
    </div>
  );
};

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogState: CatalogCustomState;
  onSaveState: (nextState: CatalogCustomState) => Promise<{ pdfUpdated: boolean }>;
  onResetState: () => Promise<CatalogCustomState>;
  onLogout: () => void;
  onNavigateToRoute: (hash: string) => void;
}

const PRESET_IMAGES = [
  { label: 'تصویر قهرمان جلد', url: IMAGES.coverHero },
  { label: 'تصویر گروه جعبه', url: IMAGES.boxesShowcase },
  { label: 'تصویر گروه کارتن', url: IMAGES.cartonsShowcase },
  { label: 'تصویر گروه ورق و فلوت', url: IMAGES.sheetsFlutes },
  { label: 'لوگوی کارتن محمد', url: IMAGES.logo },
];

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  catalogState: savedCatalogState,
  onSaveState,
  onResetState,
  onLogout,
  onNavigateToRoute,
}) => {
  const [catalogState, setDraftCatalogState] =
    useState<CatalogCustomState>(savedCatalogState);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [mainTab, setMainTab] = useState<'products' | 'pages' | 'settings'>('products');
  const [pageSubTab, setPageSubTab] = useState<
    'cover' | 'menu' | 'groups' | 'product-template' | 'about' | 'contact' | 'header'
  >('cover');

  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<CategoryId | 'all'>('all');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProductCategory, setNewProductCategory] = useState<CategoryId>('boxes');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [backupError, setBackupError] = useState<string | null>(null);
  const [backupTextInput, setBackupTextInput] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setDraftCatalogState(savedCatalogState);
      setHasUnsavedChanges(false);
      setSaveError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onUpdateState = (nextState: CatalogCustomState) => {
    setDraftCatalogState(nextState);
    setHasUnsavedChanges(true);
    setSaveError(null);
  };

  const showSavedFeedback = (
    msg: string = 'تغییرات با موفقیت در اپ و نسخه PDF ذخیره شد'
  ) => {
    setBackupError(null);
    setSaveError(null);
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 4000);
  };

  const handleSaveAll = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    setBackupError(null);
    try {
      const result = await onSaveState(catalogState);
      setHasUnsavedChanges(false);
      if (result.pdfUpdated) {
        showSavedFeedback('تغییرات همزمان در اپلیکیشن و نسخه PDF ذخیره شد');
      } else {
        showSavedFeedback('تغییرات در اپلیکیشن ذخیره شد');
      }
    } catch (err: any) {
      setSaveError(err?.message || 'خطا در ذخیره تغییرات روی اپ و نسخه PDF.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setDraftCatalogState(savedCatalogState);
    setHasUnsavedChanges(false);
    setSaveError(null);
    showSavedFeedback('تغییرات ذخیره‌نشده به آخرین نسخه ذخیره‌شده بازگردانده شد');
  };

  const handleExportBackup = () => {
    try {
      const jsonStr = exportCatalogBackupJson(catalogState);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const dateStamp = new Date().toISOString().slice(0, 10);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mohammad-carton-catalog-backup-${dateStamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showSavedFeedback('فایل بکاپ کامل کاتالوگ با موفقیت آماده و دانلود شد');
    } catch {
      setBackupError('خطا در ایجاد فایل بکاپ کاتالوگ.');
    }
  };

  const handleImportBackupFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        try {
          const restoredState = parseCatalogBackupJson(reader.result);
          onUpdateState(restoredState);
          setEditingProductId(null);
          setBackupError(null);
          showSavedFeedback(
            `بکاپ بارگذاری شد (${toPersianDigits(restoredState.products.length)} محصول) — برای اعمال روی اپ و PDF دکمه «ذخیره» را بزنید`
          );
        } catch (err: any) {
          setBackupError(err?.message || 'فایل بکاپ انتخاب‌شده معتبر نیست.');
        }
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleCopyBackupJson = () => {
    const jsonStr = exportCatalogBackupJson(catalogState);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(jsonStr)
        .then(() => {
          showSavedFeedback('کد بکاپ کامل کاتالوگ در حافظه کپی شد');
        })
        .catch(() => {
          setBackupTextInput(jsonStr);
          showSavedFeedback('کد بکاپ در کادر متنی پایین قرار گرفت');
        });
    } else {
      setBackupTextInput(jsonStr);
      showSavedFeedback('کد بکاپ در کادر متنی پایین قرار گرفت');
    }
  };

  const handleApplyBackupText = () => {
    if (!backupTextInput.trim()) {
      setBackupError('لطفاً ابتدا متن JSON بکاپ را در کادر وارد کنید.');
      return;
    }
    try {
      const restoredState = parseCatalogBackupJson(backupTextInput);
      onUpdateState(restoredState);
      setEditingProductId(null);
      setBackupError(null);
      setBackupTextInput('');
      showSavedFeedback(
        `بکاپ متنی بارگذاری شد (${toPersianDigits(restoredState.products.length)} محصول) — برای اعمال نهایی «ذخیره» را بزنید`
      );
    } catch (err: any) {
      setBackupError(err?.message || 'متن بکاپ واردشده معتبر نیست.');
    }
  };

  const handleFileUpload = (file: File | undefined, onLoaded: (dataUrl: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onLoaded(reader.result);
        showSavedFeedback('تصویر جدید بارگذاری شد — برای اعمال در اپ و PDF دکمه «ذخیره» را بزنید');
      }
    };
    reader.readAsDataURL(file);
  };

  const editingProduct =
    catalogState.products.find((p) => p.id === editingProductId) || null;

  const filteredProducts = catalogState.products.filter((p) => {
    if (productCatFilter !== 'all' && p.groupId !== productCatFilter) return false;
    if (!productSearch.trim()) return true;
    const q = productSearch.trim().toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.technicalCode.toLowerCase().includes(q) ||
      p.shortSubtitle.toLowerCase().includes(q)
    );
  });

  const handleAddNewProduct = () => {
    const created = createBlankProduct(newProductCategory);
    const nextState: CatalogCustomState = {
      ...catalogState,
      products: [created, ...catalogState.products],
    };
    onUpdateState(nextState);
    setEditingProductId(created.id);
    showSavedFeedback(`محصول جدید در دسته «${created.groupTitle}» اضافه شد — برای اعمال نهایی «ذخیره» را بزنید`);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    const nextState: CatalogCustomState = {
      ...catalogState,
      products: catalogState.products.filter((p) => p.id !== productId),
    };
    onUpdateState(nextState);
    if (editingProductId === productId) {
      setEditingProductId(null);
    }
    showSavedFeedback(`محصول «${productName}» حذف شد — برای اعمال نهایی «ذخیره» را بزنید`);
  };

  const handleUpdateProduct = (updated: CatalogProduct) => {
    const nextState: CatalogCustomState = {
      ...catalogState,
      products: catalogState.products.map((p) =>
        p.id === updated.id ? updated : p
      ),
    };
    onUpdateState(nextState);
  };

  const updateElements = (updater: (prev: CatalogCustomState['elements']) => CatalogCustomState['elements']) => {
    onUpdateState({
      ...catalogState,
      elements: updater(catalogState.elements),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="پنل مدیریت جامع کاتالوگ کارتن محمد"
      onClick={onClose}
    >
      <div
        dir="rtl"
        className="w-full max-w-4xl h-[90vh] bg-[#FAF8F3] border border-[#E5DEC9] rounded-3xl shadow-2xl overflow-hidden flex flex-col text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 bg-white border-b border-[#ECE6D8]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#1C1917]">
                پنل ادمین و مدیریت کامل کاتالوگ کارتن محمد
              </h2>
              <p className="text-[11px] text-[#78716C]">
                ویرایش محصولات، تغییر تصاویر، افزودن/حذف محصول و مدیریت تک‌تک عناصر تمام صفحات
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {savedNotice && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {savedNotice}
              </span>
            )}
            {backupError && (
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold flex items-center gap-1">
                {backupError}
              </span>
            )}

            {/* Quick Header Save Button (Applies to both App & PDF) */}
            <button
              type="button"
              onClick={() => void handleSaveAll()}
              disabled={isSaving}
              title="ذخیره تغییرات و بروزرسانی همزمان اپلیکیشن و فایل PDF قابل کلیک"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                isSaving
                  ? 'bg-[#78350F] text-white/90 cursor-wait'
                  : hasUnsavedChanges
                  ? 'bg-[#15803D] hover:bg-[#166534] text-white ring-2 ring-[#86EFAC]'
                  : 'bg-[#92400E] hover:bg-[#78350F] text-white'
              }`}
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isSaving ? 'در حال ذخیره…' : 'ذخیره'}</span>
            </button>

            {/* Quick Header Backup Export Button */}
            <button
              type="button"
              onClick={handleExportBackup}
              title="دانلود فایل پشتیبان (بکاپ) از کل اطلاعات و محصولات کاتالوگ"
              className="px-3 py-1.5 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border border-[#F59E0B]/30 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>گرفتن بکاپ</span>
            </button>

            {/* Quick Header Backup Import Button */}
            <label
              title="وارد کردن و بازیابی فایل پشتیبان (بکاپ) کاتالوگ"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F3] text-[#44403C] border border-[#D8CFC0] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#92400E]" />
              <span>وارد کردن بکاپ</span>
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  handleImportBackupFile(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </label>

            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-[#F5F2EB] hover:bg-red-50 text-[#57534E] hover:text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج ادمین</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن پنل مدیریت"
              className="w-8 h-8 rounded-full bg-[#F5F2EB] hover:bg-[#E7E0D2] flex items-center justify-center text-[#57534E] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#F3EDE0] border-b border-[#E5DEC9] overflow-x-auto">
          <button
            type="button"
            onClick={() => setMainTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              mainTab === 'products'
                ? 'bg-[#92400E] text-white shadow-xs'
                : 'bg-white text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>مدیریت محصولات ({toPersianDigits(catalogState.products.length)})</span>
          </button>

          <button
            type="button"
            onClick={() => setMainTab('pages')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              mainTab === 'pages'
                ? 'bg-[#92400E] text-white shadow-xs'
                : 'bg-white text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>مدیریت عناصر تمامی صفحات (Elements)</span>
          </button>

          <button
            type="button"
            onClick={() => setMainTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              mainTab === 'settings'
                ? 'bg-[#92400E] text-white shadow-xs'
                : 'bg-white text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>تنظیمات، پشتیبان‌گیری و بازنشانی</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* ==================== TAB 1: PRODUCTS CRUD ==================== */}
          {mainTab === 'products' && (
            <div className="space-y-4">
              {!editingProduct ? (
                <>
                  {/* Top Bar: Add Product + Search & Category Filter */}
                  <div className="bg-white p-4 rounded-2xl border border-[#E5DEC9] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value as CategoryId)}
                        aria-label="دسته محصول جدید"
                        className="bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold text-[#1C1917] outline-none"
                      >
                        <option value="boxes">دسته: انواع جعبه</option>
                        <option value="cartons">دسته: انواع کارتن</option>
                        <option value="sheets">دسته: انواع ورق و فلوت</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddNewProduct}
                        className="px-4 py-2 rounded-xl bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>افزودن محصول جدید</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 flex-1 max-w-md">
                      <div className="relative flex-1 min-w-[180px]">
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="جست‌وجوی نام یا کد محصول..."
                          aria-label="جست‌وجو در محصولات پنل ادمین"
                          className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl pr-8 pl-3 py-2 text-xs text-[#1C1917] outline-none focus:border-[#B45309]"
                        />
                        <Search className="w-3.5 h-3.5 text-[#78716C] absolute right-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                      <select
                        value={productCatFilter}
                        onChange={(e) => setProductCatFilter(e.target.value as CategoryId | 'all')}
                        aria-label="فیلتر دسته محصولات"
                        className="bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold text-[#1C1917] outline-none"
                      >
                        <option value="all">همه دسته‌ها ({toPersianDigits(catalogState.products.length)})</option>
                        <option value="boxes">جعبه ({toPersianDigits(catalogState.products.filter((p) => p.groupId === 'boxes').length)})</option>
                        <option value="cartons">کارتن ({toPersianDigits(catalogState.products.filter((p) => p.groupId === 'cartons').length)})</option>
                        <option value="sheets">ورق و فلوت ({toPersianDigits(catalogState.products.filter((p) => p.groupId === 'sheets').length)})</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick Consultation Settings: Messenger Toggles (WhatsApp, Eitaa, Rubika) & Phone Number per Category */}
                  <div className="bg-white p-4 rounded-2xl border border-[#E5DEC9] space-y-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#F5F2EB]">
                      <div className="space-y-0.5">
                        <span className="text-xs font-extrabold text-[#92400E] flex items-center gap-1.5">
                          <MessageCircle className="w-4 h-4" />
                          <span>
                            تنظیم شماره و پیام‌رسان‌های «درخواست مشاوره» محصولات (واتساپ، ایتا، روبیکا)
                          </span>
                        </span>
                        <p className="text-[11px] text-[#78716C]">
                          مشخص کنید کدام پیام‌رسان‌ها برای دکمه «درخواست مشاوره» فعال باشند و شماره پشتیبانی هر دسته یا محصول را وارد نمایید:
                        </p>
                      </div>

                      {/* Global Messenger Activation Toggles */}
                      <div className="flex flex-wrap items-center gap-2">
                        {(
                          [
                            {
                              id: 'whatsapp' as MessengerId,
                              label: 'واتساپ',
                              activeBg: 'bg-[#15803D] border-[#15803D] text-white',
                            },
                            {
                              id: 'eitaa' as MessengerId,
                              label: 'ایتا',
                              activeBg: 'bg-[#EA580C] border-[#EA580C] text-white',
                            },
                            {
                              id: 'rubika' as MessengerId,
                              label: 'روبیکا',
                              activeBg: 'bg-[#6D28D9] border-[#6D28D9] text-white',
                            },
                          ]
                        ).map((item) => {
                          const isEnabled =
                            catalogState.elements.productPage.messengers?.[item.id] ?? true;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                const nextState = setGlobalMessengerEnabledInState(
                                  catalogState,
                                  item.id,
                                  !isEnabled
                                );
                                onUpdateState(nextState);
                                showSavedFeedback(
                                  `پیام‌رسان «${item.label}» برای درخواست مشاوره ${
                                    !isEnabled ? 'فعال' : 'غیرفعال'
                                  } شد`
                                );
                              }}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                                isEnabled
                                  ? item.activeBg
                                  : 'bg-[#F5F2EB] border-[#D8CFC0] text-[#78716C]'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                readOnly
                                className="w-3.5 h-3.5 accent-white pointer-events-none"
                              />
                              <span>{item.label}:</span>
                              <span className="text-[10.5px]">
                                {isEnabled ? 'فعال' : 'غیرفعال'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {catalogState.groups.map((grp) => (
                        <div
                          key={grp.id}
                          className="bg-[#FAF8F3] border border-[#E5DEC9] rounded-xl p-2.5 flex flex-col gap-1.5"
                        >
                          <label className="text-[11px] font-extrabold text-[#44403C] flex items-center justify-between">
                            <span>شماره مشاوره دسته {grp.title}:</span>
                            <span className="text-[10px] font-normal text-[#78716C]">
                              واتساپ · ایتا · روبیکا
                            </span>
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              dir="ltr"
                              value={
                                grp.whatsappNumber ||
                                catalogState.elements.contactPage.whatsappNumber
                              }
                              onChange={(e) => {
                                const nextState = updateCategoryWhatsappInState(
                                  catalogState,
                                  grp.id,
                                  e.target.value
                                );
                                onUpdateState(nextState);
                                showSavedFeedback(
                                  `شماره مشاوره (واتساپ، ایتا، روبیکا) برای «${grp.title}» بروزرسانی شد`
                                );
                              }}
                              placeholder="09396410276 یا 989396410276"
                              className="w-full bg-white border border-[#D8CFC0] focus:border-[#B45309] rounded-lg px-2.5 py-1.5 text-xs font-mono-tech text-[#1C1917] outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Products Table / Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white border border-[#E5DEC9] hover:border-[#D97706] rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-2xs transition-all"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-14 h-14 rounded-xl object-cover border border-[#E5DEC9] shrink-0 bg-[#F5EFE6]"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 text-[11px] text-[#92400E] font-bold">
                                <span>{prod.groupTitle}</span>
                                <span>·</span>
                                <span className="font-mono-tech">{prod.technicalCode}</span>
                              </div>
                              <div className="text-sm font-extrabold text-[#1C1917] truncate mt-0.5">
                                {prod.name}
                              </div>
                              <div className="text-[11px] text-[#78716C] mt-0.5">
                                {toPersianDigits(prod.variants.length)} تیپ · {prod.badgeText}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                onNavigateToRoute(`#/p/${prod.id}`);
                                onClose();
                              }}
                              title="مشاهده در کاتالوگ"
                              className="px-2.5 py-2 rounded-xl bg-[#F5F2EB] hover:bg-[#E7E0D2] text-[#44403C] text-[11px] font-bold cursor-pointer"
                            >
                              نمایش
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingProductId(prod.id)}
                              className="px-3 py-2 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>ویرایش</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              aria-label={`حذف ${prod.name}`}
                              title="حذف محصول"
                              className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 flex items-center justify-center cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Per-Product Consultation Number & Messenger Toggles (WhatsApp, Eitaa, Rubika) */}
                        <div className="pt-2 border-t border-[#F5F2EB] space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-[11px] font-bold text-[#57534E] flex items-center gap-1 whitespace-nowrap">
                              <MessageCircle className="w-3.5 h-3.5 text-[#92400E]" />
                              <span>شماره مشاوره (واتساپ، ایتا، روبیکا):</span>
                            </label>
                            <input
                              type="text"
                              dir="ltr"
                              aria-label={`شماره مشاوره ${prod.name}`}
                              value={
                                prod.whatsappNumber ??
                                catalogState.elements.contactPage.whatsappNumber
                              }
                              onChange={(e) =>
                                handleUpdateProduct({
                                  ...prod,
                                  whatsappNumber: e.target.value,
                                })
                              }
                              placeholder="09396410276 یا 989396410276"
                              className="w-40 bg-[#FAF8F3] border border-[#D8CFC0] focus:border-[#B45309] rounded-lg px-2.5 py-1 text-xs font-mono-tech text-[#1C1917] outline-none"
                            />
                          </div>

                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-[10.5px] font-semibold text-[#78716C]">
                              پیام‌رسان‌های فعال این محصول:
                            </span>
                            <div className="flex items-center gap-1">
                              {(
                                [
                                  {
                                    id: 'whatsapp' as MessengerId,
                                    label: 'واتساپ',
                                    activeClass:
                                      'bg-[#15803D] border-[#15803D] text-white',
                                  },
                                  {
                                    id: 'eitaa' as MessengerId,
                                    label: 'ایتا',
                                    activeClass:
                                      'bg-[#EA580C] border-[#EA580C] text-white',
                                  },
                                  {
                                    id: 'rubika' as MessengerId,
                                    label: 'روبیکا',
                                    activeClass:
                                      'bg-[#6D28D9] border-[#6D28D9] text-white',
                                  },
                                ]
                              ).map((mItem) => {
                                const resolvedCfg = getProductMessengerConfig(
                                  prod,
                                  catalogState.groups,
                                  catalogState.elements.productPage.messengers
                                );
                                const isActive = resolvedCfg[mItem.id];
                                return (
                                  <button
                                    key={mItem.id}
                                    type="button"
                                    onClick={() => {
                                      const nextState =
                                        setProductMessengerEnabledInState(
                                          catalogState,
                                          prod.id,
                                          mItem.id,
                                          !isActive
                                        );
                                      onUpdateState(nextState);
                                    }}
                                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer ${
                                      isActive
                                        ? mItem.activeClass
                                        : 'bg-[#F5F2EB] border-[#D8CFC0] text-[#A8A29E] line-through'
                                    }`}
                                  >
                                    {mItem.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Detailed Single Product Editor */
                <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F0EAE0]">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingProductId(null)}
                        className="px-3 py-1.5 rounded-xl bg-[#F5F2EB] hover:bg-[#E7E0D2] text-xs font-bold text-[#1C1917] cursor-pointer"
                      >
                        → بازگشت به لیست محصولات
                      </button>
                      <h3 className="text-sm sm:text-base font-black text-[#92400E]">
                        ویرایش محصول: {editingProduct.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onNavigateToRoute(`#/p/${editingProduct.id}`);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#FEF3C7] text-[#92400E] text-xs font-bold cursor-pointer"
                      >
                        مشاهده صفحه این محصول در کاتالوگ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(editingProduct.id, editingProduct.name)}
                        className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف این محصول</span>
                      </button>
                    </div>
                  </div>

                  {/* Basic Info Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        نام محصول
                      </label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) =>
                          handleUpdateProduct({ ...editingProduct, name: e.target.value })
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold text-[#1C1917]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        گروه / دسته‌بندی اصلی
                      </label>
                      <select
                        value={editingProduct.groupId}
                        onChange={(e) => {
                          const gId = e.target.value as CategoryId;
                          const gTitle =
                            gId === 'boxes'
                              ? 'انواع جعبه'
                              : gId === 'cartons'
                              ? 'انواع کارتن'
                              : 'انواع ورق کارتن';
                          handleUpdateProduct({
                            ...editingProduct,
                            groupId: gId,
                            groupTitle: gTitle,
                          });
                        }}
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold text-[#1C1917]"
                      >
                        <option value="boxes">جعبه (boxes)</option>
                        <option value="cartons">کارتن (cartons)</option>
                        <option value="sheets">ورق و فلوت (sheets)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        کد استاندارد / فنی (Technical Code)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={editingProduct.technicalCode}
                        onChange={(e) =>
                          handleUpdateProduct({
                            ...editingProduct,
                            technicalCode: e.target.value,
                          })
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-mono-tech text-[#1C1917]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        برچسب بالای عنوان (Badge)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.badgeText}
                        onChange={(e) =>
                          handleUpdateProduct({
                            ...editingProduct,
                            badgeText: e.target.value,
                          })
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs text-[#1C1917]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        متن راهنمای انتخاب تیپ
                      </label>
                      <input
                        type="text"
                        value={editingProduct.variantPromptLabel}
                        onChange={(e) =>
                          handleUpdateProduct({
                            ...editingProduct,
                            variantPromptLabel: e.target.value,
                          })
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs text-[#1C1917]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#92400E] mb-1 flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>شماره مشاوره این محصول (واتساپ، ایتا، روبیکا)</span>
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={
                          editingProduct.whatsappNumber ??
                          catalogState.elements.contactPage.whatsappNumber
                        }
                        onChange={(e) =>
                          handleUpdateProduct({
                            ...editingProduct,
                            whatsappNumber: e.target.value,
                          })
                        }
                        placeholder="09396410276 یا 989396410276"
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] focus:border-[#B45309] rounded-xl px-3 py-2 text-xs font-mono-tech font-bold text-[#1C1917]"
                      />
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10.5px] font-bold text-[#57534E]">
                          پیام‌رسان‌های فعال:
                        </span>
                        {(
                          [
                            {
                              id: 'whatsapp' as MessengerId,
                              label: 'واتساپ',
                              activeClass:
                                'bg-[#15803D] border-[#15803D] text-white',
                            },
                            {
                              id: 'eitaa' as MessengerId,
                              label: 'ایتا',
                              activeClass:
                                'bg-[#EA580C] border-[#EA580C] text-white',
                            },
                            {
                              id: 'rubika' as MessengerId,
                              label: 'روبیکا',
                              activeClass:
                                'bg-[#6D28D9] border-[#6D28D9] text-white',
                            },
                          ]
                        ).map((mItem) => {
                          const resolvedCfg = getProductMessengerConfig(
                            editingProduct,
                            catalogState.groups,
                            catalogState.elements.productPage.messengers
                          );
                          const isActive = resolvedCfg[mItem.id];
                          return (
                            <button
                              key={mItem.id}
                              type="button"
                              onClick={() => {
                                const nextState =
                                  setProductMessengerEnabledInState(
                                    catalogState,
                                    editingProduct.id,
                                    mItem.id,
                                    !isActive
                                  );
                                onUpdateState(nextState);
                              }}
                              className={`px-2.5 py-1 rounded-lg border text-[10.5px] font-extrabold transition-colors cursor-pointer ${
                                isActive
                                  ? mItem.activeClass
                                  : 'bg-[#F5F2EB] border-[#D8CFC0] text-[#A8A29E] line-through'
                              }`}
                            >
                              {mItem.label}: {isActive ? 'فعال' : 'غیرفعال'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Product Sample Image & Schematic Image Sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Product Sample Image Section */}
                    <div className="bg-[#FAF8F3] border border-[#E5DEC9] rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#92400E] flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4" />
                          <span>تصویر نمونه محصول (آپلود مستقیم یا لینک تصویر)</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <img
                          src={editingProduct.image}
                          alt={editingProduct.name}
                          className="w-24 h-24 rounded-2xl object-cover border border-[#D8CFC0] bg-white shrink-0"
                        />
                        <div className="flex-1 min-w-[200px] space-y-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="px-3.5 py-2 rounded-xl bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                              <Upload className="w-3.5 h-3.5" />
                              <span>آپلود تصویر نمونه</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileUpload(e.target.files?.[0], (dataUrl) =>
                                    handleUpdateProduct({ ...editingProduct, image: dataUrl })
                                  )
                                }
                              />
                            </label>

                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleUpdateProduct({
                                    ...editingProduct,
                                    image: e.target.value,
                                  });
                                }
                              }}
                              className="bg-white border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C1917]"
                            >
                              <option value="">انتخاب از تصاویر پیش‌فرض...</option>
                              {PRESET_IMAGES.map((img, i) => (
                                <option key={i} value={img.url}>
                                  {img.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <input
                            type="text"
                            dir="ltr"
                            value={editingProduct.image}
                            onChange={(e) =>
                              handleUpdateProduct({ ...editingProduct, image: e.target.value })
                            }
                            placeholder="آدرس تصویر نمونه (URL یا مسیر فایل)..."
                            className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-mono-tech text-[#1C1917]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Product Schematic Image Section */}
                    <div className="bg-[#FAF8F3] border border-[#E5DEC9] rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-[#92400E] flex items-center gap-1.5">
                          <Layers className="w-4 h-4" />
                          <span>تصویر شماتیک فنی محصول (آپلود مستقیم یا لینک تصویر)</span>
                        </span>
                        {editingProduct.schematicImage && (
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateProduct({
                                ...editingProduct,
                                schematicImage: undefined,
                              })
                            }
                            className="text-[11px] font-bold text-[#78716C] hover:text-red-700 flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>بازگردانی شماتیک پیش‌فرض</span>
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#D8CFC0] bg-white shrink-0 flex items-center justify-center">
                          {editingProduct.schematicImage ? (
                            <img
                              src={editingProduct.schematicImage}
                              alt={`شماتیک ${editingProduct.name}`}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <ProductDiagram
                              diagramType={editingProduct.diagramType}
                              compact
                              enableHoverZoom={false}
                              className="w-full h-full border-0 rounded-none"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-[200px] space-y-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="px-3.5 py-2 rounded-xl bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                              <Upload className="w-3.5 h-3.5" />
                              <span>آپلود تصویر شماتیک</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileUpload(e.target.files?.[0], (dataUrl) =>
                                    handleUpdateProduct({
                                      ...editingProduct,
                                      schematicImage: dataUrl,
                                    })
                                  )
                                }
                              />
                            </label>

                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleUpdateProduct({
                                    ...editingProduct,
                                    schematicImage: e.target.value,
                                  });
                                }
                              }}
                              className="bg-white border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C1917]"
                            >
                              <option value="">انتخاب از تصاویر پیش‌فرض...</option>
                              {PRESET_IMAGES.map((img, i) => (
                                <option key={i} value={img.url}>
                                  {img.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <input
                            type="text"
                            dir="ltr"
                            value={editingProduct.schematicImage || ''}
                            onChange={(e) =>
                              handleUpdateProduct({
                                ...editingProduct,
                                schematicImage: e.target.value || undefined,
                              })
                            }
                            placeholder="آدرس تصویر شماتیک دلخواه (خالی = شماتیک برداری پیش‌فرض)..."
                            className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-mono-tech text-[#1C1917]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description & Technical Lists */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        توضیحات معرفی و مهندسی ساختار
                      </label>
                      <textarea
                        rows={2}
                        value={editingProduct.description}
                        onChange={(e) =>
                          handleUpdateProduct({
                            ...editingProduct,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs leading-relaxed text-[#1C1917]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#44403C] mb-1">
                          ویژگی‌های فنی (هر خط یک مورد)
                        </label>
                        <textarea
                          rows={3}
                          value={editingProduct.structuralFeatures.join('\n')}
                          onChange={(e) =>
                            handleUpdateProduct({
                              ...editingProduct,
                              structuralFeatures: e.target.value
                                .split('\n')
                                .filter((s) => s.trim().length > 0),
                            })
                          }
                          className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs text-[#1C1917]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#44403C] mb-1">
                          کاربردها در صنایع (هر خط یک مورد)
                        </label>
                        <textarea
                          rows={3}
                          value={editingProduct.applications.join('\n')}
                          onChange={(e) =>
                            handleUpdateProduct({
                              ...editingProduct,
                              applications: e.target.value
                                .split('\n')
                                .filter((s) => s.trim().length > 0),
                            })
                          }
                          className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs text-[#1C1917]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#44403C] mb-1">
                          ترکیب لایه‌ها و کاغذ (هر خط یک مورد)
                        </label>
                        <textarea
                          rows={3}
                          value={editingProduct.paperCombinations.join('\n')}
                          onChange={(e) =>
                            handleUpdateProduct({
                              ...editingProduct,
                              paperCombinations: e.target.value
                                .split('\n')
                                .filter((s) => s.trim().length > 0),
                            })
                          }
                          className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs text-[#1C1917]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Variants Editor */}
                  <div className="space-y-3 pt-2 border-t border-[#F0EAE0]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-black text-[#92400E]">
                        تیپ‌ها و مشخصات فنی ({toPersianDigits(editingProduct.variants.length)} تیپ)
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newVar: ProductVariant = {
                            id: `var-${Date.now()}`,
                            label: `تیپ ${toPersianDigits(editingProduct.variants.length + 1)}`,
                            subLabel: 'مشخصات سفارشی',
                            unitBasePriceToman: 20000,
                            specs: {
                              grammage: '۴۸۰ گرم بر مترمربع',
                              thickness: '۳.۰ میلی‌متر',
                              weightCapacity: '۸ کیلوگرم',
                              dimensions: '۳۰۰×۲۰۰×۲۰۰',
                              printType: 'چاپ اختصاصی',
                              minOrder: '۱٬۰۰۰ عدد',
                              jointType: 'اتصال استاندارد',
                            },
                          };
                          handleUpdateProduct({
                            ...editingProduct,
                            variants: [...editingProduct.variants, newVar],
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#92400E] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن تیپ جدید</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {editingProduct.variants.map((variant, vIdx) => {
                        const isVariantEnabled = variant.enabled !== false;
                        const isSubLabelVisible = variant.showSubLabel !== false;
                        return (
                        <div
                          key={variant.id}
                          className={`bg-[#FAF8F3] border rounded-2xl p-3.5 space-y-3 transition-opacity ${
                            isVariantEnabled
                              ? 'border-[#E5DEC9]'
                              : 'border-[#D8CFC0] opacity-75'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-extrabold text-[#92400E]">
                                تیپ شماره {toPersianDigits(vIdx + 1)}: {variant.label}
                              </span>
                              <FieldVisibilitySwitch
                                size="md"
                                checked={isVariantEnabled}
                                onLabel="نمایش تیپ: روشن"
                                offLabel="نمایش تیپ: خاموش"
                                ariaLabel={`وضعیت نمایش تیپ ${variant.label}`}
                                onChange={(nextEnabled) => {
                                  const nextVars = [...editingProduct.variants];
                                  nextVars[vIdx] = {
                                    ...variant,
                                    enabled: nextEnabled,
                                  };
                                  handleUpdateProduct({
                                    ...editingProduct,
                                    variants: nextVars,
                                  });
                                }}
                              />
                            </div>
                            {editingProduct.variants.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateProduct({
                                    ...editingProduct,
                                    variants: editingProduct.variants.filter(
                                      (v) => v.id !== variant.id
                                    ),
                                  })
                                }
                                className="text-xs font-bold text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف تیپ</span>
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                            <div>
                              <label className="block text-[11px] font-bold text-[#57534E] mb-0.5">
                                عنوان دکمه تیپ
                              </label>
                              <input
                                type="text"
                                value={variant.label}
                                onChange={(e) => {
                                  const nextVars = [...editingProduct.variants];
                                  nextVars[vIdx] = { ...variant, label: e.target.value };
                                  handleUpdateProduct({ ...editingProduct, variants: nextVars });
                                }}
                                className="w-full bg-white border border-[#D8CFC0] rounded-lg px-2.5 py-1.5 text-xs font-bold"
                              />
                            </div>
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <label className="block text-[11px] font-bold text-[#57534E]">
                                  زیرعنوان دکمه تیپ
                                </label>
                                <FieldVisibilitySwitch
                                  checked={isSubLabelVisible}
                                  ariaLabel={`وضعیت نمایش زیرعنوان ${variant.label}`}
                                  onChange={(nextVisible) => {
                                    const nextVars = [...editingProduct.variants];
                                    nextVars[vIdx] = {
                                      ...variant,
                                      showSubLabel: nextVisible,
                                    };
                                    handleUpdateProduct({
                                      ...editingProduct,
                                      variants: nextVars,
                                    });
                                  }}
                                />
                              </div>
                              <input
                                type="text"
                                value={variant.subLabel}
                                onChange={(e) => {
                                  const nextVars = [...editingProduct.variants];
                                  nextVars[vIdx] = { ...variant, subLabel: e.target.value };
                                  handleUpdateProduct({ ...editingProduct, variants: nextVars });
                                }}
                                className={`w-full border border-[#D8CFC0] rounded-lg px-2.5 py-1.5 text-xs transition-opacity ${
                                  isSubLabelVisible
                                    ? 'bg-white text-[#1C1917]'
                                    : 'bg-[#F5F2EB] text-[#78716C] opacity-55'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-[#57534E] mb-0.5">
                                قیمت پایه واحد (تومان)
                              </label>
                              <input
                                type="number"
                                value={variant.unitBasePriceToman}
                                onChange={(e) => {
                                  const nextVars = [...editingProduct.variants];
                                  nextVars[vIdx] = {
                                    ...variant,
                                    unitBasePriceToman: Number(e.target.value) || 0,
                                  };
                                  handleUpdateProduct({ ...editingProduct, variants: nextVars });
                                }}
                                className="w-full bg-white border border-[#D8CFC0] rounded-lg px-2.5 py-1.5 text-xs font-bold tabular-nums"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 pt-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-[11px] font-extrabold text-[#57534E]">
                                مشخصات فنی این تیپ (خاموش یا روشن کردن نمایش هر مورد):
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextVisibility = Object.fromEntries(
                                      ALL_SPEC_FIELD_KEYS.map((k) => [k, true])
                                    ) as Record<SpecFieldKey, boolean>;
                                    const nextVars = [...editingProduct.variants];
                                    nextVars[vIdx] = {
                                      ...variant,
                                      specsVisibility: nextVisibility,
                                    };
                                    handleUpdateProduct({
                                      ...editingProduct,
                                      variants: nextVars,
                                    });
                                  }}
                                  className="px-2 py-0.5 rounded-lg bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] text-[10px] font-bold cursor-pointer"
                                >
                                  روشن کردن همه
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextVisibility = Object.fromEntries(
                                      ALL_SPEC_FIELD_KEYS.map((k) => [k, false])
                                    ) as Record<SpecFieldKey, boolean>;
                                    const nextVars = [...editingProduct.variants];
                                    nextVars[vIdx] = {
                                      ...variant,
                                      specsVisibility: nextVisibility,
                                    };
                                    handleUpdateProduct({
                                      ...editingProduct,
                                      variants: nextVars,
                                    });
                                  }}
                                  className="px-2 py-0.5 rounded-lg bg-[#F5F2EB] hover:bg-[#E7E0D2] text-[#57534E] text-[10px] font-bold cursor-pointer"
                                >
                                  خاموش کردن همه
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                              {(
                                [
                                  ['grammage', 'گرماژ / ترکیب کاغذ'],
                                  ['thickness', 'ضخامت ورق'],
                                  ['weightCapacity', 'تحمل وزن / مقاومت'],
                                  ['dimensions', 'ابعاد استاندارد'],
                                  ['printType', 'نوع چاپ و خدمات'],
                                  ['minOrder', 'حداقل تیراژ سفارش'],
                                  ['jointType', 'ساختار و نحوه اتصال'],
                                ] as const
                              ).map(([specKey, specLabel]) => {
                                const isSpecOn = isVariantSpecVisible(variant, specKey);
                                return (
                                  <div
                                    key={specKey}
                                    className={
                                      specKey === 'jointType' ? 'sm:col-span-2' : ''
                                    }
                                  >
                                    <div className="flex items-center justify-between gap-1 mb-0.5">
                                      <label className="block text-[10px] font-semibold text-[#78716C] truncate">
                                        {specLabel}
                                      </label>
                                      <FieldVisibilitySwitch
                                        checked={isSpecOn}
                                        ariaLabel={`وضعیت نمایش ${specLabel} برای ${variant.label}`}
                                        onChange={(nextOn) => {
                                          const nextVars = [...editingProduct.variants];
                                          nextVars[vIdx] = {
                                            ...variant,
                                            specsVisibility: {
                                              ...(variant.specsVisibility || {}),
                                              [specKey]: nextOn,
                                            },
                                          };
                                          handleUpdateProduct({
                                            ...editingProduct,
                                            variants: nextVars,
                                          });
                                        }}
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      value={variant.specs[specKey]}
                                      onChange={(e) => {
                                        const nextVars = [...editingProduct.variants];
                                        nextVars[vIdx] = {
                                          ...variant,
                                          specs: {
                                            ...variant.specs,
                                            [specKey]: e.target.value,
                                          },
                                        };
                                        handleUpdateProduct({
                                          ...editingProduct,
                                          variants: nextVars,
                                        });
                                      }}
                                      className={`w-full border border-[#D8CFC0] rounded-lg px-2.5 py-1.5 text-xs transition-opacity ${
                                        isSpecOn
                                          ? 'bg-white text-[#1C1917]'
                                          : 'bg-[#F5F2EB] text-[#78716C] opacity-55'
                                      }`}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Per-Variant Sample Image & Schematic Image Controls */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-2 border-t border-[#E5DEC9]">
                            {/* Variant Sample Image */}
                            <div className="bg-white border border-[#E5DEC9] rounded-xl p-3 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-extrabold text-[#92400E] flex items-center gap-1">
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  <span>تصویر نمونه اصلی این تیپ ({variant.label})</span>
                                </span>
                                {variant.image && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextVars = [...editingProduct.variants];
                                      nextVars[vIdx] = {
                                        ...variant,
                                        image: undefined,
                                      };
                                      handleUpdateProduct({
                                        ...editingProduct,
                                        variants: nextVars,
                                      });
                                    }}
                                    className="text-[10px] font-bold text-[#78716C] hover:text-red-700 flex items-center gap-1 cursor-pointer"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>تصویر پیش‌فرض محصول</span>
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <img
                                  src={variant.image || editingProduct.image}
                                  alt={`نمونه ${variant.label}`}
                                  className="w-16 h-16 rounded-xl object-cover border border-[#D8CFC0] bg-[#FAF8F3] shrink-0"
                                />
                                <div className="flex-1 min-w-0 space-y-1.5">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <label className="px-2.5 py-1.5 rounded-lg bg-[#92400E] hover:bg-[#78350F] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                                      <Upload className="w-3 h-3" />
                                      <span>آپلود تصویر نمونه این تیپ</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                          handleFileUpload(
                                            e.target.files?.[0],
                                            (dataUrl) => {
                                              const nextVars = [
                                                ...editingProduct.variants,
                                              ];
                                              nextVars[vIdx] = {
                                                ...variant,
                                              image: dataUrl,
                                              };
                                              handleUpdateProduct({
                                                ...editingProduct,
                                                variants: nextVars,
                                              });
                                            }
                                          )
                                        }
                                      />
                                    </label>
                                  </div>
                                  <input
                                    type="text"
                                    dir="ltr"
                                    value={variant.image || ''}
                                    onChange={(e) => {
                                      const nextVars = [...editingProduct.variants];
                                      nextVars[vIdx] = {
                                        ...variant,
                                        image: e.target.value || undefined,
                                      };
                                      handleUpdateProduct({
                                        ...editingProduct,
                                        variants: nextVars,
                                      });
                                    }}
                                    placeholder="لینک تصویر نمونه اختصاصی این تیپ (خالی = تصویر کلی محصول)..."
                                    className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-lg px-2.5 py-1 text-[11px] font-mono-tech text-[#1C1917]"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Variant Schematic Image */}
                            <div className="bg-white border border-[#E5DEC9] rounded-xl p-3 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-extrabold text-[#92400E] flex items-center gap-1">
                                  <Layers className="w-3.5 h-3.5" />
                                  <span>تصویر شماتیک فنی این تیپ ({variant.label})</span>
                                </span>
                                {variant.schematicImage && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextVars = [...editingProduct.variants];
                                      nextVars[vIdx] = {
                                        ...variant,
                                        schematicImage: undefined,
                                      };
                                      handleUpdateProduct({
                                        ...editingProduct,
                                        variants: nextVars,
                                      });
                                    }}
                                    className="text-[10px] font-bold text-[#78716C] hover:text-red-700 flex items-center gap-1 cursor-pointer"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>شماتیک پیش‌فرض محصول</span>
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#D8CFC0] bg-[#FAF8F3] shrink-0 flex items-center justify-center">
                                  {variant.schematicImage ||
                                  editingProduct.schematicImage ? (
                                    <img
                                      src={
                                        variant.schematicImage ||
                                        editingProduct.schematicImage
                                      }
                                      alt={`شماتیک ${variant.label}`}
                                      className="w-full h-full object-contain p-1"
                                    />
                                  ) : (
                                    <ProductDiagram
                                      diagramType={editingProduct.diagramType}
                                      compact
                                      enableHoverZoom={false}
                                      className="w-full h-full border-0 rounded-none"
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1.5">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <label className="px-2.5 py-1.5 rounded-lg bg-[#92400E] hover:bg-[#78350F] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                                      <Upload className="w-3 h-3" />
                                      <span>آپلود شماتیک این تیپ</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                          handleFileUpload(
                                            e.target.files?.[0],
                                            (dataUrl) => {
                                              const nextVars = [
                                                ...editingProduct.variants,
                                              ];
                                              nextVars[vIdx] = {
                                                ...variant,
                                                schematicImage: dataUrl,
                                              };
                                              handleUpdateProduct({
                                                ...editingProduct,
                                                variants: nextVars,
                                              });
                                            }
                                          )
                                        }
                                      />
                                    </label>
                                  </div>
                                  <input
                                    type="text"
                                    dir="ltr"
                                    value={variant.schematicImage || ''}
                                    onChange={(e) => {
                                      const nextVars = [...editingProduct.variants];
                                      nextVars[vIdx] = {
                                        ...variant,
                                        schematicImage:
                                          e.target.value || undefined,
                                      };
                                      handleUpdateProduct({
                                        ...editingProduct,
                                        variants: nextVars,
                                      });
                                    }}
                                    placeholder="لینک تصویر شماتیک اختصاصی این تیپ (خالی = شماتیک کلی محصول)..."
                                    className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-lg px-2.5 py-1 text-[11px] font-mono-tech text-[#1C1917]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 2: ALL PAGE ELEMENTS ==================== */}
          {mainTab === 'pages' && (
            <div className="space-y-4">
              {/* Sub-tabs for each page of the catalog */}
              <div className="flex flex-wrap items-center gap-1.5 bg-white p-2 rounded-2xl border border-[#E5DEC9]">
                {(
                  [
                    { id: 'cover', label: '۱. صفحه جلد (Cover)' },
                    { id: 'menu', label: '۲. صفحه فهرست (Menu)' },
                    { id: 'groups', label: '۳. صفحه دسته‌بندی‌ها' },
                    { id: 'product-template', label: '۴. عناصر صفحه محصول' },
                    { id: 'about', label: '۵. صفحه درباره ما و افتخارات' },
                    { id: 'contact', label: '۶. صفحه تماس با ما و واحدها' },
                    { id: 'header', label: '۷. هدر و لوگو سراسری' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPageSubTab(t.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      pageSubTab === t.id
                        ? 'bg-[#FEF3C7] text-[#92400E] border border-[#D97706]'
                        : 'text-[#57534E] hover:bg-[#FAF8F3]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* 1. COVER PAGE ELEMENTS */}
              {pageSubTab === 'cover' && (
                <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
                    <h3 className="text-sm font-black text-[#92400E]">
                      مدیریت کامل عناصر صفحه جلد (#/cover)
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateToRoute('#/cover');
                        onClose();
                      }}
                      className="text-xs font-bold text-[#92400E] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>مشاهده صفحه جلد</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      تیتر اصلی صفحه جلد (h2)
                    </label>
                    <input
                      type="text"
                      value={catalogState.elements.cover.heroTitle}
                      onChange={(e) =>
                        updateElements((el) => ({
                          ...el,
                          cover: { ...el.cover, heroTitle: e.target.value },
                        }))
                      }
                      className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1C1917]"
                    />
                  </div>

                  {/* Cover Hero Image */}
                  <div className="bg-[#FAF8F3] border border-[#E5DEC9] rounded-2xl p-4 space-y-2.5">
                    <label className="block text-xs font-bold text-[#92400E]">
                      تصویر اصلی صفحه جلد (Hero Image)
                    </label>
                    <div className="flex flex-wrap items-center gap-4">
                      <img
                        src={catalogState.elements.cover.heroImage}
                        alt="تصویر جلد"
                        className="w-32 h-20 rounded-xl object-cover border border-[#D8CFC0]"
                      />
                      <div className="flex-1 min-w-[200px] space-y-2">
                        <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#92400E] text-white text-xs font-bold cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>آپلود تصویر جلد از سیستم</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e.target.files?.[0], (url) =>
                                updateElements((el) => ({
                                  ...el,
                                  cover: { ...el.cover, heroImage: url },
                                }))
                              )
                            }
                          />
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={catalogState.elements.cover.heroImage}
                          onChange={(e) =>
                            updateElements((el) => ({
                              ...el,
                              cover: { ...el.cover, heroImage: e.target.value },
                            }))
                          }
                          className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-mono-tech"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        بج سمت راست روی تصویر جلد
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.cover.badgeRight}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            cover: { ...el.cover, badgeRight: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        بج سمت چپ روی تصویر جلد
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={catalogState.elements.cover.badgeLeft}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            cover: { ...el.cover, badgeLeft: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-mono-tech"
                      />
                    </div>
                  </div>

                  {/* 4 Feature Pills on Cover */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[#44403C]">
                        کارت‌های ویژگی صفحه جلد (۴ کارت ۲×۲)
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          updateElements((el) => ({
                            ...el,
                            cover: {
                              ...el.cover,
                              features: [...el.cover.features, 'ویژگی جدید کارتن محمد'],
                            },
                          }))
                        }
                        className="px-2.5 py-1 rounded-lg bg-[#FEF3C7] text-[#92400E] text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن کارت ویژگی</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {catalogState.elements.cover.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => {
                              const next = [...catalogState.elements.cover.features];
                              next[idx] = e.target.value;
                              updateElements((el) => ({
                                ...el,
                                cover: { ...el.cover, features: next },
                              }));
                            }}
                            className="flex-1 bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateElements((el) => ({
                                ...el,
                                cover: {
                                  ...el.cover,
                                  features: el.cover.features.filter((_, i) => i !== idx),
                                },
                              }))
                            }
                            aria-label="حذف ویژگی"
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cover CTA Buttons & Copyright */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        متن دکمه اصلی (شروع کاتالوگ)
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.cover.startButtonText}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            cover: { ...el.cover, startButtonText: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        متن دکمه درباره ما
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.cover.aboutButtonText}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            cover: { ...el.cover, aboutButtonText: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        متن دکمه تماس با ما
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.cover.contactButtonText}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            cover: { ...el.cover, contactButtonText: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      متن کپی‌رایت پایین صفحه جلد
                    </label>
                    <input
                      type="text"
                      value={catalogState.elements.cover.copyrightText}
                      onChange={(e) =>
                        updateElements((el) => ({
                          ...el,
                          cover: { ...el.cover, copyrightText: e.target.value },
                        }))
                      }
                      className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* 2. MENU PAGE ELEMENTS */}
              {pageSubTab === 'menu' && (
                <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
                    <h3 className="text-sm font-black text-[#92400E]">
                      مدیریت عناصر صفحه فهرست (#/menu)
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateToRoute('#/menu');
                        onClose();
                      }}
                      className="text-xs font-bold text-[#92400E] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>مشاهده صفحه فهرست</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      متن راهنمای بالای دکمه‌ها
                    </label>
                    <input
                      type="text"
                      value={catalogState.elements.menu.promptText}
                      onChange={(e) =>
                        updateElements((el) => ({
                          ...el,
                          menu: { ...el.menu, promptText: e.target.value },
                        }))
                      }
                      className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#FAF8F3] p-3 rounded-xl border border-[#E5DEC9] space-y-2">
                      <label className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
                        <span>دکمه درباره ما</span>
                        <input
                          type="checkbox"
                          checked={catalogState.elements.menu.showAbout}
                          onChange={(e) =>
                            updateElements((el) => ({
                              ...el,
                              menu: { ...el.menu, showAbout: e.target.checked },
                            }))
                          }
                          className="accent-[#B45309] w-4 h-4"
                        />
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.menu.aboutLabel}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            menu: { ...el.menu, aboutLabel: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-[#D8CFC0] rounded-lg px-3 py-1.5 text-xs font-bold"
                      />
                    </div>

                    <div className="bg-[#FAF8F3] p-3 rounded-xl border border-[#E5DEC9] space-y-2">
                      <label className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
                        <span>دکمه محصولات</span>
                        <input
                          type="checkbox"
                          checked={catalogState.elements.menu.showProducts}
                          onChange={(e) =>
                            updateElements((el) => ({
                              ...el,
                              menu: { ...el.menu, showProducts: e.target.checked },
                            }))
                          }
                          className="accent-[#B45309] w-4 h-4"
                        />
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.menu.productsLabel}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            menu: { ...el.menu, productsLabel: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-[#D8CFC0] rounded-lg px-3 py-1.5 text-xs font-bold"
                      />
                    </div>

                    <div className="bg-[#FAF8F3] p-3 rounded-xl border border-[#E5DEC9] space-y-2">
                      <label className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
                        <span>دکمه جست‌وجوی محصول</span>
                        <input
                          type="checkbox"
                          checked={catalogState.elements.menu.showSearch}
                          onChange={(e) =>
                            updateElements((el) => ({
                              ...el,
                              menu: { ...el.menu, showSearch: e.target.checked },
                            }))
                          }
                          className="accent-[#B45309] w-4 h-4"
                        />
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.menu.searchLabel}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            menu: { ...el.menu, searchLabel: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-[#D8CFC0] rounded-lg px-3 py-1.5 text-xs font-bold"
                      />
                    </div>

                    <div className="bg-[#FAF8F3] p-3 rounded-xl border border-[#E5DEC9] space-y-2">
                      <label className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
                        <span>دکمه تماس با ما</span>
                        <input
                          type="checkbox"
                          checked={catalogState.elements.menu.showContact}
                          onChange={(e) =>
                            updateElements((el) => ({
                              ...el,
                              menu: { ...el.menu, showContact: e.target.checked },
                            }))
                          }
                          className="accent-[#B45309] w-4 h-4"
                        />
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.menu.contactLabel}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            menu: { ...el.menu, contactLabel: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-[#D8CFC0] rounded-lg px-3 py-1.5 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      متن فوتر پایین صفحه فهرست
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={catalogState.elements.menu.footerText}
                      onChange={(e) =>
                        updateElements((el) => ({
                          ...el,
                          menu: { ...el.menu, footerText: e.target.value },
                        }))
                      }
                      className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-mono-tech"
                    />
                  </div>
                </div>
              )}

              {/* 3. GROUPS PAGE & 3 CATEGORIES */}
              {pageSubTab === 'groups' && (
                <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
                    <h3 className="text-sm font-black text-[#92400E]">
                      مدیریت صفحه دسته‌بندی‌ها و ۳ گروه اصلی (#/groups/1)
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateToRoute('#/groups/1');
                        onClose();
                      }}
                      className="text-xs font-bold text-[#92400E] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>مشاهده صفحه دسته‌بندی‌ها</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        عنوان صفحه دسته‌بندی‌ها
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.groupsPage.title}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            groupsPage: { ...el.groupsPage, title: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        متن دکمه روی کارت گروه‌ها
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.groupsPage.ctaButtonText}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            groupsPage: { ...el.groupsPage, ctaButtonText: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        متن فوتر پایین صفحه گروه‌ها
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.groupsPage.footerText}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            groupsPage: { ...el.groupsPage, footerText: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  {/* Edit Each of the 3 Product Groups */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-extrabold text-[#92400E]">
                      ویرایش عنوان و تصویر ۳ گروه اصلی محصولات:
                    </h4>
                    {catalogState.groups.map((grp, gIdx) => (
                      <div
                        key={grp.id}
                        className="bg-[#FAF8F3] border border-[#E5DEC9] rounded-2xl p-3.5 flex flex-wrap items-center gap-4"
                      >
                        <img
                          src={grp.image}
                          alt={grp.title}
                          className="w-20 h-20 rounded-xl object-cover border border-[#D8CFC0] bg-white shrink-0"
                        />
                        <div className="flex-1 min-w-[220px] space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-[#57534E] mb-0.5">
                                عنوان گروه
                              </label>
                              <input
                                type="text"
                                value={grp.title}
                                onChange={(e) => {
                                  const nextGroups = [...catalogState.groups];
                                  nextGroups[gIdx] = { ...grp, title: e.target.value };
                                  onUpdateState({ ...catalogState, groups: nextGroups });
                                }}
                                className="w-full bg-white border border-[#D8CFC0] rounded-lg px-2.5 py-1.5 text-xs font-bold"
                              />
                            </div>
                            <div className="flex items-end gap-2">
                              <label className="px-3 py-1.5 rounded-lg bg-[#92400E] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                                <Upload className="w-3.5 h-3.5" />
                                <span>آپلود تصویر گروه</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(e.target.files?.[0], (url) => {
                                      const nextGroups = [...catalogState.groups];
                                      nextGroups[gIdx] = { ...grp, image: url };
                                      onUpdateState({ ...catalogState, groups: nextGroups });
                                    })
                                  }
                                />
                              </label>
                            </div>
                          </div>
                          <input
                            type="text"
                            dir="ltr"
                            value={grp.image}
                            onChange={(e) => {
                              const nextGroups = [...catalogState.groups];
                              nextGroups[gIdx] = { ...grp, image: e.target.value };
                              onUpdateState({ ...catalogState, groups: nextGroups });
                            }}
                            className="w-full bg-white border border-[#D8CFC0] rounded-lg px-2.5 py-1.5 text-xs font-mono-tech"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. PRODUCT DETAIL PAGE TEMPLATE ELEMENTS */}
              {pageSubTab === 'product-template' && (
                <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-black text-[#92400E] border-b border-[#F0EAE0] pb-3">
                    مدیریت برچسب‌ها و دکمه‌های صفحات محصول
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#57534E] mb-1">
                        دکمه شماتیک فنی
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.productPage.diagramTabLabel}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            productPage: { ...el.productPage, diagramTabLabel: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#57534E] mb-1">
                        دکمه تصویر نمونه
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.productPage.photoTabLabel}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            productPage: { ...el.productPage, photoTabLabel: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#57534E] mb-1">
                        دکمه ثبت سفارش
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.productPage.orderButtonText}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            productPage: { ...el.productPage, orderButtonText: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#57534E] mb-1">
                        دکمه درخواست مشاوره
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.productPage.consultButtonText}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            productPage: { ...el.productPage, consultButtonText: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                  </div>

                  {/* Messenger Activation Switches inside Product Template Tab */}
                  <div className="bg-[#FAF8F3] border border-[#E5DEC9] rounded-xl p-3.5 space-y-2">
                    <div className="text-xs font-extrabold text-[#92400E]">
                      فعالسازی یا غیرفعالسازی پیام‌رسان‌های «درخواست مشاوره» (واتساپ، ایتا، روبیکا):
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {(
                        [
                          {
                            id: 'whatsapp' as MessengerId,
                            label: 'واتساپ (WhatsApp)',
                            activeBg: 'bg-[#15803D] border-[#15803D] text-white',
                          },
                          {
                            id: 'eitaa' as MessengerId,
                            label: 'ایتا (Eitaa)',
                            activeBg: 'bg-[#EA580C] border-[#EA580C] text-white',
                          },
                          {
                            id: 'rubika' as MessengerId,
                            label: 'روبیکا (Rubika)',
                            activeBg: 'bg-[#6D28D9] border-[#6D28D9] text-white',
                          },
                        ]
                      ).map((item) => {
                        const isEnabled =
                          catalogState.elements.productPage.messengers?.[item.id] ?? true;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              const nextState = setGlobalMessengerEnabledInState(
                                catalogState,
                                item.id,
                                !isEnabled
                              );
                              onUpdateState(nextState);
                            }}
                            className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                              isEnabled
                                ? item.activeBg
                                : 'bg-white border-[#D8CFC0] text-[#78716C]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              readOnly
                              className="w-3.5 h-3.5 accent-white pointer-events-none"
                            />
                            <span>{item.label}:</span>
                            <span>{isEnabled ? 'فعال' : 'غیرفعال'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-xs font-extrabold text-[#92400E] mb-2">
                      عناوین ۷ فیلد جدول مشخصات فنی محصول:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {(
                        [
                          ['grammage', 'فیلد ۱ (گرماژ)'],
                          ['thickness', 'فیلد ۲ (ضخامت)'],
                          ['weightCapacity', 'فیلد ۳ (تحمل وزن)'],
                          ['dimensions', 'فیلد ۴ (ابعاد)'],
                          ['printType', 'فیلد ۵ (چاپ)'],
                          ['minOrder', 'فیلد ۶ (حداقل تیراژ)'],
                          ['jointType', 'فیلد ۷ (نحوه اتصال)'],
                        ] as const
                      ).map(([key, label]) => (
                        <div key={key}>
                          <label className="block text-[10px] font-semibold text-[#78716C] mb-0.5">
                            {label}
                          </label>
                          <input
                            type="text"
                            value={catalogState.elements.productPage.specLabels[key]}
                            onChange={(e) =>
                              updateElements((el) => ({
                                ...el,
                                productPage: {
                                  ...el.productPage,
                                  specLabels: {
                                    ...el.productPage.specLabels,
                                    [key]: e.target.value,
                                  },
                                },
                              }))
                            }
                            className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-lg px-2.5 py-1.5 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. ABOUT PAGE & AWARDS */}
              {pageSubTab === 'about' && (
                <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
                    <h3 className="text-sm font-black text-[#92400E]">
                      مدیریت صفحه درباره ما و تندیس‌های افتخارات (#/about)
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateToRoute('#/about');
                        onClose();
                      }}
                      className="text-xs font-bold text-[#92400E] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>مشاهده صفحه درباره ما</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        عنوان صفحه درباره ما
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.aboutPage.title}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            aboutPage: { ...el.aboutPage, title: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        عنوان بخش افتخارات
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.aboutPage.awardsTitle}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            aboutPage: { ...el.aboutPage, awardsTitle: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        متن لینک پایین صفحه
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.aboutPage.bottomLinkText}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            aboutPage: { ...el.aboutPage, bottomLinkText: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      متن کامل درباره ما
                    </label>
                    <textarea
                      rows={4}
                      value={catalogState.elements.aboutPage.aboutText}
                      onChange={(e) =>
                        updateElements((el) => ({
                          ...el,
                          aboutPage: { ...el.aboutPage, aboutText: e.target.value },
                        }))
                      }
                      className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3.5 py-2.5 text-xs leading-7 text-[#1C1917]"
                    />
                  </div>

                  {/* Awards CRUD */}
                  <div className="space-y-3 pt-2 border-t border-[#F0EAE0]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-[#92400E] flex items-center gap-1.5">
                        <Award className="w-4 h-4" />
                        <span>مدیریت تندیس‌ها و افتخارات ({toPersianDigits(catalogState.awards.length)})</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateState({
                            ...catalogState,
                            awards: [
                              ...catalogState.awards,
                              {
                                year: '۱۴۰۳',
                                title: 'واحد نمونه صنعتی استان خوزستان',
                                image: IMAGES.award1398,
                              },
                            ],
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-[#92400E] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن افتخار جدید</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {catalogState.awards.map((award, aIdx) => (
                        <div
                          key={aIdx}
                          className="bg-[#FAF8F3] border border-[#E5DEC9] rounded-2xl p-3 flex items-center gap-3"
                        >
                          <img
                            src={award.image}
                            alt={award.title}
                            className="w-14 h-20 object-contain bg-white rounded-xl border border-[#E5DEC9] p-1 shrink-0"
                          />
                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={award.year}
                                onChange={(e) => {
                                  const next = [...catalogState.awards];
                                  next[aIdx] = { ...award, year: e.target.value };
                                  onUpdateState({ ...catalogState, awards: next });
                                }}
                                placeholder="سال"
                                className="w-20 bg-white border border-[#D8CFC0] rounded-lg px-2 py-1 text-xs font-bold"
                              />
                              <label className="px-2.5 py-1 rounded-lg bg-[#FEF3C7] text-[#92400E] text-[11px] font-bold cursor-pointer">
                                آپلود عکس
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(e.target.files?.[0], (url) => {
                                      const next = [...catalogState.awards];
                                      next[aIdx] = { ...award, image: url };
                                      onUpdateState({ ...catalogState, awards: next });
                                    })
                                  }
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateState({
                                    ...catalogState,
                                    awards: catalogState.awards.filter((_, i) => i !== aIdx),
                                  })
                                }
                                className="mr-auto text-red-600 hover:text-red-800 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={award.title}
                              onChange={(e) => {
                                const next = [...catalogState.awards];
                                next[aIdx] = { ...award, title: e.target.value };
                                onUpdateState({ ...catalogState, awards: next });
                              }}
                              className="w-full bg-white border border-[#D8CFC0] rounded-lg px-2 py-1 text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. CONTACT PAGE & DEPARTMENTS */}
              {pageSubTab === 'contact' && (
                <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
                    <h3 className="text-sm font-black text-[#92400E]">
                      مدیریت کامل صفحه تماس با ما و واحدها (#/contact)
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateToRoute('#/contact');
                        onClose();
                      }}
                      className="text-xs font-bold text-[#92400E] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>مشاهده صفحه تماس با ما</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        عنوان صفحه تماس با ما
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.contactPage.title}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            contactPage: { ...el.contactPage, title: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        جمله زیر لوگو در صفحه تماس
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.contactPage.subtitle}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            contactPage: { ...el.contactPage, subtitle: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        شماره تماس کارخانه (نمایشی)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={catalogState.elements.contactPage.phoneFormatted}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            contactPage: { ...el.contactPage, phoneFormatted: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        شماره مستقیم واحد فروش
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={catalogState.elements.contactPage.mobileDisplay}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            contactPage: { ...el.contactPage, mobileDisplay: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        آدرس کارخانه و دفتر مرکزی
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.contactPage.address}
                        onChange={(e) =>
                          updateElements((el) => ({
                            ...el,
                            contactPage: { ...el.contactPage, address: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                  </div>

                  {/* Department Contacts Table CRUD */}
                  <div className="space-y-2.5 pt-2 border-t border-[#F0EAE0]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-[#92400E] flex items-center gap-1.5">
                        <Phone className="w-4 h-4" />
                        <span>جدول ارتباط با دیگر واحدها ({toPersianDigits(catalogState.departments.length)} واحد)</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateState({
                            ...catalogState,
                            departments: [
                              ...catalogState.departments,
                              {
                                unit: 'واحد جدید',
                                mobile: '۰۹۳۹۶۴۱۰۲۷۶',
                                mobileTel: '09396410276',
                                ext: '۱۱۰',
                              },
                            ],
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-[#92400E] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن واحد جدید</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {catalogState.departments.map((dept, dIdx) => (
                        <div
                          key={dIdx}
                          className="grid grid-cols-12 gap-2 items-center bg-[#FAF8F3] p-2 rounded-xl border border-[#E5DEC9]"
                        >
                          <input
                            type="text"
                            value={dept.unit}
                            onChange={(e) => {
                              const next = [...catalogState.departments];
                              next[dIdx] = { ...dept, unit: e.target.value };
                              onUpdateState({ ...catalogState, departments: next });
                            }}
                            placeholder="نام واحد"
                            className="col-span-4 bg-white border border-[#D8CFC0] rounded-lg px-2.5 py-1.5 text-xs font-bold"
                          />
                          <input
                            type="text"
                            dir="ltr"
                            value={dept.mobile}
                            onChange={(e) => {
                              const next = [...catalogState.departments];
                              next[dIdx] = {
                                ...dept,
                                mobile: e.target.value,
                                mobileTel: e.target.value,
                              };
                              onUpdateState({ ...catalogState, departments: next });
                            }}
                            placeholder="شماره موبایل"
                            className="col-span-4 bg-white border border-[#D8CFC0] rounded-lg px-2.5 py-1.5 text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={dept.ext}
                            onChange={(e) => {
                              const next = [...catalogState.departments];
                              next[dIdx] = { ...dept, ext: e.target.value };
                              onUpdateState({ ...catalogState, departments: next });
                            }}
                            placeholder="داخلی"
                            className="col-span-3 bg-white border border-[#D8CFC0] rounded-lg px-2.5 py-1.5 text-xs text-center"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateState({
                                ...catalogState,
                                departments: catalogState.departments.filter((_, i) => i !== dIdx),
                              })
                            }
                            className="col-span-1 text-red-600 hover:text-red-800 flex justify-center cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 7. HEADER & LOGO BRANDING */}
              {pageSubTab === 'header' && (
                <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-black text-[#92400E] border-b border-[#F0EAE0] pb-3">
                    مدیریت لوگو و هدر بالای کاتالوگ
                  </h3>

                  <div className="bg-[#FAF8F3] border border-[#E5DEC9] rounded-2xl p-4 flex flex-wrap items-center gap-4">
                    <img
                      src={catalogState.elements.logoUrl}
                      alt="لوگوی شرکت کارتن محمد"
                      className="h-20 w-auto object-contain bg-white p-2 rounded-xl border border-[#D8CFC0]"
                    />
                    <div className="flex-1 min-w-[200px] space-y-2">
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#92400E] text-white text-xs font-bold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>آپلود لوگوی جدید از سیستم</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e.target.files?.[0], (url) =>
                              updateElements((el) => ({ ...el, logoUrl: url }))
                            )
                          }
                        />
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={catalogState.elements.logoUrl}
                        onChange={(e) =>
                          updateElements((el) => ({ ...el, logoUrl: e.target.value }))
                        }
                        className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-mono-tech"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        عنوان نوار ابزار بالای سایت
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.headerTitle}
                        onChange={(e) =>
                          updateElements((el) => ({ ...el, headerTitle: e.target.value }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        زیرعنوان راهنمای نوار ابزار بالا
                      </label>
                      <input
                        type="text"
                        value={catalogState.elements.headerSubtitle}
                        onChange={(e) =>
                          updateElements((el) => ({ ...el, headerSubtitle: e.target.value }))
                        }
                        className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 3: SETTINGS, BACKUP & RESTORE ==================== */}
          {mainTab === 'settings' && (
            <div className="space-y-5">
              {/* Backup & Restore Center */}
              <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0EAE0] pb-3">
                  <div>
                    <h3 className="text-sm font-black text-[#92400E]">
                      پشتیبان‌گیری (گرفتن بکاپ) و بازیابی (وارد کردن بکاپ) کاتالوگ
                    </h3>
                    <p className="text-[11px] text-[#78716C] mt-0.5">
                      شامل تمامی محصولات ({toPersianDigits(catalogState.products.length)} محصول)، تصاویر نمونه و شماتیک، شماره‌های واتساپ، تیپ‌ها و تنظیمات تمام صفحات
                    </p>
                  </div>
                </div>

                {backupError && (
                  <div
                    role="alert"
                    className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold"
                  >
                    {backupError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Export Backup */}
                  <div className="bg-[#FAF8F3] border border-[#E5DEC9] rounded-2xl p-4 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-extrabold text-[#1C1917] flex items-center gap-1.5">
                        <Download className="w-4 h-4 text-[#92400E]" />
                        <span>گرفتن بکاپ از کاتالوگ (خروجی فایل پشتیبان)</span>
                      </div>
                      <p className="text-[11px] text-[#57534E] leading-relaxed">
                        یک فایل پشتیبان کامل با فرمت استاندارد JSON از تمامی اطلاعات فعلی کاتالوگ دانلود کنید تا در هر زمان یا سیستم دیگری بتوانید آن را بازیابی نمایید.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleExportBackup}
                        className="px-4 py-2.5 rounded-xl bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>دانلود فایل بکاپ کاتالوگ (.json)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyBackupJson}
                        className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FFFBEB] border border-[#D8CFC0] text-[#44403C] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#92400E]" />
                        <span>کپی کد بکاپ</span>
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Import Backup */}
                  <div className="bg-[#FAF8F3] border border-[#E5DEC9] rounded-2xl p-4 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-extrabold text-[#1C1917] flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-[#92400E]" />
                        <span>وارد کردن بکاپ به کاتالوگ (بازیابی از فایل)</span>
                      </div>
                      <p className="text-[11px] text-[#57534E] leading-relaxed">
                        فایل پشتیبان (.json) قبلی خود را انتخاب کنید تا تمامی محصولات، تصاویر، شماره‌های واتساپ و تنظیمات صفحات فوراً جایگزین و PDF کاتالوگ نیز آپدیت شود.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <label className="px-4 py-2.5 rounded-xl bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>انتخاب و وارد کردن فایل بکاپ (.json)</span>
                        <input
                          type="file"
                          accept=".json,application/json"
                          className="hidden"
                          onChange={(e) => {
                            handleImportBackupFile(e.target.files?.[0]);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Direct JSON Text Paste / Inspect */}
                <div className="bg-[#FAF8F3] border border-[#E5DEC9] rounded-2xl p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-bold text-[#44403C]">
                      وارد کردن بکاپ از طریق جایگذاری متن (Paste JSON)
                    </label>
                    <button
                      type="button"
                      onClick={() => setBackupTextInput(exportCatalogBackupJson(catalogState))}
                      className="text-[11px] font-bold text-[#92400E] hover:underline cursor-pointer"
                    >
                      نمایش کد JSON بکاپ فعلی در کادر
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    dir="ltr"
                    value={backupTextInput}
                    onChange={(e) => setBackupTextInput(e.target.value)}
                    placeholder='برای بازیابی متنی، محتوای فایل بکاپ JSON را اینجا قرار دهید و دکمه «اعمال بکاپ متنی» را بزنید...'
                    className="w-full bg-white border border-[#D8CFC0] focus:border-[#B45309] rounded-xl px-3 py-2 text-xs font-mono-tech text-[#1C1917] outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleApplyBackupText}
                      className="px-4 py-2 rounded-xl bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-extrabold cursor-pointer transition-colors"
                    >
                      اعمال بکاپ متنی
                    </button>
                  </div>
                </div>
              </div>

              {/* Security & Factory Reset */}
              <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 space-y-5">
                <h3 className="text-sm font-black text-[#92400E] border-b border-[#F0EAE0] pb-3">
                  تنظیمات امنیتی و بازنشانی به حالت پیش‌فرض کارخانه
                </h3>

                <div className="max-w-sm">
                  <label className="block text-xs font-bold text-[#44403C] mb-1">
                    تغییر رمز عبور پنل ادمین
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={catalogState.adminPassword || '1234'}
                    onChange={(e) =>
                      onUpdateState({ ...catalogState, adminPassword: e.target.value })
                    }
                    className="w-full bg-[#FAF8F3] border border-[#D8CFC0] rounded-xl px-3.5 py-2 text-xs font-mono-tech"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#E5DEC9] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-extrabold text-[#1C1917]">
                      بازگردانی کاتالوگ به اطلاعات پیش‌فرض کارخانه
                    </div>
                    <div className="text-[11px] text-[#57534E] mt-0.5">
                      تمامی تغییرات انجام‌شده روی محصولات، تصاویر و متن صفحات به حالت اولیه کارتن محمد بازگردانده می‌شود.
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={async () => {
                      setIsSaving(true);
                      try {
                        const defaults = await onResetState();
                        setDraftCatalogState(defaults);
                        setHasUnsavedChanges(false);
                        setEditingProductId(null);
                        showSavedFeedback('کاتالوگ و نسخه PDF به حالت پیش‌فرض بازنشانی شد');
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>بازنشانی به تنظیمات پیش‌فرض</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Save Bar: Simultaneously updates Web App and Clickable PDF */}
        <div className="px-5 py-3 bg-white border-t border-[#ECE6D8] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            {saveError ? (
              <span className="font-bold text-red-700">{saveError}</span>
            ) : isSaving ? (
              <span className="font-bold text-[#92400E] flex items-center gap-1.5">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>در حال اعمال تغییرات روی اپ و بازسازی نسخه PDF قابل کلیک…</span>
              </span>
            ) : hasUnsavedChanges ? (
              <span className="font-bold text-[#B45309] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse shrink-0" />
                <span>
                  تغییرات ذخیره‌نشده دارید — با زدن «ذخیره تغییرات» همزمان روی اپ و PDF اعمال می‌شود.
                </span>
              </span>
            ) : (
              <span className="font-semibold text-[#15803D] flex items-center gap-1.5">
                <Check className="w-4 h-4 shrink-0" />
                <span>تمامی تغییرات در اپ و نسخه PDF همگام‌سازی و ذخیره شده است.</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasUnsavedChanges && !isSaving && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="px-3.5 py-2 rounded-xl bg-[#F5F2EB] hover:bg-[#E7E0D2] border border-[#D8CFC0] text-xs font-bold text-[#57534E] cursor-pointer transition-colors"
              >
                لغو تغییرات
              </button>
            )}
            <button
              type="button"
              onClick={() => void handleSaveAll()}
              disabled={isSaving}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                isSaving
                  ? 'bg-[#78350F] text-white/90 cursor-wait'
                  : hasUnsavedChanges
                  ? 'bg-[#15803D] hover:bg-[#166534] text-white'
                  : 'bg-[#92400E] hover:bg-[#78350F] text-white'
              }`}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>
                {isSaving ? 'در حال ذخیره در اپ و PDF…' : 'ذخیره تغییرات (اپ و PDF)'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
