import {
  CATALOG_PRODUCTS,
  COMPANY_AWARDS,
  COMPANY_INFO,
  CatalogProduct,
  CategoryId,
  CompanyAward,
  DEPARTMENT_CONTACTS,
  DEFAULT_MESSENGERS,
  DepartmentContact,
  IMAGES,
  MessengerConfig,
  MessengerId,
  PRODUCT_GROUPS,
  ProductGroup,
} from './catalogData';

export interface PageElementsConfig {
  headerTitle: string;
  headerSubtitle: string;
  logoUrl: string;
  cover: {
    heroTitle: string;
    heroImage: string;
    badgeRight: string;
    badgeLeft: string;
    features: string[];
    startButtonText: string;
    aboutButtonText: string;
    contactButtonText: string;
    copyrightText: string;
  };
  menu: {
    promptText: string;
    aboutLabel: string;
    productsLabel: string;
    searchLabel: string;
    contactLabel: string;
    showAbout: boolean;
    showProducts: boolean;
    showSearch: boolean;
    showContact: boolean;
    footerText: string;
  };
  groupsPage: {
    title: string;
    promptText: string;
    ctaButtonText: string;
    footerText: string;
    allGroupsButtonText: string;
    groupDetailHintText: string;
  };
  productPage: {
    diagramTabLabel: string;
    photoTabLabel: string;
    specLabels: {
      grammage: string;
      thickness: string;
      weightCapacity: string;
      dimensions: string;
      printType: string;
      minOrder: string;
      jointType: string;
    };
    orderButtonText: string;
    consultButtonText: string;
    fullTableButtonText: string;
    specsButtonText: string;
    nextButtonText: string;
    prevButtonText: string;
    messengers: MessengerConfig;
  };
  aboutPage: {
    title: string;
    aboutText: string;
    awardsTitle: string;
    bottomLinkText: string;
  };
  contactPage: {
    title: string;
    subtitle: string;
    phoneLabel: string;
    phoneFormatted: string;
    phoneTel: string;
    salesMobileLabel: string;
    mobileDisplay: string;
    mobileTel: string;
    whatsappLabel: string;
    whatsappNumber: string;
    websiteLabel: string;
    website: string;
    websiteUrl: string;
    departmentsTitle: string;
    addressTitle: string;
    address: string;
    mapUrl: string;
    directCallButtonText: string;
  };
}

export interface CatalogCustomState {
  elements: PageElementsConfig;
  groups: ProductGroup[];
  products: CatalogProduct[];
  awards: CompanyAward[];
  departments: DepartmentContact[];
  adminPassword?: string;
}

const STORAGE_KEY = 'mohammad_carton_catalog_state_v1';

