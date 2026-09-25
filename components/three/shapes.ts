/**
 * Point-cloud targets for the particle morph. 2D silhouettes are drawn on an offscreen canvas and
 * sampled; volumetric shapes are parametric. Every shape is generated lazily and cached.
 */
export type ShapeKey =
  | "chaos"
  | "logo"
  | "code"
  | "browser"
  | "phone"
  | "chip"
  | "sphere"
  | "core"
  | "dashboard"
  | "helix"
  | "galaxy"
  | "ring"
  | "vortex"
  | "check";

const cache = new Map<string, Float32Array>();
const TEXT_SHAPES: ShapeKey[] = ["logo", "code"];
const S = 512;

export function clearTextShapes() {
  for (const key of [...cache.keys()]) {
    if (TEXT_SHAPES.some((t) => key.startsWith(t + ":"))) cache.delete(key);
  }
}

export function getShape(key: ShapeKey, count: number): Float32Array {
  const id = `${key}:${count}`;
  let shape = cache.get(id);
  if (!shape) {
    shape = build(key, count);
    cache.set(id, shape);
  }
  return shape;
}

function build(key: ShapeKey, n: number): Float32Array {
  switch (key) {
    case "chaos":
      return chaos(n);
    case "sphere":
      return sphere(n, 2.1, 0.06);
    case "core":
      return core(n);
    case "helix":
      return helix(n);
    case "galaxy":
      return galaxy(n);
    case "ring":
      return ring(n);
    case "vortex":
      return vortex(n);
    default:
      return fromCanvas(n, DRAW[key], key === "logo" ? 7.2 : 5.2, key === "logo" ? 0.35 : 0.5);
  }
}

const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

function displayFont() {
  if (typeof document === "undefined") return "sans-serif";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-unbounded").trim();
  return v || "sans-serif";
}

type Draw = (ctx: CanvasRenderingContext2D) => void;

function fromCanvas(n: number, draw: Draw, worldSize: number, depth: number): Float32Array {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  draw(ctx);

  const data = ctx.getImageData(0, 0, S, S).data;
  const filled: number[] = [];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (data[(y * S + x) * 4] > 120) filled.push(x, y);
    }
  }
  const count = filled.length / 2 || 1;
  const out = new Float32Array(n * 3);
  const k = worldSize / S;
  for (let i = 0; i < n; i++) {
    const i3 = i * 3;
    if (Math.random() < 0.035) {
      // Loose dust around the silhouette keeps the shape feeling alive.
      out[i3] = (Math.random() - 0.5) * worldSize * 1.1;
      out[i3 + 1] = (Math.random() - 0.5) * worldSize * 0.9;
      out[i3 + 2] = (Math.random() - 0.5) * 2.5;
      continue;
    }
    const j = Math.floor(Math.random() * count) * 2;
    out[i3] = (filled[j] + Math.random() - 0.5 - S / 2) * k;
    out[i3 + 1] = -(filled[j + 1] + Math.random() - 0.5 - S / 2) * k;
    out[i3 + 2] = gauss() * depth;
  }
  return out;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x * S, y * S, w * S, h * S, r * S);
}

