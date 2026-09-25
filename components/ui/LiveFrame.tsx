"use client";

import { useEffect, useRef, useState } from "react";
import { DEMO_SANDBOX, workSrc } from "@/data/works";

const W = 1440;
const H = 900;

/** Hover previews run only where they are cheap and expected. */
export const LIVE_PREVIEW_QUERY = "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/** Non-interactive live render of a demo at desktop size, scaled to cover its parent and pinned top-left like the screenshots. */
export function LiveFrame({ slug, onReady }: { slug: string; onReady?: () => void }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const timer = useRef(0);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    // Layout sizes, not getBoundingClientRect: parents may be mid-Flip or tilted.
    const fit = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const s = Math.max(w / W, h / H);
      el.style.transform = `scale(${s})`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => {
      ro.disconnect();
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <iframe
      ref={ref}
      className={`live-frame ${shown ? "is-on" : ""}`}
      src={workSrc(slug)}
      title=""
      aria-hidden="true"
      tabIndex={-1}
      sandbox={DEMO_SANDBOX}
      onLoad={() => {
        // Let the demo paint its first frames before revealing it over the screenshot.
        timer.current = window.setTimeout(() => {
          setShown(true);
          onReady?.();
        }, 700);
      }}
    />
  );
}
