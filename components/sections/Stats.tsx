"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { stats } from "@/data/stats";
import { Odometer } from "@/components/ui/Odometer";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const strips = gsap.utils.toArray<HTMLElement>(".odo-strip", root.current);
      const to = (s: HTMLElement) => -((10 + Number(s.dataset.digit)) / 20) * 100;
      if (prefersReducedMotion()) {
        strips.forEach((s) => gsap.set(s, { yPercent: to(s) }));
        return;
      }
      gsap.to(strips, {
        yPercent: (_: number, s: HTMLElement) => to(s),
        duration: 2.2,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section id="stats" ref={root} data-section="stats" className="section stats">
      <div className="stats-header">
        <SectionLabel index="07" label="Цифры" />
        <h2 className="h3" data-split>
          Цифры, за которые <span className="text-gradient">не стыдно</span>
        </h2>
      </div>
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat" data-reveal>
            <Odometer value={s.value} />
            <p className="mono-label text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
