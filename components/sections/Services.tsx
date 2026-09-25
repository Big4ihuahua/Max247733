"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { sceneStore, useSceneStore } from "@/lib/scene-store";
import { services } from "@/data/services";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DotSymbol } from "@/components/ui/DotSymbol";
import { pad2 } from "@/lib/format";

const HORIZONTAL = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

function tilt(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  card.style.setProperty("--mx", `${x * 100}%`);
  card.style.setProperty("--my", `${y * 100}%`);
  gsap.to(card, { rotateY: (x - 0.5) * 10, rotateX: (0.5 - y) * 10, transformPerspective: 1000, duration: 0.6, ease: "power3.out", overwrite: "auto" });
}

function untilt(e: React.PointerEvent<HTMLElement>) {
  gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 1, ease: "expo.out", overwrite: "auto" });
}

export function Services() {
  const root = useRef<HTMLElement>(null);
  const active = useSceneStore((s) => s.serviceIndex);

  useGSAP(
    () => {
      const el = root.current!;
      const pin = el.querySelector<HTMLElement>(".services-pin")!;
      const track = el.querySelector<HTMLElement>(".services-track")!;
      const bar = el.querySelector<HTMLElement>(".services-bar-fill");
      const cards = gsap.utils.toArray<HTMLElement>(".service-card", el);

      const pickActive = () => {
        const cx = window.innerWidth * 0.55;
        let best = 0;
        let bestD = Infinity;
        cards.forEach((c, i) => {
          const r = c.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - cx);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        sceneStore.set({ serviceIndex: best });
      };

      const mm = gsap.matchMedia();
      mm.add(HORIZONTAL, () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            pin: true,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar) gsap.set(bar, { scaleX: self.progress });
              pickActive();
            },
          },
        });
      });
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        cards.forEach((card, i) =>
          ScrollTrigger.create({
            trigger: card,
            start: "top 65%",
            end: "bottom 35%",
            onToggle: (self) => self.isActive && sceneStore.set({ serviceIndex: i }),
          }),
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="services" ref={root} data-section="services" className="services">
      <div className="services-pin">
        <div className="services-track">
          <div className="services-intro">
            <SectionLabel index="03" label="Услуги" />
            <h2 className="h2" data-split>
              Что мы
              <br />
              <span className="text-outline">делаем</span>
            </h2>
            <p className="services-lead" data-reveal>
              Полный цикл: от стратегии и дизайна до кода, запуска и поддержки. Одна команда — ноль испорченных телефонов.
            </p>
            <div className="services-counter mono-label" data-reveal>
              <span className="text-mint">{pad2(active + 1)}</span>
              <span className="services-bar">
                <span className="services-bar-fill" />
              </span>
              <span className="text-muted">{pad2(services.length)}</span>
            </div>
          </div>

          {services.map((s, i) => (
            <article
              key={s.id}
              className={`service-card ${active === i ? "is-active" : ""}`}
              onPointerMove={tilt}
              onPointerLeave={untilt}
            >
              <span className="service-glow" aria-hidden="true" />
              <div className="service-top">
                <span className="mono-label text-mint">{s.num}</span>
                <span className="mono-label text-muted">{s.tag}</span>
              </div>
              <DotSymbol symbol={s.symbol} active={active === i} />
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.description}</p>
              <ul className="service-list">
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <div className="service-bottom">
                <div>
                  <span className="mono-label text-muted">Срок</span>
                  <span>{s.term}</span>
                </div>
                <div>
                  <span className="mono-label text-muted">Стоимость</span>
                  <span>{s.price}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
