export type CategoryId = 'boxes' | 'cartons' | 'sheets';

export type SpecFieldKey =
  | 'grammage'
  | 'thickness'
  | 'weightCapacity'
  | 'dimensions'
  | 'printType'
  | 'minOrder'
  | 'jointType';

export const ALL_SPEC_FIELD_KEYS: readonly SpecFieldKey[] = [
  'grammage',
  'thickness',
  'weightCapacity',
  'dimensions',
  'printType',
  'minOrder',
  'jointType',
] as const;

export type VariantSpecsVisibility = Partial<Record<SpecFieldKey, boolean>>;

export interface ProductVariant {
  id: string;
  label: string;
  subLabel: string;
  image?: string;
  schematicImage?: string;
  enabled?: boolean;
  showSubLabel?: boolean;
  specsVisibility?: VariantSpecsVisibility;
  specs: {
    grammage: string;        // گرماژ / ترکیب کاغذ (GSM)
    thickness: string;       // ضخامت ورق / دیواره (mm)
    weightCapacity: string;  // تحمل وزن (kg)
    dimensions: string;      // ابعاد استاندارد / قابل تولید (mm)
    printType: string;       // نوع چاپ و خدمات
    minOrder: string;        // حداقل تیراژ سفارش
    jointType: string;       // نحوه اتصال / ساختار
  };
  unitBasePriceToman: number;
}

export interface CatalogProduct {
  id: string;
  groupId: CategoryId;
  groupTitle: string;
  name: string;
  shortSubtitle: string;
  technicalCode: string;
  badgeText: string;
  image: string;
  schematicImage?: string;
  diagramType:
    | 'stand'
    | 'lock-bottom'
    | 'snap-lock'
    | 'mailer'
    | 'fancy'
    | 'pharma'
    | 'holder'
    | 'tray'
    | 'rsc-carton'
    | 'diecut-carton'
    | 'postal-carton'
    | 'charcoal-carton'
    | 'fruit-carton'
    | 'date-carton'
    | 'flute-e'
    | 'flute-b'
    | 'flute-c'
    | 'flute-cb'
    | 'flute-ce'
    | 'flute-be';
  variantPromptLabel: string;
  description: string;
  applications: string[];
  structuralFeatures: string[];
  paperCombinations: string[];
  variants: ProductVariant[];
  whatsappNumber?: string;
  messengers?: Partial<MessengerConfig>;
}

export type MessengerId = 'whatsapp' | 'eitaa' | 'rubika';

export interface MessengerConfig {
  whatsapp: boolean;
  eitaa: boolean;
  rubika: boolean;
}

export const DEFAULT_MESSENGERS: MessengerConfig = {
  whatsapp: true,
  eitaa: true,
  rubika: true,
};

export interface ProductGroup {
  id: CategoryId;
  numericId: number;
  title: string;
  subtitle: string;
  seriesCountLabel: string;
  image: string;
  accentLabel: string;
  whatsappNumber?: string;
  messengers?: Partial<MessengerConfig>;
}

export const IMAGES = {
  logo: '/assets/aistudio/Logo_-2_copy-3_0faf4749.png',
  award1395: '/assets/aistudio/image_685225f2.png',
  award1396: '/assets/aistudio/image_1a8fe992.png',
  award1397: '/assets/aistudio/image_9874cb4c.png',
  award1398: '/assets/aistudio/image_3805a96c.png',
  coverHero: '/src/assets/images/cover_packaging_hero_1794726954722.jpg',
  boxesShowcase: '/src/assets/images/cat_boxes_showcase_1794726957826.jpg',
  cartonsShowcase: '/src/assets/images/cat_cartons_showcase_1794726959384.jpg',
  sheetsFlutes: '/src/assets/images/cat_sheets_flutes_1794726960511.jpg',
};

export interface DepartmentContact {
  unit: string;
  mobile: string;
  mobileTel: string;
  ext: string;
}

export interface CompanyAward {
  year: string;
  title: string;
  image: string;
}

export const COMPANY_AWARDS: CompanyAward[] = [
  {
    year: '۱۳۹۵',
    title: 'واحد نمونه صنعتی استان خوزستان',
    image: IMAGES.award1395,
  },
  {
    year: '۱۳۹۶',
    title: 'واحد نمونه صنعتی استان خوزستان',
    image: IMAGES.award1396,
  },
  {
    year: '۱۳۹۷',
    title: 'واحد نمونه صنعتی استان خوزستان',
    image: IMAGES.award1397,
  },
  {
    year: '۱۳۹۸',
    title: 'واحد نمونه صنعتی استان خوزستان',
    image: IMAGES.award1398,
  },
];

export const DEPARTMENT_CONTACTS: DepartmentContact[] = [
  { unit: 'فروش', mobile: '۰۹۳۹۶۴۱۰۲۷۶', mobileTel: '09396410276', ext: '۱۰۴' },
  { unit: 'تدارکات', mobile: '۰۹۰۵۰۹۷۶۷۸۴', mobileTel: '09050976784', ext: '۱۳۶' },
  { unit: 'طراحی', mobile: '۰۹۰۵۰۹۷۶۷۸۱', mobileTel: '09050976781', ext: '۱۰۵' },
  { unit: 'مالی', mobile: '۰۹۰۵۰۹۷۶۷۸۵', mobileTel: '09050976785', ext: '۱۰۲' },
  { unit: 'منابع انسانی', mobile: '۰۹۰۵۰۹۷۶۷۸۶', mobileTel: '09050976786', ext: '۱۰۶' },
  { unit: 'خرید آخال', mobile: '۰۹۰۲۰۱۰۶۸۵۳', mobileTel: '09020106853', ext: '۱۳۶' },
];

export const COMPANY_INFO = {
  name: 'شرکت کارتن محمد',
  fullTitle: 'کاتالوگ هوشمند شرکت کارتن محمد',
  englishName: 'MOHAMMAD CARTON CO.',
  tagline: 'کارتن محمد پیشرو در صنعت بسته بندی کشور · تولید کننده انواع کاغذ، ورق، کارتن و جعبه',
  city: 'دزفول',
  phoneDisplay: '۰۶۱-۴۲۲۰۲۰۴۰',
  phoneFormatted: '۴۰ ۲۰ ۲۰ ۴۲ - ۰۶۱',
  phoneTel: '06142202040',
  mobileDisplay: '۰۹۳۹۶۴۱۰۲۷۶',
  mobileTel: '09396410276',
  whatsappNumber: '989396410276',
  website: 'mohammadcarton.com',
  websiteUrl: 'https://www.mohammadcarton.com',
  mapUrl: 'https://maps.google.com/?cid=13330582876234232006',
  address: 'دزفول، شهرک صنعتی شماره یک، خیابان چهارم',
  aboutText:
    'کارتن محمد، در سال ۱۳۸۰ به تناسب نیاز بازار برای بسته بندی ، با یک واحد کارتــن سازی ، فعالیت خود را در دزفول آغاز نمود.در مدت زمان کوتاهی بدلیل کیفیت بالا ، سرعت در زمان تحویل و رضایتمندی مشتریان ؛ سیل تقاضای بازار هدف ، ما را بر آن داشت تا گام بزرگی در جهت خودکفایی برداشته و صنایع مادر را راه اندازی کنیم.اکنون کارتن محمد ، مجموعه ای از واحدهای کاغذسازی ، ورق سازی ، کارتن سازی و جعبه سازی را در اختیار دارد که با داشتـــــن خطوط تولیدی با تکنولوژی روز دنیا در هرواحد ، از منحصربفردترین مجموعــــه های صــنــــــایع سلولزی کشور می باشد.  کارتــــــن محمد با توکل بر خدا و با پشتوانـــــه ی منــــابع انســـــــانـــی و مشتریان وفادار هرروز مصمّم تر از دیـــروز در جهت خدمت رسانی به هموطنان گام برمیدارد.',
  stats: [
    { value: '۲۰', label: 'سری محصول' },
    { value: '۳', label: 'گروه اصلی' },
    { value: '۶', label: 'تیپ ورق و فلوت' },
  ],
  highlights: [
    'تولید سفارشی در تیراژ بالا',
    'ورق و کاغذ استاندارد صنعتی',
    'تنوع کامل فلوت و قالب دایکات',
    'ارسال سریع به سراسر کشور',
  ],
};

