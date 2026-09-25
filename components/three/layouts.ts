import type { SectionId } from "@/data/site";
import type { ShapeKey } from "./shapes";
import type { SceneState } from "@/lib/scene-store";

export type Layout = {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  intensity: number;
  /** DOM element id to follow; the cloud is centred on it and scaled to its height. */
  anchor?: string;
  /** Shape height in world units at scale 1, used to fit the anchor. */
  anchorSize?: number;
};

type Key = SectionId | "preload";

const L = (pos: Layout["pos"], scale: number, intensity: number, rot: Layout["rot"] = [0, 0, 0]): Layout => ({
  pos,
  rot,
  scale,
  intensity,
});

const galaxyRot: Layout["rot"] = [-1.05, 0, 0.35];

export const DESKTOP: Record<Key, Layout> = {
  preload: L([0, 0, 0], 1, 1),
  hero: L([2.95, 0.85, 0], 0.76, 0.9),
  manifesto: L([3.15, -0.1, 0], 0.88, 1),
  services: L([0.6, 0, -2.2], 1.25, 0.5),
  process: L([0, -0.4, -2], 1, 0.6, [0.2, 0, 0.08]),
  cases: L([0, -1, -5], 1.3, 0.38, galaxyRot),
  tech: { ...L([2.8, -0.2, -1.5], 1, 0.75, [0.25, 0, 0]), anchor: "tag-sphere", anchorSize: 7.4 },
  stats: L([0, -1, -5], 1.3, 0.38, galaxyRot),
  reviews: L([0, -1, -5], 1.3, 0.34, galaxyRot),
  pricing: L([0, -1, -5], 1.3, 0.3, galaxyRot),
  faq: L([0, -1, -5], 1.3, 0.3, galaxyRot),
  contact: { ...L([2.4, -0.2, -1.5], 1, 1, [0.35, -0.3, 0]), anchor: "portal-anchor", anchorSize: 6.4 },
  footer: L([0, -1.2, -5], 1.4, 0.45, galaxyRot),
};

export const MOBILE: Record<Key, Layout> = {
  preload: L([0, 0.2, 0], 0.55, 1),
  hero: L([0, 1.35, -0.5], 0.6, 0.85),
  manifesto: { ...L([0, -1.7, 0], 0.62, 0.9), anchor: "manifesto-core", anchorSize: 4.4 },
  services: L([0, 0.4, -2], 0.7, 0.45),
  process: L([0, 0, -2], 0.55, 0.35, [0.2, 0, 1.45]),
  cases: L([0, 0, -5], 0.9, 0.35, galaxyRot),
  tech: { ...L([0, 0, -1.5], 0.55, 0.7, [0.25, 0, 0]), anchor: "tag-sphere", anchorSize: 7.4 },
  stats: L([0, 0, -5], 0.9, 0.35, galaxyRot),
  reviews: L([0, 0, -5], 0.9, 0.3, galaxyRot),
  pricing: L([0, 0, -5], 0.9, 0.3, galaxyRot),
  faq: L([0, 0, -5], 0.9, 0.3, galaxyRot),
  contact: { ...L([0, 0.6, -2], 0.6, 0.9, [0.3, 0, 0]), anchor: "portal-anchor", anchorSize: 6.4 },
  footer: L([0, 0, -5], 0.9, 0.4, galaxyRot),
};

const CONTACT_SUCCESS: Layout = { ...L([2.4, 0.4, 0], 0.6, 1), anchor: "success-anchor", anchorSize: 4 };

export const HERO_SEQUENCE: ShapeKey[] = ["code", "browser", "phone", "chip", "sphere"];
export const SERVICE_SHAPES: ShapeKey[] = ["browser", "dashboard", "phone", "chip"];

/** Differential rotation speed (rad/s) applied in the shader for disc-like shapes. */
export const SWIRL: Partial<Record<ShapeKey, number>> = { vortex: 0.45, galaxy: 0.04 };

export function resolveShape(s: SceneState, heroIndex: number): ShapeKey {
  if (!s.revealed) return s.loaded ? "logo" : "chaos";
  switch (s.section) {
    case "hero":
      return HERO_SEQUENCE[heroIndex % HERO_SEQUENCE.length];
    case "manifesto":
      return "core";
    case "services":
      return SERVICE_SHAPES[s.serviceIndex] ?? "browser";
    case "process":
      return "helix";
    case "tech":
      return "ring";
    case "contact":
      return s.contactSuccess ? "check" : "vortex";
    default:
      return "galaxy";
  }
}

export const layoutFor = (s: SceneState, mobile: boolean): Layout => {
  if (s.revealed && s.section === "contact" && s.contactSuccess) return CONTACT_SUCCESS;
  return (mobile ? MOBILE : DESKTOP)[s.revealed ? s.section : "preload"];
};

export const SECTION_BG: Record<SectionId, string> = {
  hero: "#07080b",
  manifesto: "#0a0a11",
  services: "#070a0b",
  process: "#0b0a10",
  cases: "#07080b",
  tech: "#080b10",
  stats: "#0b090b",
  reviews: "#0b090b",
  pricing: "#08090c",
  faq: "#08090c",
  contact: "#0c0a12",
  footer: "#060708",
};

export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

/** Where the particle cloud currently sits; the glass core wraps it. Written by Particles every frame. */
export const coreFrame = { x: 0, y: 0, z: 0, scale: 1 };
