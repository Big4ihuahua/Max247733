/** localStorage key for the visitor's explicit choice: "static" or "full". */
export const SCENE_PREF_KEY = "lumen-scene";
/** Class on <html> while the WebGL scene is replaced by the static backdrop. Set before first paint by the boot script. */
export const STATIC_CLASS = "scene-static";

export type StaticReason = "user" | "reduced-motion" | "save-data" | "no-webgl" | "performance";

export type SceneMode = { isStatic: boolean; reason: StaticReason | null };

export const SERVER_SCENE_MODE: SceneMode = { isStatic: false, reason: null };
let mode: SceneMode | null = null;
const listeners = new Set<() => void>();

function read(): SceneMode {
  if (mode) return mode;
  const html = document.documentElement;
  const reason = (html.dataset.sceneReason as StaticReason | undefined) ?? null;
  mode = { isStatic: html.classList.contains(STATIC_CLASS), reason };
  return mode;
}

function apply(next: SceneMode) {
  mode = next;
  const html = document.documentElement;
  html.classList.toggle(STATIC_CLASS, next.isStatic);
  if (next.reason) html.dataset.sceneReason = next.reason;
  else delete html.dataset.sceneReason;
  listeners.forEach((l) => l());
}

export const sceneMode = {
  get: () => (typeof window === "undefined" ? SERVER_SCENE_MODE : read()),
  /** Visitor toggle; remembered across visits. */
  setStatic(on: boolean) {
    try {
      localStorage.setItem(SCENE_PREF_KEY, on ? "static" : "full");
    } catch {}
    apply({ isStatic: on, reason: on ? "user" : null });
  },
  /** Automatic downgrade for this page view only (no WebGL, or the device can't keep up). */
  forceStatic(reason: Extract<StaticReason, "no-webgl" | "performance">) {
    if (read().reason === "no-webgl") return;
    apply({ isStatic: true, reason });
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