export const PRODUCT_GROUPS: ProductGroup[] = [
  {
    id: 'boxes',
    numericId: 1,
    title: 'انواع جعبه (دایکاتی و مقوایی)',
    subtitle: 'استندی، لاک‌باتم، ته‌قفلی، کیبوردی، فانتزی، درب دارویی، هولدر، سینی و کفی · ۸ سری',
    seriesCountLabel: '۸ سری محصول',
    image: IMAGES.boxesShowcase,
    accentLabel: 'FEFCO 04 / 07',
  },
  {
    id: 'cartons',
    numericId: 2,
    title: 'انواع کارتن (۳ لایه و ۵ لایه)',
    subtitle: 'معمولی و دایکاتی، پستی، ذغال، میوه و صیفی‌جات، خرما و صادراتی · ۶ سری',
    seriesCountLabel: '۶ سری محصول',
    image: IMAGES.cartonsShowcase,
    accentLabel: 'FEFCO 02 / 03',
  },
  {
    id: 'sheets',
    numericId: 3,
    title: 'انواع ورق کارتن (فلوت‌های تخصصی)',
    subtitle: 'ورق‌های ۳ لایه و ۵ لایه با فلوت‌های E, B, C, CB, CE, BE · ۶ سری',
    seriesCountLabel: '۶ سری محصول',
    image: IMAGES.sheetsFlutes,
    accentLabel: 'E · B · C · CB · CE · BE',
  },
];

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  // ==================== GROUP 1: BOXES (جعبه) ====================
  {
    id: 'box-stand',
    groupId: 'boxes',
    groupTitle: 'انواع جعبه',
    name: 'جعبه استندی',
    shortSubtitle: 'پرفراژدار و استند رومیزی فروشگاهی',
    technicalCode: 'FEFCO 0426 · POS',
    badgeText: 'نمایشگاهی و شلف',
    image: IMAGES.boxesShowcase,
    diagramType: 'stand',
    variantPromptLabel: 'تیپ و ساختار استند را انتخاب کنید',
    description:
      'جعبه استندی (Display & Shelf-Ready Box) با خط پرفراژ دقیق یا تاج تبلیغاتی تاشو، ابتدا نقش کارتن محافظ در حمل‌ونقل را ایفا کرده و در فروشگاه با یک حرکت به استند نمایش محصول روی پیشخوان تبدیل می‌شود.',
    applications: [
      'محصولات غذایی، شکلات، اسنک و خشکبار تک‌نفره',
      'لوازم آرایشی، بهداشتی و داروخانه‌ای روی کانتر',
      'قطعات الکتریکی، چسب، باتری و ابزارآلات مصرفی',
    ],
    structuralFeatures: [
      'خطوط پرفراژ مهندسی‌شده برای جداسازی آسان درب بدون پارگی بدنه',
      'تاج (Header) برجسته با قابلیت چاپ افست چهاررنگ و سلفون‌بندی',
      'قابلیت تولید با ورق ای‌فلوت (E) یا بی‌فلوت (B) لمینتی',
    ],
    paperCombinations: ['پشت‌طوسی ۲۵۰ گرم لمینت روی E-Flute', 'کرافت سفید وارداتی + فلوت ۱۲۵ گرم', 'مقوای ایندربرد ۳۰۰ تا ۳۵۰ گرم'],
    variants: [
      {
        id: 'stand-counter-s',
        label: 'استند رومیزی',
        subLabel: 'کوچک · E فلوت',
        specs: {
          grammage: '۴۸۰ گرم بر مترمربع',
          thickness: '۱.۵ میلی‌متر (فلوت E)',
          weightCapacity: '۳.۵ کیلوگرم',
          dimensions: '۲۰۰×۱۵۰×۱۸۰',
          printType: 'افست ۴ رنگ + سلفون براق',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'دایکات قفلی + پرفراژ',
        },
        unitBasePriceToman: 14500,
      },
      {
        id: 'stand-counter-m',
        label: 'استند پرفراژدار',
        subLabel: 'متوسط · E فلوت',
        specs: {
          grammage: '۵۲۰ گرم بر مترمربع',
          thickness: '۱.۶ میلی‌متر (فلوت E)',
          weightCapacity: '۶ کیلوگرم',
          dimensions: '۲۸۰×۲۰۰×۲۲۰',
          printType: 'افست لمینتی + یووی موضعی',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'چسب بغل + خط پرفراژ',
        },
        unitBasePriceToman: 19800,
      },
      {
        id: 'stand-shelf-l',
        label: 'استند شلف فروشگاهی',
        subLabel: 'بزرگ · B فلوت',
        specs: {
          grammage: '۵۹۰ گرم بر مترمربع',
          thickness: '۳.۰ میلی‌متر (فلوت B)',
          weightCapacity: '۱۰ کیلوگرم',
          dimensions: '۳۵۰×۲۵۰×۲۶۰',
          printType: 'لمینت افست یا فلکسو کلیشه‌ای',
          minOrder: '۵۰۰ عدد',
          jointType: 'دایکات ته‌قفلی + پرفراژ',
        },
        unitBasePriceToman: 26400,
      },
      {
        id: 'stand-stepped',
        label: 'استند طبقاتی',
        subLabel: '۲ طبقه · BE فلوت',
        specs: {
          grammage: '۷۸۰ گرم بر مترمربع',
          thickness: '۴.۵ میلی‌متر (فلوت BE)',
          weightCapacity: '۱۶ کیلوگرم',
          dimensions: '۴۰۰×۳۰۰×۳۵۰',
          printType: 'افست اختصاصی + روکش مات',
          minOrder: '۵۰۰ عدد',
          jointType: 'قفل متقاطع + مقسم طبقاتی',
        },
        unitBasePriceToman: 42000,
      },
    ],
  },
  {
    id: 'box-lock-bottom',
    groupId: 'boxes',
    groupTitle: 'انواع جعبه',
    name: 'جعبه لاک باتم',
    shortSubtitle: 'کف قفل اتوماتیک با چسب سه‌نقطه‌ای',
    technicalCode: 'FEFCO 0713',
    badgeText: 'مونتاژ سریع خط تولید',
    image: IMAGES.boxesShowcase,
    diagramType: 'lock-bottom',
    variantPromptLabel: 'تیپ جعبه لاک‌باتم را انتخاب کنید',
    description:
      'جعبه لاک باتم (Auto-Lock Bottom / Crash Lock) در کارخانه از سه نقطه چسب‌کاری می‌شود و به‌صورت تخت ارسال می‌گردد. در خط بسته‌بندی تنها با فشار دو لبه، کف جعبه به‌صورت خودکار قفل و آماده بارگذاری می‌شود.',
    applications: [
      'ظروف شیشه‌ای، عسل، مربا، سس و بطری‌های سنگین',
      'قطعات خودرو، بلبرینگ، شیرآلات و تجهیزات صنعتی',
      'بسته‌بندی محصولات صادراتی با سرعت خط تولید بالا',
    ],
    structuralFeatures: [
      'کاهش ۷۰ درصدی زمان مونتاژ کارتن در خط بسته‌بندی کارخانه',
      'تحمل وزن فوق‌العاده در بخش کف به دلیل هم‌پوشانی چهار لبه چسب‌دار',
      'قابلیت اجرا روی مقوای گرم بالا و ورق ای‌فلوت و بی‌فلوت لمینتی',
    ],
    paperCombinations: ['مقوای پشت‌طوسی ۳۰۰ گرم + لمینت E-Flute', 'تست‌لاینر قهوه‌ای + فلوت سمی‌کمیکال', 'ایندربرد ۳۵۰ گرم با چسب گرم صنعتی'],
    variants: [
      {
        id: 'lb-cardboard',
        label: 'مقوایی ایندربرد',
        subLabel: '۳۵۰ گرم · دارویی/آرایشی',
        specs: {
          grammage: '۳۵۰ گرم بر مترمربع',
          thickness: '۰.۵۵ میلی‌متر',
          weightCapacity: '۱.۸ کیلوگرم',
          dimensions: '۱۲۰×۸۰×۱۸۰',
          printType: 'افست ۴ رنگ + طلاکوب',
          minOrder: '۲٬۰۰۰ عدد',
          jointType: 'چسب ۳ نقطه‌ای اتوماتیک',
        },
        unitBasePriceToman: 9200,
      },
      {
        id: 'lb-eflute',
        label: 'لمینتی ای‌فلوت',
        subLabel: '۳ لایه ظریف · E فلوت',
        specs: {
          grammage: '۵۱۰ گرم بر مترمربع',
          thickness: '۱.۶ میلی‌متر (فلوت E)',
          weightCapacity: '۵ کیلوگرم',
          dimensions: '۱۸۰×۱۴۰×۲۴۰',
          printType: 'افست لمینتی + سلفون مات',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'چسب ۳ نقطه‌ای لاک‌باتم',
        },
        unitBasePriceToman: 16800,
      },
      {
        id: 'lb-bflute',
        label: 'صنعتی بی‌فلوت',
        subLabel: '۳ لایه مقاوم · B فلوت',
        specs: {
          grammage: '۶۲۰ گرم بر مترمربع',
          thickness: '۳.۰ میلی‌متر (فلوت B)',
          weightCapacity: '۹ کیلوگرم',
          dimensions: '۲۵۰×۲۰۰×۳۰۰',
          printType: 'لمینت افست یا فلکسو',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'قفل اتوماتیک کف + درب دارویی',
        },
        unitBasePriceToman: 24500,
      },
      {
        id: 'lb-beflute',
        label: 'فوق‌سنگین ۵ لایه',
        subLabel: '۵ لایه · BE فلوت',
        specs: {
          grammage: '۸۴۰ گرم بر مترمربع',
          thickness: '۴.۵ میلی‌متر (فلوت BE)',
          weightCapacity: '۱۸ کیلوگرم',
          dimensions: '۳۲۰×۲۴۰×۳۵۰',
          printType: 'لمینت افست مقاوم + ورنی',
          minOrder: '۵۰۰ عدد',
          jointType: 'چسب صنعتی ۳ نقطه‌ای تقویت‌شده',
        },
        unitBasePriceToman: 37500,
      },
    ],
  },
  {
    id: 'box-snap-lock',
    groupId: 'boxes',
    groupTitle: 'انواع جعبه',
    name: 'جعبه ته قفلی',
    shortSubtitle: 'کف قفلی ۱-۲-۳ چهارگوش با استحکام بالا',
    technicalCode: 'FEFCO 0215',
    badgeText: 'تحمل وزن اقتصادی',
    image: IMAGES.boxesShowcase,
    diagramType: 'snap-lock',
    variantPromptLabel: 'مدل جعبه ته‌قفلی را انتخاب کنید',
    description:
      'جعبه ته‌قفلی (۱-۲-۳ Snap Lock Bottom) دارای یک چسب طولی در بغل بوده و چهار لبهٔ کف آن با قفل مکانیکی در هم چفت می‌شوند. گزینه‌ای بسیار اقتصادی و مستحکم برای محصولات نیمه‌سنگین و سنگین است.',
    applications: [
      'بسته‌بندی قطعات الکتریکی، لوستر، لامپ و کلید و پریز',
      'محصولات خانگی، ظروف چینی، بلور و لوازم آشپزخانه',
      'بسته‌بندی مواد غذایی، خرما، شیرینی و بطری‌های نوشیدنی',
    ],
    structuralFeatures: [
      'قفل مکانیکی ۴ تکه در کف بدون نیاز به نوارچسب زیر جعبه',
      'هزینه قالب و چسب‌کاری پایین‌تر نسبت به لاک‌باتم اتوماتیک',
      'مقاومت عالی در برابر باز شدن کف هنگام جابه‌جایی دستی',
    ],
    paperCombinations: ['ورق E-Flute سفید یا کرافت', 'ورق B-Flute لمینتی پشت‌طوسی', 'مقوای دوبلکس ۳۰۰ تا ۴۰۰ گرم'],
    variants: [
      {
        id: 'snap-small',
        label: 'ته‌قفلی مقوایی',
        subLabel: '۳۰۰ گرم · سبک',
        specs: {
          grammage: '۳۰۰ گرم بر مترمربع',
          thickness: '۰.۴۸ میلی‌متر',
          weightCapacity: '۱.۵ کیلوگرم',
          dimensions: '۱۴۰×۱۰۰×۱۶۰',
          printType: 'افست ۴ رنگ + ورنی چاپ',
          minOrder: '۲٬۰۰۰ عدد',
          jointType: 'چسب بغل + کف قفلی ۱-۲-۳',
        },
        unitBasePriceToman: 7800,
      },
      {
        id: 'snap-eflute',
        label: 'ته‌قفلی ای‌فلوت',
        subLabel: '۳ لایه · E فلوت',
        specs: {
          grammage: '۴۹۰ گرم بر مترمربع',
          thickness: '۱.۵ میلی‌متر (فلوت E)',
          weightCapacity: '۴.۵ کیلوگرم',
          dimensions: '۲۰۰×۱۶۰×۲۲۰',
          printType: 'لمینت افست ۴ رنگ',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'چسب بغل + قفل چهارگوش کف',
        },
        unitBasePriceToman: 15200,
      },
      {
        id: 'snap-bflute',
        label: 'ته‌قفلی بی‌فلوت',
        subLabel: '۳ لایه · B فلوت',
        specs: {
          grammage: '۵۸۰ گرم بر مترمربع',
          thickness: '۳.۰ میلی‌متر (فلوت B)',
          weightCapacity: '۸ کیلوگرم',
          dimensions: '۲۸۰×۲۲۰×۲۸۰',
          printType: 'فلکسو ۲ رنگ یا لمینت افست',
          minOrder: '۵۰۰ عدد',
          jointType: 'چسب یا منگنه بغل + کف قفلی',
        },
        unitBasePriceToman: 21900,
      },
      {
        id: 'snap-handle',
        label: 'ته‌قفلی دسته‌دار',
        subLabel: 'دسته دایکاتی · B فلوت',
        specs: {
          grammage: '۶۴۰ گرم بر مترمربع',
          thickness: '۳.۰ میلی‌متر (فلوت B)',
          weightCapacity: '۱۰ کیلوگرم',
          dimensions: '۳۰۰×۲۴۰×۳۲۰',
          printType: 'افست لمینتی + سلفون حرارتی',
          minOrder: '۵۰۰ عدد',
          jointType: 'کف قفلی + درب دسته‌دار قفلی',
        },
        unitBasePriceToman: 27800,
      },
    ],
  },
  {
    id: 'box-mailer',
    groupId: 'boxes',
    groupTitle: 'انواع جعبه',
    name: 'جعبه کیبوردی',
    shortSubtitle: 'قفل‌دار دوطرفه بدون نیاز به چسب',
    technicalCode: 'FEFCO 0427',
    badgeText: 'پرفروش آنباکسینگ و پستی',
    image: IMAGES.coverHero,
    diagramType: 'mailer',
    variantPromptLabel: 'سایز و جنس جعبه کیبوردی را انتخاب کنید',
    description:
      'جعبه کیبوردی (لپ‌تاپی / Tuck-Top Mailer) محبوب‌ترین ساختار بسته‌بندی برای فروشگاه‌های اینترنتی، پوشاک، اکسسوری، کتاب و هدایای سازمانی است. دیواره‌های دوجداره در طرفین، مقاومت فشاری فوق‌العاده‌ای بدون یک قطره چسب ایجاد می‌کنند.',
    applications: [
      'بسته‌بندی سفارش‌های فروشگاه‌های آنلاین، پوشاک، شال و کیف و کفش',
      'پک‌های هدیه سازمانی، کتاب، گجت‌های الکترونیکی و لوازم جانبی موبایل',
      'بسته‌بندی اشتراک قهوه، دمنوش، عطر و محصولات لوکس دست‌ساز',
    ],
    structuralFeatures: [
      'مونتاژ ۱۰۰٪ قفلی بدون نیاز به چسب و منگنه با دیواره‌های دوبل کناری',
      'تجربه آنباکسینگ (Unboxing) بسیار شیک با قابلیت چاپ داخل و بیرون جعبه',
      'زبانه‌های قفل شونده در جلوی جعبه برای امنیت کامل در ارسال پستی',
    ],
    paperCombinations: ['ورق E-Flute دو رو کرافت طبیعی', 'ورق E-Flute سفید لمینتی با چاپ داخل و بیرون', 'ورق B-Flute مستحکم برای ابعاد بزرگ'],
    variants: [
      {
        id: 'mailer-s',
        label: 'کیبوردی سایز ۱',
        subLabel: '۲۰×۱۵×۶ cm · E فلوت',
        specs: {
          grammage: '۴۵۰ گرم بر مترمربع',
          thickness: '۱.۵ میلی‌متر (فلوت E)',
          weightCapacity: '۳ کیلوگرم',
          dimensions: '۲۰۰×۱۵۰×۶۰',
          printType: 'کرافت ساده / چاپ سیلک یا فلکسو',
          minOrder: '۵۰۰ عدد',
          jointType: 'دایکات قفلی بدون چسب',
        },
        unitBasePriceToman: 11500,
      },
      {
        id: 'mailer-m',
        label: 'کیبوردی سایز ۲',
        subLabel: '۲۸×۲۰×۸ cm · E فلوت',
        specs: {
          grammage: '۴۸۰ گرم بر مترمربع',
          thickness: '۱.۵ میلی‌متر (فلوت E)',
          weightCapacity: '۵ کیلوگرم',
          dimensions: '۲۸۰×۲۰۰×۸۰',
          printType: 'سفید یا کرافت + چاپ اختصاصی',
          minOrder: '۵۰۰ عدد',
          jointType: 'دایکات قفلی FEFCO 0427',
        },
        unitBasePriceToman: 16200,
      },
      {
        id: 'mailer-l',
        label: 'کیبوردی سایز ۳',
        subLabel: '۳۵×۲۵×۱۰ cm · B فلوت',
        specs: {
          grammage: '۵۵۰ گرم بر مترمربع',
          thickness: '۳.۰ میلی‌متر (فلوت B)',
          weightCapacity: '۸ کیلوگرم',
          dimensions: '۳۵۰×۲۵۰×۱۰۰',
          printType: 'لمینت افست ۴ رنگ + سلفون',
          minOrder: '۵۰۰ عدد',
          jointType: 'دیواره دوبل قفلی بدون چسب',
        },
        unitBasePriceToman: 23400,
      },
      {
        id: 'mailer-vip',
        label: 'کیبوردی لمینتی دو رو چاپ',
        subLabel: 'چاپ داخل و بیرون · E فلوت',
        specs: {
          grammage: '۵۸۰ گرم بر مترمربع',
          thickness: '۱.۷ میلی‌متر (فلوت E لمینتی)',
          weightCapacity: '۶ کیلوگرم',
          dimensions: '۳۰۰×۲۲۰×۹۰',
          printType: 'افست بیرونی + چاپ تم داخلی + طلاکوب',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'دایکات قفلی دقیق با گوشه صاف',
        },
        unitBasePriceToman: 29800,
      },
    ],
  },
  {
    id: 'box-fancy',
    groupId: 'boxes',
    groupTitle: 'انواع جعبه',
    name: 'جعبه فانتزی و کادویی',
    shortSubtitle: 'پنجره‌دار، کشویی، بالشتی و طلاکوب لوکس',
    technicalCode: 'CUSTOM DIE-CUT',
    badgeText: 'لوکس و اختصاصی',
    image: IMAGES.boxesShowcase,
    diagramType: 'fancy',
    variantPromptLabel: 'سبک جعبه فانتزی را انتخاب کنید',
    description:
      'جعبه‌های فانتزی با قالب‌های خلاقانه (کشویی کبریتی، پنجره‌دار طلق‌دار، بالشتی، شش‌ضلعی، دسته‌دار فانتزی) و خدمات تکمیلی چاپ شامل طلاکوب، نقره‌کوب، برجسته‌سازی (امباس) و یووی موضعی برای ارتقای ارزش برند شما طراحی می‌شوند.',
    applications: [
      'بسته‌بندی عطر، ادکلن، جواهرات، ساعت و محصولات آرایشی لوکس',
      'شکلات دست‌ساز، زعفران، خشکبار صادراتی، عسل و دمنوش‌های ویژه',
      'هدایای تبلیغاتی سازمانی و بسته‌بندی‌های مناسبتی',
    ],
    structuralFeatures: [
      'قابلیت نصب طلق شفاف PVC/PET روی پنجره دایکات‌شده برای نمایش محصول',
      'پشتیبانی کامل از خدمات پس از چاپ: طلاکوب، یووی موضعی، امباس و سلفون مخملی',
      'طراحی ساختار دو تکه (کشویی یا زیر و رو) با دقت میلی‌متری',
    ],
    paperCombinations: ['مقوای ایندربرد ۳۰۰ و ۳۵۰ گرم', 'مقوای کرافت فانتزی + لمینت E-Flute', 'مقوای فابریانو و متالایز طلایی/نقره‌ای'],
    variants: [
      {
        id: 'fancy-drawer',
        label: 'فانتزی کشویی (کبریتی)',
        subLabel: 'دو تکه · ایندربرد / E فلوت',
        specs: {
          grammage: '۳۵۰ تا ۵۰۰ گرم',
          thickness: '۰.۶ تا ۱.۵ میلی‌متر',
          weightCapacity: '۲.۵ کیلوگرم',
          dimensions: '۲۰۰×۱۲۰×۵۰',
          printType: 'افست + سلفون مات + طلاکوب',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'غلاف کشویی + سینی داخلی قفلی',
        },
        unitBasePriceToman: 18500,
      },
      {
        id: 'fancy-window',
        label: 'فانتزی پنجره‌دار طلق‌دار',
        subLabel: 'نصب طلق شفاف · E فلوت',
        specs: {
          grammage: '۴۸۰ گرم بر مترمربع',
          thickness: '۱.۵ میلی‌متر (فلوت E)',
          weightCapacity: '۴ کیلوگرم',
          dimensions: '۲۲۰×۱۸۰×۸۰',
          printType: 'افست ۴ رنگ + پنجره طلق PVC',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'دایکات پنجره‌دار + چسب طلق',
        },
        unitBasePriceToman: 21000,
      },
      {
        id: 'fancy-telescopic',
        label: 'زیر و رو (درب و کفی)',
        subLabel: 'کادویی لوکس · E فلوت',
        specs: {
          grammage: '۵۲۰ گرم بر مترمربع',
          thickness: '۱.۶ میلی‌متر (فلوت E)',
          weightCapacity: '۵ کیلوگرم',
          dimensions: '۲۶۰×۲۰۰×۹۰',
          printType: 'سلفون مخملی + یووی موضعی',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'درب و کفی تلسکوپی دوجداره',
        },
        unitBasePriceToman: 25600,
      },
      {
        id: 'fancy-gable',
        label: 'فانتزی دسته‌دار (کیفی)',
        subLabel: 'دسته یکپارچه · E/B فلوت',
        specs: {
          grammage: '۵۵۰ گرم بر مترمربع',
          thickness: '۲.۵ میلی‌متر',
          weightCapacity: '۶ کیلوگرم',
          dimensions: '۲۴۰×۱۶۰×۲۰۰',
          printType: 'افست لمینتی + ورنی براق',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'کف قفلی اتوماتیک + دسته قفل‌شو',
        },
        unitBasePriceToman: 22900,
      },
    ],
  },
  {
    id: 'box-pharma',
    groupId: 'boxes',
    groupTitle: 'انواع جعبه',
    name: 'جعبه درب دارویی',
    shortSubtitle: 'دو سر درب دارویی متقارن و نامتقارن',
    technicalCode: 'FEFCO 0211 / RTE / STE',
    badgeText: 'پرتیراژ و اقتصادی',
    image: IMAGES.boxesShowcase,
    diagramType: 'pharma',
    variantPromptLabel: 'مدل جعبه درب دارویی را انتخاب کنید',
    description:
      'جعبه درب دارویی در دو تیپ استاندارد Reverse Tuck End (درب‌های خلاف جهت) و Straight Tuck End (درب‌های هم‌جهت) تولید می‌شود. به دلیل شیت‌چینی بهینه با کمترین پرت مقوا و ورق، اقتصادی‌ترین ساختار بسته‌بندی صنعتی است.',
    applications: [
      'بسته‌بندی دارو، مکمل، شربت، کرم، تیوب و محصولات بهداشتی',
      'لوازم یدکی خودرو، فیلتر، شمع، لنت و قطعات صنعتی سبک',
      'بسته‌بندی لامپ، شیرآلات، چسب، تیغ و ملزومات اداری',
    ],
    structuralFeatures: [
      'کمترین میزان دورریز کاغذ در شیت‌بندی قالب دایکات (حداکثر صرفه‌جویی اقتصادی)',
      'قابلیت افزودن قفل امنیتی (Slit Lock) روی درب بالا و پایین',
      'مناسب برای دستگاه‌های جعبه پرکن اتوماتیک و نیمه‌اتوماتیک',
    ],
    paperCombinations: ['مقوای پشت‌طوسی ۲۵۰ تا ۳۵۰ گرم', 'مقوای ایندربرد بهداشتی ۲۸۰ تا ۳۵۰ گرم', 'ورق E-Flute لمینتی برای قطعات سنگین‌تر'],
    variants: [
      {
        id: 'pharma-rte-250',
        label: 'درب دارویی مقوایی',
        subLabel: 'پشت‌طوسی ۳۰۰ گرم · RTE',
        specs: {
          grammage: '۳۰۰ گرم بر مترمربع',
          thickness: '۰.۴۵ میلی‌متر',
          weightCapacity: '۰.۸ کیلوگرم',
          dimensions: '۱۰۰×۶۰×۱۴۰',
          printType: 'افست ۴ رنگ + ورنی ماشینی',
          minOrder: '۳٬۰۰۰ عدد',
          jointType: 'چسب بغل طولی + دو درب دارویی',
        },
        unitBasePriceToman: 4600,
      },
      {
        id: 'pharma-ste-inder',
        label: 'درب هم‌جهت بهداشتی',
        subLabel: 'ایندربرد ۳۰۰ گرم · STE',
        specs: {
          grammage: '۳۰۰ گرم بر مترمربع',
          thickness: '۰.۵۰ میلی‌متر',
          weightCapacity: '۱.۲ کیلوگرم',
          dimensions: '۱۲۰×۷۰×۱۶۰',
          printType: 'افست + سلفون مات + خط بریل/امباس',
          minOrder: '۳٬۰۰۰ عدد',
          jointType: 'چسب بغل + درب هم‌جهت بدون مرز در جلو',
        },
        unitBasePriceToman: 6200,
      },
      {
        id: 'pharma-eflute',
        label: 'درب دارویی ای‌فلوت',
        subLabel: '۳ لایه لمینتی · E فلوت',
        specs: {
          grammage: '۴۸۰ گرم بر مترمربع',
          thickness: '۱.۵ میلی‌متر (فلوت E)',
          weightCapacity: '۳.۵ کیلوگرم',
          dimensions: '۱۶۰×۱۱۰×۲۲۰',
          printType: 'افست لمینتی ۴ رنگ',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'چسب بغل صنعتی + قفل زبانه درب',
        },
        unitBasePriceToman: 13400,
      },
      {
        id: 'pharma-hangtab',
        label: 'درب دارویی آویزدار',
        subLabel: 'دارای آویز رگال · یورو هول',
        specs: {
          grammage: '۳۵۰ تا ۴۸۰ گرم',
          thickness: '۰.۵۵ تا ۱.۵ میلی‌متر',
          weightCapacity: '۲ کیلوگرم',
          dimensions: '۱۴۰×۸۰×۱۹۰',
          printType: 'افست + سلفون براق مقاوم',
          minOrder: '۲٬۰۰۰ عدد',
          jointType: 'چسب بغل + زبانه آویز پانچ یورو',
        },
        unitBasePriceToman: 9800,
      },
    ],
  },
  {
    id: 'box-holder',
    groupId: 'boxes',
    groupTitle: 'انواع جعبه',
    name: 'جعبه هولدر و مقسم',
    shortSubtitle: 'نگهدارنده داخلی، شانه و هولدر لیوان و بطری',
    technicalCode: 'FEFCO 0900 / INSERT',
    badgeText: 'محافظت و تثبیت',
    image: IMAGES.boxesShowcase,
    diagramType: 'holder',
    variantPromptLabel: 'مدل هولدر و نگهدارنده را انتخاب کنید',
    description:
      'انواع هولدر و اینسرت دایکاتی (پارتیشن، مقسم شبکه‌ای، نگهدارنده داخل جعبه و هولدر بیرون‌بر لیوان و بطری) جهت تثبیت کامل محصول، جلوگیری از برخورد ظروف شکستنی و آرایش منظم اقلام داخل بسته‌بندی طراحی می‌شوند.',
    applications: [
      'هولدر دوتایی و چهارتایی لیوان قهوه، نوشیدنی و پک‌های بیرون‌بر کافه و رستوران',
      'مقسم و نگهدارنده داخلی برای شیشه عطر، ویال دارویی، ظروف عسل و قطعات حساس الکترونیکی',
      'پارتیشن‌های مشبک ۳ لایه و ۵ لایه برای تفکیک بطری در کارتن مادر',
    ],
    structuralFeatures: [
      'طراحی دقیق حفره‌ها و زبانه‌های ضربه‌گیر متناسب با فرم هندسی محصول شما',
      'قابلیت تولید به‌صورت مشبک کشویی یا کفی دایکاتی تاشو',
      'افزایش چشمگیر مقاومت عمودی کارتن در چیدمان پالت (BCT)',
    ],
    paperCombinations: ['ورق E-Flute کرافت و سفید', 'ورق B-Flute و C-Flute برای مقسم کارتن مادر', 'مقوای کرافت ۳۰۰ گرم برای گلس‌هولدر'],
    variants: [
      {
        id: 'holder-cup-2',
        label: 'هولدر ۲ و ۴ لیوانی',
        subLabel: 'کافه و بیرون‌بر · E فلوت',
        specs: {
          grammage: '۴۴۰ گرم بر مترمربع',
          thickness: '۱.۵ میلی‌متر (فلوت E)',
          weightCapacity: '۲.۵ کیلوگرم',
          dimensions: '۲۲۰×۱۱۰×۵۵',
          printType: 'کرافت طبیعی / چاپ تک‌رنگ یا افست',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'دایکات قفلی یا دسته‌دار تاشو',
        },
        unitBasePriceToman: 6800,
      },
      {
        id: 'holder-insert-custom',
        label: 'اینسرت نگهدارنده داخلی',
        subLabel: 'حفره اختصاصی · E/B فلوت',
        specs: {
          grammage: '۴۶۰ گرم بر مترمربع',
          thickness: '۱.۵ تا ۳.۰ میلی‌متر',
          weightCapacity: '۴ کیلوگرم',
          dimensions: 'سفارشی مطابق جعبه',
          printType: 'سفید، مشکی یا کرافت فانتزی',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'دایکات خط‌تا و قفل نگهدارنده',
        },
        unitBasePriceToman: 5900,
      },
      {
        id: 'holder-partition-grid',
        label: 'مقسم مشبک (پارتیشن)',
        subLabel: '۶، ۱۲ و ۲۴ خانه · B/C فلوت',
        specs: {
          grammage: '۵۲۰ گرم بر مترمربع',
          thickness: '۳.۰ تا ۴.۰ میلی‌متر',
          weightCapacity: 'محافظت تا ۲۰ کیلوگرم',
          dimensions: '۴۰۰×۳۰۰×۲۵۰',
          printType: 'بدون چاپ (ورق صنعتی)',
          minOrder: '۵۰۰ ست',
          jointType: 'شکاف متقاطع (چاک‌دار شبکه‌ای)',
        },
        unitBasePriceToman: 12400,
      },
      {
        id: 'holder-bottle-pack',
        label: 'هولدر دسته‌دار بطری',
        subLabel: 'پک ۴ و ۶ عددی · B فلوت',
        specs: {
          grammage: '۵۸۰ گرم بر مترمربع',
          thickness: '۳.۰ میلی‌متر (فلوت B)',
          weightCapacity: '۶ کیلوگرم',
          dimensions: '۲۴۰×۱۶۰×۲۲۰',
          printType: 'افست لمینتی ۴ رنگ',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'کف قفلی + دسته تقویت‌شده دوبل',
        },
        unitBasePriceToman: 18200,
      },
    ],
  },
  {
    id: 'box-tray',
    groupId: 'boxes',
    groupTitle: 'انواع جعبه',
    name: 'جعبه سینی و کفی',
    shortSubtitle: 'سینی لبه‌دار، کفی شرینک‌پک و صنایع غذایی',
    technicalCode: 'FEFCO 0452 / TRAY',
    badgeText: 'شرینک‌پک و قنادی',
    image: IMAGES.boxesShowcase,
    diagramType: 'tray',
    variantPromptLabel: 'مدل سینی و کفی را انتخاب کنید',
    description:
      'جعبه سینی و کفی (تخت بدون درب یا با لبه‌های دوجداره قفلی) برای بسته‌بندی‌های شرینک‌پک (قوطی، آبمیوه، کنسرو، لبنیات)، صنایع شیرینی و شکلات، فست‌فود و کفی‌های نمایشگاهی در ابعاد متنوع تولید می‌گردد.',
    applications: [
      'کفی شرینک‌پک ماءالشعیر، نوشابه، آبمعدنی، کنسرو و شیشه‌های مربا',
      'سینی شیرینی، باقلوا، کیک، فینگرفود و محصولات قنادی و نانوایی',
      'سینی نظم‌دهنده قطعات در خطوط مونتاژ کارخانجات و انبارها',
    ],
    structuralFeatures: [
      'لبه‌های کوتاه مستحکم با قابلیت تحمل فشار حرارتی دستگاه تونل شرینک',
      'تولید در دو مدل قفلی بدون چسب (دستی) و چسبی چهارگوش (اتوماتیک)',
      'امکان استفاده از پوشش بهداشتی یا سلفون در تماس با مواد غذایی',
    ],
    paperCombinations: ['ورق B-Flute و C-Flute مقاوم در برابر رطوبت', 'ورق E-Flute سفید بهداشتی قنادی', 'ورق ۵ لایه BE برای کفی‌های سنگین صنعتی'],
    variants: [
      {
        id: 'tray-shrink-b',
        label: 'کفی شرینک‌پک صنعتی',
        subLabel: '۳ لایه · B/C فلوت',
        specs: {
          grammage: '۴۸۰ گرم بر مترمربع',
          thickness: '۳.۰ تا ۴.۰ میلی‌متر',
          weightCapacity: '۱۲ کیلوگرم',
          dimensions: '۴۰۰×۲۷۰×۶۵',
          printType: 'فلکسو ۱ تا ۳ رنگ',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'دایکات لبه‌دار شرینک',
        },
        unitBasePriceToman: 9500,
      },
      {
        id: 'tray-pastry-e',
        label: 'سینی قنادی و غذایی',
        subLabel: 'سفید بهداشتی · E فلوت',
        specs: {
          grammage: '۴۵۰ گرم بر مترمربع',
          thickness: '۱.۵ میلی‌متر (فلوت E)',
          weightCapacity: '۴ کیلوگرم',
          dimensions: '۳۰۰×۲۲۰×۵۰',
          printType: 'افست + سلفون بهداشتی داخل',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'قفل دو طرفه دیواره دوبل',
        },
        unitBasePriceToman: 12800,
      },
      {
        id: 'tray-double-wall',
        label: 'سینی لبه‌دوبل نمایشگاهی',
        subLabel: 'دیواره تقویتی · B فلوت',
        specs: {
          grammage: '۵۶۰ گرم بر مترمربع',
          thickness: '۳.۰ میلی‌متر (فلوت B)',
          weightCapacity: '۱۰ کیلوگرم',
          dimensions: '۳۵۰×۲۵۰×۸۰',
          printType: 'افست لمینتی ۴ رنگ',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'دیواره دوبل قفل‌شونده کف',
        },
        unitBasePriceToman: 16400,
      },
      {
        id: 'tray-heavy-be',
        label: 'کفی پالتی ۵ لایه',
        subLabel: 'فوق‌مقاوم · BE/CB فلوت',
        specs: {
          grammage: '۷۶۰ گرم بر مترمربع',
          thickness: '۴.۵ تا ۷.۰ میلی‌متر',
          weightCapacity: '۲۵ کیلوگرم',
          dimensions: '۶۰۰×۴۰۰×۱۰۰',
          printType: 'فلکسو صنعتی ۲ رنگ',
          minOrder: '۵۰۰ عدد',
          jointType: 'قفل گوشه یا منگنه صنعتی',
        },
        unitBasePriceToman: 28500,
      },
    ],
  },

  // ==================== GROUP 2: CARTONS (کارتن) ====================
  {
    id: 'carton-rsc',
    groupId: 'cartons',
    groupTitle: 'انواع کارتن',
    name: 'کارتن ۳ لایه و ۵ لایه معمولی (RSC)',
    shortSubtitle: 'کارتن چاک‌دار آمریکایی در کلیه ابعاد سفارشی',
    technicalCode: 'FEFCO 0201 / RSC',
    badgeText: 'استاندارد حمل‌ونقل',
    image: IMAGES.cartonsShowcase,
    diagramType: 'rsc-carton',
    variantPromptLabel: 'تعداد لایه و تیپ ورق کارتن معمولی را انتخاب کنید',
    description:
      'کارتن معمولی یا چاک‌دار آمریکایی (Regular Slotted Container) پرکاربردترین کارتن بسته‌بندی در صنایع تولیدی، غذایی، شوینده، نساجی و لجستیک است. در شرکت کارتن محمد، این محصول بدون محدودیت ابعاد و بدون نیاز به هزینه قالب در تیپ‌های ۳ لایه و ۵ لایه تولید می‌شود.',
    applications: [
      'کارتن مادر برای بسته‌بندی نهایی محصولات غذایی، بهداشتی، شوینده و دارویی',
      'بسته‌بندی لوازم خانگی، قطعات صنعتی، ظروف پلاستیکی و بلورجات',
      'کارتن‌های اسباب‌کشی، انبارداری، آرشیو اسناد و حمل‌ونقل بین‌شهری',
    ],
    structuralFeatures: [
      'تولید با دستگاه‌های چاک‌زن و خط‌تازن روتاری بدون نیاز به هزینه ساخت قالب دایکات',
      'قابلیت اتصال درز کارتن با چسب گرم صنعتی و یا منگنه فلزی مسوار',
      'چاپ فلکسو تا ۴ رنگ همراه با درج علائم استاندارد حمل، بارکد و مشخصات محصول',
    ],
    paperCombinations: [
      '۳ لایه اقتصادی: لاینر ایرانی + فلوت + لاینر',
      '۳ لایه مقاوم: تست‌لاینر + فلوت سمی‌کمیکال + تست',
      '۵ لایه صادراتی: کرافت وارداتی + فلوت CB/CE + تست‌لاینر',
    ],
    variants: [
      {
        id: 'rsc-3ply-b',
        label: '۳ لایه معمولی',
        subLabel: 'فلوت B یا C · استاندارد',
        specs: {
          grammage: '۴۲۰ تا ۴۸۰ گرم',
          thickness: '۳.۰ تا ۴.۰ میلی‌متر',
          weightCapacity: '۱۰ تا ۱۵ کیلوگرم',
          dimensions: '۴۰۰×۳۰۰×۳۰۰ (یا سفارشی)',
          printType: 'فلکسو ۱ تا ۳ رنگ',
          minOrder: '۳۰۰ عدد',
          jointType: 'چسب صنعتی یا منگنه',
        },
        unitBasePriceToman: 18500,
      },
      {
        id: 'rsc-3ply-white',
        label: '۳ لایه رویه سفید',
        subLabel: 'فلوت C/B · سفید صادراتی',
        specs: {
          grammage: '۴۸۰ گرم بر مترمربع',
          thickness: '۳.۵ میلی‌متر',
          weightCapacity: '۱۵ کیلوگرم',
          dimensions: '۴۵۰×۳۲۰×۳۰۰',
          printType: 'فلکسو ۳ رنگ با وضوح بالا',
          minOrder: '۵۰۰ عدد',
          jointType: 'چسب گرم اتوماتیک',
        },
        unitBasePriceToman: 22800,
      },
      {
        id: 'rsc-5ply-cb',
        label: '۵ لایه مقاوم',
        subLabel: 'فلوت CB · نیمه‌سنگین',
        specs: {
          grammage: '۶۸۰ تا ۷۵۰ گرم',
          thickness: '۷.۰ میلی‌متر (فلوت CB)',
          weightCapacity: '۲۵ تا ۳۵ کیلوگرم',
          dimensions: '۵۰۰×۴۰۰×۴۰۰',
          printType: 'فلکسو صنعتی ۲ تا ۴ رنگ',
          minOrder: '۳۰۰ عدد',
          jointType: 'چسب تقویت‌شده یا منگنه مسوار',
        },
        unitBasePriceToman: 34500,
      },
      {
        id: 'rsc-5ply-kraft',
        label: '۵ لایه کرافت صادراتی',
        subLabel: 'فلوت CB/BE · فوق‌سنگین',
        specs: {
          grammage: '۸۵۰ تا ۹۵۰ گرم',
          thickness: '۷.۰ میلی‌متر (کرافت وارداتی)',
          weightCapacity: '۴۵ کیلوگرم (مقاوم در پالت)',
          dimensions: '۶۰۰×۴۰۰×۴۵۰',
          printType: 'فلکسو یا لمینت اختصاصی',
          minOrder: '۳۰۰ عدد',
          jointType: 'منگنه دوبل صنعتی + چسب',
        },
        unitBasePriceToman: 46000,
      },
    ],
  },
  {
    id: 'carton-diecut',
    groupId: 'cartons',
    groupTitle: 'انواع کارتن',
    name: 'کارتن ۳ لایه و ۵ لایه دایکاتی',
    shortSubtitle: 'برش دقیق با قالب اختصاصی و قفل‌های مهندسی',
    technicalCode: 'FEFCO 0400 / DIE-CUT',
    badgeText: 'دقت ابعادی میلی‌متری',
    image: IMAGES.cartonsShowcase,
    diagramType: 'diecut-carton',
    variantPromptLabel: 'تیپ کارتن دایکاتی را انتخاب کنید',
    description:
      'کارتن‌های دایکاتی ۳ لایه و ۵ لایه به کمک قالب‌های برش فلت و روتاری، امکان ایجاد هرگونه دستگیره حمل، منافذ تهویه، زبانه‌های قفلی، پنجره نمایش و خطوط تا با دقت میلی‌متری را فراهم می‌کنند.',
    applications: [
      'بسته‌بندی قطعات حساس صنعتی، پمپ، الکتروموتور، شیرآلات و لوازم خودرو',
      'کارتن‌های دسته‌دار و قفل‌دار برای لوازم خانگی کوچک و تجهیزات پزشکی',
      'پکینگ‌های صادراتی با لمینت افست تمام‌رنگ روی ورق ۳ لایه و ۵ لایه',
    ],
    structuralFeatures: [
      'برش کاملاً یکدست و دقیق برای خطوط بسته‌بندی اتوماتیک و رباتیک',
      'امکان تعبیه دستگیره حمل، سوراخ تهویه و قفل‌های بدون چسب',
      'مقاومت فشاری بالا به لطف ستون‌های دوبل در دیواره‌های جانبی',
    ],
    paperCombinations: ['ورق ۳ لایه B-Flute و E-Flute', 'ورق ۵ لایه BE-Flute (میکرو ۵ لایه)', 'ورق ۵ لایه CB-Flute و CE-Flute لمینتی'],
    variants: [
      {
        id: 'dc-3ply-b',
        label: 'دایکاتی ۳ لایه صنعتی',
        subLabel: 'فلوت B · قفلی/دسته‌دار',
        specs: {
          grammage: '۵۲۰ گرم بر مترمربع',
          thickness: '۳.۰ میلی‌متر (فلوت B)',
          weightCapacity: '۱۲ کیلوگرم',
          dimensions: '۳۸۰×۲۸۰×۲۲۰',
          printType: 'فلکسو ۲ رنگ یا لمینت افست',
          minOrder: '۵۰۰ عدد',
          jointType: 'برش قالب دایکات فلت/روتاری',
        },
        unitBasePriceToman: 21500,
      },
      {
        id: 'dc-3ply-laminated',
        label: 'دایکاتی ۳ لایه لمینتی',
        subLabel: 'چاپ افست ۴ رنگ · B/E فلوت',
        specs: {
          grammage: '۵۹۰ گرم بر مترمربع',
          thickness: '۲.۸ میلی‌متر',
          weightCapacity: '۱۴ کیلوگرم',
          dimensions: '۴۰۰×۳۰۰×۲۵۰',
          printType: 'افست ۴ رنگ + سلفون حرارتی',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'دایکات قفلی یا ته‌قفلی',
        },
        unitBasePriceToman: 29800,
      },
      {
        id: 'dc-5ply-be',
        label: 'دایکاتی ۵ لایه ظریف',
        subLabel: 'فلوت BE · میکرو ۵ لایه',
        specs: {
          grammage: '۷۶۰ گرم بر مترمربع',
          thickness: '۴.۵ میلی‌متر (فلوت BE)',
          weightCapacity: '۲۴ کیلوگرم',
          dimensions: '۴۵۰×۳۲۰×۲۸۰',
          printType: 'لمینت افست یا فلکسو دقیق',
          minOrder: '۵۰۰ عدد',
          jointType: 'دایکات سنگین صنعتی',
        },
        unitBasePriceToman: 38200,
      },
      {
        id: 'dc-5ply-cb',
        label: 'دایکاتی ۵ لایه سنگین',
        subLabel: 'فلوت CB/CE · صادراتی',
        specs: {
          grammage: '۸۴۰ گرم بر مترمربع',
          thickness: '۶.۵ میلی‌متر (فلوت CB)',
          weightCapacity: '۳۵ کیلوگرم',
          dimensions: '۵۵۰×۳۸۰×۳۵۰',
          printType: 'فلکسو ۳ رنگ + روکش ضدآب',
          minOrder: '۵۰۰ عدد',
          jointType: 'دایکات تلسکوپی یا قفل دوبل',
        },
        unitBasePriceToman: 44900,
      },
    ],
  },
  {
    id: 'carton-postal',
    groupId: 'cartons',
    groupTitle: 'انواع کارتن',
    name: 'کارتن پستی و تجارت الکترونیک',
    shortSubtitle: 'سایزبندی استاندارد پستی (سایز ۱ تا ۹) و سفارشی',
    technicalCode: 'POSTAL STD 1-9',
    badgeText: 'آماده ارسال و لوگوی اختصاصی',
    image: IMAGES.cartonsShowcase,
    diagramType: 'postal-carton',
    variantPromptLabel: 'سایز استاندارد کارتن پستی را انتخاب کنید',
    description:
      'کارتن‌های پستی شرکت کارتن محمد در تمامی سایزهای استاندارد شرکت ملی پست (از سایز ۱ تا ۹) در دو مدل چاک‌دار و کیبوردی دایکاتی تولید می‌شوند. امکان چاپ جدول مشخصات فرستنده و گیرنده یا لوگوی اختصاصی فروشگاه شما فراهم است.',
    applications: [
      'ارسال مرسولات فروشگاه‌های اینترنتی، دیجی‌کالا، باسلام و پیج‌های فروشگاهی',
      'بسته‌بندی کتاب، لوازم التحریر، قطعات کامپیوتر، موبایل و پوشاک',
      'ارسال مرسولات پیشتاز، تیپاکس، چاپار و باربری در سراسر کشور',
    ],
    structuralFeatures: [
      'تولید با ورق ۳ لایه و ۵ لایه استاندارد مقاوم در برابر ضربات حمل‌ونقل پستی',
      'طراحی خط‌تاهای دقیق برای بسته شدن سریع و کیپ شدن درب‌ها',
      'قابلیت چاپ لوگوی برند شما به جای طرح عمومی پست در تیراژ اقتصادی',
    ],
    paperCombinations: ['ورق ۳ لایه B-Flute تست‌لاینر (سایز ۱ تا ۴)', 'ورق ۳ لایه C-Flute تقویت‌شده (سایز ۵ و ۶)', 'ورق ۵ لایه CB-Flute (سایز ۷ تا ۹)'],
    variants: [
      {
        id: 'post-s1-2',
        label: 'پستی سایز ۱ و ۲',
        subLabel: '۱۵×۱۰×۱۰ تا ۲۰×۱۵×۱۰ cm',
        specs: {
          grammage: '۴۴۰ گرم بر مترمربع',
          thickness: '۳.۰ میلی‌متر (فلوت B)',
          weightCapacity: '۳ کیلوگرم',
          dimensions: '۲۰۰×۱۵۰×۱۰۰',
          printType: 'چاپ استاندارد پستی یا اختصاصی',
          minOrder: '۵۰۰ عدد',
          jointType: 'دایکاتی کیبوردی یا چاک‌دار',
        },
        unitBasePriceToman: 7400,
      },
      {
        id: 'post-s3-4',
        label: 'پستی سایز ۳ و ۴',
        subLabel: '۲۵×۲۰×۱۵ تا ۳۰×۲۰×۲۰ cm',
        specs: {
          grammage: '۴۷۰ گرم بر مترمربع',
          thickness: '۳.۰ میلی‌متر (فلوت B/C)',
          weightCapacity: '۶ کیلوگرم',
          dimensions: '۳۰۰×۲۰۰×۲۰۰',
          printType: 'چاپ جدول پستی + لوگوی برند',
          minOrder: '۵۰۰ عدد',
          jointType: 'چسب بغل اتوماتیک RSC',
        },
        unitBasePriceToman: 12900,
      },
      {
        id: 'post-s5-6',
        label: 'پستی سایز ۵ و ۶',
        subLabel: '۳۵×۲۵×۲۰ تا ۴۵×۳۰×۲۵ cm',
        specs: {
          grammage: '۵۲۰ گرم بر مترمربع',
          thickness: '۴.۰ میلی‌متر (فلوت C)',
          weightCapacity: '۱۲ کیلوگرم',
          dimensions: '۴۵۰×۳۰۰×۲۵۰',
          printType: 'فلکسو ۱ تا ۲ رنگ اختصاصی',
          minOrder: '۳۰۰ عدد',
          jointType: 'چسب یا منگنه صنعتی',
        },
        unitBasePriceToman: 19600,
      },
      {
        id: 'post-s7-9',
        label: 'پستی سایز ۷ تا ۹ (۵ لایه)',
        subLabel: '۵۰×۳۵×۳۰ تا ۶۰×۴۵×۴۰ cm',
        specs: {
          grammage: '۷۴۰ گرم بر مترمربع',
          thickness: '۷.۰ میلی‌متر (۵ لایه CB)',
          weightCapacity: '۲۸ کیلوگرم',
          dimensions: '۵۵۰×۴۰۰×۳۵۰',
          printType: 'فلکسو صنعتی مقاوم',
          minOrder: '۲۰۰ عدد',
          jointType: 'منگنه مسوار یا چسب گرم',
        },
        unitBasePriceToman: 32800,
      },
    ],
  },
  {
    id: 'carton-charcoal',
    groupId: 'cartons',
    groupTitle: 'انواع کارتن',
    name: 'کارتن ذغال (فشرده، لیمو و صادراتی)',
    shortSubtitle: '۵ لایه فوق‌مستحکم با چاپ لمینت، فلکسو و دسته‌دار',
    technicalCode: 'HEAVY DUTY 5-PLY',
    badgeText: 'مقاوم در برابر فشار و رطوبت',
    image: IMAGES.cartonsShowcase,
    diagramType: 'charcoal-carton',
    variantPromptLabel: 'وزن و مدل کارتن ذغال را انتخاب کنید',
    description:
      'کارتن ذغال نیازمند استحکام ستونی بسیار بالا (جهت چیدمان در انبار و کانتینر) و مقاومت در برابر نفوذ گرد ذغال و رطوبت است. شرکت کارتن محمد انواع کارتن ذغال ۱ تا ۱۰ کیلویی را با ورق ۵ لایه CB و BE در دو مدل فلکسو و لمینتی تولید می‌کند.',
    applications: [
      'بسته‌بندی ذغال فشرده (چینی/پرشده)، ذغال قلیانی، ذغال لیمو و کبابی',
      'صادرات ذغال به کشورهای حوزه خلیج فارس، عراق، ترکیه و اروپا',
      'بسته‌بندی بریکت‌های صنعتی و مواد معدنی سنگین',
    ],
    structuralFeatures: [
      'استفاده از ورق ۵ لایه با فلوت سمی‌کمیکال گرم بالا برای جلوگیری از شکم دادن کارتن',
      'امکان تولید در مدل زیر و رو (تلسکوپی)، دسته‌دار پلاستیکی یا دایکاتی قفلی',
      'روکش سلفون حرارتی براق یا مات روی چاپ لمینتی جهت ضدآب شدن سطح بیرونی',
    ],
    paperCombinations: ['۵ لایه CB فلوت کرافت‌دار', '۵ لایه BE فلوت لمینت شده با مقوای پشت‌طوسی ۲۵۰ گرم', '۳ لایه E/B لمینتی برای بسته‌های کوچک ۱ کیلویی'],
    variants: [
      {
        id: 'charcoal-1kg',
        label: 'جعبه ذغال ۱ و ۲ کیلویی',
        subLabel: 'حبه‌ای / قلیانی · لمینتی',
        specs: {
          grammage: '۵۶۰ گرم بر مترمربع',
          thickness: '۳.۰ میلی‌متر (فلوت B لمینتی)',
          weightCapacity: '۳ کیلوگرم',
          dimensions: '۱۸۰×۱۵۰×۱۶۰',
          printType: 'افست ۴ رنگ + سلفون براق + دسته',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'دایکات ته‌قفلی دسته‌دار',
        },
        unitBasePriceToman: 17500,
      },
      {
        id: 'charcoal-5kg-flexo',
        label: 'کارتن ذغال ۵ و ۶ کیلویی',
        subLabel: '۵ لایه · چاپ فلکسو',
        specs: {
          grammage: '۷۶۰ گرم بر مترمربع',
          thickness: '۷.۰ میلی‌متر (فلوت CB)',
          weightCapacity: '۱۲ کیلوگرم (چیدمان ۱۰ ردیف)',
          dimensions: '۳۶۰×۲۴۰×۲۴۰',
          printType: 'فلکسو ۲ یا ۳ رنگ روی سفید/قهوه‌ای',
          minOrder: '۵۰۰ عدد',
          jointType: 'منگنه مسوار صنعتی + چسب',
        },
        unitBasePriceToman: 28900,
      },
      {
        id: 'charcoal-8kg-lam',
        label: 'کارتن ذغال ۸ و ۱۰ کیلویی لمینتی',
        subLabel: '۵ لایه صادراتی · CB/CE',
        specs: {
          grammage: '۸۸۰ گرم بر مترمربع',
          thickness: '۶.۵ میلی‌متر (۵ لایه لمینتی)',
          weightCapacity: '۲۰ کیلوگرم (فوق‌مقاوم)',
          dimensions: '۴۲۰×۲۸۰×۲۸۰',
          printType: 'افست لمینتی تمام‌رنگ + سلفون ضدآب',
          minOrder: '۵۰۰ عدد',
          jointType: 'منگنه دوبل یا قفل دایکاتی سنگین',
        },
        unitBasePriceToman: 43500,
      },
      {
        id: 'charcoal-telescopic',
        label: 'کارتن ذغال زیر و رو (تلسکوپی)',
        subLabel: 'دو تکه ۸ لایه دیواره · صادراتی',
        specs: {
          grammage: '۹۵۰ گرم مجموع دو تکه',
          thickness: '۷.۰ میلی‌متر در دیواره جانبی',
          weightCapacity: '۲۵ کیلوگرم در کانتینر',
          dimensions: '۴۰۰×۲۷۰×۲۶۰',
          printType: 'لمینت افست لوکس + طلاکوب برند',
          minOrder: '۵۰۰ ست',
          jointType: 'کفی ۵ لایه + درب تلسکوپی لمینتی',
        },
        unitBasePriceToman: 49800,
      },
    ],
  },
  {
    id: 'carton-fruit',
    groupId: 'cartons',
    groupTitle: 'انواع کارتن',
    name: 'کارتن میوه و صیفی‌جات (صادراتی و سردخانه‌ای)',
    shortSubtitle: 'سبدی، تلسکوپی و پنجره‌دار با تهویه استاندارد',
    technicalCode: 'FEFCO 0320 / AGRI',
    badgeText: 'مقاوم در رطوبت سردخانه',
    image: IMAGES.cartonsShowcase,
    diagramType: 'fruit-carton',
    variantPromptLabel: 'مدل کارتن میوه و صیفی‌جات را انتخاب کنید',
    description:
      'کارتن‌های میوه، صیفی‌جات و محصولات گلخانه‌ای (فلفل دلمه‌ای، گوجه‌فرنگی، کیوی، سیب، انار، مرکبات) با کاغذهای ضدآب (کرافت و وایت‌تاپ) و چسب مقاوم به رطوبت، همراه با حفره‌های گردش هوای مهندسی‌شده برای حفظ تازگی در سردخانه و کانتینر یخچال‌دار تولید می‌شوند.',
    applications: [
      'صادرات صیفی‌جات گلخانه‌ای: فلفل دلمه‌ای رنگی، گوجه‌فرنگی، بادمجان و خیار',
      'بسته‌بندی میوه‌های سردخانه‌ای: سیب درختی، کیوی، انار، پرتقال و انگور',
      'سینی‌های میوه تک‌ردیفه و دوردیفه شانه‌دار برای بازارهای روسیه و خلیج فارس',
    ],
    structuralFeatures: [
      'تعبیه حفره‌های تهویه جانبی و کفی منطبق با جریان هوای کانتینر یخچالی (Reefer)',
      'ستون‌های مثلثی یا دوبل در چهار گوشه سبد برای تحمل بار پالت تا ۲ تن',
      'چسب ضدآب نشاسته پلیمری مقاوم در رطوبت نسبی ۸۵٪ سردخانه',
    ],
    paperCombinations: ['کرافت وارداتی ۱۸۰ تا ۲۲۰ گرم + فلوت سمی‌کمیکال ۱۷۵ گرم', 'وایت‌تاپ صادراتی + لمینت سلفون', '۵ لایه CB و BE ضدآب'],
    variants: [
      {
        id: 'fruit-tray-single',
        label: 'سبد میوه تک‌ردیفه دایکاتی',
        subLabel: '۴ تا ۶ کیلو · کیوی/انار/هلو',
        specs: {
          grammage: '۷۲۰ گرم بر مترمربع',
          thickness: '۴.۵ تا ۷.۰ میلی‌متر (۵ لایه)',
          weightCapacity: '۸ کیلوگرم (تحمل پالت عالی)',
          dimensions: '۴۰۰×۳۰۰×۱۲۰',
          printType: 'لمینت افست ۴ رنگ یا فلکسو',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'دایکات ستون‌دار گوشه قفلی',
        },
        unitBasePriceToman: 31500,
      },
      {
        id: 'fruit-pepper-5kg',
        label: 'کارتن فلفل دلمه‌ای و گوجه',
        subLabel: '۵ لایه صادراتی روسیه · ۵ کیلویی',
        specs: {
          grammage: '۸۲۰ گرم بر مترمربع',
          thickness: '۷.۰ میلی‌متر (فلوت CB کرافت)',
          weightCapacity: '۱۲ کیلوگرم در چیدمان ۱۲ لایه',
          dimensions: '۴۰۰×۳۰۰×۲۲۰',
          printType: 'فلکسو ۳ رنگ یا لمینت ضدآب',
          minOrder: '۵۰۰ عدد',
          jointType: 'دایکات تهویه‌دار دسته‌دار',
        },
        unitBasePriceToman: 36800,
      },
      {
        id: 'fruit-apple-telescopic',
        label: 'کارتن تلسکوپی سیب و مرکبات',
        subLabel: 'زیر و رو ۱۰ تا ۱۸ کیلویی',
        specs: {
          grammage: '۹۸۰ گرم (کفی ۵ لایه + درب)',
          thickness: '۷.۰ میلی‌متر + ۳.۰ میلی‌متر',
          weightCapacity: '۲۰ کیلوگرم در سردخانه',
          dimensions: '۵۰۰×۳۳۰×۳۰۰',
          printType: 'افست لمینتی سلفون‌دار یا فلکسو',
          minOrder: '۵۰۰ ست',
          jointType: 'کفی و درب تلسکوپی با منافذ هوا',
        },
        unitBasePriceToman: 52000,
      },
      {
        id: 'fruit-pallet-tray',
        label: 'سبد ۶۰×۴۰ استاندارد یوروپالت',
        subLabel: '۵ لایه ستون‌دار · صادراتی',
        specs: {
          grammage: '۹۲۰ گرم بر مترمربع',
          thickness: '۷.۰ میلی‌متر (فلوت CB سنگین)',
          weightCapacity: '۱۶ کیلوگرم',
          dimensions: '۶۰۰×۴۰۰×۱۶۰',
          printType: 'فلکسو ۴ رنگ یا لمینت اختصاصی',
          minOrder: '۵۰۰ عدد',
          jointType: 'دایکات قفلی با زبانه درگیرشونده پالت',
        },
        unitBasePriceToman: 47500,
      },
    ],
  },
  {
    id: 'carton-dates',
    groupId: 'cartons',
    groupTitle: 'انواع کارتن',
    name: 'کارتن خرما و خشکبار صادراتی',
    shortSubtitle: 'جعبه کودک و کارتن مادر (مضافتی، پیارم، کبکاب، زاهدی)',
    technicalCode: 'DATE EXPORT SET',
    badgeText: 'پک مادر و کودک بهداشتی',
    image: IMAGES.cartonsShowcase,
    diagramType: 'date-carton',
    variantPromptLabel: 'مدل بسته‌بندی خرما را انتخاب کنید',
    description:
      'شرکت کارتن محمد تولیدکننده تخصصی ست کامل بسته‌بندی خرما شامل جعبه کودک (۵۰۰ تا ۸۰۰ گرمی با پوشش بهداشتی ضدروغن و شیره) و کارتن مادر ۱۲ عددی و ۵ یا ۱۰ کیلویی فله با چاپ صادراتی چندزبانه است.',
    applications: [
      'ست ۱۲ عددی جعبه کودک + کارتن مادر برای خرمای مضافتی بم و سراوان',
      'جعبه‌های فانتزی و پنجره‌دار برای خرمای پیارم، مجول، ربی و خاصویی',
      'کارتن‌های ۵ و ۱۰ کیلویی فله و وکیوم برای خرمای زاهدی، کبکاب و شاهانی',
    ],
    structuralFeatures: [
      'پوشش سلفون بهداشتی داخل جعبه کودک برای جلوگیری از نفوذ شیره و رطوبت خرما به مقوا',
      'تناسب دقیق ابعاد ۱۲ جعبه کودک داخل کارتن مادر بدون لقی در حمل سردخانه‌ای',
      'قابلیت چاپ به زبان‌های فارسی، انگلیسی، عربی، روسی و هندی برای بازارهای هدف',
    ],
    paperCombinations: ['جعبه کودک: ایندربرد یا پشت‌طوسی ۳۰۰ تا ۳۵۰ گرم با سلفون داخلی', 'کارتن مادر: ۵ لایه CB یا BE کرافت ضدآب', 'کارتن ۵ کیلویی تلسکوپی: ۳ یا ۵ لایه لمینتی'],
    variants: [
      {
        id: 'date-child-box',
        label: 'جعبه کودک خرما (۵۰۰-۸۰۰ گرم)',
        subLabel: 'مقوایی بهداشتی · سلفون داخل',
        specs: {
          grammage: '۳۰۰ تا ۳۵۰ گرم بر مترمربع',
          thickness: '۰.۵۰ میلی‌متر (مقوای بهداشتی)',
          weightCapacity: '۰.۹ کیلوگرم',
          dimensions: '۱۸۵×۱۱۵×۵۵',
          printType: 'افست ۴ رنگ + سلفون بهداشتی داخل و بیرون',
          minOrder: '۶٬۰۰۰ عدد',
          jointType: 'دایکات قفلی یک‌تکه یا زیر و رو',
        },
        unitBasePriceToman: 5200,
      },
      {
        id: 'date-mother-12',
        label: 'کارتن مادر ۱۲ عددی مضافتی',
        subLabel: '۵ لایه یا ۳ لایه سنگین · صادراتی',
        specs: {
          grammage: '۶۸۰ گرم بر مترمربع',
          thickness: '۴.۵ تا ۷.۰ میلی‌متر (BE / CB)',
          weightCapacity: '۱۲ کیلوگرم (۱۲ بسته کودک)',
          dimensions: '۳۸۵×۲۴۵×۱۸۰',
          printType: 'فلکسو ۳ رنگ یا لمینت افست',
          minOrder: '۵۰۰ عدد',
          jointType: 'چاک‌دار یا تلسکوپی با حفره تهویه',
        },
        unitBasePriceToman: 27900,
      },
      {
        id: 'date-5kg-bulk',
        label: 'کارتن خرما ۵ و ۱۰ کیلویی فله',
        subLabel: '۵ لایه کرافت · زاهدی/کبکاب',
        specs: {
          grammage: '۷۸۰ گرم بر مترمربع',
          thickness: '۷.۰ میلی‌متر (فلوت CB)',
          weightCapacity: '۱۲ کیلوگرم',
          dimensions: '۳۸۰×۲۶۰×۱۶۰',
          printType: 'فلکسو یا لمینت صادراتی ضدآب',
          minOrder: '۵۰۰ عدد',
          jointType: 'منگنه مسوار ضدزنگ + چسب ضدآب',
        },
        unitBasePriceToman: 31200,
      },
      {
        id: 'date-vip-pyarom',
        label: 'جعبه لوکس خرما پیارم و مجول',
        subLabel: 'کشویی / پنجره‌دار · طلاکوب',
        specs: {
          grammage: '۴۸۰ گرم بر مترمربع',
          thickness: '۱.۵ میلی‌متر (E فلوت لمینتی)',
          weightCapacity: '۱ تا ۲ کیلوگرم',
          dimensions: '۲۴۰×۱۶۰×۴۵',
          printType: 'افست + سلفون مات + طلاکوب + طلق',
          minOrder: '۱٬۰۰۰ عدد',
          jointType: 'کشویی یا کیبوردی لوکس',
        },
        unitBasePriceToman: 18900,
      },
    ],
  },

  // ==================== GROUP 3: CORRUGATED SHEETS (ورق کارتن) ====================
  {
    id: 'sheet-flute-e',
    groupId: 'sheets',
    groupTitle: 'انواع ورق کارتن',
    name: 'ورق کارتن فلوت E (ای‌فلوت / ۳ لایه)',
    shortSubtitle: 'ضخامت ۱.۵ میلی‌متر · ۹۰ تا ۹۸ کنگره در ۳۰ سانتی‌متر',
    technicalCode: 'FLUTE E · 1.5mm',
    badgeText: 'بهترین سطح چاپ و لمینت',
    image: IMAGES.sheetsFlutes,
    diagramType: 'flute-e',
    variantPromptLabel: 'ترکیب کاغذ ورق فلوت E را انتخاب کنید',
    description:
      'ورق ۳ لایه ای‌فلوت (E-Flute) ظریف‌ترین کنگره استاندارد در صنعت کارتن‌سازی را دارد. به دلیل فشردگی بالای گام کنگره‌ها، سطح ورق کاملاً صاف و بدون اثر موج (Washboarding) بوده و بهترین گزینه برای لمینت مقوای چاپی و جعبه‌های دایکاتی ظریف است.',
    applications: [
      'تولید جعبه‌های کیبوردی، دارویی، آرایشی، قطعات خودرو و استندهای رومیزی',
      'لمینت مقوای پشت‌طوسی و ایندربرد چاپ افست شده روی ورق ۲ لایه (سینگل) و ۳ لایه',
      'جعبه‌های پیتزا، فست‌فود، شیرینی و بسته‌بندی‌های لوکس فروشگاهی',
    ],
    structuralFeatures: [
      'ضخامت بسیار کم (۱.۵ تا ۱.۸ میلی‌متر) که فضای انبارش بسته‌ها را به حداقل می‌رساند',
      'مقاومت عالی در برابر لهیدگی سطحی (Flat Crush Test) به علت تراکم بالای کنگره',
      'برش و خط‌تاپذیری فوق‌العاده تمیز روی دستگاه‌های دایکات فلت و پینگ‌پنگی',
    ],
    paperCombinations: ['دو رو کرافت طبیعی (قهوه‌ای)', 'یک رو سفید (وایت‌تاپ) + یک رو قهوه‌ای', 'دو رو سفید بهداشتی', 'سینگل‌فیس (۲ لایه) ویژه لمینت'],
    variants: [
      {
        id: 'eflute-single',
        label: 'سینگل‌فیس E (۲ لایه)',
        subLabel: 'ویژه لمینت مقوا · ۱ لاینر + ۱ فلوت',
        specs: {
          grammage: '۲۳۰ تا ۲۶۰ گرم بر مترمربع',
          thickness: '۱.۳ میلی‌متر (۲ لایه)',
          weightCapacity: 'ECT 3.2 kN/m',
          dimensions: 'شیت یا رول (عرض تا ۱۴۰ cm)',
          printType: 'آماده لمینت مقوای افست',
          minOrder: '۵۰۰ مترمربع',
          jointType: 'چسب نشاسته صنعتی با چسبندگی بالا',
        },
        unitBasePriceToman: 24500,
      },
      {
        id: 'eflute-liner',
        label: '۳ لایه لاینر ایرانی',
        subLabel: 'لاینر ۱۲۵ + فلوت ۱۱۵ + لاینر ۱۲۵',
        specs: {
          grammage: '۳۸۰ گرم بر مترمربع',
          thickness: '۱.۵ میلی‌متر (فلوت E)',
          weightCapacity: 'ECT 4.2 kN/m',
          dimensions: 'برش شیت در ابعاد سفارشی',
          printType: 'فلکسو، سیلک یا لمینت',
          minOrder: '۵۰۰ مترمربع',
          jointType: '۳ لایه کنگره ریز (۹۴ کنگره/۳۰cm)',
        },
        unitBasePriceToman: 32000,
      },
      {
        id: 'eflute-kraft',
        label: '۳ لایه تست و کرافت',
        subLabel: 'تست‌لاینر ۱۴۰ + سمی ۱۲۵ + تست ۱۲۵',
        specs: {
          grammage: '۴۱۰ گرم بر مترمربع',
          thickness: '۱.۶ میلی‌متر (فلوت E)',
          weightCapacity: 'ECT 5.1 kN/m',
          dimensions: 'برش شیت با خط‌تا سفارشی',
          printType: 'چاپ مستقیم یا لمینت لوکس',
          minOrder: '۵۰۰ مترمربع',
          jointType: '۳ لایه مقاوم ضد رطوبت',
        },
        unitBasePriceToman: 38500,
      },
      {
        id: 'eflute-white',
        label: '۳ لایه رویه سفید',
        subLabel: 'سفید ۱۴۰ + فلوت ۱۲۵ + تست ۱۲۵',
        specs: {
          grammage: '۴۱۰ گرم بر مترمربع',
          thickness: '۱.۶ میلی‌متر (فلوت E)',
          weightCapacity: 'ECT 5.0 kN/m',
          dimensions: 'برش شیت دقیق بدون تاب‌برداشتگی',
          printType: 'سطح سفید عالی برای چاپ مستقیم',
          minOrder: '۵۰۰ مترمربع',
          jointType: '۳ لایه بهداشتی و فروشگاهی',
        },
        unitBasePriceToman: 42900,
      },
    ],
  },
  {
    id: 'sheet-flute-b',
    groupId: 'sheets',
    groupTitle: 'انواع ورق کارتن',
    name: 'ورق کارتن فلوت B (بی‌فلوت / ۳ لایه)',
    shortSubtitle: 'ضخامت ۲.۸ تا ۳.۰ میلی‌متر · ۴۷ تا ۵۳ کنگره در ۳۰ سانتی‌متر',
    technicalCode: 'FLUTE B · 3.0mm',
    badgeText: 'پرمصرف‌ترین ورق دایکاتی',
    image: IMAGES.sheetsFlutes,
    diagramType: 'flute-b',
    variantPromptLabel: 'ترکیب کاغذ ورق فلوت B را انتخاب کنید',
    description:
      'ورق ۳ لایه بی‌فلوت (B-Flute) استاندارد طلایی برای کارتن‌های دایکاتی، سینی‌های شرینک‌پک، کارتن‌های مواد غذایی و بسته‌بندی‌های نیمه‌سنگین است. تعادل کم‌نظیری بین مقاومت پانچ، کیفیت چاپ فلکسو و دایکات‌پذیری دارد.',
    applications: [
      'کارتن‌های دایکاتی صنعتی، کفی‌های شرینک‌پک و کارتن‌های پستی سایز کوچک و متوسط',
      'بسته‌بندی کنسروجات، قوطی‌های فلزی، بطری‌ها و قطعات خودرو',
      'تولید جعبه‌های لمینتی بزرگ برای لوازم خانگی و برقی',
    ],
    structuralFeatures: [
      'مقاومت بسیار بالا در برابر سوراخ‌شدگی و فشار سطحی (Flat Crush)',
      'عملکرد عالی روی دستگاه‌های دایکات روتاری، فلت و چاک‌زن بدون ترک خوردن خط‌تا',
      'اشغال فضای ۳۰٪ کمتر نسبت به ورق سی‌فلوت در پالت‌بندی ورق خام',
    ],
    paperCombinations: ['لاینر/فلوت/لاینر اقتصادی', 'تست‌لاینر/سمی‌کمیکال/تست', 'کرافت وارداتی/سمی/تست', 'وایت‌تاپ سفید/فلوت/تست'],
    variants: [
      {
        id: 'bflute-eco',
        label: '۳ لایه اقتصادی (ایرانی)',
        subLabel: 'لاینر ۱۳۰ + فلوت ۱۱۵ + لاینر ۱۲۵',
        specs: {
          grammage: '۴۰۰ گرم بر مترمربع',
          thickness: '۲.۸ میلی‌متر (فلوت B)',
          weightCapacity: 'ECT 4.4 kN/m',
          dimensions: 'شیت در ابعاد دلخواه مشتری',
          printType: 'مناسب فلکسو و لمینت',
          minOrder: '۵۰۰ مترمربع',
          jointType: '۵۰ کنگره در ۳۰ سانتی‌متر',
        },
        unitBasePriceToman: 31500,
      },
      {
        id: 'bflute-test',
        label: '۳ لایه تست و سمی‌کمیکال',
        subLabel: 'تست ۱۵۰ + سمی ۱۲۵ + تست ۱۳۰',
        specs: {
          grammage: '۴۴۵ گرم بر مترمربع',
          thickness: '۳.۰ میلی‌متر (فلوت B)',
          weightCapacity: 'ECT 5.6 kN/m',
          dimensions: 'برش شیت + خط‌تا اتوماتیک',
          printType: 'سطح یکدست مناسب چاپ فلکسو ۴ رنگ',
          minOrder: '۵۰۰ مترمربع',
          jointType: 'چسب نشاسته تقویت‌شده',
        },
        unitBasePriceToman: 37800,
      },
      {
        id: 'bflute-white',
        label: '۳ لایه سفید صادراتی',
        subLabel: 'وایت‌تاپ ۱۴۰ + سمی ۱۲۵ + تست ۱۳۰',
        specs: {
          grammage: '۴۳۵ گرم بر مترمربع',
          thickness: '۳.۰ میلی‌متر (فلوت B)',
          weightCapacity: 'ECT 5.5 kN/m',
          dimensions: 'شیت صاف بدون قوس',
          printType: 'سفید ممتاز جهت چاپ گرافیکی',
          minOrder: '۵۰۰ مترمربع',
          jointType: '۳ لایه استاندارد B-Flute',
        },
        unitBasePriceToman: 43200,
      },
      {
        id: 'bflute-kraft',
        label: '۳ لایه کرافت سنگین',
        subLabel: 'کرافت ۱۷۵ + سمی ۱۵۰ + تست ۱۵۰',
        specs: {
          grammage: '۵۲۵ گرم بر مترمربع',
          thickness: '۳.۱ میلی‌متر (فلوت B)',
          weightCapacity: 'ECT 7.2 kN/m',
          dimensions: 'شیت سفارشی صنعتی',
          printType: 'مقاوم در سردخانه و رطوبت',
          minOrder: '۵۰۰ مترمربع',
          jointType: 'چسب ضدآب پلیمری',
        },
        unitBasePriceToman: 49500,
      },
    ],
  },
  {
    id: 'sheet-flute-c',
    groupId: 'sheets',
    groupTitle: 'انواع ورق کارتن',
    name: 'ورق کارتن فلوت C (سی‌فلوت / ۳ لایه)',
    shortSubtitle: 'ضخامت ۳.۸ تا ۴.۰ میلی‌متر · ۳۹ تا ۴۳ کنگره در ۳۰ سانتی‌متر',
    technicalCode: 'FLUTE C · 4.0mm',
    badgeText: 'ضربه‌گیری و مقاومت عمودی',
    image: IMAGES.sheetsFlutes,
    diagramType: 'flute-c',
    variantPromptLabel: 'ترکیب کاغذ ورق فلوت C را انتخاب کنید',
    description:
      'ورق ۳ لایه سی‌فلوت (C-Flute) به دلیل ارتفاع بلندتر کنگره‌ها (۴ میلی‌متر)، خاصیت ضربه‌گیری (Cushioning) و مقاومت فشاری عمودی (ECT / BCT) بالاتری نسبت به فلوت B دارد و انتخاب اول برای کارتن‌های چاک‌دار آمریکایی (RSC) و انبارش پالتی است.',
    applications: [
      'کارتن‌های ۳ لایه معمولی (چاک‌دار) برای حمل‌ونقل و چیدمان روی هم در انبار',
      'بسته‌بندی ظروف شکستنی، شیشه، بلور، سرامیک و لوازم خانگی',
      'کارتن‌های مواد غذایی، حبوبات، ماکارونی، چیپس و پفک و محصولات حجیم',
    ],
    structuralFeatures: [
      'ارتفاع کنگره ۴ میلی‌متری که مانند ضربه‌گیر فنری از محصول داخل کارتن محافظت می‌کند',
      'تحمل بار عمودی (Stacking Strength) حدود ۱۵٪ بیشتر از ورق B-Flute هم‌وزن',
      'ایده‌آل برای تولید کارتن‌های سایز متوسط و بزرگ چاک‌دار',
    ],
    paperCombinations: ['لاینر/فلوت/لاینر استاندارد', 'تست‌لاینر/سمی/تست', 'وایت‌تاپ سفید/سمی/تست', 'کرافت وارداتی/سمی ۱۷۵/کرافت'],
    variants: [
      {
        id: 'cflute-std',
        label: '۳ لایه استاندارد',
        subLabel: 'لاینر ۱۳۰ + فلوت ۱۲۵ + لاینر ۱۳۰',
        specs: {
          grammage: '۴۲۵ گرم بر مترمربع',
          thickness: '۳.۸ میلی‌متر (فلوت C)',
          weightCapacity: 'ECT 4.8 kN/m',
          dimensions: 'شیت در ابعاد سفارشی کارتن',
          printType: 'چاپ فلکسو ۱ تا ۴ رنگ',
          minOrder: '۵۰۰ مترمربع',
          jointType: '۴۱ کنگره در ۳۰ سانتی‌متر',
        },
        unitBasePriceToman: 32500,
      },
      {
        id: 'cflute-test',
        label: '۳ لایه تست تقویت‌شده',
        subLabel: 'تست ۱۵۰ + سمی ۱۴۰ + تست ۱۴۰',
        specs: {
          grammage: '۴۷۵ گرم بر مترمربع',
          thickness: '۴.۰ میلی‌متر (فلوت C)',
          weightCapacity: 'ECT 6.1 kN/m',
          dimensions: 'برش و خط‌تا با دقت بالا',
          printType: 'فلکسو صنعتی با جذب مرکب عالی',
          minOrder: '۵۰۰ مترمربع',
          jointType: '۳ لایه کنگره متوسط ضربه‌گیر',
        },
        unitBasePriceToman: 38900,
      },
      {
        id: 'cflute-white',
        label: '۳ لایه سفید (وایت‌تاپ)',
        subLabel: 'سفید ۱۵۰ + سمی ۱۴۰ + تست ۱۳۰',
        specs: {
          grammage: '۴۶۵ گرم بر مترمربع',
          thickness: '۴.۰ میلی‌متر (فلوت C)',
          weightCapacity: 'ECT 5.9 kN/m',
          dimensions: 'شیت آماده چاپ و دایکات',
          printType: 'رویه سفید یکدست صادراتی',
          minOrder: '۵۰۰ مترمربع',
          jointType: 'چسب نشاسته صنعتی',
        },
        unitBasePriceToman: 44200,
      },
      {
        id: 'cflute-kraft',
        label: '۳ لایه کرافت سنگین',
        subLabel: 'کرافت ۱۷۵ + سمی ۱۷۵ + کرافت ۱۶۰',
        specs: {
          grammage: '۵۶۵ گرم بر مترمربع',
          thickness: '۴.۱ میلی‌متر (فلوت C)',
          weightCapacity: 'ECT 7.8 kN/m',
          dimensions: 'شیت سفارشی صادراتی',
          printType: 'فلکسو روی کرافت طبیعی',
          minOrder: '۵۰۰ مترمربع',
          jointType: 'مقاوم در برابر رطوبت و فشار پالت',
        },
        unitBasePriceToman: 51800,
      },
    ],
  },
  {
    id: 'sheet-flute-cb',
    groupId: 'sheets',
    groupTitle: 'انواع ورق کارتن',
    name: 'ورق ۵ لایه فلوت CB (سی‌بی فلوت)',
    shortSubtitle: 'ضخامت ۶.۸ تا ۷.۰ میلی‌متر · ترکیب طلایی استحکام و ضربه‌گیری',
    technicalCode: 'FLUTE CB · 7.0mm',
    badgeText: 'پرفروش‌ترین ورق ۵ لایه سنگین',
    image: IMAGES.sheetsFlutes,
    diagramType: 'flute-cb',
    variantPromptLabel: 'ترکیب کاغذ ورق ۵ لایه فلوت CB را انتخاب کنید',
    description:
      'ورق ۵ لایه سی‌بی فلوت (CB Double-Wall) از ترکیب یک لایه فلوت C (ضربه‌گیر و مقاوم عمودی) و یک لایه فلوت B (مقاوم در برابر سوراخ‌شدگی و صاف برای چاپ) تشکیل شده است. مستحکم‌ترین و پرکاربردترین ورق ۵ لایه برای بارهای سنگین، صادرات، ذغال و میوه است.',
    applications: [
      'کارتن‌های ۵ لایه سنگین صادراتی، ذغال، میوه و صیفی‌جات، خرما و خشکبار',
      'بسته‌بندی لوازم خانگی بزرگ (اجاق گاز، هود، سینک، پکیج، رادیاتور)',
      'کارتن‌های صنعتی قطعات خودرو، کاشی و سرامیک، چینی بهداشتی و مواد شیمیایی',
    ],
    structuralFeatures: [
      'ضخامت ۷ میلی‌متری واقعی با مقاومت عالی در برابر کمانش و لهیدگی در پالت',
      'سمت فلوت B در بیرون قرار می‌گیرد تا کیفیت چاپ فلکسو یا لمینت به حداکثر برسد',
      'سمت فلوت C در داخل قرار می‌گیرد تا نقش ضربه‌گیر برای کالای سنگین را ایفا کند',
    ],
    paperCombinations: ['۵ لایه استاندارد ایرانی', '۵ لایه تست‌لاینر و سمی‌کمیکال', '۵ لایه رویه سفید صادراتی', '۵ لایه کرافت وارداتی ضدآب'],
    variants: [
      {
        id: 'cb-standard',
        label: '۵ لایه استاندارد CB',
        subLabel: 'لاینر و فلوت ایرانی · ۶۵۰ گرم',
        specs: {
          grammage: '۶۵۰ گرم بر مترمربع',
          thickness: '۶.۸ میلی‌متر (فلوت C+B)',
          weightCapacity: 'ECT 7.5 kN/m (تا ۲۵ کیلو)',
          dimensions: 'برش شیت و خط‌تا تا عرض ۲۲۰ cm',
          printType: 'فلکسو یا لمینت',
          minOrder: '۳۰۰ مترمربع',
          jointType: '۵ لایه (۳ لاینر + فلوت C + فلوت B)',
        },
        unitBasePriceToman: 54000,
      },
      {
        id: 'cb-test-semi',
        label: '۵ لایه تست و سمی‌کمیکال',
        subLabel: 'تست ۱۵۰ + دو فلوت سمی ۱۴۰ · ۷۴۰ گرم',
        specs: {
          grammage: '۷۴۰ گرم بر مترمربع',
          thickness: '۷.۰ میلی‌متر (فلوت CB)',
          weightCapacity: 'ECT 9.2 kN/m (تا ۳۵ کیلو)',
          dimensions: 'شیت دقیق بدون تاب‌برداشتگی',
          printType: 'مناسب کارتن ذغال، صنعتی و صادراتی',
          minOrder: '۳۰۰ مترمربع',
          jointType: 'چسب نشاسته صنعتی پرقدرت',
        },
        unitBasePriceToman: 63500,
      },
      {
        id: 'cb-white-export',
        label: '۵ لایه رویه سفید CB',
        subLabel: 'وایت‌تاپ ۱۶۰ + فلوت سمی + تست',
        specs: {
          grammage: '۷۶۰ گرم بر مترمربع',
          thickness: '۷.۰ میلی‌متر (فلوت CB)',
          weightCapacity: 'ECT 9.5 kN/m (صادراتی)',
          dimensions: 'شیت آماده چاپ فلکسو چندرنگ',
          printType: 'رویه سفید درخشان صادراتی',
          minOrder: '۳۰۰ مترمربع',
          jointType: '۵ لایه استاندارد CB',
        },
        unitBasePriceToman: 71000,
      },
      {
        id: 'cb-kraft-heavy',
        label: '۵ لایه کرافت سردخانه‌ای',
        subLabel: 'کرافت ۲۰۰ + دو فلوت سمی ۱۷۵ + کرافت',
        specs: {
          grammage: '۹۲۰ گرم بر مترمربع',
          thickness: '۷.۲ میلی‌متر (فلوت CB سنگین)',
          weightCapacity: 'ECT 12.8 kN/m (تا ۵۰ کیلو)',
          dimensions: 'شیت سفارشی میوه و صنعت سنگین',
          printType: 'مقاوم در رطوبت سردخانه و کانتینر',
          minOrder: '۳۰۰ مترمربع',
          jointType: 'چسب ضدآب رزین‌دار',
        },
        unitBasePriceToman: 84000,
      },
    ],
  },
  {
    id: 'sheet-flute-ce',
    groupId: 'sheets',
    groupTitle: 'انواع ورق کارتن',
    name: 'ورق ۵ لایه فلوت CE (سی‌ای فلوت)',
    shortSubtitle: 'ضخامت ۵.۳ تا ۵.۵ میلی‌متر · ضربه‌گیری C همراه با سطح ظریف E',
    technicalCode: 'FLUTE CE · 5.5mm',
    badgeText: 'ویژه لمینت و چاپ مستقیم ۵ لایه',
    image: IMAGES.sheetsFlutes,
    diagramType: 'flute-ce',
    variantPromptLabel: 'ترکیب کاغذ ورق ۵ لایه فلوت CE را انتخاب کنید',
    description:
      'ورق ۵ لایه سی‌ای فلوت (CE Double-Wall) یک ساختار هوشمندانه است: لایه بیرونی فلوت E سطحی کاملاً صاف و بی‌نقص برای چاپ مستقیم یا لمینت پوستر افست فراهم می‌کند، درحالی‌که لایه درونی فلوت C ضربه‌گیری و تحمل بار یک کارتن ۵ لایه کامل را تضمین می‌نماید.',
    applications: [
      'کارتن‌های ۵ لایه لمینتی برای لوازم خانگی، زودپز، جاروبرقی و سینمای خانگی',
      'کارتن‌های صادراتی با چاپ گرافیکی ظریف که نیازمند مقاومت ضربه‌ای بالا هستند',
      'بسته‌بندی ابزارآلات برقی، دریل، فرز و تجهیزات صنعتی صادراتی',
    ],
    structuralFeatures: [
      'حذف کامل پدیده موج‌افتادگی (Washboarding) روی پوستر لمینت شده به لطف لایه بیرونی E-Flute',
      'کاهش ۲۰ درصدی حجم انبارش نسبت به ورق CB با حفظ مقاومت ضربه‌گیری فلوت C',
      'خط‌تاپذیری و دایکات بسیار تمیز در زوایای ۹۰ درجه',
    ],
    paperCombinations: ['۵ لایه CE ویژه لمینت (چهارلایه + پوستر)', '۵ لایه CE تست‌لاینر', '۵ لایه CE رویه سفید گلاسه/وایت‌تاپ'],
    variants: [
      {
        id: 'ce-laminating',
        label: '۵ لایه CE ویژه لمینت',
        subLabel: 'تست و فلوت استاندارد · ۶۴۰ گرم',
        specs: {
          grammage: '۶۴۰ گرم بر مترمربع',
          thickness: '۵.۴ میلی‌متر (فلوت C+E)',
          weightCapacity: 'ECT 7.4 kN/m',
          dimensions: 'شیت برش‌خورده دقیق برای لمینت',
          printType: 'سطح بیرونی E-Flute کاملاً مسطح',
          minOrder: '۳۰۰ مترمربع',
          jointType: '۵ لایه ترکیبی C و E',
        },
        unitBasePriceToman: 55500,
      },
      {
        id: 'ce-test-heavy',
        label: '۵ لایه CE تست و سمی',
        subLabel: 'تست ۱۵۰ + دو فلوت سمی ۱۳۰ · ۷۲۰ گرم',
        specs: {
          grammage: '۷۲۰ گرم بر مترمربع',
          thickness: '۵.۵ میلی‌متر (فلوت CE)',
          weightCapacity: 'ECT 8.9 kN/m',
          dimensions: 'شیت سفارشی دایکاتی و چاک‌دار',
          printType: 'چاپ فلکسو با ترام ظریف یا لمینت',
          minOrder: '۳۰۰ مترمربع',
          jointType: 'چسب نشاسته صنعتی',
        },
        unitBasePriceToman: 64200,
      },
      {
        id: 'ce-white-top',
        label: '۵ لایه CE رویه سفید',
        subLabel: 'وایت‌تاپ ۱۵۰ رویه E + فلوت C داخلی',
        specs: {
          grammage: '۷۴۰ گرم بر مترمربع',
          thickness: '۵.۵ میلی‌متر (فلوت CE)',
          weightCapacity: 'ECT 9.1 kN/m',
          dimensions: 'شیت بدون قوس ویژه چاپ حساس',
          printType: 'چاپ مستقیم ۴ رنگ با کیفیت عالی',
          minOrder: '۳۰۰ مترمربع',
          jointType: '۵ لایه ممتاز صادراتی',
        },
        unitBasePriceToman: 72500,
      },
      {
        id: 'ce-kraft-pro',
        label: '۵ لایه CE کرافت صادراتی',
        subLabel: 'کرافت ۱۷۵ + دو فلوت سمی ۱۵۰',
        specs: {
          grammage: '۸۳۰ گرم بر مترمربع',
          thickness: '۵.۶ میلی‌متر (فلوت CE)',
          weightCapacity: 'ECT 11.2 kN/m',
          dimensions: 'شیت سفارشی صنعتی',
          printType: 'لمینت افست یا چاپ روی کرافت',
          minOrder: '۳۰۰ مترمربع',
          jointType: 'چسب ضدآب مقاوم',
        },
        unitBasePriceToman: 79800,
      },
    ],
  },
  {
    id: 'sheet-flute-be',
    groupId: 'sheets',
    groupTitle: 'انواع ورق کارتن',
    name: 'ورق ۵ لایه فلوت BE (بی‌ای فلوت / میکرو ۵ لایه)',
    shortSubtitle: 'ضخامت ۴.۳ تا ۴.۵ میلی‌متر · ۵ لایه فشرده با مقاومت فوق‌العاده',
    technicalCode: 'FLUTE BE · 4.5mm',
    badgeText: 'میکرو ۵ لایه دایکاتی',
    image: IMAGES.sheetsFlutes,
    diagramType: 'flute-be',
    variantPromptLabel: 'ترکیب کاغذ ورق ۵ لایه فلوت BE را انتخاب کنید',
    description:
      'ورق ۵ لایه بی‌ای فلوت (BE Micro Double-Wall) نسل مدرن ورق‌های ۵ لایه است. با ترکیب دو فلوت ریز B و E، ضخامت ورق تنها ۴.۵ میلی‌متر (معادل یک ورق ۳ لایه C) است اما استحکام، مقاومت پانچ و تحمل وزن یک ورق ۵ لایه واقعی را ارائه می‌دهد و روی ظریف‌ترین قالب‌های دایکات بدون ترک‌خوردگی اجرا می‌شود.',
    applications: [
      'جعبه‌های دایکاتی ۵ لایه برای قطعات سنگین خودرو، شیرآلات، ابزار و یراق‌آلات',
      'جعبه و کارتن مادر خرما، خشکبار، زعفران، عسل و بطری‌های شیشه‌ای صادراتی',
      'استندهای فروشگاهی طبقاتی و جعبه‌های لاک‌باتم یا کیبوردی سایز بزرگ',
    ],
    structuralFeatures: [
      'ضخامت کم (۴.۵ میلی‌متر) با تراکم الیاف بسیار بالا و مقاومت فوق‌العاده در برابر لهیدگی',
      'بهترین ورق ۵ لایه برای قالب‌های دایکات پیچیده، قفلی و لاک‌باتم',
      'صرفه‌جویی ۳۵ درصدی در فضای انبار و کانتینر نسبت به ورق ۵ لایه CB',
    ],
    paperCombinations: ['۵ لایه BE استاندارد دایکاتی', '۵ لایه BE تست و سمی‌کمیکال', '۵ لایه BE رویه سفید بهداشتی', '۵ لایه BE کرافت وارداتی'],
    variants: [
      {
        id: 'be-diecut-std',
        label: '۵ لایه BE دایکاتی استاندارد',
        subLabel: 'لاینر و فلوت ایرانی · ۶۴۰ گرم',
        specs: {
          grammage: '۶۴۰ گرم بر مترمربع',
          thickness: '۴.۳ میلی‌متر (فلوت B+E)',
          weightCapacity: 'ECT 7.8 kN/m',
          dimensions: 'شیت دقیق ویژه قالب دایکات',
          printType: 'لمینت افست یا فلکسو ظریف',
          minOrder: '۳۰۰ مترمربع',
          jointType: '۵ لایه فشرده میکرو (B+E)',
        },
        unitBasePriceToman: 55000,
      },
      {
        id: 'be-test-semi',
        label: '۵ لایه BE تست و سمی',
        subLabel: 'تست ۱۵۰ + دو فلوت سمی ۱۳۰ · ۷۳۰ گرم',
        specs: {
          grammage: '۷۳۰ گرم بر مترمربع',
          thickness: '۴.۵ میلی‌متر (فلوت BE)',
          weightCapacity: 'ECT 9.4 kN/m',
          dimensions: 'برش شیت بدون ذره‌ای انحنا',
          printType: 'ایده‌آل برای لمینت و دایکات سنگین',
          minOrder: '۳۰۰ مترمربع',
          jointType: 'تراکم کنگره بالا (۵۰ + ۹۴ کنگره)',
        },
        unitBasePriceToman: 64800,
      },
      {
        id: 'be-white-pro',
        label: '۵ لایه BE رویه سفید',
        subLabel: 'وایت‌تاپ ۱۵۰ + سمی + تست',
        specs: {
          grammage: '۷۴۵ گرم بر مترمربع',
          thickness: '۴.۵ میلی‌متر (فلوت BE)',
          weightCapacity: 'ECT 9.5 kN/m',
          dimensions: 'شیت آماده دایکات و چاپ',
          printType: 'رویه سفید صاف بدون رد کنگره',
          minOrder: '۳۰۰ مترمربع',
          jointType: '۵ لایه بهداشتی و صنعتی',
        },
        unitBasePriceToman: 73200,
      },
      {
        id: 'be-kraft-export',
        label: '۵ لایه BE کرافت وارداتی',
        subLabel: 'کرافت ۱۷۵ + دو فلوت سمی ۱۵۰',
        specs: {
          grammage: '۸۵۰ گرم بر مترمربع',
          thickness: '۴.۶ میلی‌متر (فلوت BE)',
          weightCapacity: 'ECT 11.8 kN/m',
          dimensions: 'شیت صادراتی فوق‌فشرده',
          printType: 'چاپ مستقیم یا لمینت صادراتی',
          minOrder: '۳۰۰ مترمربع',
          jointType: 'چسب ضدآب با استحکام کششی بالا',
        },
        unitBasePriceToman: 81500,
      },
    ],
  },
];

