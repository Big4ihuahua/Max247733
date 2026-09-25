import * as THREE from "three";

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
