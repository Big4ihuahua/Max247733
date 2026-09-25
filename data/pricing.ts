export type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  bundlePrice: number;
  term: string;
  features: string[];
  supportFeatures: string[];
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "landing",
    name: "Лендинг",
    description: "Одностраничный сайт, который быстро запускает продажи и рекламу.",
    price: 90000,
    bundlePrice: 150000,
    term: "от 2 недель",
    features: ["Уникальный дизайн", "Адаптив под все устройства", "Анимации и 3D-акценты", "SEO-оптимизация", "Формы заявок и CRM"],
    supportFeatures: ["Хостинг и домен", "Правки до 5 часов в месяц", "Мониторинг 24/7"],
  },
  {
    id: "site",
    name: "Сайт / магазин",
    description: "Многостраничный сайт или интернет-магазин с оплатой и админкой.",
    price: 250000,
    bundlePrice: 390000,
    term: "от 5 недель",
    features: ["До 30 страниц или каталог", "Корзина и онлайн-оплата", "Личный кабинет", "Интеграция с 1С и CRM", "Скорость загрузки до 1,5 с"],
    supportFeatures: ["Хостинг, бэкапы, SSL", "Правки до 15 часов в месяц", "Мониторинг и SLA 24/7"],
    featured: true,
  },
  {
    id: "app",
    name: "Приложение под ключ",
    description: "Мобильное или веб-приложение: от идеи до публикации в сторах.",
    price: 600000,
    bundlePrice: 850000,
    term: "от 8 недель",
    features: ["iOS, Android или Web", "Дизайн-система", "Бэкенд и API", "Push-уведомления и оплаты", "Публикация в сторах"],
    supportFeatures: ["Выделенный разработчик", "Обновления под новые iOS/Android", "SLA и дежурства 24/7"],
  },
];

export const bundleNote = "включая 6 месяцев поддержки";