// ==================== PURE LOGIC & HELPERS (UNIT TESTABLE) ====================

export type CatalogRoute =
  | { page: 'cover' }
  | { page: 'menu' }
  | { page: 'groups'; pageNum: number }
  | { page: 'group-detail'; groupId: CategoryId; pageNum: number }
  | { page: 'product'; productId: string }
  | { page: 'about' }
  | { page: 'contact' };

/**
 * Parses location.hash (e.g. "#/cover", "#/menu", "#/groups/1", "#/g/boxes/1", "#/p/box-stand")
 * into a deterministic CatalogRoute state. Also supports numeric group aliases ("1" -> "boxes", etc.)
 * just like the reference catalog URL pattern.
 */
export function parseCatalogRoute(
  hash: string,
  search: string = '',
  customProducts: CatalogProduct[] = CATALOG_PRODUCTS
): CatalogRoute {
  const params = new URLSearchParams(search);
  const clean = (hash || '').replace(/^#\/?/, '').trim();

  if (!clean || clean === 'cover') {
    if (params.get('autostart') === '1') {
      return { page: 'menu' };
    }
    return { page: 'cover' };
  }

  if (clean === 'menu') return { page: 'menu' };
  if (clean === 'about') return { page: 'about' };
  if (clean === 'contact') return { page: 'contact' };

  const parts = clean.split('/');

  if (parts[0] === 'groups') {
    const pageNum = Math.max(1, parseInt(parts[1] || '1', 10) || 1);
    return { page: 'groups', pageNum };
  }

  if (parts[0] === 'g') {
    const rawGroup = parts[1] || 'boxes';
    let groupId: CategoryId = 'boxes';
    if (rawGroup === '1' || rawGroup === 'boxes') groupId = 'boxes';
    else if (rawGroup === '2' || rawGroup === 'cartons') groupId = 'cartons';
    else if (rawGroup === '3' || rawGroup === 'sheets') groupId = 'sheets';

    const pageArg = parts.length >= 4 ? parts[3] : parts[2] || '1';
    const pageNum = Math.max(1, parseInt(pageArg, 10) || 1);
    return { page: 'group-detail', groupId, pageNum };
  }

  if (parts[0] === 'p' && parts[1]) {
    const product = getProductById(parts[1], customProducts);
    if (product) {
      return { page: 'product', productId: product.id };
    }
  }

  return { page: 'cover' };
}

export function getProductById(
  productId: string,
  customProducts: CatalogProduct[] = CATALOG_PRODUCTS
): CatalogProduct | undefined {
  return customProducts.find((p) => p.id === productId);
}

export function getGroupById(
  groupId: CategoryId,
  customGroups: ProductGroup[] = PRODUCT_GROUPS
): ProductGroup {
  return customGroups.find((g) => g.id === groupId) || customGroups[0] || PRODUCT_GROUPS[0];
}

export function getGroupProducts(
  groupId: CategoryId,
  customProducts: CatalogProduct[] = CATALOG_PRODUCTS
): CatalogProduct[] {
  return customProducts.filter((p) => p.groupId === groupId);
}

export function getAdjacentProducts(
  productId: string,
  customProducts: CatalogProduct[] = CATALOG_PRODUCTS
): {
  prev: CatalogProduct | null;
  next: CatalogProduct | null;
} {
  const current = getProductById(productId, customProducts);
  if (!current) return { prev: null, next: null };
  const siblings = getGroupProducts(current.groupId, customProducts);
  const idx = siblings.findIndex((p) => p.id === productId);
  return {
    prev: idx > 0 ? siblings[idx - 1] : null,
    next: idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null,
  };
}

export function filterCatalogProducts(
  query: string,
  categoryFilter: CategoryId | 'all' = 'all',
  customProducts: CatalogProduct[] = CATALOG_PRODUCTS
): CatalogProduct[] {
  const normalized = query.trim().toLowerCase();
  return customProducts.filter((item) => {
    if (categoryFilter !== 'all' && item.groupId !== categoryFilter) {
      return false;
    }
    if (!normalized) return true;
    const haystack = [
      item.name,
      item.shortSubtitle,
      item.technicalCode,
      item.groupTitle,
      item.description,
      ...item.applications,
      ...item.variants.map((v) => `${v.label} ${v.subLabel}`),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export interface OrderEstimateInput {
  productId: string;
  variantId: string;
  quantity: number;
  customPrint: boolean;
}

export interface OrderEstimateResult {
  unitPrice: number;
  discountPercent: number;
  totalPrice: number;
  isValidQuantity: boolean;
}

export function calculateOrderEstimate(
  input: OrderEstimateInput,
  customProducts: CatalogProduct[] = CATALOG_PRODUCTS
): OrderEstimateResult {
  const product = getProductById(input.productId, customProducts);
  const variant =
    product?.variants.find((v) => v.id === input.variantId) || product?.variants[0];

  if (!product || !variant || !Number.isFinite(input.quantity) || input.quantity <= 0) {
    return {
      unitPrice: 0,
      discountPercent: 0,
      totalPrice: 0,
      isValidQuantity: false,
    };
  }

  let discountPercent = 0;
  if (input.quantity >= 5000) discountPercent = 14;
  else if (input.quantity >= 2000) discountPercent = 9;
  else if (input.quantity >= 1000) discountPercent = 5;

  const printAddon = input.customPrint ? Math.round(variant.unitBasePriceToman * 0.12) : 0;
  const rawUnit = variant.unitBasePriceToman + printAddon;
  const discountedUnit = Math.round(rawUnit * (1 - discountPercent / 100));
  const totalPrice = discountedUnit * Math.floor(input.quantity);

  return {
    unitPrice: discountedUnit,
    discountPercent,
    totalPrice,
    isValidQuantity: input.quantity >= 100,
  };
}

export function toPersianDigits(value: string | number): string {
  const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(value).replace(/\d/g, (d) => persian[Number(d)]);
}

export function formatToman(amount: number): string {
  return toPersianDigits(amount.toLocaleString('en-US'));
}

/**
 * Converts Persian/Arabic numerals and local Iranian mobile formats (e.g. 09396410276 or +989396410276)
 * into clean international WhatsApp digits (e.g. 989396410276).
 */
export function normalizeWhatsappNumber(
  raw?: string,
  fallback: string = COMPANY_INFO.whatsappNumber
): string {
  const convertDigits = (str: string) =>
    str
      .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
      .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
      .replace(/\D/g, '');

  let digits = convertDigits(raw || '');
  if (!digits) {
    digits = convertDigits(fallback) || '989396410276';
  }
  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }
  if (digits.startsWith('09') && digits.length === 11) {
    digits = '98' + digits.slice(1);
  } else if (digits.startsWith('9') && digits.length === 10) {
    digits = '98' + digits;
  }
  return digits;
}

/**
 * Resolves the effective WhatsApp consultation number for a given product:
 * 1) Product-specific whatsappNumber (if set)
 * 2) Category/Group-specific whatsappNumber (if set)
 * 3) Global Contact Page whatsappNumber fallback
 */
export function getProductWhatsappNumber(
  product: CatalogProduct,
  groups: ProductGroup[] = PRODUCT_GROUPS,
  fallback: string = COMPANY_INFO.whatsappNumber
): string {
  if (product.whatsappNumber && product.whatsappNumber.trim()) {
    return normalizeWhatsappNumber(product.whatsappNumber, fallback);
  }
  const group = groups.find((g) => g.id === product.groupId);
  if (group?.whatsappNumber && group.whatsappNumber.trim()) {
    return normalizeWhatsappNumber(group.whatsappNumber, fallback);
  }
  return normalizeWhatsappNumber(fallback, COMPANY_INFO.whatsappNumber);
}

/**
 * Formats an international Iranian phone number (e.g. 989396410276) into local 09... format (e.g. 09396410276).
 */
export function formatLocalIranPhone(intlDigits: string): string {
  if (intlDigits.startsWith('98') && intlDigits.length === 12) {
    return '0' + intlDigits.slice(2);
  }
  return intlDigits;
}

/**
 * Resolves the active state of each messenger (WhatsApp, Eitaa, Rubika) for a product:
 * 1) Product-level override (product.messengers?.[key])
 * 2) Category/Group-level override (group.messengers?.[key])
 * 3) Global default config (globalMessengers[key] ?? true)
 */
export function getProductMessengerConfig(
  product: CatalogProduct,
  groups: ProductGroup[] = PRODUCT_GROUPS,
  globalMessengers: MessengerConfig = DEFAULT_MESSENGERS
): MessengerConfig {
  const group = groups.find((g) => g.id === product.groupId);
  const resolveKey = (key: MessengerId): boolean => {
    if (typeof product.messengers?.[key] === 'boolean') {
      return Boolean(product.messengers[key]);
    }
    if (typeof group?.messengers?.[key] === 'boolean') {
      return Boolean(group.messengers[key]);
    }
    if (typeof globalMessengers?.[key] === 'boolean') {
      return Boolean(globalMessengers[key]);
    }
    return true;
  };

  return {
    whatsapp: resolveKey('whatsapp'),
    eitaa: resolveKey('eitaa'),
    rubika: resolveKey('rubika'),
  };
}

export interface ProductMessengerLink {
  id: MessengerId;
  label: string;
  href: string;
  phoneIntl: string;
  phoneLocal: string;
  messageText: string;
  enabled: boolean;
  bgClass: string;
}

/**
 * Builds consultation links for WhatsApp, Eitaa, and Rubika for a given product and variant,
 * using the configured consultation phone number and active messenger flags.
 */
export function buildProductMessengerLinks(
  product: CatalogProduct,
  variantLabel: string,
  groups: ProductGroup[] = PRODUCT_GROUPS,
  fallbackNumber: string = COMPANY_INFO.whatsappNumber,
  globalMessengers: MessengerConfig = DEFAULT_MESSENGERS
): ProductMessengerLink[] {
  const phoneIntl = getProductWhatsappNumber(product, groups, fallbackNumber);
  const phoneLocal = formatLocalIranPhone(phoneIntl);
  const config = getProductMessengerConfig(product, groups, globalMessengers);
  const messageText = `سلام، لطفاً قیمت و شرایط تولید «${product.name} - تیپ ${variantLabel}» را اعلام فرمایید.`;
  const encodedMsg = encodeURIComponent(messageText);
  const encodedMsgWithPhone = encodeURIComponent(
    `${messageText}\nشماره تماس پشتیبانی: ${phoneLocal}`
  );

  const allLinks: ProductMessengerLink[] = [
    {
      id: 'whatsapp',
      label: 'واتساپ',
      href: `https://wa.me/${phoneIntl}?text=${encodedMsg}`,
      phoneIntl,
      phoneLocal,
      messageText,
      enabled: config.whatsapp,
      bgClass: 'bg-[#15803D] hover:bg-[#166534]',
    },
    {
      id: 'eitaa',
      label: 'ایتا',
      href: `https://eitaa.com/share/url?url=${encodeURIComponent(
        `tel:+${phoneIntl}`
      )}&text=${encodedMsgWithPhone}`,
      phoneIntl,
      phoneLocal,
      messageText,
      enabled: config.eitaa,
      bgClass: 'bg-[#EA580C] hover:bg-[#C2410C]',
    },
    {
      id: 'rubika',
      label: 'روبیکا',
      href: `https://rubika.ir/${phoneLocal}?text=${encodedMsg}`,
      phoneIntl,
      phoneLocal,
      messageText,
      enabled: config.rubika,
      bgClass: 'bg-[#6D28D9] hover:bg-[#5B21B6]',
    },
  ];

  return allLinks;
}

/**
 * Resolves the effective sample image and schematic image for a specific product variant:
 * - Uses variant.image if defined on the variant, otherwise falls back to product.image.
 * - Uses variant.schematicImage if defined on the variant, otherwise falls back to product.schematicImage.
 */
export function getVariantEffectiveMedia(
  product: CatalogProduct,
  variant?: ProductVariant
): {
  image: string;
  schematicImage?: string;
} {
  const targetVariant = variant || product.variants[0];
  return {
    image:
      targetVariant?.image && targetVariant.image.trim()
        ? targetVariant.image
        : product.image,
    schematicImage:
      targetVariant?.schematicImage && targetVariant.schematicImage.trim()
        ? targetVariant.schematicImage
        : product.schematicImage,
  };
}

/**
 * Returns only the variants that are currently enabled (shown) for a product.
 * Variants without an explicit `enabled` flag default to visible (`true`).
 */
export function getVisibleProductVariants(product: CatalogProduct): ProductVariant[] {
  return product.variants.filter((v) => v.enabled !== false);
}

/**
 * Checks whether a specific technical spec field is enabled (shown) for a variant.
 * Defaults to `true` when not explicitly set to `false`.
 */
export function isVariantSpecVisible(
  variant: ProductVariant | undefined,
  specKey: SpecFieldKey
): boolean {
  if (!variant) return false;
  return variant.specsVisibility?.[specKey] !== false;
}

/**
 * Checks whether at least one technical spec field is enabled for the given variant.
 */
export function hasAnyVisibleVariantSpec(variant: ProductVariant | undefined): boolean {
  if (!variant) return false;
  return ALL_SPEC_FIELD_KEYS.some((key) => isVariantSpecVisible(variant, key));
}

export const GROUP_PRODUCTS_PER_PAGE = 8;

export interface PaginatedGroupPage {
  globalPageNumber: number;
  groupId: CategoryId;
  groupTitle: string;
  groupPageNum: number;
  totalGroupPages: number;
  routeHash: string;
  products: CatalogProduct[];
}

/**
 * Builds the ordered list of all product listing pages across the catalog,
 * with up to 8 products per page (GROUP_PRODUCTS_PER_PAGE = 8).
 */
export function buildPaginatedGroupPages(
  customProducts: CatalogProduct[] = CATALOG_PRODUCTS,
  customGroups: ProductGroup[] = PRODUCT_GROUPS
): PaginatedGroupPage[] {
  const result: PaginatedGroupPage[] = [];
  let globalIdx = 1;

  for (const group of customGroups) {
    const groupProds = customProducts.filter((p) => p.groupId === group.id);
    const totalGroupPages = Math.max(
      1,
      Math.ceil(groupProds.length / GROUP_PRODUCTS_PER_PAGE)
    );

    for (let pNum = 1; pNum <= totalGroupPages; pNum++) {
      const slice = groupProds.slice(
        (pNum - 1) * GROUP_PRODUCTS_PER_PAGE,
        pNum * GROUP_PRODUCTS_PER_PAGE
      );
      result.push({
        globalPageNumber: globalIdx++,
        groupId: group.id,
        groupTitle: group.title,
        groupPageNum: pNum,
        totalGroupPages,
        routeHash: pNum === 1 ? `#/g/${group.id}` : `#/g/${group.id}/${pNum}`,
        products: slice,
      });
    }
  }

  return result;
}

/**
 * Returns the paginated pages strictly for a single category (boxes, cartons, or sheets),
 * with up to 8 products per page and independent 1..N numbering per category.
 */
export function getPaginatedPagesForGroup(
  groupId: CategoryId,
  customProducts: CatalogProduct[] = CATALOG_PRODUCTS,
  customGroups: ProductGroup[] = PRODUCT_GROUPS
): PaginatedGroupPage[] {
  return buildPaginatedGroupPages(customProducts, customGroups).filter(
    (p) => p.groupId === groupId
  );
}

/**
 * Returns the exact category page route (e.g. '#/g/boxes' or '#/g/boxes/2')
 * where a given product appears based on 8 products per page.
 */
export function getProductGroupPageRoute(
  productId: string,
  customProducts: CatalogProduct[] = CATALOG_PRODUCTS
): string {
  const product = getProductById(productId, customProducts);
  if (!product) return '#/groups/1';
  const siblings = getGroupProducts(product.groupId, customProducts);
  const idx = siblings.findIndex((p) => p.id === productId);
  const pageNum = idx >= 0 ? Math.floor(idx / GROUP_PRODUCTS_PER_PAGE) + 1 : 1;
  return pageNum <= 1 ? `#/g/${product.groupId}` : `#/g/${product.groupId}/${pageNum}`;
}

export type PdfPageType =
  | { type: 'cover' }
  | { type: 'menu' }
  | { type: 'about' }
  | { type: 'groups' }
  | { type: 'group-detail'; groupId: CategoryId; pageNum?: number }
  | {
      type: 'product';
      productId: string;
      variantIndex: number;
      visualMode: 'diagram' | 'photo';
    }
  | { type: 'product-spec'; productId: string }
  | { type: 'contact' };

export interface PdfPageEntry {
  pdfId: string;
  pageNumber: number;
  routeHash: string;
  target: PdfPageType;
}

/**
 * Builds the complete interactive PDF manifest:
 * - Main sequential pages (Cover, Menu, About, Groups, 3 Group Details, Product Detail pages, Contact Us).
 * - Interactive state pages for all products (Variants, Studio Photo view, Full Table + Technical Features view)
 *   and additional paginated group pages (>8 products per group).
 */
export function buildPdfCatalogManifest(
  customProducts: CatalogProduct[] = CATALOG_PRODUCTS,
  customGroups: ProductGroup[] = PRODUCT_GROUPS
): {
  pages: PdfPageEntry[];
  routeToPdfId: Record<string, string>;
} {
  const specs: Array<{ routeHash: string; target: PdfPageType }> = [
    { routeHash: '#/cover', target: { type: 'cover' } },
    { routeHash: '#/menu', target: { type: 'menu' } },
    { routeHash: '#/about', target: { type: 'about' } },
    { routeHash: '#/groups/1', target: { type: 'groups' } },
  ];

  for (const group of customGroups) {
    specs.push({
      routeHash: `#/g/${group.id}`,
      target: { type: 'group-detail', groupId: group.id, pageNum: 1 },
    });
  }

  // Main page for each product (first visible variant, Diagram mode)
  for (const product of customProducts) {
    const firstVisibleIdx = product.variants.findIndex((v) => v.enabled !== false);
    const defaultVariantIdx = firstVisibleIdx >= 0 ? firstVisibleIdx : 0;
    specs.push({
      routeHash: `#/p/${product.id}`,
      target: {
        type: 'product',
        productId: product.id,
        variantIndex: defaultVariantIdx,
        visualMode: 'diagram',
      },
    });
  }

  specs.push({ routeHash: '#/contact', target: { type: 'contact' } });

  // Interactive state pages for each product: additional visible variants, Photo mode, and Full Table + Specs
  for (const product of customProducts) {
    const firstVisibleIdx = product.variants.findIndex((v) => v.enabled !== false);
    const defaultVariantIdx = firstVisibleIdx >= 0 ? firstVisibleIdx : 0;

    for (let vIdx = 0; vIdx < product.variants.length; vIdx++) {
      if (vIdx === defaultVariantIdx) continue;
      if (product.variants[vIdx].enabled === false) continue;
      specs.push({
        routeHash: `#/p/${product.id}?v=${vIdx}`,
        target: {
          type: 'product',
          productId: product.id,
          variantIndex: vIdx,
          visualMode: 'diagram',
        },
      });
    }

    specs.push({
      routeHash: `#/p/${product.id}?mode=photo`,
      target: {
        type: 'product',
        productId: product.id,
        variantIndex: defaultVariantIdx,
        visualMode: 'photo',
      },
    });

    specs.push({
      routeHash: `#/p/${product.id}?modal=spec`,
      target: {
        type: 'product-spec',
        productId: product.id,
      },
    });
  }

  // Additional paginated group pages if any category has more than 8 products
  for (const group of customGroups) {
    const groupProds = customProducts.filter((p) => p.groupId === group.id);
    const totalGroupPages = Math.max(
      1,
      Math.ceil(groupProds.length / GROUP_PRODUCTS_PER_PAGE)
    );
    for (let pNum = 2; pNum <= totalGroupPages; pNum++) {
      specs.push({
        routeHash: `#/g/${group.id}/${pNum}`,
        target: { type: 'group-detail', groupId: group.id, pageNum: pNum },
      });
    }
  }

  // Additional variant-specific photo pages when a visible variant has its own custom sample image
  for (const product of customProducts) {
    const firstVisibleIdx = product.variants.findIndex((v) => v.enabled !== false);
    const defaultVariantIdx = firstVisibleIdx >= 0 ? firstVisibleIdx : 0;
    for (let vIdx = 0; vIdx < product.variants.length; vIdx++) {
      if (vIdx === defaultVariantIdx) continue;
      const v = product.variants[vIdx];
      if (v.enabled === false) continue;
      if (v.image && v.image.trim()) {
        specs.push({
          routeHash: `#/p/${product.id}?v=${vIdx}&mode=photo`,
          target: {
            type: 'product',
            productId: product.id,
            variantIndex: vIdx,
            visualMode: 'photo',
          },
        });
      }
    }
  }

  const routeToPdfId: Record<string, string> = {};
  const pages: PdfPageEntry[] = specs.map((spec, idx) => {
    const pdfId = `pdf-${idx}`;
    routeToPdfId[spec.routeHash] = pdfId;
    return {
      pdfId,
      pageNumber: idx + 1,
      routeHash: spec.routeHash,
      target: spec.target,
    };
  });

  // Also map default variant explicit query and numeric/page-1 group aliases
  for (const product of customProducts) {
    const firstVisibleIdx = product.variants.findIndex((v) => v.enabled !== false);
    const defaultVariantIdx = firstVisibleIdx >= 0 ? firstVisibleIdx : 0;
    routeToPdfId[`#/p/${product.id}?v=${defaultVariantIdx}`] =
      routeToPdfId[`#/p/${product.id}`];
    if (!routeToPdfId[`#/p/${product.id}?v=0`]) {
      routeToPdfId[`#/p/${product.id}?v=0`] = routeToPdfId[`#/p/${product.id}`];
    }
    routeToPdfId[`#/p/${product.id}?mode=diagram`] = routeToPdfId[`#/p/${product.id}`];
    routeToPdfId[`#/p/${product.id}?v=${defaultVariantIdx}&mode=photo`] =
      routeToPdfId[`#/p/${product.id}?mode=photo`];
    for (let vIdx = 0; vIdx < product.variants.length; vIdx++) {
      if (!routeToPdfId[`#/p/${product.id}?v=${vIdx}&mode=photo`]) {
        routeToPdfId[`#/p/${product.id}?v=${vIdx}&mode=photo`] =
          routeToPdfId[`#/p/${product.id}?mode=photo`];
      }
    }
  }
  for (const group of customGroups) {
    routeToPdfId[`#/g/${group.id}/1`] = routeToPdfId[`#/g/${group.id}`];
  }
  routeToPdfId['#/g/1'] = routeToPdfId['#/g/boxes'];
  routeToPdfId['#/g/2'] = routeToPdfId['#/g/cartons'];
  routeToPdfId['#/g/3'] = routeToPdfId['#/g/sheets'];
  routeToPdfId['#/groups'] = routeToPdfId['#/groups/1'];

  return { pages, routeToPdfId };
}

export function getPdfPageIdForRoute(
  routeHash: string,
  customProducts: CatalogProduct[] = CATALOG_PRODUCTS
): string {
  const { routeToPdfId } = buildPdfCatalogManifest(customProducts);
  return routeToPdfId[routeHash] || 'pdf-0';
}


