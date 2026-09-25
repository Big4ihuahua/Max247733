import * as THREE from "three";

const family = (v: string, fallback: string) => {
  const f = getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  return f || fallback;
};

function makeCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return { canvas, ctx, texture };
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill?: string | CanvasGradient) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

/** Animated screen for the Pulse fitness app; redraw with `draw(time)`. */
export function createPhoneScreen() {
  const W = 540;
  const H = 1170;
  const { ctx, texture } = makeCanvas(W, H);

  const draw = (t: number) => {
    const display = family("--font-unbounded", "sans-serif");
    const body = family("--font-manrope", "sans-serif");
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#15101a");
    bg.addColorStop(1, "#0b0c10");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#edebe6";
    ctx.font = `600 26px ${body}`;
    ctx.fillText("9:41", 52, 62);
    rr(ctx, W - 110, 44, 46, 22, 6, "rgba(237,235,230,0.9)");

    ctx.font = `500 52px ${display}`;
    ctx.fillText("Сегодня", 48, 175);
    ctx.fillStyle = "#8a8f98";
    ctx.font = `500 24px ${body}`;
    ctx.fillText("Активность · цель 10 000 шагов", 50, 218);

    const cx = W / 2;
    const cy = 430;
    const rings = [
      { r: 150, c: "#ff8a7a", p: 0.78 + Math.sin(t * 0.7) * 0.03 },
      { r: 114, c: "#7cf5c8", p: 0.62 + Math.sin(t * 0.9 + 1) * 0.03 },
      { r: 78, c: "#a89bff", p: 0.9 + Math.sin(t * 0.6 + 2) * 0.03 },
    ];
    ctx.lineCap = "round";
    rings.forEach(({ r, c, p }) => {
      ctx.lineWidth = 28;
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = c;
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p);
      ctx.stroke();
    });
    ctx.textAlign = "center";
    ctx.fillStyle = "#edebe6";
    ctx.font = `600 34px ${display}`;
    ctx.fillText("8 420", cx, cy + 8);
    ctx.fillStyle = "#8a8f98";
    ctx.font = `500 20px ${body}`;
    ctx.fillText("шагов", cx, cy + 40);
    ctx.textAlign = "left";

    const cards = [
      { y: 640, title: "Пульс", value: "72 уд/мин", color: "#ff8a7a" },
      { y: 790, title: "Калории", value: "612 ккал", color: "#7cf5c8" },
      { y: 940, title: "Сон", value: "7 ч 40 мин", color: "#a89bff" },
    ];
    cards.forEach((card, i) => {
      rr(ctx, 36, card.y, W - 72, 128, 30, "rgba(255,255,255,0.05)");
      ctx.fillStyle = "#8a8f98";
      ctx.font = `500 22px ${body}`;
      ctx.fillText(card.title, 66, card.y + 48);
      ctx.fillStyle = "#edebe6";
      ctx.font = `600 30px ${display}`;
      ctx.fillText(card.value, 66, card.y + 94);
      ctx.strokeStyle = card.color;
      ctx.fillStyle = card.color;
      ctx.lineWidth = 4;
      const x0 = 300;
      const w = 180;
      if (i === 0) {
        ctx.beginPath();
        for (let k = 0; k <= 60; k++) {
          const x = x0 + (k / 60) * w;
          const ph = (k / 60) * 6 - t * 2.2;
          const spike = Math.exp(-Math.pow(((ph % 2) + 2) % 2 - 1, 2) * 60) * 36;
          const y = card.y + 70 - spike + Math.sin(ph * 3) * 3;
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (i === 1) {
        for (let k = 0; k < 7; k++) {
          const h = 20 + ((Math.sin(k * 1.7 + t * 0.8) + 1) / 2) * 50;
          rr(ctx, x0 + k * 27, card.y + 100 - h, 16, h, 6, card.color);
        }
      } else {
        rr(ctx, x0, card.y + 58, w, 12, 6, "rgba(255,255,255,0.08)");
        rr(ctx, x0, card.y + 58, w * (0.72 + Math.sin(t * 0.5) * 0.04), 12, 6, card.color);
      }
    });

    rr(ctx, 36, 1082, W - 72, 60, 30, "rgba(255,255,255,0.05)");
    [0, 1, 2, 3].forEach((k) => {
      ctx.beginPath();
      ctx.arc(110 + k * 107, 1112, 12, 0, Math.PI * 2);
      ctx.fillStyle = k === 0 ? "#ff8a7a" : "rgba(237,235,230,0.35)";
      ctx.fill();
    });
    texture.needsUpdate = true;
  };

  draw(0);
  return { texture, draw };
}

/** Long Nordwind storefront page; shown through a scrolling window on the laptop screen. */
export function createSiteScreen() {
  const W = 1024;
  const H = 2600;
  const { ctx, texture } = makeCanvas(W, H);

  const draw = () => {
    const display = family("--font-unbounded", "sans-serif");
    const body = family("--font-manrope", "sans-serif");
    ctx.fillStyle = "#0d1413";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#edebe6";
    ctx.font = `600 26px ${display}`;
    ctx.fillText("NORDWIND", 48, 62);
    ctx.fillStyle = "#9aa6a3";
    ctx.font = `500 19px ${body}`;
    ["Каталог", "Коллекции", "Бренды", "Блог"].forEach((l, i) => ctx.fillText(l, 380 + i * 118, 60));
    rr(ctx, W - 150, 34, 104, 40, 20, "#9ad7c9");
    ctx.fillStyle = "#0d1413";
    ctx.font = `600 17px ${body}`;
    ctx.fillText("Корзина", W - 131, 60);

    const hero = ctx.createLinearGradient(0, 110, 0, 690);
    hero.addColorStop(0, "#1c3a35");
    hero.addColorStop(1, "#0f201d");
    rr(ctx, 32, 110, W - 64, 580, 28, hero);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(32, 110, W - 64, 580, 28);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(760, 300, 70, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,179,138,0.85)";
    ctx.fill();
    const mountains: [string, number[]][] = [
      ["#2d5a52", [420, 690, 640, 330, 820, 520, 900, 420, 1000, 690]],
      ["#9ad7c9", [520, 690, 760, 400, 1000, 690]],
      ["#16302c", [300, 690, 560, 520, 700, 600, 860, 470, 1000, 590, 1000, 690]],
    ];
    mountains.forEach(([c, p]) => {
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]);
      for (let i = 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]);
      ctx.closePath();
      ctx.fillStyle = c;
      ctx.fill();
    });
    ctx.restore();
    ctx.fillStyle = "#9ad7c9";
    ctx.font = `600 16px ${body}`;
    ctx.fillText("НОВАЯ КОЛЛЕКЦИЯ · ОСЕНЬ 2026", 80, 220);
    ctx.fillStyle = "#edebe6";
    ctx.font = `600 96px ${display}`;
    ctx.fillText("Север", 76, 340);
    ctx.fillText("зовёт", 76, 450);
    ctx.fillStyle = "#b8c4c1";
    ctx.font = `500 22px ${body}`;
    ctx.fillText("Снаряжение для тех, кто идёт дальше.", 80, 510);
    rr(ctx, 80, 560, 200, 60, 30, "#edebe6");
    ctx.fillStyle = "#0d1413";
    ctx.font = `600 20px ${body}`;
    ctx.fillText("Каталог  →", 118, 598);

    ctx.fillStyle = "#edebe6";
    ctx.font = `600 40px ${display}`;
    ctx.fillText("Хиты сезона", 48, 800);
    const tints = ["#20403a", "#2e2a40", "#40302a", "#1e3440", "#34402a", "#402a36"];
    const names = ["Палатка Fjell 2", "Рюкзак Trail 45", "Куртка Storm", "Спальник Polar", "Ботинки Ridge", "Термос Ember"];
    for (let i = 0; i < 6; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 32 + col * 328;
      const y = 840 + row * 420;
      const g = ctx.createLinearGradient(x, y, x + 300, y + 260);
      g.addColorStop(0, tints[i]);
      g.addColorStop(1, "#111817");
      rr(ctx, x, y, 304, 270, 22, g);
      ctx.beginPath();
      ctx.arc(x + 152, y + 140, 62, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(237,235,230,0.12)";
      ctx.fill();
      ctx.fillStyle = "#edebe6";
      ctx.font = `600 22px ${body}`;
      ctx.fillText(names[i], x + 4, y + 312);
      ctx.fillStyle = "#9ad7c9";
      ctx.font = `600 20px ${body}`;
      ctx.fillText(`${(12 + i * 7) * 1000} ₽`.replace(/\B(?=(\d{3})+(?!\d))/g, " "), x + 4, y + 346);
    }

    const banner = ctx.createLinearGradient(32, 0, W - 32, 0);
    banner.addColorStop(0, "#9ad7c9");
    banner.addColorStop(1, "#a89bff");
    rr(ctx, 32, 1720, W - 64, 300, 28, banner);
    ctx.fillStyle = "#0d1413";
    ctx.font = `600 50px ${display}`;
    ctx.fillText("−20% на первый", 80, 1840);
    ctx.fillText("заказ", 80, 1908);
    ctx.font = `600 20px ${body}`;
    ctx.fillText("Промокод NORTH20", 80, 1964);

    ["Доставка за 1 день", "Возврат 30 дней", "Гарантия 2 года"].forEach((l, i) => {
      const x = 48 + i * 330;
      ctx.beginPath();
      ctx.arc(x + 28, 2130, 28, 0, Math.PI * 2);
      ctx.strokeStyle = "#9ad7c9";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#edebe6";
      ctx.font = `600 22px ${body}`;
      ctx.fillText(l, x + 74, 2138);
    });

    ctx.fillStyle = "#0a100f";
    ctx.fillRect(0, 2250, W, H - 2250);
    ctx.fillStyle = "#edebe6";
    ctx.font = `600 64px ${display}`;
    ctx.fillText("NORDWIND", 48, 2380);
    ctx.fillStyle = "#6f7a78";
    ctx.font = `500 18px ${body}`;
    ["Покупателям", "О компании", "Контакты", "Instagram"].forEach((l, i) => ctx.fillText(l, 48 + i * 230, 2470));
    texture.needsUpdate = true;
  };

  draw();
  return { texture, draw, aspect: W / H };
}

export function createKeyboardTexture() {
  const W = 1024;
  const H = 400;
  const { ctx, texture } = makeCanvas(W, H);
  ctx.fillStyle = "#15171b";
  ctx.fillRect(0, 0, W, H);
  const cols = 14;
  const rows = 5;
  const gap = 8;
  const kw = (W - 40 - gap * (cols - 1)) / cols;
  const kh = (H - 40 - gap * (rows - 1)) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === rows - 1 && c > 3 && c < 10) continue;
      rr(ctx, 20 + c * (kw + gap), 20 + r * (kh + gap), kw, kh, 8, "#23262c");
    }
  }
  rr(ctx, 20 + 4 * (kw + gap), 20 + (rows - 1) * (kh + gap), kw * 6 + gap * 5, kh, 8, "#23262c");
  texture.needsUpdate = true;
  return texture;
}
