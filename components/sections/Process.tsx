"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { processSteps } from "@/data/process";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { pad2 } from "@/lib/format";

const PATH = "M0,230 C150,230 210,120 350,130 S560,300 700,280 S900,110 1050,130 S1170,210 1200,200";
const FRACTIONS = processSteps.map((_, i) => 0.06 + (i * 0.88) / (processSteps.length - 1));
const WAVE = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export function Process() {
  const root = useRef<HTMLElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [nodes, setNodes] = useState<{ x: number; y: number }[] | null>(null);
  const step = processSteps[active];

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

  useEffect(() => {
    const el = detail.current;
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el.querySelectorAll("[data-step-fade]"),
      { y: 18, autoAlpha: 0, filter: "blur(6px)" },
      { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.8, ease: "expo.out", stagger: 0.05, overwrite: true, clearProps: "filter" },
    );
  }, [active]);

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
        let last = -1;
        gsap.to(st, {
          p: 1,
          ease: "none",
          onUpdate: () => {
            path.style.strokeDashoffset = `${len * (1 - st.p)}`;
            const pt = path.getPointAtLength(len * st.p);
            head.style.left = `${pt.x / 12}%`;
            head.style.top = `${pt.y / 4}%`;
            const idx = Math.max(0, FRACTIONS.filter((f) => st.p >= f - 0.02).length - 1);
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
            <SectionLabel id="process" />
            <h2 className="h2 process-title" data-split>
              Как мы <span className="text-outline">работаем</span>
            </h2>
          </div>
          <p className="process-lead" data-reveal>
            Шесть понятных этапов. На каждом — результат, который можно потрогать, и никаких сюрпризов в смете.
          </p>
        </div>

        <div className="process-wave" aria-hidden="true">
          <svg className="process-svg" viewBox="0 0 1200 400" preserveAspectRatio="none">
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
          <span className="process-head" />
          {nodes &&
            processSteps.map((s, i) => {
              const n = nodes[i];
              const align = i === 0 ? "start" : i === processSteps.length - 1 ? "end" : "center";
              // Label goes on the side of the curve that has more room.
              const side = n.y > 50 ? "above" : "below";
              return (
                <div
                  key={s.title}
                  className={`process-node ${side} align-${align} ${i <= active ? "is-done" : ""} ${i === active ? "is-active" : ""}`}
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <span className="process-dot" />
                  <span className="process-tag">
                    <span className="mono-label">{pad2(i + 1)}</span>
                    <span className="process-tag-title">{s.title}</span>
                  </span>
                </div>
              );
            })}
        </div>

        <div ref={detail} className="process-detail" aria-live="polite">
          <div className="process-detail-card">
            <span className="process-detail-num" data-step-fade>
              {pad2(active + 1)}
            </span>
            <div className="process-detail-body">
              <span className="mono-label text-mint" data-step-fade>
                Этап {pad2(active + 1)} · {step.duration}
              </span>
              <h3 data-step-fade>{step.title}</h3>
              <p data-step-fade>{step.text}</p>
            </div>
          </div>
          <div className="process-steps" aria-hidden="true">
            {processSteps.map((s, i) => (
              <span key={s.title} className={i <= active ? "is-on" : ""} />
            ))}
          </div>
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
