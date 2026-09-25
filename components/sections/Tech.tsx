"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { sceneStore } from "@/lib/scene-store";
import { techMarquee, techSphere } from "@/data/tech";
import { SectionLabel } from "@/components/ui/SectionLabel";

function TagSphere() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tags = [...el.querySelectorAll<HTMLElement>(".tag")];
    const n = tags.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts = tags.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r];
    });
    const reduced = prefersReducedMotion();
    let radius = el.offsetWidth * 0.4;
    let ax = 0.4;
    let ay = 0;
    let vx = 0.0015;
    let vy = 0.003;
    let tvx = vx;
    let tvy = vy;
    let visible = false;

    const render = () => {
      const cx = Math.cos(ax);
      const sx = Math.sin(ax);
      const cy = Math.cos(ay);
      const sy = Math.sin(ay);
      for (let i = 0; i < n; i++) {
        const [x, y, z] = pts[i];
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y1 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const depth = (z2 + 1) / 2;
        const tag = tags[i];
        tag.style.transform = `translate3d(${x1 * radius}px, ${y1 * radius}px, 0) translate(-50%, -50%) scale(${0.55 + depth * 0.6})`;
        tag.style.opacity = String(0.15 + depth * 0.85);
        tag.style.zIndex = String(Math.round(depth * 100));
        tag.classList.toggle("is-front", depth > 0.8);
      }
    };

    const tick = () => {
      if (!visible) return;
      vx += (tvx - vx) * 0.05;
      vy += (tvy - vy) * 0.05;
      ax += vx;
      ay += vy;
      render();
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tvy = ((e.clientX - (r.left + r.width / 2)) / r.width) * 0.035;
      tvx = (-(e.clientY - (r.top + r.height / 2)) / r.height) * 0.035;
    };
    const onLeave = () => {
      tvx = 0.0015;
      tvy = 0.003;
    };

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    const ro = new ResizeObserver(() => {
      radius = el.offsetWidth * 0.4;
      render();
    });
    io.observe(el);
    ro.observe(el);
    render();
    if (reduced) return () => (io.disconnect(), ro.disconnect());

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    gsap.ticker.add(tick);
    return () => {
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div ref={ref} id="tag-sphere" className="tag-sphere" data-cursor="drag" data-cursor-label="Крути">
      {techSphere.map((t) => (
        <span key={t} className="tag">
          {t}
        </span>
      ))}
    </div>
  );
}

function Marquee({ items, direction, outline }: { items: string[]; direction: 1 | -1; outline?: boolean }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    let x = 0;
    let skew = 0;
    let half = el.scrollWidth / 2;
    const ro = new ResizeObserver(() => (half = el.scrollWidth / 2));
    ro.observe(el);
    const tick = (_: number, delta: number) => {
      const v = sceneStore.state.scrollVelocity;
      const speed = (1 + Math.min(Math.abs(v) * 0.25, 12)) * direction * (v < -0.5 ? -1 : 1);
      x -= speed * (delta / 16.67) * 0.9;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      skew += (Math.max(-12, Math.min(12, -v * 0.5)) - skew) * 0.1;
      el.style.transform = `translate3d(${x}px, 0, 0) skewX(${skew}deg)`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
    };
  }, [direction]);

  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div ref={track} className={`marquee-track ${outline ? "is-outline" : ""}`}>
        {row.map((t, i) => (
          <span key={i} className="marquee-item">
            {t}
            <span className="marquee-star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Tech() {
  return (
    <section id="tech" data-section="tech" className="section tech">
      <div className="tech-layout">
        <div className="tech-copy">
          <SectionLabel index="06" label="Технологии" />
          <h2 className="h2" data-split>
            Стек,
            <br />
            <span className="text-outline">которому</span>
            <br />
            доверяют
          </h2>
          <p data-reveal>
            Выбираем технологии под задачу, а не под моду. Всё, что мы пишем, можно поддерживать и развивать годами — даже без
            нас.
          </p>
          <ul className="tech-facts mono-label" data-reveal>
            <li>
              <span className="text-mint">✦</span> Код-ревью каждого коммита
            </li>
            <li>
              <span className="text-mint">✦</span> CI/CD и автотесты
            </li>
            <li>
              <span className="text-mint">✦</span> Документация и передача прав
            </li>
          </ul>
        </div>
        <TagSphere />
      </div>
      <p className="sr-only">Технологии: {techSphere.join(", ")}.</p>
      <div className="marquees">
        <Marquee items={techMarquee[0]} direction={1} />
        <Marquee items={techMarquee[1]} direction={-1} outline />
      </div>
    </section>
  );
}