export function getDefaultCatalogState(): CatalogCustomState {
  return {
    elements: {
      headerTitle: 'کاتالوگ هوشمند شرکت کارتن محمد',
      headerSubtitle: 'روی دکمه‌های داخل کاتالوگ بزنید',
      logoUrl: IMAGES.logo,
      cover: {
        heroTitle: 'کاتالوگ محصولات شرکت کارتن محمد',
        heroImage: IMAGES.coverHero,
        badgeRight: 'کیفیت صادراتی و صنعتی',
        badgeLeft: 'FEFCO STANDARD',
        features: [
          'تولید سفارشی تیراژ بالا',
          'کاغذ و ورق استاندارد',
          'سبد کامل جعبه و کارتن',
          'ارسال سریع سراسر کشور',
        ],
        startButtonText: 'شروع کاتالوگ',
        aboutButtonText: 'درباره ما',
        contactButtonText: 'تماس با ما',
        copyrightText: '© کلیهٔ محتوای این کاتالوگ متعلق به شرکت کارتن محمد می‌باشد.',
      },
      menu: {
        promptText: 'بر روی گزینهٔ مورد نظر خود کلیک کنید :',
        aboutLabel: 'دربارهٔ ما',
        productsLabel: 'محصولات',
        searchLabel: 'جست‌وجوی محصول',
        contactLabel: 'تماس با ما',
        showAbout: true,
        showProducts: true,
        showSearch: true,
        showContact: true,
        footerText: 'SMART PACKAGING CATALOG · MOHAMMAD CARTON',
      },
      groupsPage: {
        title: 'محصولات',
        promptText: 'بر روی گزینهٔ مورد نظر خود کلیک کنید :',
        ctaButtonText: 'مشاهدهٔ محصولات',
        footerText: '۳ گروه اصلی · ۲۰ سری محصول استاندارد و سفارشی',
        allGroupsButtonText: 'همه گروه‌ها',
        groupDetailHintText: 'برای مشاهده جزئیات روی محصول کلیک کنید',
      },
      productPage: {
        diagramTabLabel: 'شماتیک فنی',
        photoTabLabel: 'تصویر نمونه',
        specLabels: {
          grammage: 'گرماژ / ترکیب کاغذ',
          thickness: 'ضخامت ورق (mm)',
          weightCapacity: 'تحمل وزن / مقاومت',
          dimensions: 'ابعاد استاندارد (mm)',
          printType: 'نوع چاپ و خدمات',
          minOrder: 'حداقل تیراژ سفارش',
          jointType: 'ساختار و نحوه اتصال:',
        },
        orderButtonText: 'ثبت سفارش',
        consultButtonText: 'درخواست مشاوره',
        fullTableButtonText: 'جدول کامل',
        specsButtonText: 'مشخصات',
        nextButtonText: 'بعدی',
        prevButtonText: 'قبلی',
        messengers: { ...DEFAULT_MESSENGERS },
      },
      aboutPage: {
        title: 'دربارهٔ ما',
        aboutText: COMPANY_INFO.aboutText,
        awardsTitle: 'افتخارات و دستاوردها',
        bottomLinkText: 'مشاهده محصولات کارتن محمد',
      },
      contactPage: {
        title: 'تماس با ما',
        subtitle: 'کارشناسان ما در اولین فرصت پاسخگوی شما خواهند بود',
        phoneLabel: 'شماره تماس کارخانه',
        phoneFormatted: COMPANY_INFO.phoneFormatted,
        phoneTel: COMPANY_INFO.phoneTel,
        salesMobileLabel: 'شماره مستقیم واحد فروش',
        mobileDisplay: COMPANY_INFO.mobileDisplay,
        mobileTel: COMPANY_INFO.mobileTel,
        whatsappLabel: 'واتساپ واحد فروش',
        whatsappNumber: COMPANY_INFO.whatsappNumber,
        websiteLabel: 'وب‌سایت رسمی',
        website: COMPANY_INFO.website,
        websiteUrl: COMPANY_INFO.websiteUrl,
        departmentsTitle: 'ارتباط با دیگر واحدها:',
        addressTitle: 'دفتر مرکزی و کارخانه (مسیریابی روی نقشه)',
        address: COMPANY_INFO.address,
        mapUrl: COMPANY_INFO.mapUrl,
        directCallButtonText: 'تماس مستقیم با کارخانه',
      },
    },
    groups: JSON.parse(JSON.stringify(PRODUCT_GROUPS)),
    products: JSON.parse(JSON.stringify(CATALOG_PRODUCTS)),
    awards: JSON.parse(JSON.stringify(COMPANY_AWARDS)),
    departments: JSON.parse(JSON.stringify(DEPARTMENT_CONTACTS)),
    adminPassword: '1234',
  };
}

