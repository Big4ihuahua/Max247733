"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { processSteps } from "@/data/process";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { pad2 } from "@/lib/format";

// Kept shallow so the cards can alternate above and below the line without colliding.
const PATH = "M0,205 C150,205 210,150 350,155 S560,255 700,240 S900,150 1050,165 S1170,215 1200,210";
const FRACTIONS = processSteps.map((_, i) => 0.07 + (i * 0.86) / (processSteps.length - 1));
const WAVE = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export function Process() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  const [nodes, setNodes] = useState<{ x: number; y: number }[] | null>(null);

  useEffect(() => {
    const path = root.current?.querySelector<SVGPathElement>(".process-path-base");
    if (!path) return;
    const len = path.getTotalLength();
    setNodes(
      FRACTIONS.map((f) => {
        const p = path.getPointAtLength(len * f);
        return { x: p.x / 12, y: p.y / 4 };
      }),
    );
  }, []);

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();

      mm.add(WAVE, () => {
        const path = el.querySelector<SVGPathElement>(".process-path-draw")!;
        const head = el.querySelector<HTMLElement>(".process-head")!;
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len}`;
        const st = { p: 0 };
        let last = -2;
        gsap.to(st, {
          p: 1,
          ease: "none",
          onUpdate: () => {
            path.style.strokeDashoffset = `${len * (1 - st.p)}`;
            const pt = path.getPointAtLength(len * st.p);
            head.style.left = `${pt.x / 12}%`;
            head.style.top = `${pt.y / 4}%`;
            const idx = FRACTIONS.filter((f) => st.p >= f - 0.015).length - 1;
            if (idx !== last) {
              last = idx;
              setActive(idx);
            }
          },
          scrollTrigger: { trigger: el.querySelector(".process-pin"), pin: true, start: "top top", end: "+=260%", scrub: 1 },
        });
        return () => {
          path.style.strokeDasharray = "";
          path.style.strokeDashoffset = "";
        };
      });

      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        gsap.fromTo(
          el.querySelector(".process-vfill"),
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: el.querySelector(".process-list"), start: "top 70%", end: "bottom 70%", scrub: true } },
        );
        gsap.utils.toArray<HTMLElement>(".process-item", el).forEach((item) =>
          ScrollTrigger.create({
            trigger: item,
            start: "top 72%",
            onEnter: () => item.classList.add("is-active"),
            onLeaveBack: () => item.classList.remove("is-active"),
          }),
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="process" ref={root} data-section="process" className="process">
      <div className="process-pin">
        <div className="process-header">
          <div>
            <SectionLabel index="04" label="Процесс" />
            <h2 className="h2" data-split>
              Как мы
              <br />
              <span className="text-outline">работаем</span>
            </h2>
          </div>
          <div className="process-aside" data-reveal>
            <p>Шесть понятных этапов. На каждом — результат, который можно потрогать, и никаких сюрпризов в смете.</p>
            <span className="mono-label">
              Этап <span className="text-mint">{pad2(Math.max(active, 0) + 1)}</span> / {pad2(processSteps.length)}
            </span>
          </div>
        </div>

        <div className="process-wave">
          <svg className="process-svg" viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="process-grad" x1="0" x2="1200" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7CF5C8" />
                <stop offset="0.6" stopColor="#A89BFF" />
                <stop offset="1" stopColor="#FFB38A" />
              </linearGradient>
            </defs>
            <path className="process-path-base" d={PATH} />
            <path className="process-path-draw" d={PATH} />
          </svg>
          <span className="process-head" aria-hidden="true" />
          {nodes &&
            processSteps.map((s, i) => {
              const n = nodes[i];
              const align = i === 0 ? "start" : i === processSteps.length - 1 ? "end" : "center";
              return (
                <div
                  key={s.title}
                  className={`process-node ${i % 2 === 0 ? "above" : "below"} align-${align} ${i <= active ? "is-done" : ""} ${
                    i === active ? "is-active" : ""
                  }`}
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <span className="process-dot" />
                  <div className="process-card">
                    <span className="mono-label text-mint">
                      {pad2(i + 1)} · {s.duration}
                    </span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </div>
              );
            })}
        </div>

        <ol className="process-list">
          <span className="process-vline" aria-hidden="true">
            <span className="process-vfill" />
          </span>
          {processSteps.map((s, i) => (
            <li key={s.title} className="process-item">
              <span className="process-item-dot" aria-hidden="true" />
              <span className="mono-label text-mint">
                {pad2(i + 1)} · {s.duration}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
