export type CaseCategory = "sites" | "apps" | "software" | "bots";
export type MockupVariant = "shop" | "mobile" | "dashboard" | "promo" | "bot" | "desktop" | "portfolio" | "edu";

export type CaseStudy = {
  slug: string;
  title: string;
  type: string;
  category: CaseCategory;
  year: number;
  stack: string[];
  metric: string;
  mockup: MockupVariant;
  colors: [string, string];
  size: "lg" | "md" | "sm" | "full";
  task: string;
  solution: string;
  results: { value: number; prefix?: string; suffix?: string; decimals?: number; label: string }[];
};

export const caseFilters: { id: "all" | CaseCategory; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "sites", label: "Сайты" },
  { id: "apps", label: "Приложения" },
  { id: "software", label: "Программы" },
  { id: "bots", label: "Боты" },
];

export const cases: CaseStudy[] = [
  {
    slug: "nordwind",
    title: "Nordwind",
    type: "Интернет-магазин туристического снаряжения",
    category: "sites",
    year: 2025,
    stack: ["Next.js", "Stripe", "Sanity", "Vercel"],
    metric: "Конверсия +140%",
    mockup: "shop",
    colors: ["#9ad7c9", "#16302c"],
    size: "lg",
    task: "Старый магазин грузился 7 секунд и терял покупателей на мобильных. Нужно было сохранить каталог на 4 000 товаров и поднять продажи.",
    solution: "Пересобрали магазин на Next.js с мгновенной навигацией, сделали фильтры без перезагрузок, оплату в один клик и персональные подборки.",
    results: [
      { value: 140, prefix: "+", suffix: "%", label: "рост конверсии" },
      { value: 0.9, suffix: " с", decimals: 1, label: "загрузка страницы" },
      { value: 2.3, prefix: "×", decimals: 1, label: "средний чек" },
    ],
  },
  {
    slug: "pulse",
    title: "Pulse",
    type: "Фитнес-приложение для iOS и Android",
    category: "apps",
    year: 2025,
    stack: ["React Native", "Expo", "HealthKit", "Node.js"],
    metric: "50K+ установок · 4.8★",
    mockup: "mobile",
    colors: ["#ff8a7a", "#2a1216"],
    size: "md",
    task: "Стартапу нужен был MVP фитнес-трекера за три месяца, с синхронизацией с часами и подпиской.",
    solution: "Сделали кроссплатформенное приложение на React Native с живыми кольцами активности, тренировками и платной подпиской.",
    results: [
      { value: 50, suffix: "K+", label: "установок" },
      { value: 4.8, decimals: 1, suffix: "★", label: "рейтинг в сторах" },
      { value: 38, suffix: "%", label: "удержание D30" },
    ],
  },
  {
    slug: "logitrack",
    title: "LogiTrack",
    type: "Дашборд логистики с картой в реальном времени",
    category: "apps",
    year: 2024,
    stack: ["React", "WebSockets", "Mapbox", "Go"],
    metric: "Заказы быстрее на 30%",
    mockup: "dashboard",
    colors: ["#a89bff", "#15122b"],
    size: "md",
    task: "Диспетчеры работали в пяти разных таблицах и не видели машины на карте.",
    solution: "Собрали единый дашборд: карта с живыми маршрутами, статусы заказов, алерты и аналитика по водителям.",
    results: [
      { value: 30, prefix: "−", suffix: "%", label: "время обработки заказа" },
      { value: 1200, suffix: "+", label: "машин онлайн" },
      { value: 99.9, decimals: 1, suffix: "%", label: "аптайм" },
    ],
  },
  {
    slug: "aroma-lab",
    title: "Aroma Lab",
    type: "Промо-сайт кофейни с 3D-чашкой и онлайн-заказом",
    category: "sites",
    year: 2025,
    stack: ["Three.js", "GSAP", "Next.js", "YooKassa"],
    metric: "Онлайн-заказы ×3",
    mockup: "promo",
    colors: ["#ffb38a", "#2b1a12"],
    size: "lg",
    task: "Сеть кофеен хотела сайт, который пахнет кофе, и онлайн-заказ навынос без очереди.",
    solution: "3D-чашка на Three.js меняет напиток при скролле, а заказ оформляется за 20 секунд с оплатой картой.",
    results: [
      { value: 3, prefix: "×", label: "онлайн-заказов" },
      { value: 20, suffix: " с", label: "на оформление заказа" },
      { value: 4, suffix: " мин", label: "среднее время на сайте" },
    ],
  },
  {
    slug: "medslot",
    title: "MedSlot",
    type: "Telegram-бот записи к врачу с оплатой",
    category: "bots",
    year: 2024,
    stack: ["Python", "aiogram", "PostgreSQL", "Redis"],
    metric: "12K записей в месяц",
    mockup: "bot",
    colors: ["#7cf5c8", "#0e2420"],
    size: "sm",
    task: "Клиника теряла пациентов из-за занятой линии колл-центра.",
    solution: "Бот показывает свободные слоты врачей, принимает оплату, напоминает о визите и переносит запись в два касания.",
    results: [
      { value: 12, suffix: "K", label: "записей в месяц" },
      { value: 64, prefix: "−", suffix: "%", label: "нагрузка на колл-центр" },
      { value: 18, prefix: "−", suffix: "%", label: "неявки пациентов" },
    ],
  },
  {
    slug: "finsight",
    title: "FinSight",
    type: "Десктоп-программа для финансовой аналитики",
    category: "software",
    year: 2024,
    stack: ["Tauri", "Rust", "React", "SQLite"],
    metric: "Отчёты за 3 секунды",
    mockup: "desktop",
    colors: ["#e8d48a", "#1e1b10"],
    size: "sm",
    task: "Аналитики собирали отчёты в Excel по полдня, а данные нельзя было выносить в облако.",
    solution: "Лёгкая десктоп-программа на Tauri работает офлайн, строит графики по миллионам строк и шифрует данные.",
    results: [
      { value: 3, suffix: " с", label: "на сборку отчёта" },
      { value: 12, suffix: " МБ", label: "размер установщика" },
      { value: 40, suffix: " ч", label: "экономии в месяц" },
    ],
  },
  {
    slug: "atelier-mira",
    title: "Atelier Mira",
    type: "Портфолио архитектурного бюро с WebGL-галереей",
    category: "sites",
    year: 2025,
    stack: ["Astro", "WebGL", "GSAP", "Strapi"],
    metric: "Awwwards Honorable",
    mockup: "portfolio",
    colors: ["#edebe6", "#c9c2b5"],
    size: "sm",
    task: "Бюро хотело портфолио, которое ощущается как прогулка по их проектам.",
    solution: "WebGL-галерея с плавными переходами, чертежи, которые прорисовываются при скролле, и тихая типографика.",
    results: [
      { value: 7, suffix: " мин", label: "среднее время на сайте" },
      { value: 3, prefix: "×", label: "входящих заявок" },
      { value: 98, label: "баллов Lighthouse" },
    ],
  },
  {
    slug: "eduspace",
    title: "EduSpace",
    type: "Платформа онлайн-курсов с личным кабинетом",
    category: "apps",
    year: 2025,
    stack: ["Next.js", "NestJS", "PostgreSQL", "HLS"],
    metric: "30K студентов",
    mockup: "edu",
    colors: ["#b7a0ff", "#ff9ec7"],
    size: "full",
    task: "Онлайн-школа переросла конструктор: видео тормозили, а домашние задания проверяли в почте.",
    solution: "Собственная платформа: адаптивный видеоплеер, домашки с проверкой, прогресс, сертификаты и оплаты.",
    results: [
      { value: 30, suffix: "K", label: "студентов" },
      { value: 72, suffix: "%", label: "доходят до конца курса" },
      { value: 2.1, prefix: "×", decimals: 1, label: "рост выручки" },
    ],
  },
];
