"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { getLenis, scrollToTarget } from "@/lib/lenis";
import { menuLinks, site } from "@/data/site";
import { useSceneStore } from "@/lib/scene-store";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { StatusBadge } from "@/components/ui/LiveClock";
import { LogoMark } from "@/components/ui/Icons";

const CLOSED = "circle(0% at calc(100% - 3.25rem) 2.6rem)";
const OPEN = "circle(150% at calc(100% - 3.25rem) 2.6rem)";

export function Header() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const openRef = useRef(open);
  const section = useSceneStore((s) => s.section);

  useEffect(() => {
    openRef.current = open;
    if (open) gsap.to(header.current, { yPercent: 0, duration: 0.5, overwrite: "auto" });
  }, [open]);

  useGSAP(() => {
    const el = header.current!;
    let hidden = false;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        el.classList.toggle("is-scrolled", y > 40);
        const hide = !openRef.current && self.direction === 1 && y > 160;
        if (hide !== hidden) {
          hidden = hide;
          gsap.to(el, { yPercent: hide ? -120 : 0, duration: 0.7, ease: "expo.out", overwrite: "auto" });
        }
      },
    });
  });

  return (
    <>
      <header ref={header} className="site-header">
        <a href="#hero" className="logo" aria-label={`${site.fullName} — в начало`}>
          <LogoMark className="logo-mark" />
          <span className="logo-word">{site.name}</span>
        </a>
        <nav className="header-nav" aria-label="Разделы">
          {menuLinks
            .filter((l) => l.id !== "contact")
            .map((l) => (
              <a key={l.id} href={`#${l.id}`} aria-current={section === l.id ? "true" : undefined}>
                {l.label}
              </a>
            ))}
        </nav>
        <div className="header-right">
          <MagneticButton href="#contact" variant="ghost" className="header-cta">
            Обсудить проект
          </MagneticButton>
          <button
            type="button"
            className={`menu-toggle ${open ? "is-open" : ""}`}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="mono-label">{open ? "Закрыть" : "Меню"}</span>
            <span className="burger" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>
      <Menu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useGSAP(
    () => {
      const el = ref.current!;
      if (!mounted.current) {
        mounted.current = true;
        gsap.set(el, { clipPath: CLOSED, visibility: "hidden" });
        return;
      }
      if (open) {
        getLenis()?.stop();
        gsap.set(el, { visibility: "visible" });
        gsap.to(el, { clipPath: OPEN, duration: 1.1, ease: "expo.inOut" });
        gsap.fromTo(
          el.querySelectorAll(".menu-link-inner, .menu-aside > *"),
          { yPercent: 110, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: "expo.out", stagger: 0.05, delay: 0.35 },
        );
        el.querySelector<HTMLAnchorElement>(".menu-link")?.focus({ preventScroll: true });
      } else {
        getLenis()?.start();
        gsap.to(el, {
          clipPath: CLOSED,
          duration: 0.8,
          ease: "expo.inOut",
          onComplete: () => {
            gsap.set(el, { visibility: "hidden" });
          },
        });
      }
    },
    { dependencies: [open] },
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    onClose();
    getLenis()?.start();
    window.setTimeout(() => scrollToTarget(hash), 120);
  };

  const tab = open ? 0 : -1;

  return (
    <div ref={ref} id="site-menu" className="menu" aria-hidden={!open}>
      <nav className="menu-nav" aria-label="Основная навигация">
        {menuLinks.map((l, i) => (
          <a key={l.id} href={`#${l.id}`} className="menu-link" onClick={(e) => go(e, `#${l.id}`)} tabIndex={tab}>
            <span className="menu-link-inner">
              <span className="menu-num mono-label">{String(i + 1).padStart(2, "0")}</span>
              <span className="menu-text">{l.label}</span>
            </span>
          </a>
        ))}
      </nav>
      <div className="menu-aside">
        <p className="mono-label text-muted">Связаться</p>
        <a href={`mailto:${site.email}`} className="menu-contact" tabIndex={tab}>
          {site.email}
        </a>
        <a href={site.telegramUrl} className="menu-contact" target="_blank" rel="noreferrer" tabIndex={tab}>
          Telegram {site.telegram}
        </a>
        <a href={site.phoneHref} className="menu-contact" tabIndex={tab}>
          {site.phone}
        </a>
        <StatusBadge />
      </div>
    </div>
  );
}
