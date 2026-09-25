"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { bundleNote, plans } from "@/data/pricing";
import { formatPrice } from "@/lib/format";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowIcon } from "@/components/ui/Icons";

function Price({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = formatPrice(value);
      shown.current = value;
      return;
    }
    const obj = { v: shown.current };
    const tween = gsap.to(obj, {
      v: value,
      duration: 0.9,
      ease: "expo.out",
      onUpdate: () => {
        shown.current = obj.v;
        el.textContent = formatPrice(obj.v);
      },
    });
    return () => {
      tween.kill();
    };
  }, [value]);

  return <span ref={ref}>{formatPrice(value)}</span>;
}

export function Pricing() {
  const [bundle, setBundle] = useState(false);

  return (
    <section id="pricing" data-section="pricing" className="section pricing">
      <div className="pricing-header">
        <div>
          <SectionLabel index="09" label="Тарифы" />
          <h2 className="h2" data-split>
            Прозрачные
            <br />
            <span className="text-outline">цены</span>
          </h2>
        </div>
        <div className="toggle" role="group" aria-label="Формат работы" data-reveal>
          <button type="button" className={!bundle ? "is-active" : ""} aria-pressed={!bundle} onClick={() => setBundle(false)}>
            Разработка
          </button>
          <button type="button" className={bundle ? "is-active" : ""} aria-pressed={bundle} onClick={() => setBundle(true)}>
            Разработка + поддержка
          </button>
          <span className={`toggle-thumb ${bundle ? "is-right" : ""}`} aria-hidden="true" />
        </div>
      </div>

      <div className="pricing-grid">
        {plans.map((p) => (
          <article key={p.id} className={`plan ${p.featured ? "plan-featured" : ""}`} data-reveal>
            {p.featured && <span className="plan-badge mono-label">Выбирают чаще</span>}
            <div className="plan-head">
              <h3 className="plan-name">{p.name}</h3>
              <p className="text-muted">{p.description}</p>
            </div>
            <div className="plan-price">
              <span className="plan-from">от</span>
              <Price value={bundle ? p.bundlePrice : p.price} />
              <span className="plan-cur">₽</span>
            </div>
            <p className={`plan-note mono-label ${bundle ? "is-visible" : ""}`}>{bundle ? bundleNote : `Срок ${p.term}`}</p>
            <ul className="plan-features">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className={`plan-extras ${bundle ? "is-on" : ""}`} inert={!bundle}>
              <ul>
                {p.supportFeatures.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <MagneticButton href="#contact" variant={p.featured ? "primary" : "ghost"} className="plan-cta">
              Выбрать тариф <ArrowIcon />
            </MagneticButton>
          </article>
        ))}
      </div>
    </section>
  );
}
