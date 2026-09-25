import type { CSSProperties, JSX } from "react";
import type { MockupVariant } from "@/data/cases";

/** Abstract, code-drawn UI previews used instead of real screenshots. */
export function Mockup({ variant, colors, className = "" }: { variant: MockupVariant; colors: [string, string]; className?: string }) {
  const style = { "--a": colors[0], "--b": colors[1] } as CSSProperties;
  const Variant = VARIANTS[variant];
  return (
    <div className={`mk mk-${variant} ${className}`} style={style} aria-hidden="true">
      <Variant />
    </div>
  );
}

function Bar({ url }: { url: string }) {
  return (
    <div className="mk-bar">
      <i />
      <i />
      <i />
      <span className="mk-url">{url}</span>
    </div>
  );
}

const Line = ({ w, accent = false }: { w: string; accent?: boolean }) => (
  <i className={`mk-ln ${accent ? "mk-ln-a" : ""}`} style={{ width: w }} />
);

function Shop() {
  return (
    <>
      <Bar url="nordwind.store" />
      <div className="mk-shop-hero">
        <div className="mk-shop-copy">
          <span className="mk-kicker">Новая коллекция</span>
          <span className="mk-title">
            Север
            <br />
            зовёт
          </span>
          <span className="mk-pill">Каталог →</span>
        </div>
        <svg className="mk-shop-art" viewBox="0 0 200 120" preserveAspectRatio="xMidYMax slice">
          <circle cx="146" cy="36" r="13" style={{ fill: "#ffb38a" }} />
          <polygon points="30,120 100,46 130,80 150,60 200,120" style={{ fill: "color-mix(in srgb, var(--a) 40%, #0d1413)" }} />
          <polygon points="80,120 136,58 196,120" style={{ fill: "var(--a)" }} />
          <polygon points="0,120 46,88 80,102 120,84 160,102 200,92 200,120" style={{ fill: "var(--b)" }} />
        </svg>
      </div>
      <div className="mk-shop-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="mk-product">
            <div className="mk-product-img" />
            <Line w="72%" />
            <Line w="36%" accent />
          </div>
        ))}
      </div>
    </>
  );
}