export function normalizeCatalogState(
  parsed: Partial<CatalogCustomState> | null | undefined
): CatalogCustomState {
  const defaults = getDefaultCatalogState();
  if (!parsed || typeof parsed !== 'object') {
    return defaults;
  }
  return {
    elements: {
      ...defaults.elements,
      ...(parsed.elements || {}),
      cover: { ...defaults.elements.cover, ...(parsed.elements?.cover || {}) },
      menu: { ...defaults.elements.menu, ...(parsed.elements?.menu || {}) },
      groupsPage: {
        ...defaults.elements.groupsPage,
        ...(parsed.elements?.groupsPage || {}),
      },
      productPage: {
        ...defaults.elements.productPage,
        ...(parsed.elements?.productPage || {}),
        specLabels: {
          ...defaults.elements.productPage.specLabels,
          ...(parsed.elements?.productPage?.specLabels || {}),
        },
        messengers: {
          ...defaults.elements.productPage.messengers,
          ...(parsed.elements?.productPage?.messengers || {}),
        },
      },
      aboutPage: {
        ...defaults.elements.aboutPage,
        ...(parsed.elements?.aboutPage || {}),
      },
      contactPage: {
        ...defaults.elements.contactPage,
        ...(parsed.elements?.contactPage || {}),
      },
    },
    groups:
      Array.isArray(parsed.groups) && parsed.groups.length > 0
        ? parsed.groups
        : defaults.groups,
    products:
      Array.isArray(parsed.products) && parsed.products.length > 0
        ? parsed.products
        : defaults.products,
    awards: Array.isArray(parsed.awards) ? parsed.awards : defaults.awards,
    departments: Array.isArray(parsed.departments)
      ? parsed.departments
      : defaults.departments,
    adminPassword: parsed.adminPassword || defaults.adminPassword,
  };
}

export function exportCatalogBackupJson(state: CatalogCustomState): string {
  const payload = {
    backupFormat: 'mohammad-carton-catalog-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    catalogState: state,
  };
  return JSON.stringify(payload, null, 2);
}

export function parseCatalogBackupJson(rawJson: string): CatalogCustomState {
  let decoded: any;
  try {
    decoded = JSON.parse(rawJson);
  } catch {
    throw new Error('فرمت فایل بکاپ نامعتبر است (فایل JSON معتبر نیست).');
  }

  if (!decoded || typeof decoded !== 'object') {
    throw new Error('محتوای فایل بکاپ خالی یا نامعتبر است.');
  }

  const candidate =
    decoded.catalogState && typeof decoded.catalogState === 'object'
      ? decoded.catalogState
      : decoded;

  if (
    !Array.isArray(candidate.products) &&
    !candidate.elements &&
    !Array.isArray(candidate.groups)
  ) {
    throw new Error(
      'ساختار فایل بکاپ با اطلاعات کاتالوگ کارتن محمد مطابقت ندارد.'
    );
  }

  return normalizeCatalogState(candidate);
}

export function loadCatalogState(): CatalogCustomState {
  const defaults = getDefaultCatalogState();
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaults;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<CatalogCustomState>;
    return normalizeCatalogState(parsed);
  } catch {
    return defaults;
  }
}

export function saveCatalogState(state: CatalogCustomState): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota errors
  }
}

export function resetCatalogState(): CatalogCustomState {
  const defaults = getDefaultCatalogState();
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return defaults;
}

export function addProductToState(
  state: CatalogCustomState,
  newProduct: CatalogProduct
): CatalogCustomState {
  return {
    ...state,
    products: [...state.products, newProduct],
  };
}

export function updateProductInState(
  state: CatalogCustomState,
  updatedProduct: CatalogProduct
): CatalogCustomState {
  return {
    ...state,
    products: state.products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    ),
  };
}

export function deleteProductFromState(
  state: CatalogCustomState,
  productId: string
): CatalogCustomState {
  return {
    ...state,
    products: state.products.filter((p) => p.id !== productId),
  };
}

