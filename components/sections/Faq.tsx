"use client";

import { useState } from "react";
import { faq } from "@/data/faq";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" data-section="faq" className="section faq">
      <div className="faq-layout">
        <div className="faq-intro">
          <SectionLabel index="10" label="FAQ" />
          <h2 className="h2" data-split>
            Частые
            <br />
            <span className="text-outline">вопросы</span>
          </h2>
          <p className="text-muted" data-reveal>
            Не нашли ответ? Напишите нам — ответим за час в рабочее время.
          </p>
        </div>
        <div className="faq-list">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={`faq-item ${isOpen ? "is-open" : ""}`} data-reveal>
                <h3>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="mono-label text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="faq-q-text">{item.q}</span>
                    <span className="faq-icon" aria-hidden="true" />
                  </button>
                </h3>
                <div className="faq-a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} inert={!isOpen}>
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