function Mobile() {
  const rings = [
    { r: 50, p: 0.78, c: "var(--a)" },
    { r: 38, p: 0.62, c: "#7cf5c8" },
    { r: 26, p: 0.9, c: "#a89bff" },
  ];
  return (
    <div className="mk-mobile-stage">
      <div className="mk-phone">
        <div className="mk-phone-notch" />
        <span className="mk-phone-h">Сегодня</span>
        <svg className="mk-rings" viewBox="0 0 120 120">
          {rings.map(({ r, p, c }) => {
            const len = 2 * Math.PI * r;
            return (
              <g key={r}>
                <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="9" />
                <circle
                  cx="60"
                  cy="60"
                  r={r}
                  fill="none"
                  style={{ stroke: c, strokeDasharray: len, strokeDashoffset: len * (1 - p) }}
                  strokeWidth="9"
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </g>
            );
          })}
        </svg>
        <div className="mk-phone-rows">
          {["Пульс", "Калории", "Сон"].map((l, i) => (
            <div key={l} className="mk-phone-row">
              <span>{l}</span>
              <i style={{ width: `${[64, 48, 80][i]}%` }} />
            </div>
          ))}
        </div>
        <div className="mk-phone-tabs">
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="mk-float mk-float-1">
        <span className="mk-kicker">Пульс</span>
        <b>72</b>
        <svg viewBox="0 0 100 30" preserveAspectRatio="none">
          <polyline className="mk-beat" points="0,18 22,18 28,6 34,26 40,18 60,18 66,10 72,22 78,18 100,18" />
        </svg>
      </div>
      <div className="mk-float mk-float-2">
        <span className="mk-kicker">Тренировка</span>
        <b>45 мин</b>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="mk-dash">
      <div className="mk-dash-side">
        {[0, 1, 2, 3, 4].map((i) => (
          <i key={i} className={i === 1 ? "on" : ""} />
        ))}
      </div>
      <div className="mk-dash-main">
        <div className="mk-dash-kpis">
          {[
            ["Заказы", "1 284"],
            ["В пути", "342"],
            ["Вовремя", "98%"],
          ].map(([k, v]) => (
            <div key={k} className="mk-kpi">
              <span>{k}</span>
              <b>{v}</b>
            </div>
          ))}
        </div>
        <div className="mk-map">
          <svg viewBox="0 0 300 150" preserveAspectRatio="none">
            {[30, 60, 90, 120].map((y) => (
              <line key={y} x1="0" x2="300" y1={y} y2={y} className="mk-grid" />
            ))}
            {[50, 100, 150, 200, 250].map((x) => (
              <line key={x} y1="0" y2="150" x1={x} x2={x} className="mk-grid" />
            ))}
            <path className="mk-route" d="M20,120 C60,40 110,110 150,60 S240,30 280,50" />
            <path className="mk-route mk-route-2" d="M30,30 C90,60 120,20 170,100 S250,130 285,110" />
            {[
              [20, 120],
              [150, 60],
              [280, 50],
              [170, 100],
              [285, 110],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3.2" className="mk-pin" style={{ animationDelay: `${i * 0.4}s` }} />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

function Promo() {
  return (
    <div className="mk-promo-wrap">
      <div className="mk-promo-copy">
        <span className="mk-kicker">Specialty coffee</span>
        <span className="mk-title">
          Aroma
          <br />
          Lab
        </span>
        <span className="mk-pill">Заказать →</span>
      </div>
      <div className="mk-cup">
        <div className="mk-steam">
          <i />
          <i />
          <i />
        </div>
        <div className="mk-cup-body" />
        <div className="mk-cup-handle" />
        <div className="mk-saucer" />
      </div>
    </div>
  );
}

function Bot() {
  return (
    <div className="mk-chat">
      <div className="mk-chat-head">
        <span className="mk-avatar" />
        <div>
          <b>MedSlot</b>
          <span>бот · онлайн</span>
        </div>
      </div>
      <div className="mk-chat-body">
        <div className="mk-msg">Здравствуйте! К какому врачу записать?</div>
        <div className="mk-keys">
          <span>Терапевт</span>
          <span>Стоматолог</span>
          <span>Кардиолог</span>
          <span>ЛОР</span>
        </div>
        <div className="mk-msg mk-msg-me">Терапевт</div>
        <div className="mk-msg">
          Свободно завтра: <b>10:30</b> · <b>14:00</b> · <b>17:15</b>
        </div>
        <div className="mk-typing">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

// Rounded so server and browser Math.sin output serialise identically (avoids hydration mismatches).
const r1 = (n: number) => Math.round(n * 10) / 10;
const CANDLES = Array.from({ length: 22 }, (_, i) => {
  const base = 60 - i * 1.6 + Math.sin(i * 1.3) * 10;
  const open = r1(base + Math.sin(i * 2.1) * 8);
  const close = r1(base - Math.cos(i * 1.7) * 8);
  return { x: r1(8 + i * 10.6), open, close, high: r1(Math.min(open, close) - 6), low: r1(Math.max(open, close) + 6) };
});

function Desktop() {
  return (
    <div className="mk-win">
      <div className="mk-win-bar">
        <i />
        <i />
        <i />
        <span>FinSight — Портфель Q3</span>
      </div>
      <div className="mk-win-body">
        <div className="mk-win-nav">
          <Line w="80%" accent />
          <Line w="60%" />
          <Line w="70%" />
          <Line w="50%" />
        </div>
        <div className="mk-win-main">
          <div className="mk-win-stats">
            <div>
              <span>Доходность</span>
              <b>+18.4%</b>
            </div>
            <div>
              <span>Риск</span>
              <b>0.62</b>
            </div>
          </div>
          <svg className="mk-candles" viewBox="0 0 240 100" preserveAspectRatio="none">
            {CANDLES.map((c, i) => {
              const up = c.close < c.open;
              return (
                <g key={i} className={up ? "up" : "down"}>
                  <line x1={c.x} x2={c.x} y1={c.high} y2={c.low} />
                  <rect x={r1(c.x - 3)} width="6" y={Math.min(c.open, c.close)} height={r1(Math.max(2, Math.abs(c.open - c.close)))} rx="1" />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

function Portfolio() {
  return (
    <div className="mk-folio">
      <div className="mk-folio-top">
        <span>Atelier Mira</span>
        <span>Проекты · Бюро · Контакты</span>
      </div>
      <span className="mk-folio-title">
        Архитектура
        <br />
        тишины
      </span>
      <div className="mk-folio-grid">
        {[0, 1, 2].map((i) => (
          <svg key={i} viewBox="0 0 100 80" preserveAspectRatio="xMidYMax slice">
            <rect width="100" height="80" className="mk-folio-bg" />
            {i === 0 && <polygon points="10,80 10,30 50,10 90,30 90,80" className="mk-bld" />}
            {i === 1 && (
              <>
                <rect x="20" y="20" width="26" height="60" className="mk-bld" />
                <rect x="52" y="36" width="30" height="44" className="mk-bld mk-bld-2" />
              </>
            )}
            {i === 2 && <path d="M0,80 L0,50 Q50,5 100,50 L100,80 Z" className="mk-bld" />}
          </svg>
        ))}
      </div>
    </div>
  );
}

function Edu() {
  return (
    <div className="mk-edu-grid">
      <div className="mk-player">
        <div className="mk-play" />
        <span className="mk-kicker">Урок 4 · Анимации в интерфейсах</span>
        <div className="mk-progress">
          <i />
        </div>
      </div>
      <div className="mk-course-list">
        {(
          [
            ["Основы UX", 100],
            ["Figma для профи", 72],
            ["Motion-дизайн", 38],
            ["Дизайн-системы", 12],
          ] as const
        ).map(([t, p]) => (
          <div key={t} className="mk-course">
            <span>{t}</span>
            <div className="mk-course-bar">
              <i style={{ width: `${p}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const VARIANTS: Record<MockupVariant, () => JSX.Element> = {
  shop: Shop,
  mobile: Mobile,
  dashboard: Dashboard,
  promo: Promo,
  bot: Bot,
  desktop: Desktop,
  portfolio: Portfolio,
  edu: Edu,
};
