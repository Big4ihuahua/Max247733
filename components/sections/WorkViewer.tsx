"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { getLenis } from "@/lib/lenis";
import { pad2 } from "@/lib/format";
import { DEMO_SANDBOX, workSrc, works } from "@/data/works";
import { ArrowIcon } from "@/components/ui/Icons";

type Device = "desktop" | "tablet" | "phone";
const DEVICES: { id: Device; label: string; w: number; h: number }[] = [
  { id: "desktop", label: "Десктоп", w: 0, h: 0 },
  { id: "tablet", label: "Планшет", w: 820, h: 1180 },
  { id: "phone", label: "Телефон", w: 390, h: 844 },
];

type Props = { index: number; onNavigate: (index: number) => void; onClose: () => void };

export function WorkViewer({ index, onNavigate, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const [device, setDevice] = useState<Device>("desktop");
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const w = works[index];
  const dev = DEVICES.find((d) => d.id === device)!;
  const prev = (index - 1 + works.length) % works.length;
  const next = (index + 1) % works.length;

  useIsoLayoutEffect(() => {
    const el = ref.current!;
    getLenis()?.stop();
    document.documentElement.classList.add("modal-open");
    if (!prefersReducedMotion()) {
      gsap.fromTo(el.querySelector(".viewer-backdrop"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
      gsap.fromTo(
        el.querySelectorAll(".viewer-top > *"),
        { y: -16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: "expo.out", stagger: 0.05, delay: 0.15 },
      );
      gsap.fromTo(
        el.querySelector(".viewer-stage"),
        { y: 60, scale: 0.94, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 1.1, ease: "expo.out", delay: 0.1 },
      );
    }
    // Controls start hidden by the entrance tween; focus once they are visible.
    const focusCall = gsap.delayedCall(0.35, () => el.querySelector<HTMLButtonElement>(".viewer-close")?.focus({ preventScroll: true }));
    return () => {
      focusCall.kill();
      getLenis()?.start();
      document.documentElement.classList.remove("modal-open", "cursor-off");
    };
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (!el || device === "desktop") return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      setScale(Math.min(1, (r.width - 32) / dev.w, (r.height - 32) / dev.h));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [device, dev.w, dev.h]);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    gsap.to(ref.current, { autoAlpha: 0, duration: 0.4, ease: "power2.in", onComplete: onClose });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") onNavigate(next);
      else if (e.key === "ArrowLeft") onNavigate(prev);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const frameStyle =
    device === "desktop" ? undefined : ({ width: dev.w, height: dev.h, transform: `scale(${scale})` } as React.CSSProperties);

  // Portalled to <body>: <main> is its own stacking context and would sit under the header and frame.
  return createPortal(
    <div
      ref={ref}
      className="work-viewer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="work-viewer-title"
      style={{ "--accent": w.accent } as React.CSSProperties}
    >
      <div className="viewer-backdrop" onClick={close} />

      <div className="viewer-top">
        <div className="viewer-title">
          <span className="mono-label text-muted">
            {pad2(index + 1)} / {pad2(works.length)} · {w.category}
          </span>
          <h2 id="work-viewer-title">
            {w.title} <span>{w.subtitle}</span>
          </h2>
        </div>

        <p className="viewer-hint">
          <span className="viewer-hint-dot" aria-hidden="true" />
          {w.hint}
        </p>

        <div className="viewer-controls">
          <div className="viewer-devices" role="group" aria-label="Размер экрана">
            {DEVICES.map((d) => (
              <button
                key={d.id}
                type="button"
                className={device === d.id ? "is-active" : ""}
                aria-pressed={device === d.id}
                onClick={() => setDevice(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
          <a className="viewer-btn viewer-newtab" href={workSrc(w.slug)} target="_blank" rel="noopener" aria-label="Открыть в новой вкладке">
            <span className="viewer-btn-text">Новая вкладка</span> ↗
          </a>
          <button type="button" className="viewer-btn viewer-icon" onClick={() => onNavigate(prev)} aria-label={`Предыдущий: ${works[prev].title}`}>
            <ArrowIcon className="is-back" />
          </button>
          <button type="button" className="viewer-btn viewer-icon" onClick={() => onNavigate(next)} aria-label={`Следующий: ${works[next].title}`}>
            <ArrowIcon />
          </button>
          <button type="button" className="viewer-btn viewer-icon viewer-close" onClick={close} aria-label="Закрыть просмотр">
            <span />
            <span />
          </button>
        </div>
      </div>

      <div ref={stage} className={`viewer-stage is-${device}`} data-cursor="hide">
        <div className="viewer-device" style={frameStyle}>
          {loadedSlug !== w.slug && (
            <div className="viewer-loading" aria-hidden="true">
              <span className="viewer-spinner" />
              <span className="mono-label">Запускаем {w.title}…</span>
            </div>
          )}
          <iframe
            key={w.slug}
            src={workSrc(w.slug)}
            title={`Демо: ${w.title} — ${w.subtitle}`}
            sandbox={DEMO_SANDBOX}
            allow="autoplay; fullscreen"
            onLoad={() => setLoadedSlug(w.slug)}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
