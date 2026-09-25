"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { workThumb, works } from "@/data/works";
import { pad2 } from "@/lib/format";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowIcon } from "@/components/ui/Icons";
import { LIVE_PREVIEW_QUERY, LiveFrame } from "@/components/ui/LiveFrame";
import { WorkViewer } from "./WorkViewer";

const DWELL_MS = 550;

export function LiveWorks() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const [liveSlug, setLiveSlug] = useState<string | null>(null);
  const [liveReady, setLiveReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [viewer, setViewer] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const canLive = useMediaQuery(LIVE_PREVIEW_QUERY);
  const w = works[active];

  const activate = useCallback((i: number) => {
    setActive(i);
    setSeen((s) => (s.has(i) ? s : new Set(s).add(i)));
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "-10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    setLiveReady(false);
    setLiveSlug(null);
    if (!canLive || !inView || viewer !== null) return;
    const id = window.setTimeout(() => setLiveSlug(works[active].slug), DWELL_MS);
    return () => window.clearTimeout(id);
  }, [active, canLive, inView, viewer]);

  const open = (i: number, trigger: HTMLElement | null) => {
    lastTrigger.current = trigger;
    activate(i);
    setViewer(i);
  };

  const navigate = useCallback(
    (i: number) => {
      activate(i);
      setViewer(i);
    },
    [activate],
  );

  const close = useCallback(() => {
    setViewer(null);
    lastTrigger.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section id="works" ref={root} data-section="works" className="section works">
      <div className="works-header">
        <div>
          <SectionLabel id="works" />
          <h2 className="h2" data-split>
            Живые
            <br />
            <span className="text-gradient">примеры</span>
          </h2>
        </div>
        <div className="works-aside" data-reveal>
          <p>
            {works.length} настоящих проектов, которые работают прямо в браузере. Наведите — превью оживёт. Нажмите — откроется
            полноэкранный режим, где можно всё потрогать.
          </p>
          <span className="mono-label text-muted">HTML · Canvas · WebGL · Web Audio</span>
        </div>
      </div>

      <div className="works-layout">
        <ol className="works-list">
          {works.map((item, i) => (
            <li key={item.slug} className="work-item" data-reveal>
              <button
                type="button"
                className={`work-row ${i === active ? "is-active" : ""}`}
                style={{ "--accent": item.accent } as React.CSSProperties}
                onPointerEnter={(e) => e.pointerType === "mouse" && activate(i)}
                onFocus={() => activate(i)}
                onClick={(e) => open(i, e.currentTarget)}
                data-cursor="view"
                data-cursor-label="Открыть"
                aria-label={`Открыть демо «${item.title}» — ${item.subtitle}`}
              >
                <span className="work-thumb" aria-hidden="true">
                  <img src={workThumb(item.slug)} alt="" width={1280} height={800} loading="lazy" decoding="async" />
                </span>
                <span className="work-num mono-label">{pad2(i + 1)}</span>
                <span className="work-name">
                  <span className="work-title">{item.title}</span>
                  <span className="work-sub">{item.subtitle}</span>
                </span>
                <span className="work-desc">{item.description}</span>
                <span className="work-cat mono-label">{item.category}</span>
                <span className="work-arrow" aria-hidden="true">
                  <ArrowIcon />
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="works-stage" aria-hidden="true">
          <div className="stage-sticky">
            <div className="stage-frame" style={{ "--accent": w.accent } as React.CSSProperties}>
              <div className="stage-bar">
                <i />
                <i />
                <i />
                <span className="stage-url">lumen.studio/works/{w.slug}</span>
                <span className={`stage-status ${liveReady ? "is-live" : ""}`}>{liveReady ? "live" : "превью"}</span>
              </div>
              <div className="stage-screen" onClick={() => open(active, null)} data-cursor="view" data-cursor-label="Открыть">
                {works.map((item, i) =>
                  seen.has(i) ? (
                    <img
                      key={item.slug}
                      className={`stage-shot ${i === active ? "is-on" : ""}`}
                      src={workThumb(item.slug)}
                      alt=""
                      width={1280}
                      height={800}
                      decoding="async"
                    />
                  ) : null,
                )}
                {liveSlug && <LiveFrame key={liveSlug} slug={liveSlug} onReady={() => setLiveReady(true)} />}
                <span className="stage-open">
                  Открыть демо <ArrowIcon />
                </span>
              </div>
            </div>
            <div className="stage-info">
              <div className="stage-meta">
                <span className="mono-label text-mint">
                  {pad2(active + 1)} / {pad2(works.length)} · {w.category}
                </span>
                <p key={w.slug} className="stage-desc">
                  {w.description}
                </p>
              </div>
              <div className="stage-tags">
                {w.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
                {w.sound && <span className="is-sound">Со звуком</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewer !== null && <WorkViewer items={works} index={viewer} onNavigate={navigate} onClose={close} />}
    </section>
  );
}
