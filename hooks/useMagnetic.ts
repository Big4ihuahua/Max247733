"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

type Options = { strength?: number; innerStrength?: number; radius?: number };

/** Pulls the element toward the cursor within `radius` px of its edges; the inner label moves further. */
export function useMagnetic<T extends HTMLElement>({ strength = 0.3, innerStrength = 0.5, radius = 80 }: Options = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");
    const cfg = { duration: 0.7, ease: "power3.out" };
    const x = gsap.quickTo(el, "x", cfg);
    const y = gsap.quickTo(el, "y", cfg);
    const ix = inner ? gsap.quickTo(inner, "x", cfg) : null;
    const iy = inner ? gsap.quickTo(inner, "y", cfg) : null;
    let active = false;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const inside = Math.abs(dx) < r.width / 2 + radius && Math.abs(dy) < r.height / 2 + radius;
      if (inside) {
        active = true;
        x(dx * strength);
        y(dy * strength);
        ix?.(dx * innerStrength * 0.4);
        iy?.(dy * innerStrength * 0.4);
      } else if (active) {
        active = false;
        x(0);
        y(0);
        ix?.(0);
        iy?.(0);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [strength, innerStrength, radius]);

  return ref;
}
