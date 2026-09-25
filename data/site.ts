export const site = {
  name: "LUMEN",
  fullName: "Lumen Studio",
  tagline: "Студия цифровой разработки",
  description:
    "Разрабатываем сайты, веб-приложения, мобильные приложения, программы и Telegram-ботов под ключ. Дизайн, код, запуск и поддержка — в одной команде.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumen.studio",
  founded: 2018,
  city: "Москва",
  timeZone: "Europe/Moscow",
  coords: "55.7558° N — 37.6173° E",
  email: "hello@lumen.studio",
  phone: "+7 (999) 123-45-67",
  phoneHref: "tel:+79991234567",
  telegram: "@lumen_studio",
  telegramUrl: "https://t.me/lumen_studio",
  storageKey: "lumen-visited",
  socials: [
    { label: "Telegram", href: "https://t.me/lumen_studio" },
    { label: "Behance", href: "https://www.behance.net/" },
    { label: "Dribbble", href: "https://dribbble.com/" },
    { label: "GitHub", href: "https://github.com/" },
  ],
} as const;

export const sections = [
  { id: "hero", label: "Старт" },
  { id: "manifesto", label: "Манифест" },
  { id: "services", label: "Услуги" },
  { id: "process", label: "Процесс" },
  { id: "cases", label: "Кейсы" },
  { id: "tech", label: "Технологии" },
  { id: "stats", label: "Цифры" },
  { id: "reviews", label: "Отзывы" },
  { id: "pricing", label: "Тарифы" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Заявка" },
  { id: "footer", label: "Контакты" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const menuLinks: { id: SectionId; label: string }[] = [
  { id: "services", label: "Услуги" },
  { id: "process", label: "Процесс" },
  { id: "cases", label: "Кейсы" },
  { id: "pricing", label: "Тарифы" },
  { id: "faq", label: "Вопросы" },
  { id: "contact", label: "Контакты" },
];

export const manifestoFacts = [
  { key: "Команда", value: "24 человека в штате: дизайн, фронтенд, бэкенд, мобильная разработка и QA." },
  { key: "Прозрачность", value: "Демо каждую неделю и доступ к таск-трекеру с первого дня." },
  { key: "Гарантия", value: "6 месяцев бесплатных исправлений после запуска проекта." },
];
