"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/lenis";
import { menuLinks, site } from "@/data/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LiveClock } from "@/components/ui/LiveClock";
import { ArrowUpIcon } from "@/components/ui/Icons";

export function Footer() {
  const giant = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = giant.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    const letters = [...el.querySelectorAll<HTMLElement>("span")];
    const setters = letters.map((l) => gsap.quickTo(l, "--wght", { duration: 0.7, ease: "power3.out" }));
    let raf = 0;
    let mx = 0;
    let my = 0;
    const update = () => {
      raf = 0;
      const reach = window.innerWidth * 0.3;
      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(mx - (r.left + r.width / 2), (my - (r.top + r.height / 2)) * 0.5);
        setters[i](200 + Math.max(0, 1 - d / reach) * 700);
      });
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onLeave = () => setters.forEach((fn) => fn(200));
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) window.addEventListener("pointermove", onMove, { passive: true });
      else {
        window.removeEventListener("pointermove", onMove);
        onLeave();
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <footer id="footer" data-section="footer" className="footer">
      <div className="footer-cta">
        <p className="h3" data-split>
          Есть идея? <span className="text-gradient">Давайте обсудим.</span>
        </p>
        <MagneticButton href="#contact" variant="circle" aria-label="Оставить заявку">
          Оставить
          <br />
          заявку
        </MagneticButton>
      </div>

      <div className="footer-cols">
        <div>
          <p className="mono-label text-muted">Навигация</p>
          <ul>
            {menuLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mono-label text-muted">Контакты</p>
          <ul>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <a href={site.phoneHref}>{site.phone}</a>
            </li>
            <li>
              <a href={site.telegramUrl} target="_blank" rel="noreferrer">
                Telegram {site.telegram}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="mono-label text-muted">Соцсети</p>
          <ul>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mono-label text-muted">Студия</p>
          <ul>
            <li>{site.city} · работаем по всему миру</li>
            <li>
              <LiveClock />
            </li>
          </ul>
        </div>
      </div>

      <div ref={giant} className="footer-giant" aria-hidden="true">
        {[...site.name].map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </div>

      <div className="footer-bottom">
        <span className="mono-label text-muted">
          © {site.founded}—2026 {site.fullName}
        </span>
        <span className="mono-label text-muted">Сделано с любовью к деталям</span>
        <MagneticButton variant="ghost" className="to-top" onClick={() => scrollToTarget(0)}>
          Наверх <ArrowUpIcon className="icon-arrow" />
        </MagneticButton>
      </div>
    </footer>
  );
}
