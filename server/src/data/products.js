// Centralized product & category data for Loghmeh.
// Prices are in Toman (numbers, never formatted strings) and are editable
// demonstration values — not verified real prices.

const img = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const DELIVERY_FEE = 35000; // Toman, flat — shown transparently at checkout
export const FREE_DELIVERY_THRESHOLD = 800000; // orders above this ship free

export const categories = [
  { id: 'irani', name: 'غذاهای ایرانی', image: img('photo-1603360946369-dc9bb6258143', 700) },
  { id: 'stews', name: 'خورشت‌های ایرانی', image: img('photo-1590301157890-4810ed352733', 700) },
  { id: 'rice', name: 'غذاهای برنجی', image: img('photo-1631515243349-e0cb75fb8d3a', 700) },
  { id: 'daily', name: 'غذاهای روز', image: img('photo-1563379926898-05f4575a45d8', 700) },
  { id: 'light', name: 'غذاهای سبک', image: img('photo-1607532941433-304659e8198a', 700) },
  { id: 'sides', name: 'پیش‌غذا و دورچین', image: img('photo-1540420773420-3366772f4999', 700) },
];

// createdAt is a stable ordering key: smaller = older.
const t = (n) => n;

export const products = [
  {
    id: 'p1',
    slug: 'zereshk-polo-ba-morgh',
    name: 'زرشک‌پلو با مرغ',
    category: 'rice',
    description: 'برنج خوش‌عطر همراه با مرغ و زرشک.',
    longDescription:
      'ترکیبی دل‌چسب از برنج خوش‌عطر، زرشک و مرغ؛ انتخابی دوست‌داشتنی برای یک وعده غذای خانگی.',
    price: 285000,
    originalPrice: 320000,
    serving: 'یک پرس',
    image: img('photo-1631515243349-e0cb75fb8d3a'),
    ingredients: ['برنج', 'مرغ', 'زرشک', 'پیاز', 'کره'],
    available: true,
    featured: true,
    daily: true,
    createdAt: t(1),
  },
  {
    id: 'p2',
    slug: 'ghormeh-sabzi',
    name: 'قورمه‌سبزی',
    category: 'stews',
    description: 'خورشت محبوب ایرانی با سبزی‌های معطر و طعم آشنا.',
    longDescription:
      'خورشت قورمه‌سبزی با سبزی‌های تازه و معطر، لوبیا و گوشت؛ همان طعمی که از غذای خونگی انتظار داری.',
    price: 215000,
    serving: 'یک پرس',
    image: img('photo-1590301157890-4810ed352733'),
    ingredients: ['سبزی قورمه‌سبزی', 'گوشت', 'لوبیا', 'لیموعمانی'],
    available: true,
    featured: true,
    daily: false,
    createdAt: t(2),
  },
  {
    id: 'p3',
    slug: 'gheymeh-sibzamini',
    name: 'قیمه‌سیب‌زمینی',
    category: 'stews',
    description: 'خورشت قیمه با سیب‌زمینی و همراهی برنج.',
    longDescription:
      'خورشت قیمه خانگی با سیب‌زمینی سرخ‌شده و طعمی آشنا و دوست‌داشتنی؛ همراه با برنج تازه.',
    price: 195000,
    serving: 'یک پرس',
    image: img('photo-1585937421612-70a008356fbe'),
    ingredients: ['گوشت', 'سیب‌زمینی', 'لوبیاچیتی', 'رب گوجه'],
    available: true,
    featured: true,
    daily: true,
    createdAt: t(3),
  },
  {
    id: 'p4',
    slug: 'adas-polo',
    name: 'عدس‌پلو',
    category: 'rice',
    description: 'ترکیبی خوش‌طعم از عدس و برنج.',
    longDescription:
      'عدس‌پلوی گرم و خوش‌عطر با کشمش و پیازداغ؛ یک انتخاب ساده و دلچسب برای وعده روز.',
    price: 165000,
    serving: 'یک پرس',
    image: img('photo-1547592180-85f173990554'),
    ingredients: ['برنج', 'عدس', 'کشمش', 'پیاز'],
    available: true,
    featured: false,
    daily: true,
    createdAt: t(4),
  },
  {
    id: 'p5',
    slug: 'lubia-polo',
    name: 'لوبیاپلو',
    category: 'rice',
    description: 'غذای محبوب خانگی با لوبیا سبز و برنج.',
    longDescription:
      'لوبیاپلوی خانگی با لوبیای سبز تازه، برنج خوش‌عطر و گوشت؛ یک غذای کامل و مقوی.',
    price: 175000,
    serving: 'یک پرس',
    image: img('photo-1565557623262-b51c2513a641'),
    ingredients: ['برنج', 'لوبیا سبز', 'گوشت', 'رب گوجه'],
    available: true,
    featured: false,
    daily: false,
    createdAt: t(5),
  },
  {
    id: 'p6',
    slug: 'kebab-tabeei',
    name: 'کباب تابه‌ای',
    category: 'irani',
    description: 'کباب تابه‌ای با مخلفات و دورچین متناسب.',
    longDescription:
      'کباب تابه‌ای تازه و خوش‌طعم با دورچین مناسب؛ برای روزهایی که حال‌وهوای کباب داری.',
    price: 235000,
    serving: 'یک پرس',
    image: img('photo-1555939594-58d7cb561ad1'),
    ingredients: ['گوشت چرخ‌شده', 'پیاز', 'ادویه'],
    available: true,
    featured: true,
    daily: false,
    createdAt: t(6),
  },
  {
    id: 'p7',
    slug: 'makaroni-khanegi',
    name: 'ماکارونی خانگی',
    category: 'daily',
    description: 'ماکارونی با سس خوش‌طعم و سبک خانگی.',
    longDescription:
      'ماکارونی خانگی با سس رب گوجه و ادویه‌های خوش‌عطر؛ همان طعم مأنوس ماکارونی پنج‌شنبه‌ها.',
    price: 155000,
    serving: 'یک پرس',
    image: img('photo-1563379926898-05f4575a45d8'),
    ingredients: ['ماکارونی', 'گوشت چرخ‌شده', 'رب گوجه', 'پیاز'],
    available: true,
    featured: false,
    daily: true,
    createdAt: t(7),
  },
  {
    id: 'p8',
    slug: 'kookoo-sabzi',
    name: 'کوکو سبزی',
    category: 'light',
    description: 'کوکوی سبزی با مواد اولیه متناسب و دورچین دلخواه.',
    longDescription:
      'کوکوی سبزی با سبزی تازه و تخم‌مرغ؛ سبک، خوش‌طعم و مناسب هر وعده.',
    price: 125000,
    serving: 'یک پرس',
    image: img('photo-1607532941433-304659e8198a'),
    ingredients: ['سبزی', 'تخم‌مرغ', 'گردو'],
    available: true,
    featured: false,
    daily: false,
    createdAt: t(8),
  },
  {
    id: 'p9',
    slug: 'kotlet-khanegi',
    name: 'کتلت خانگی',
    category: 'light',
    description: 'کتلت خانگی با دورچین مناسب.',
    longDescription:
      'کتلت خانگی سرخ‌شده با طعمی آشنا و دوست‌داشتنی؛ همراه با نان تازه و سبزی.',
    price: 135000,
    serving: 'یک پرس',
    image: img('photo-1601050690597-df0568f70950'),
    ingredients: ['گوشت چرخ‌شده', 'سیب‌زمینی', 'تخم‌مرغ'],
    available: true,
    featured: false,
    daily: false,
    createdAt: t(9),
  },
  {
    id: 'p10',
    slug: 'salad-shirazi',
    name: 'سالاد شیرازی',
    category: 'sides',
    description: 'سالاد تازه و خنک با سبزیجات روز.',
    longDescription:
      'سالاد شیرازی با خیار، گوجه و پیاز تازه و آبلیمو؛ همراه مناسب هر غذای برنجی.',
    price: 65000,
    serving: 'یک پرس',
    image: img('photo-1540420773420-3366772f4999'),
    ingredients: ['خیار', 'گوجه', 'پیاز', 'آبلیمو'],
    available: true,
    featured: false,
    daily: false,
    createdAt: t(10),
  },
  {
    id: 'p11',
    slug: 'mast-o-khiar',
    name: 'ماست و خیار',
    category: 'sides',
    description: 'ماست و خیار با گردو و گل محمدی.',
    longDescription:
      'ماست و خیار خنک با گردو و گل محمدی؛ دورچینی ساده و لذیذ برای غذاهای برنجی.',
    price: 55000,
    serving: 'یک پرس',
    image: img('photo-1482049016688-2d3e1b311543'),
    ingredients: ['ماست', 'خیار', 'گردو', 'گل محمدی'],
    available: true,
    featured: false,
    daily: false,
    createdAt: t(11),
  },
  {
    id: 'p12',
    slug: 'sup-jo',
    name: 'سوپ جو',
    category: 'light',
    description: 'سوپ جوی گرم و مقوی با سبزیجات.',
    longDescription:
      'سوپ جوی گرم با سبزیجات تازه و طعمی لذیذ؛ مناسب شروع یک وعده یا یک شام سبک.',
    price: 85000,
    serving: 'یک پرس',
    image: img('photo-1476124369491-e7addf5db371'),
    ingredients: ['جو پرک', 'هویج', 'سبزیجات', 'خامه'],
    available: true,
    featured: false,
    daily: false,
    createdAt: t(12),
  },
];

// One deliberately unavailable demo product state is exercised via `available: false`
// when needed; all seed products above ship as available.

export const heroImage = img('photo-1504674900247-0877df9cc836', 1800);

export const pageImages = {
  aboutMain: img('photo-1490645935967-10de6ba17061', 1000),
  aboutSecondary: img('photo-1556910103-1c02745aae4d', 700),
  storyPrimary: img('photo-1414235077428-338989a2e8c0', 1000),
  storySecondary: img('photo-1476224203421-9ac39bcb3327', 800),
  storyTertiary: img('photo-1498837167922-ddd27525d352', 800),
  cta: img('photo-1546069901-ba9599a7e63c', 700),
  contact: img('photo-1466637574441-749b8f19452f', 900),
};
