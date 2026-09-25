"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, Flip, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { caseFilters, caseShots, cases, type CaseCategory } from "@/data/cases";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowIcon } from "@/components/ui/Icons";
import { LIVE_PREVIEW_QUERY, LiveFrame } from "@/components/ui/LiveFrame";
import { pad2 } from "@/lib/format";
import { CaseModal } from "./CaseModal";
import { WorkViewer } from "./WorkViewer";

type Filter = "all" | CaseCategory;

const DWELL_MS = 650;
const PHONE_CASE = cases.findIndex((c) => c.slug === "yadro");
const LAPTOP_CASE = cases.findIndex((c) => c.slug === "torq");

function liquidIn(media: HTMLElement) {
  if (prefersReducedMotion()) return;
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

function liquidOut(media: HTMLElement) {
  if (!media.style.filter) return;
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
  const [viewer, setViewer] = useState<number | null>(null);
  const [live, setLive] = useState<string | null>(null);
  const liveTimer = useRef(0);
  const canLive = useMediaQuery(LIVE_PREVIEW_QUERY);
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

  const enter = (e: React.PointerEvent<HTMLElement>, slug: string) => {
    if (e.pointerType !== "mouse") return;
    const media = e.currentTarget.querySelector<HTMLElement>(".case-media-inner");
    if (media) liquidIn(media);
    window.clearTimeout(liveTimer.current);
    if (canLive) liveTimer.current = window.setTimeout(() => setLive(slug), DWELL_MS);
  };

  const leave = (e: React.PointerEvent<HTMLElement>) => {
    const media = e.currentTarget.querySelector<HTMLElement>(".case-media-inner");
    if (media) liquidOut(media);
    window.clearTimeout(liveTimer.current);
    setLive(null);
  };

  const open = (i: number, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    window.clearTimeout(liveTimer.current);
    const media = grid.current?.querySelector(`[data-flip-id="media-${cases[i].slug}"]`);
    openState.current = media ? Flip.getState(media) : null;
    setLive(null);
    setOpenIndex(i);
  };

  const close = useCallback(() => {
    setOpenIndex(null);
    lastTrigger.current?.focus({ preventScroll: true });
  }, []);

  const launch = (i: number, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    setViewer(i);
  };

  const closeViewer = useCallback(() => {
    setViewer(null);
    lastTrigger.current?.focus({ preventScroll: true });
  }, []);

  const visibleCount = cases.filter((c) => filter === "all" || c.filter === filter).length;

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
          <p className="cases-lead">Каждый сайт — один HTML-файл без картинок и видео. Наведите курсор, и превью оживёт.</p>
          <div className="chips" role="group" aria-label="Фильтр работ">
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
          const visible = filter === "all" || c.filter === filter;
          const shots = caseShots(c.slug);
          return (
            <article
              key={c.slug}
              data-flip-id={`card-${c.slug}`}
              className={`case-card case-${c.size} ${visible ? "" : "is-hidden"}`}
              style={{ "--accent": c.accent } as React.CSSProperties}
              data-cursor="view"
              data-reveal
              onPointerEnter={(e) => enter(e, c.slug)}
              onPointerLeave={leave}
            >
              <div className="case-media" data-flip-id={`media-${c.slug}`}>
                <div className="case-media-inner">
                  <img src={shots[0]} alt="" width={1280} height={800} loading="lazy" decoding="async" />
                  {c.size === "full" && (
                    <img className="case-diptych" src={shots[1]} alt="" width={960} height={600} loading="lazy" decoding="async" />
                  )}
                </div>
                {live === c.slug && <LiveFrame key={c.slug} slug={c.slug} />}
                <span className="case-badge mono-label">{c.category}</span>
                <span className="case-open" aria-hidden="true">
                  Смотреть кейс <ArrowIcon />
                </span>
              </div>
              <div className="case-info">
                <div className="case-head">
                  <h3 className="case-title">{c.title}</h3>
                  <span className="mono-label text-muted">{c.year}</span>
                </div>
                <p className="case-type">{c.description}</p>
                <div className="case-foot">
                  <span className="case-metric">{c.metric}</span>
                  <span className="case-stack mono-label">{c.stack.join(" · ")}</span>
                </div>
              </div>
              <button
                type="button"
                className="case-hit"
                aria-label={`Открыть кейс ${c.title}: ${c.subtitle}`}
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
            <span className="mono-label text-mint">ЯДРО.dev · мобильная версия</span>
            <p>Сайт онлайн-школы в 3D-смартфоне: прокручивайте страницу — и мобильная вёрстка листается вместе с вами.</p>
            <button type="button" className="btn-text showcase-link" onClick={(e) => launch(PHONE_CASE, e.currentTarget)}>
              Запустить демо <ArrowIcon />
            </button>
          </div>
        </div>
        <div className="showcase-item showcase-laptop">
          <div id="device-laptop" className="device-anchor" aria-hidden="true" />
          <div className="showcase-caption" data-reveal>
            <span className="mono-label text-mint">TORQ.ECU · каталог</span>
            <p>Крышка открывается, а магазин прошивок прокручивается прямо внутри экрана — от главного экрана до каталога.</p>
            <button type="button" className="btn-text showcase-link" onClick={(e) => launch(LAPTOP_CASE, e.currentTarget)}>
              Запустить демо <ArrowIcon />
            </button>
          </div>
        </div>
      </div>

      {openIndex !== null && (
        <CaseModal index={openIndex} flip={openState} onClose={close} onNavigate={(i) => setOpenIndex(i)} />
      )}
      {viewer !== null && <WorkViewer items={cases} index={viewer} onNavigate={setViewer} onClose={closeViewer} />}
    </section>
  );
}

