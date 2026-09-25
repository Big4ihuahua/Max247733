"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";
import { sceneStore } from "@/lib/scene-store";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: 0, duration: 1.6 },
      autoRaf: false,
    });
    setLenis(lenis);

    const offScroll = lenis.on("scroll", (l: Lenis) => {
      ScrollTrigger.update();
      sceneStore.state.scrollVelocity = l.velocity;
    });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    if (document.documentElement.classList.contains("is-loading")) lenis.stop();

    return () => {
      offScroll();
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