const DRAW: Record<string, Draw> = {
  code(ctx) {
    ctx.font = `600 190px ${displayFont()}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("</>", S / 2, S / 2 + 8);
  },
  logo(ctx) {
    ctx.font = `700 120px ${displayFont()}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const w = ctx.measureText("LUMEN").width;
    const size = Math.min(120, (120 * S * 0.9) / w);
    ctx.font = `700 ${size}px ${displayFont()}`;
    ctx.fillText("LUMEN", S / 2, S / 2);
  },
  browser(ctx) {
    ctx.lineWidth = 9;
    roundRect(ctx, 0.1, 0.2, 0.8, 0.6, 0.04);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0.1 * S, 0.29 * S);
    ctx.lineTo(0.9 * S, 0.29 * S);
    ctx.stroke();
    [0.14, 0.18, 0.22].forEach((x) => {
      ctx.beginPath();
      ctx.arc(x * S, 0.245 * S, 0.012 * S, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.lineWidth = 5;
    roundRect(ctx, 0.32, 0.225, 0.4, 0.04, 0.02);
    ctx.stroke();
    roundRect(ctx, 0.15, 0.35, 0.36, 0.05, 0.01);
    ctx.fill();
    roundRect(ctx, 0.15, 0.43, 0.26, 0.022, 0.01);
    ctx.fill();
    roundRect(ctx, 0.15, 0.48, 0.14, 0.04, 0.02);
    ctx.stroke();
    roundRect(ctx, 0.56, 0.34, 0.29, 0.2, 0.02);
    ctx.stroke();
    [0.15, 0.405, 0.66].forEach((x) => {
      roundRect(ctx, x, 0.6, 0.19, 0.15, 0.02);
      ctx.stroke();
    });
  },
  dashboard(ctx) {
    ctx.lineWidth = 9;
    roundRect(ctx, 0.08, 0.18, 0.84, 0.64, 0.04);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0.22 * S, 0.18 * S);
    ctx.lineTo(0.22 * S, 0.82 * S);
    ctx.stroke();
    [0.27, 0.34, 0.41, 0.48].forEach((y) => {
      roundRect(ctx, 0.12, y, 0.06, 0.03, 0.01);
      ctx.fill();
    });
    ctx.lineWidth = 5;
    [0.26, 0.47, 0.68].forEach((x) => {
      roundRect(ctx, x, 0.24, 0.19, 0.1, 0.015);
      ctx.stroke();
    });
    const bars = [0.12, 0.2, 0.15, 0.26, 0.22, 0.3, 0.18];
    bars.forEach((h, i) => {
      roundRect(ctx, 0.27 + i * 0.045, 0.76 - h, 0.026, h, 0.006);
      ctx.fill();
    });
    ctx.lineWidth = 6;
    ctx.beginPath();
    const pts = [0.62, 0.7, 0.66, 0.56, 0.6, 0.48, 0.52];
    pts.forEach((y, i) => {
      const x = (0.62 + i * 0.045) * S;
      if (i === 0) ctx.moveTo(x, y * S);
      else ctx.lineTo(x, y * S);
    });
    ctx.stroke();
    pts.forEach((y, i) => {
      ctx.beginPath();
      ctx.arc((0.62 + i * 0.045) * S, y * S, 7, 0, Math.PI * 2);
      ctx.fill();
    });
  },
  phone(ctx) {
    ctx.lineWidth = 10;
    roundRect(ctx, 0.33, 0.08, 0.34, 0.84, 0.07);
    ctx.stroke();
    roundRect(ctx, 0.45, 0.115, 0.1, 0.028, 0.014);
    ctx.fill();
    ctx.lineWidth = 5;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        roundRect(ctx, 0.375 + c * 0.09, 0.2 + r * 0.1, 0.065, 0.065, 0.018);
        ctx.stroke();
      }
    }
    roundRect(ctx, 0.375, 0.62, 0.245, 0.16, 0.03);
    ctx.stroke();
    roundRect(ctx, 0.44, 0.86, 0.12, 0.012, 0.006);
    ctx.fill();
  },
  chip(ctx) {
    ctx.lineWidth = 10;
    roundRect(ctx, 0.3, 0.3, 0.4, 0.4, 0.04);
    ctx.stroke();
    ctx.lineWidth = 5;
    roundRect(ctx, 0.39, 0.39, 0.22, 0.22, 0.02);
    ctx.stroke();
    ctx.font = `600 44px ${displayFont()}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("AI", S / 2, S / 2 + 2);
    ctx.lineWidth = 7;
    for (let i = 0; i < 5; i++) {
      const t = 0.36 + i * 0.07;
      const segs: [number, number, number, number][] = [
        [t, 0.3, t, 0.2],
        [t, 0.7, t, 0.8],
        [0.3, t, 0.2, t],
        [0.7, t, 0.8, t],
      ];
      segs.forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(x1 * S, y1 * S);
        ctx.lineTo(x2 * S, y2 * S);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x2 * S, y2 * S, 7, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    ctx.lineWidth = 4;
    const traces: number[][] = [
      [0.36, 0.2, 0.36, 0.12, 0.22, 0.12],
      [0.64, 0.8, 0.64, 0.88, 0.8, 0.88],
      [0.2, 0.64, 0.1, 0.64, 0.1, 0.78],
      [0.8, 0.36, 0.9, 0.36, 0.9, 0.22],
    ];
    traces.forEach((p) => {
      ctx.beginPath();
      ctx.moveTo(p[0] * S, p[1] * S);
      ctx.lineTo(p[2] * S, p[3] * S);
      ctx.lineTo(p[4] * S, p[5] * S);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p[4] * S, p[5] * S, 9, 0, Math.PI * 2);
      ctx.fill();
    });
  },
  check(ctx) {
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(S / 2, S / 2, S * 0.36, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 38;
    ctx.beginPath();
    ctx.moveTo(0.33 * S, 0.52 * S);
    ctx.lineTo(0.45 * S, 0.64 * S);
    ctx.lineTo(0.69 * S, 0.38 * S);
    ctx.stroke();
  },
};

function chaos(n: number) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 7 * Math.cbrt(Math.random());
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    out[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.4;
    out[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.8;
    out[i * 3 + 2] = r * Math.cos(ph) - 2;
  }
  return out;
}

function sphere(n: number, radius: number, jitter: number) {
  const out = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rr = Math.sqrt(1 - y * y);
    const th = golden * i;
    const r = radius * (1 + gauss() * jitter);
    out[i * 3] = Math.cos(th) * rr * r;
    out[i * 3 + 1] = y * r;
    out[i * 3 + 2] = Math.sin(th) * rr * r;
  }
  return out;
}

function core(n: number) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const shell = Math.random() < 0.6;
    const r = shell ? 0.85 + gauss() * 0.04 : 0.85 * Math.pow(Math.random(), 0.7);
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    out[i * 3] = r * Math.sin(ph) * Math.cos(th);
    out[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    out[i * 3 + 2] = r * Math.cos(ph);
  }
  return out;
}

function helix(n: number) {
  const out = new Float32Array(n * 3);
  const L = 13;
  const turns = 3.2;
  for (let i = 0; i < n; i++) {
    let t = Math.random();
    const rung = Math.random() < 0.14;
    if (rung) t = Math.round(t * 46) / 46;
    const a = t * Math.PI * 2 * turns;
    const x = (t - 0.5) * L;
    const r = 1.05;
    let y: number;
    let z: number;
    if (rung) {
      const k = Math.random() * 2 - 1;
      y = Math.cos(a) * r * k;
      z = Math.sin(a) * r * k;
    } else {
      const strand = Math.random() < 0.5 ? 0 : Math.PI;
      y = Math.cos(a + strand) * r + gauss() * 0.06;
      z = Math.sin(a + strand) * r + gauss() * 0.06;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

function galaxy(n: number) {
  const out = new Float32Array(n * 3);
  const arms = 3;
  for (let i = 0; i < n; i++) {
    const r = Math.pow(Math.random(), 0.55) * 7.5;
    const arm = (i % arms) * ((Math.PI * 2) / arms);
    const spread = gauss() * (0.55 - r * 0.03);
    const a = arm + r * 0.75 + spread;
    out[i * 3] = Math.cos(a) * r + gauss() * 0.25;
    out[i * 3 + 1] = Math.sin(a) * r + gauss() * 0.25;
    out[i * 3 + 2] = gauss() * 0.35 * (1 - r / 9);
  }
  return out;
}

function ring(n: number) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const inner = Math.random() < 0.28;
    const R = inner ? 2.35 : 3.4;
    const a = Math.random() * Math.PI * 2;
    const tube = inner ? 0.05 : 0.14;
    let x = Math.cos(a) * (R + gauss() * tube);
    let y = Math.sin(a) * (R + gauss() * tube);
    let z = gauss() * tube;
    if (inner) {
      // Second orbit on a crossed plane, like an atom.
      const c = Math.cos(1.1);
      const s = Math.sin(1.1);
      const ny = y * c - z * s;
      z = y * s + z * c;
      y = ny;
      const cz = Math.cos(0.9);
      const sz = Math.sin(0.9);
      const nx = x * cz - y * sz;
      y = x * sz + y * cz;
      x = nx;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

function vortex(n: number) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 0.35 + Math.pow(Math.random(), 1.35) * 5;
    const a = Math.random() * Math.PI * 2 + r * 0.9;
    out[i * 3] = Math.cos(a) * r;
    out[i * 3 + 1] = Math.sin(a) * r;
    out[i * 3 + 2] = -3.2 * Math.exp(-r * 0.55) + gauss() * 0.08;
  }
  return out;
}
