"use client";

import { useRef } from "react";
import { gsap, Draggable, useGSAP } from "@/lib/gsap";
import { testimonials } from "@/data/testimonials";
import { SectionLabel } from "@/components/ui/SectionLabel";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

export function Testimonials() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const viewport = root.current!.querySelector<HTMLElement>(".reviews-viewport")!;
      const track = root.current!.querySelector<HTMLElement>(".reviews-track")!;
      const cards = gsap.utils.toArray<HTMLElement>(".review", track);
      const tilt = cards.map((c) => gsap.quickTo(c, "rotation", { duration: 0.6, ease: "power3.out" }));
      const skew = cards.map((c) => gsap.quickTo(c, "skewX", { duration: 0.6, ease: "power3.out" }));
      const bounds = () => {
        const cs = getComputedStyle(viewport);
        const inner = viewport.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        return { minX: Math.min(0, inner - track.scrollWidth), maxX: 0 };
      };
      let lastX = 0;
      let lastT = performance.now();

      const lean = (x: number) => {
        const now = performance.now();
        const v = (x - lastX) / Math.max(now - lastT, 1);
        lastX = x;
        lastT = now;
        const r = gsap.utils.clamp(-6, 6, v * -3);
        tilt.forEach((fn) => fn(r));
        skew.forEach((fn) => fn(r * 0.6));
      };
      const settle = () => {
        tilt.forEach((fn) => fn(0));
        skew.forEach((fn) => fn(0));
      };

      const [drag] = Draggable.create(track, {
        type: "x",
        inertia: true,
        bounds: bounds(),
        edgeResistance: 0.85,
        dragClickables: true,
        onPress() {
          lastX = this.x;
          lastT = performance.now();
          viewport.classList.add("is-dragging");
        },
        onDrag() {
          lean(this.x);
        },
        onThrowUpdate() {
          lean(this.x);
        },
        onRelease() {
          viewport.classList.remove("is-dragging");
        },
        onThrowComplete: settle,
        onDragEnd() {
          if (!this.tween) settle();
        },
      });

      const onResize = () => drag.applyBounds(bounds());
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        drag.kill();
      };
    },
    { scope: root },
  );

  return (
    <section id="reviews" ref={root} data-section="reviews" className="section reviews">
      <div className="reviews-header">
        <div>
          <SectionLabel id="reviews" />
          <h2 className="h2" data-split>
            Что говорят
            <br />
            <span className="text-outline">клиенты</span>
          </h2>
        </div>
        <p className="mono-label text-muted" data-reveal>
          ← Тяните карточки →
        </p>
      </div>
      <div className="reviews-viewport" data-cursor="drag">
        <div className="reviews-track">
          {testimonials.map((t) => (
            <figure key={t.name} className="review">
              <div className="review-top">
                <span className="review-stars" aria-label={`Оценка ${t.rating} из 5`}>
                  {"★".repeat(t.rating)}
                </span>
                <span className="mono-label text-muted">{t.project}</span>
              </div>
              <blockquote className="review-text">«{t.text}»</blockquote>
              <figcaption className="review-author">
                <span className="review-avatar" aria-hidden="true">
                  {initials(t.name)}
                </span>
                <span>
                  <b>{t.name}</b>
                  <span className="text-muted">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
