export type ServiceSymbol = "browser" | "dashboard" | "phone" | "chip";

export type Service = {
  id: string;
  num: string;
  title: string;
  tag: string;
  description: string;
  items: string[];
  term: string;
  price: string;
  symbol: ServiceSymbol;
};

export const services: Service[] = [
  {
    id: "sites",
    num: "01",
    title: "Сайты",
    tag: "Web",
    description: "Сайты, которые продают с первого экрана и грузятся быстрее, чем вы моргнёте.",
    items: ["Лендинги и промо-сайты", "Корпоративные сайты", "Интернет-магазины", "3D и WebGL-эффекты"],
    term: "от 2 недель",
    price: "от 90 000 ₽",
    symbol: "browser",
  },
  {
    id: "webapps",
    num: "02",
    title: "Веб-приложения",
    tag: "SaaS",
    description: "Сложные интерфейсы, которые выглядят просто: от CRM до собственного SaaS.",
    items: ["CRM и ERP-системы", "Личные кабинеты", "SaaS-платформы", "Дашборды и аналитика"],
    term: "от 6 недель",
    price: "от 400 000 ₽",
    symbol: "dashboard",
  },
  {
    id: "mobile",
    num: "03",
    title: "Мобильные приложения",
    tag: "iOS · Android",
    description: "Нативное ощущение на обеих платформах и один код для быстрого развития.",
    items: ["iOS и Android", "React Native и Flutter", "Публикация в сторах", "Push, оплаты, офлайн"],
    term: "от 8 недель",
    price: "от 600 000 ₽",
    symbol: "phone",
  },
  {
    id: "software",
    num: "04",
    title: "Программы и автоматизация",
    tag: "Desktop · Bots · AI",
    description: "Убираем рутину: программы, боты и интеграции, которые работают, пока вы спите.",
    items: ["Десктоп-программы", "Telegram-боты", "Интеграции и API", "AI-ассистенты"],
    term: "от 2 недель",
    price: "от 60 000 ₽",
    symbol: "chip",
  },
];
