"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { sceneStore } from "@/lib/scene-store";
import { sectionTotal, site } from "@/data/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LiveClock, StatusBadge } from "@/components/ui/LiveClock";
import { ArrowIcon } from "@/components/ui/Icons";

const WORDS = ["Сайты", "Веб-приложения", "Мобильные приложения", "Программы и боты"];

function whenRevealed(cb: () => void) {
  if (sceneStore.state.revealed) {
    cb();
    return () => {};
  }
  const unsub = sceneStore.subscribe(() => {
    if (sceneStore.state.revealed) {
      unsub();
      cb();
    }
  });
  return unsub;
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const scramble = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const reduced = prefersReducedMotion();

      gsap.to(".hero-inner", {
        y: () => -window.innerHeight * 0.14,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            sceneStore.state.heroExit = self.progress;
          },
        },
      });

      const split = SplitText.create(el.querySelectorAll(".hero-split"), { type: "chars", charsClass: "hero-char", aria: "none" });
      const tl = gsap.timeline({ paused: true });
      tl.set("[data-hero-hide]", { visibility: "visible" })
        .from(split.chars, { yPercent: 115, filter: "blur(8px)", duration: 1.3, ease: "expo.out", stagger: 0.03 })
        .from(".hero-grad", { yPercent: 115, filter: "blur(8px)", duration: 1.3, ease: "expo.out" }, 0.3)
        .from(".hero-sub", { y: 30, autoAlpha: 0, filter: "blur(8px)", duration: 1.1, ease: "expo.out" }, 0.6)
        .from("[data-hero-fade]", { y: 24, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.7)
        .set(".hero-char, .hero-grad, .hero-sub", { clearProps: "filter" });

      return whenRevealed(() => (reduced ? tl.progress(1) : tl.play()));
    },
    { scope: root },
  );

  useEffect(() => {
    let i = 0;
    let id = 0;
    const stop = whenRevealed(() => {
      id = window.setInterval(() => {
        const el = scramble.current;
        if (!el) return;
        i = (i + 1) % WORDS.length;
        if (prefersReducedMotion()) {
          el.textContent = WORDS[i];
          return;
        }
        gsap.to(el, { duration: 1.1, scrambleText: { text: WORDS[i], chars: "01<>/{}#_*", speed: 0.5, revealDelay: 0.25 } });
      }, 2800);
    });
    return () => {
      stop();
      window.clearInterval(id);
    };
  }, []);

  return (
    <section id="hero" ref={root} data-section="hero" className="hero">
      <div id="hero-anchor" className="hero-anchor" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-top" data-hero-hide data-hero-fade>
          <span className="mono-label">
            [ 01 / {sectionTotal} ] — {site.tagline}
          </span>
          <span className="mono-label text-muted hero-top-list">Сайты · Веб-приложения · Мобильные приложения · Программы и боты</span>
        </div>

        <h1 className="hero-title" aria-label="Создаём цифровые продукты, которые работают на ваш бизнес" data-hero-hide>
          <span className="hero-line" aria-hidden="true">
            <span className="hero-split">Создаём</span>
          </span>
          <span className="hero-line" aria-hidden="true">
            <span className="hero-split text-outline">цифровые</span>
          </span>
          <span className="hero-line hero-line-last" aria-hidden="true">
            <span className="hero-grad-mask">
              <span className="hero-grad text-gradient">продукты,</span>
            </span>
            <span className="hero-sub">
              которые работают на&nbsp;ваш&nbsp;бизнес
              <span className="caret" />
            </span>
          </span>
        </h1>

        <div className="hero-actions">
          <p className="hero-scramble" data-hero-hide data-hero-fade>
            <span className="mono-label text-muted">Разрабатываем&nbsp;→</span>
            <span ref={scramble} className="scramble-word">
              {WORDS[0]}
            </span>
          </p>
          <div className="hero-buttons" data-hero-hide data-hero-fade>
            <MagneticButton href="#contact" variant="primary">
              Обсудить проект <ArrowIcon />
            </MagneticButton>
            <MagneticButton href="#cases" variant="ghost">
              Смотреть работы
            </MagneticButton>
          </div>
        </div>

        <div className="hero-bottom" data-hero-hide data-hero-fade>
          <StatusBadge />
          <span className="scroll-hint mono-label">
            Листайте <span className="scroll-hint-line" />
          </span>
          <LiveClock />
        </div>
      </div>
    </section>
  );
}
