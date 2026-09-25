"use client";

import { useEffect, useState } from "react";
import type Lenis from "lenis";
import { getLenis, onLenisChange } from "@/lib/lenis";

/** Returns the shared Lenis instance (null with reduced motion) and optionally subscribes to its scroll events. */
export function useLenis(onScroll?: (lenis: Lenis) => void) {
  const [lenis, setLenis] = useState<Lenis | null>(() => getLenis());

  useEffect(() => onLenisChange(setLenis), []);

  useEffect(() => {
    if (!lenis || !onScroll) return;
    const off = lenis.on("scroll", onScroll);
    return off;
  }, [lenis, onScroll]);

  return lenis;
}