export function createBlankProduct(groupId: CategoryId = 'boxes'): CatalogProduct {
  const timestamp = Date.now().toString().slice(-4);
  const groupTitle =
    groupId === 'boxes'
      ? 'انواع جعبه'
      : groupId === 'cartons'
      ? 'انواع کارتن'
      : 'انواع ورق کارتن';
  const defaultImage =
    groupId === 'boxes'
      ? IMAGES.boxesShowcase
      : groupId === 'cartons'
      ? IMAGES.cartonsShowcase
      : IMAGES.sheetsFlutes;
  const defaultDiagram =
    groupId === 'boxes'
      ? 'stand'
      : groupId === 'cartons'
      ? 'rsc-carton'
      : 'flute-b';

  return {
    id: `custom-prod-${timestamp}`,
    groupId,
    groupTitle,
    name: 'محصول جدید کارتن محمد',
    shortSubtitle: 'تولید سفارشی با ابعاد و چاپ اختصاصی',
    technicalCode: `FEFCO CUSTOM-${timestamp}`,
    badgeText: 'تولید اختصاصی',
    image: defaultImage,
    diagramType: defaultDiagram,
    variantPromptLabel: 'تیپ و ساختار محصول را انتخاب کنید',
    description:
      'این محصول با بهره‌گیری از خطوط مدرن ورق‌سازی، کارتن‌سازی و جعبه‌سازی شرکت کارتن محمد در ابعاد و ترکیب کاغذ دلخواه مشتری تولید می‌گردد.',
    applications: [
      'بسته‌بندی صنعتی و صادراتی',
      'محافظت کامل در برابر ضربه و فشار چیدمان',
    ],
    structuralFeatures: [
      'تولید با ورق و کاغذ استاندارد با استحکام بالا',
      'قابلیت چاپ فلکسو و افست لمینتی',
    ],
    paperCombinations: ['تست‌لاینر + فلوت سمی‌کمیکال', 'کرافت وارداتی صادراتی'],
    whatsappNumber: COMPANY_INFO.whatsappNumber,
    variants: [
      {
        id: `var-${timestamp}-1`,
        label: 'تیپ استاندارد ۱',
        subLabel: '۳ لایه · B فلوت',
        specs: {
          grammage: '۴۵۰ گرم بر مترمربع',
          thickness: '۳.۰ میلی‌متر',
          weightCapacity: '۸ کیلوگرم',
          dimensions: '۳۰۰×۲۰۰×۲۰۰',
          printType: 'فلکسو یا افست لمینتی',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'چسب صنعتی / دایکات',
        },
        unitBasePriceToman: 18500,
      },
      {
        id: `var-${timestamp}-2`,
        label: 'تیپ تقویت‌شده ۲',
        subLabel: '۵ لایه · CB/BE فلوت',
        specs: {
          grammage: '۷۲۰ گرم بر مترمربع',
          thickness: '۵.۵ میلی‌متر',
          weightCapacity: '۱۸ کیلوگرم',
          dimensions: '۴۰۰×۳۰۰×۲۵۰',
          printType: 'چاپ اختصاصی تا ۴ رنگ',
          minOrder: '۵۰۰ عدد',
          jointType: 'اتصال تقویت‌شده صادراتی',
        },
        unitBasePriceToman: 32000,
      },
    ],
  };
}

export function updateCategoryWhatsappInState(
  state: CatalogCustomState,
  groupId: CategoryId,
  whatsappNumber: string
): CatalogCustomState {
  return {
    ...state,
    groups: state.groups.map((g) =>
      g.id === groupId ? { ...g, whatsappNumber } : g
    ),
    products: state.products.map((p) =>
      p.groupId === groupId ? { ...p, whatsappNumber } : p
    ),
  };
}

export function setGlobalMessengerEnabledInState(
  state: CatalogCustomState,
  messengerId: MessengerId,
  enabled: boolean
): CatalogCustomState {
  return {
    ...state,
    elements: {
      ...state.elements,
      productPage: {
        ...state.elements.productPage,
        messengers: {
          ...state.elements.productPage.messengers,
          [messengerId]: enabled,
        },
      },
    },
    groups: state.groups.map((g) => ({
      ...g,
      messengers: {
        ...(g.messengers || {}),
        [messengerId]: enabled,
      },
    })),
    products: state.products.map((p) => ({
      ...p,
      messengers: {
        ...(p.messengers || {}),
        [messengerId]: enabled,
      },
    })),
  };
}

export function setProductMessengerEnabledInState(
  state: CatalogCustomState,
  productId: string,
  messengerId: MessengerId,
  enabled: boolean
): CatalogCustomState {
  return {
    ...state,
    products: state.products.map((p) =>
      p.id === productId
        ? {
            ...p,
            messengers: {
              ...(p.messengers || {}),
              [messengerId]: enabled,
            },
          }
        : p
    ),
  };
}

