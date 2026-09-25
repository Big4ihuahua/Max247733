"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { manifestoFacts } from "@/data/site";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const text = root.current!.querySelector<HTMLElement>(".manifesto-text")!;
      const split = SplitText.create(text, { type: "words", wordsClass: "mw" });
      // Gradient text can't clip through split children, so each gradient word gets its own background.
      text.querySelectorAll(".text-gradient .mw").forEach((w) => w.classList.add("text-gradient"));
      text.querySelectorAll(":scope > .text-gradient").forEach((w) => w.classList.replace("text-gradient", "was-gradient"));
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: text, start: "top 78%", end: "bottom 42%", scrub: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="manifesto" ref={root} data-section="manifesto" className="section manifesto">
      <SectionLabel id="manifesto" />
      <p className="manifesto-text">
        Мы не просто пишем код — мы превращаем <em className="text-mint">идею</em> в <span className="text-gradient">продукт,</span>{" "}
        которым люди любят пользоваться.
      </p>
      <div className="manifesto-facts">
        {manifestoFacts.map((f) => (
          <div key={f.key} className="fact" data-reveal>
            <span className="mono-label text-muted">{f.key}</span>
            <p>{f.value}</p>
          </div>
        ))}
      </div>
      <div id="manifesto-core" className="manifesto-core" aria-hidden="true" />
    </section>
  );
}
