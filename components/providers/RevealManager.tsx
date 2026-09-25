"use client";

import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * One place for the site-wide entrance language: `[data-reveal]` blocks rise out of a blur,
 * `[data-split]` headings are revealed line by line through a mask.
 */
export function RevealManager() {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    gsap.set(blocks, { y: 40, autoAlpha: 0, filter: "blur(8px)" });
    ScrollTrigger.batch(blocks, {
      start: "top 90%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.07,
          overwrite: true,
          clearProps: "filter",
        }),
    });

    gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.25,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
      });
    });
  });

  return null;
}
