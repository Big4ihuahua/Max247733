"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const LABELS: Record<string, string> = { view: "Смотреть", drag: "Тяни" };

export function useCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: innerWidth / 2, y: innerHeight / 2, autoAlpha: 0 });
    const dx = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });
    let visible = false;

    const show = (on: boolean) => {
      if (visible === on) return;
      visible = on;
      gsap.to([dot, ring], { autoAlpha: on ? 1 : 0, duration: 0.3, overwrite: "auto" });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      show(true);
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(
        "[data-cursor], a, button, [role='button'], input, textarea, select, label",
      );
      let state = "default";
      let text = "";
      if (target) {
        const kind = target.getAttribute("data-cursor");
        if (kind && kind !== "link") {
          state = kind;
          text = target.getAttribute("data-cursor-label") ?? LABELS[kind] ?? "";
        } else if (target.matches("input, textarea, select")) {
          state = "text";
        } else {
          state = "link";
        }
      }
      ring.dataset.state = state;
      dot.dataset.state = state;
      label.textContent = text;
    };

    const onDown = () => gsap.to(ring, { scale: 0.82, duration: 0.2 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    const onLeave = () => show(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return { dotRef, ringRef, labelRef };
}
