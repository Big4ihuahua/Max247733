"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap, Flip, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { getLenis } from "@/lib/lenis";
import { cases, type CaseStudy } from "@/data/cases";
import { Mockup } from "@/components/ui/Mockup";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowIcon } from "@/components/ui/Icons";

type Props = {
  index: number;
  flip: React.RefObject<Flip.FlipState | null>;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function CaseModal({ index, flip, onClose, onNavigate }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const c = cases[index];
  const next = (index + 1) % cases.length;

  useIsoLayoutEffect(() => {
    const el = ref.current!;
    getLenis()?.stop();
    document.documentElement.classList.add("modal-open");
    const reduced = prefersReducedMotion();
    gsap.fromTo(el.querySelector(".modal-backdrop"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
    const media = el.querySelector<HTMLElement>(".modal-media");
    if (flip.current && media && !reduced) {
      Flip.from(flip.current, { targets: media, duration: 1.1, ease: "expo.inOut", scale: true });
    } else if (media) {
      gsap.fromTo(media, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 });
    }
    flip.current = null;
    el.querySelector<HTMLButtonElement>(".modal-close")?.focus({ preventScroll: true });
    return () => {
      getLenis()?.start();
      document.documentElement.classList.remove("modal-open");
    };
  }, []);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    gsap.to(ref.current, { autoAlpha: 0, duration: 0.45, ease: "power2.in", onComplete: onClose });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const goNext = () => {
    const scroller = ref.current?.querySelector(".modal-scroll");
    gsap.to(scroller?.querySelectorAll("[data-modal-fade], .modal-media") ?? [], {
      autoAlpha: 0,
      y: -20,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        scroller?.scrollTo({ top: 0 });
        onNavigate(next);
      },
    });
  };

  return createPortal(
    <div ref={ref} className="case-modal" role="dialog" aria-modal="true" aria-labelledby="case-modal-title">
      <div className="modal-backdrop" onClick={close} />
      <button type="button" className="modal-close" onClick={close} aria-label="Закрыть кейс">
        <span />
        <span />
      </button>
      <div className="modal-scroll" data-lenis-prevent>
        <ModalContent key={c.slug} c={c} nextTitle={cases[next].title} onNext={goNext} />
      </div>
    </div>,
    document.body,
  );
}

function ModalContent({ c, nextTitle, onNext }: { c: CaseStudy; nextTitle: string; onNext: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current!;
    if (prefersReducedMotion()) return;
    gsap.fromTo(
      el.querySelectorAll("[data-modal-fade]"),
      { y: 40, autoAlpha: 0, filter: "blur(8px)" },
      { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1, ease: "expo.out", stagger: 0.06, delay: 0.45, clearProps: "filter" },
    );
    gsap.set(el.querySelector(".modal-media"), { autoAlpha: 1, y: 0 });
  }, []);

  return (
    <div ref={ref} className="modal-content">
      <div className="modal-media" data-flip-id={`media-${c.slug}`}>
        <Mockup variant={c.mockup} colors={c.colors} />
      </div>

      <div className="modal-head">
        <div data-modal-fade>
          <span className="mono-label text-mint">
            {c.year} · {c.type}
          </span>
          <h2 id="case-modal-title" className="modal-title">
            {c.title}
          </h2>
        </div>
        <dl className="modal-meta" data-modal-fade>
          <div>
            <dt className="mono-label text-muted">Стек</dt>
            <dd>{c.stack.join(" · ")}</dd>
          </div>
          <div>
            <dt className="mono-label text-muted">Итог</dt>
            <dd>{c.metric}</dd>
          </div>
        </dl>
      </div>

      <div className="modal-body">
        <div data-modal-fade>
          <h3 className="mono-label text-muted">Задача</h3>
          <p>{c.task}</p>
        </div>
        <div data-modal-fade>
          <h3 className="mono-label text-muted">Решение</h3>
          <p>{c.solution}</p>
        </div>
      </div>

      <div className="modal-results">
        {c.results.map((r) => (
          <div key={r.label} className="modal-result" data-modal-fade>
            <Counter value={r.value} prefix={r.prefix} suffix={r.suffix} decimals={r.decimals} />
            <span className="mono-label text-muted">{r.label}</span>
          </div>
        ))}
      </div>

      <div className="modal-gallery">
        {["0% 0%", "50% 40%", "100% 100%"].map((origin, i) => (
          <div key={i} className="modal-shot" data-modal-fade>
            <div className="modal-shot-inner" style={{ transformOrigin: origin }}>
              <Mockup variant={c.mockup} colors={c.colors} />
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="modal-next" onClick={onNext} data-cursor="link" data-modal-fade>
        <span className="mono-label text-muted">Следующий кейс</span>
        <span className="modal-next-title">
          {nextTitle} <ArrowIcon />
        </span>
      </button>

      <div className="modal-cta" data-modal-fade>
        <p>Хотите такой же результат?</p>
        <MagneticButton href="#contact" onClick={() => document.querySelector<HTMLButtonElement>(".modal-close")?.click()}>
          Обсудить проект <ArrowIcon />
        </MagneticButton>
      </div>
    </div>
  );
}

function Counter({ value, prefix = "", suffix = "", decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = (v: number) => {
      el.textContent = `${prefix}${v.toLocaleString("ru-RU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
    };
    if (prefersReducedMotion()) {
      render(value);
      return;
    }
    render(0);
    const obj = { v: 0 };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        gsap.to(obj, { v: value, duration: 1.8, ease: "expo.out", delay: 0.3, onUpdate: () => render(obj.v) });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, prefix, suffix, decimals]);

  return <span ref={ref} className="modal-result-value" />;
}
