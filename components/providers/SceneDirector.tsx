"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { sceneStore } from "@/lib/scene-store";
import type { SectionId } from "@/data/site";

/** Maps scroll position to the active section and feeds pointer coordinates to the WebGL scene. */
export function SceneDirector() {
  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>("[data-section]").forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) sceneStore.set({ section: el.dataset.section as SectionId });
        },
      });
    });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const p = sceneStore.state.pointer;
      p.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.y = -(e.clientY / window.innerHeight) * 2 + 1;
      sceneStore.state.pointerActive = true;
    };
    const onLeave = () => {
      sceneStore.state.pointerActive = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    let alive = true;
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

    return () => {
      alive = false;
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  });

  return null;
}
