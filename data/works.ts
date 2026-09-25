export const workSrc = (slug: string) => `/works/${slug}.html`;
export const workThumb = (slug: string) => `/works/thumbs/${slug}.webp`;
/** Demos run in an opaque origin: scripts work, but they can't touch this page, its storage or top navigation. */
export const DEMO_SANDBOX = "allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals";

export type Work = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  tags: string[];
  /** Short hint shown in the viewer: what to try on the page. */
  hint: string;
  accent: string;
  theme: "dark" | "light";
  sound?: boolean;
};

/** Standalone demo pages live in /public/works/<slug>.html, previews in /public/works/thumbs/<slug>.webp. */
export const works: Work[] = [
  {
    slug: "radiant-studio",
    title: "Radiant",
    subtitle: "Студия разработки",
    category: "Лендинг",
    description: "Лендинг студии с 42 000 частиц: сфера-солнце при скролле пересобирается в новые формы.",
    tags: ["Canvas", "WebGL", "Частицы"],
    hint: "Листайте страницу и кликайте по пустому месту — частицы соберутся в новую фигуру.",
    accent: "#e0402a",
    theme: "light",
  },
  {
    slug: "radiant-ai",
    title: "Radiant AI",
    subtitle: "ИИ-инженер для репозитория",
    category: "SaaS",
    description: "Промо ИИ-продукта в редакционном стиле: антиква, звезда из частиц и демо пул-реквеста.",
    tags: ["SaaS", "WebGL", "Editorial"],
    hint: "Наведите курсор на звезду и прокрутите до блока с пул-реквестом.",
    accent: "#c9472b",
    theme: "light",
  },
  {
    slug: "radiant-code",
    title: "Radiant Code",
    subtitle: "Платформа обучения",
    category: "EdTech",
    description: "Образовательная платформа с живой песочницей: код на JavaScript выполняется прямо на странице.",
    tags: ["EdTech", "Песочница", "Градиенты"],
    hint: "Найдите песочницу, напишите console.log('привет') и нажмите Ctrl + Enter.",
    accent: "#8b5cf6",
    theme: "dark",
  },
  {
    slug: "particles-lab",
    title: "Particles Lab",
    subtitle: "Физика частиц",
    category: "Интерактив",
    description: "Физический движок в браузере: ткань, верёвки, мягкие тела и гравитация, которые рисуются мышью.",
    tags: ["Verlet", "Canvas 2D", "Физика"],
    hint: "Выберите инструмент слева и рисуйте мышью. Пробел ставит симуляцию на паузу.",
    accent: "#3ee8d0",
    theme: "dark",
  },
  {
    slug: "primordial-lab",
    title: "Primordial Lab",
    subtitle: "Симулятор первичной жизни",
    category: "Симуляция",
    description: "Лаборатория «первичного бульона»: атомы собираются в клетки, матрица сил и мутации ДНК в реальном времени.",
    tags: ["Генеративка", "Canvas 2D", "Панель"],
    hint: "Меняйте матрицу сил и кликайте по клеткам, чтобы открыть инспектор организма.",
    accent: "#35f28f",
    theme: "dark",
  },
  {
    slug: "null",
    title: "NULL",
    subtitle: "Комьюнити разработчиков",
    category: "Лендинг",
    description: "Лендинг для нового поколения программистов: облако частиц, терминал и кислотный акцент.",
    tags: ["Частицы", "Терминал", "Типографика"],
    hint: "Откройте терминал в шапке и поводите курсором по облаку частиц.",
    accent: "#d4ff3a",
    theme: "dark",
  },
  {
    slug: "abyss",
    title: "ABYSS",
    subtitle: "Цифровая биолюминесценция",
    category: "Арт",
    description: "Процедурная медуза из тысяч точек, которая чувствует курсор. Ни одной текстуры и видео, только математика.",
    tags: ["Генеративное", "Web Audio", "Canvas 2D"],
    hint: "Поводите курсором рядом с медузой. Кнопка «Музыка» включает звук.",
    accent: "#f0a36b",
    theme: "dark",
    sound: true,
  },
  {
    slug: "what-if",
    title: "А что если?",
    subtitle: "Студия управляемого хаоса",
    category: "Креатив",
    description: "Сайт креативной студии: буквы из частиц ломаются и собираются обратно, если удержать клавишу R.",
    tags: ["Типографика", "Частицы", "Хаос"],
    hint: "Проведите курсором по буквам, затем удерживайте клавишу R.",
    accent: "#ef4a2f",
    theme: "light",
  },
  {
    slug: "polyphony",
    title: "Полифония",
    subtitle: "Архитектура, которую слышно",
    category: "Арт",
    description: "Изометрический город, который звучит: каждое здание — нота, каждая улица — ритм.",
    tags: ["Изометрия", "Web Audio", "Генеративное"],
    hint: "Нажмите «Разбудить город» и стройте кварталы — лучше в наушниках.",
    accent: "#ea6a4a",
    theme: "light",
    sound: true,
  },
  {
    slug: "aether",
    title: "AETHER®",
    subtitle: "Студия цифрового опыта",
    category: "Брендинг",
    description: "Сайт дизайн-студии: сфера из частиц перетекает между тремя концептуальными мирами.",
    tags: ["Брендинг", "Частицы", "Motion"],
    hint: "Переключайте формы кнопками внизу и листайте к проектам.",
    accent: "#c6f25c",
    theme: "dark",
  },
];
