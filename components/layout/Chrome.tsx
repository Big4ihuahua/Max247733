"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSceneStore } from "@/lib/scene-store";
import { sections, site } from "@/data/site";

/** Fixed decorative layer: blueprint frame, coordinates and the section progress rail. */
export function Chrome() {
  return (
    <div className="chrome" aria-hidden="true">
      <span className="frame-line frame-line-l" />
      <span className="frame-line frame-line-r" />
      <span className="frame-cross frame-cross-tl" />
      <span className="frame-cross frame-cross-bl" />
      <span className="frame-coords mono-label">{site.coords}</span>
      <ScrollProgress />
    </div>
  );
}

export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}

function ScrollProgress() {
  const fill = useRef<HTMLSpanElement>(null);
  const section = useSceneStore((s) => s.section);
  const index = Math.max(0, sections.findIndex((s) => s.id === section));

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => gsap.set(fill.current, { scaleY: self.progress }),
    });
  });

  return (
    <div className="progress">
      <span key={index} className="progress-num mono-label">
        {String(index + 1).padStart(2, "0")} <span className="text-muted">/ {sections.length}</span>
      </span>
      <span className="progress-track">
        <span ref={fill} className="progress-fill" />
      </span>
      <span key={`l-${index}`} className="progress-name mono-label">
        {sections[index].label}
      </span>
    </div>
  );
}
