"use client";

import { useEffect, useState } from "react";
import { useCursor } from "@/hooks/useCursor";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(document.documentElement.classList.contains("has-cursor"));
  }, []);
  return enabled ? <CursorInner /> : null;
}

function CursorInner() {
  const { dotRef, ringRef, labelRef } = useCursor();
  return (
    <div aria-hidden="true">
      <div ref={ringRef} className="cursor-ring" data-state="default">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
