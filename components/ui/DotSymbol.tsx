"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { ServiceSymbol } from "@/data/services";

const BITMAPS: Record<ServiceSymbol, string[]> = {
  browser: [
    "111111111111",
    "101010000001",
    "111111111111",
    "100000000001",
    "101111101101",
    "100000001101",
    "101110000001",
    "100000000001",
    "111111111111",
  ],
  dashboard: [
    "111111111111",
    "100100000001",
    "110100000101",
    "100100010101",
    "110101010101",
    "100101110111",
    "110111111111",
    "100100000001",
    "111111111111",
  ],
  phone: [
    "000111111000",
    "001000000100",
    "001011110100",
    "001010010100",
    "001011110100",
    "001000000100",
    "001011110100",
    "001000000100",
    "000111111000",
  ],
  chip: [
    "001010101000",
    "011111111100",
    "110000000110",
    "010011100100",
    "110010100110",
    "010011100100",
    "110000000110",
    "011111111100",
    "001010101000",
  ],
};

/** Dot-matrix icon whose dots fly together when the card becomes active. */
export function DotSymbol({ symbol, active }: { symbol: ServiceSymbol; active: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const rows = BITMAPS[symbol];
  const cols = rows[0].length;
  const dots = useMemo(
    () =>
      rows.flatMap((row, y) =>
        [...row].map((v, x) => ({ x: x * 10 + 5, y: y * 10 + 5, on: v === "1", key: `${x}-${y}` })),
      ),
    [rows],
  );

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const on = svg.querySelectorAll<SVGCircleElement>(".dot-on");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(on, { x: 0, y: 0, opacity: 1 });
      return;
    }
    if (active) {
      gsap.to(on, { x: 0, y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: { amount: 0.5, from: "random" }, overwrite: true });
    } else {
      gsap.to(on, {
        x: () => gsap.utils.random(-40, 40),
        y: () => gsap.utils.random(-30, 30),
        opacity: 0.25,
        duration: 1.2,
        ease: "power3.out",
        overwrite: true,
      });
    }
  }, [active]);

  return (
    <svg ref={ref} className="dot-symbol" viewBox={`0 0 ${cols * 10} ${rows.length * 10}`} aria-hidden="true">
      {dots.map((d) =>
        d.on ? (
          <circle key={d.key} className="dot-on" cx={d.x} cy={d.y} r="2.6" />
        ) : (
          <circle key={d.key} className="dot-off" cx={d.x} cy={d.y} r="0.9" />
        ),
      )}
    </svg>
  );
}
