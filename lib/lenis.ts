import type Lenis from "lenis";

let instance: Lenis | null = null;
const listeners = new Set<(l: Lenis | null) => void>();

export function setLenis(l: Lenis | null) {
  instance = l;
  listeners.forEach((fn) => fn(l));
}

export const getLenis = () => instance;

export function onLenisChange(fn: (l: Lenis | null) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function scrollToTarget(target: string | HTMLElement | number, opts: { offset?: number; immediate?: boolean } = {}) {
  if (instance) {
    instance.scrollTo(target, {
      offset: opts.offset ?? 0,
      immediate: opts.immediate,
      duration: 1.6,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      force: true,
    });
    return;
  }
  const behavior: ScrollBehavior = opts.immediate ? "auto" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior });
}
