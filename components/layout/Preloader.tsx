"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { sceneStore } from "@/lib/scene-store";
import { site } from "@/data/site";

export function Preloader() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("is-loading")) {
      sceneStore.set({ loaded: true, revealed: true });
      setDone(true);
      return;
    }
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const counter = { v: 0 };
    const el = root.current!;
    const tl = gsap.timeline();
    tl.to(counter, {
      v: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
      },
    })
      .to(el.querySelector(".pl-bar-fill"), { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, 0)
      .add(() => sceneStore.set({ loaded: true }))
      .to(el.querySelectorAll(".pl-fade"), { autoAlpha: 0, y: -24, duration: 0.5, ease: "power3.in", stagger: 0.04 }, "+=0.5")
      .add(() => {
        html.classList.remove("is-loading");
        try {
          sessionStorage.setItem(site.storageKey, "1");
        } catch {}
        sceneStore.set({ revealed: true });
        getLenis()?.start();
        ScrollTrigger.refresh();
      })
      .add(() => setDone(true), "+=0.3");

    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="preloader" role="status" aria-label="Загрузка">
      <div className="pl-row pl-fade mono-label">
        <span>{site.fullName}</span>
        <span className="text-muted">Код как живая материя</span>
      </div>
      <div className="pl-center pl-fade">
        <span ref={count} className="pl-count">
          000
        </span>
        <span className="pl-pct mono-label">%</span>
      </div>
      <div className="pl-row pl-fade mono-label">
        <span className="text-muted">© {site.founded}—2026</span>
        <span className="pl-bar">
          <span className="pl-bar-fill" />
        </span>
        <span className="text-muted">Загружаем вселенную</span>
      </div>
    </div>
  );
}
