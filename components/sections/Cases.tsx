"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, Flip, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { caseFilters, cases, type CaseCategory } from "@/data/cases";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Mockup } from "@/components/ui/Mockup";
import { ArrowIcon } from "@/components/ui/Icons";
import { pad2 } from "@/lib/format";
import { CaseModal } from "./CaseModal";

type Filter = "all" | CaseCategory;

function liquidIn(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
  const media = e.currentTarget.querySelector<HTMLElement>(".case-media-inner");
  if (!media) return;
  document.querySelectorAll<HTMLElement>(".case-media-inner").forEach((m) => {
    if (m !== media) m.style.filter = "";
  });
  const disp = document.getElementById("liquid-disp");
  const off = document.getElementById("liquid-offset");
  const turb = document.getElementById("liquid-turb");
  gsap.killTweensOf([disp, off, turb]);
  media.style.filter = "url(#liquid)";
  gsap
    .timeline()
    .fromTo(disp, { attr: { scale: 0 } }, { attr: { scale: 60 }, duration: 0.35, ease: "power2.out" })
    .to(disp, { attr: { scale: 6 }, duration: 1, ease: "expo.out" });
  gsap.timeline().fromTo(off, { attr: { dx: 0 } }, { attr: { dx: 7 }, duration: 0.35 }).to(off, { attr: { dx: 1.5 }, duration: 0.9 });
  gsap.fromTo(turb, { attr: { baseFrequency: "0.02 0.07" } }, { attr: { baseFrequency: "0.008 0.02" }, duration: 1.3, ease: "expo.out" });
}

function liquidOut(e: React.PointerEvent<HTMLElement>) {
  const media = e.currentTarget.querySelector<HTMLElement>(".case-media-inner");
  if (!media || !media.style.filter) return;
  const disp = document.getElementById("liquid-disp");
  const off = document.getElementById("liquid-offset");
  gsap.killTweensOf([disp, off]);
  gsap.to(off, { attr: { dx: 0 }, duration: 0.4 });
  gsap.to(disp, {
    attr: { scale: 0 },
    duration: 0.45,
    ease: "power2.out",
    onComplete: () => {
      media.style.filter = "";
    },
  });
}

export function Cases() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const openState = useRef<Flip.FlipState | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const changeFilter = (id: Filter) => {
    if (id === filter || !grid.current) return;
    flipState.current = Flip.getState(grid.current.querySelectorAll(".case-card"));
    setFilter(id);
  };

  useIsoLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    Flip.from(state, {
      duration: 0.9,
      ease: "expo.inOut",
      absolute: true,
      scale: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.8, delay: 0.25, ease: "expo.out" }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.85, duration: 0.5, ease: "power3.in" }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [filter]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".case-card", root.current).forEach((card) => {
        gsap.fromTo(
          card.querySelector(".case-media-inner"),
          { yPercent: -2.5 },
          { yPercent: 2.5, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  const open = (i: number, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    const media = grid.current?.querySelector(`[data-flip-id="media-${cases[i].slug}"]`);
    openState.current = media ? Flip.getState(media) : null;
    setOpenIndex(i);
  };

  const close = useCallback(() => {
    setOpenIndex(null);
    lastTrigger.current?.focus({ preventScroll: true });
  }, []);

  const visibleCount = cases.filter((c) => filter === "all" || c.category === filter).length;

  return (
    <section id="cases" ref={root} data-section="cases" className="section cases">
      <div className="cases-header">
        <div>
          <SectionLabel id="cases" />
          <h2 className="h2" data-split>
            Избранные
            <br />
            <span className="text-gradient">работы</span>
          </h2>
        </div>
        <div className="cases-controls" data-reveal>
          <div className="chips" role="group" aria-label="Фильтр кейсов">
            {caseFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`chip ${filter === f.id ? "is-active" : ""}`}
                aria-pressed={filter === f.id}
                onClick={() => changeFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="mono-label text-muted">
            {pad2(visibleCount)} {visibleCount === 1 ? "проект" : visibleCount < 5 ? "проекта" : "проектов"}
          </span>
        </div>
      </div>

      <div ref={grid} className="cases-grid">
        {cases.map((c, i) => {
          const visible = filter === "all" || c.category === filter;
          return (
            <article
              key={c.slug}
              data-flip-id={`card-${c.slug}`}
              className={`case-card case-${c.size} ${visible ? "" : "is-hidden"}`}
              data-cursor="view"
              data-reveal
              onPointerEnter={liquidIn}
              onPointerLeave={liquidOut}
            >
              <div className="case-media" data-flip-id={`media-${c.slug}`}>
                <div className="case-media-inner">
                  <Mockup variant={c.mockup} colors={c.colors} />
                </div>
                <span className="case-open" aria-hidden="true">
                  Смотреть кейс <ArrowIcon />
                </span>
              </div>
              <div className="case-info">
                <div className="case-head">
                  <h3 className="case-title">{c.title}</h3>
                  <span className="mono-label text-muted">{c.year}</span>
                </div>
                <p className="case-type">{c.type}</p>
                <div className="case-foot">
                  <span className="case-metric">{c.metric}</span>
                  <span className="case-stack mono-label">{c.stack.join(" · ")}</span>
                </div>
              </div>
              <button
                type="button"
                className="case-hit"
                aria-label={`Открыть кейс ${c.title}: ${c.type}`}
                tabIndex={visible ? 0 : -1}
                onClick={(e) => open(i, e.currentTarget)}
              />
            </article>
          );
        })}
      </div>

      <div className="showcase">
        <div className="showcase-item showcase-phone">
          <div id="device-phone" className="device-anchor" aria-hidden="true" />
          <div className="showcase-caption" data-reveal>
            <span className="mono-label text-mint">Pulse · iOS / Android</span>
            <p>Кольца активности, пульс и сон — приложение живёт прямо в 3D-смартфоне.</p>
          </div>
        </div>
        <div className="showcase-item showcase-laptop">
          <div id="device-laptop" className="device-anchor" aria-hidden="true" />
          <div className="showcase-caption" data-reveal>
            <span className="mono-label text-mint">Nordwind · Next.js</span>
            <p>Крышка открывается, а магазин прокручивается внутри экрана — так же быстро, как в жизни.</p>
          </div>
        </div>
      </div>

      {openIndex !== null && (
        <CaseModal index={openIndex} flip={openState} onClose={close} onNavigate={(i) => setOpenIndex(i)} />
      )}
    </section>
  );
}
