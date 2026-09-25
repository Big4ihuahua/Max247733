"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

const fmt = () =>
  new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: site.timeZone }).format(new Date());

export function LiveClock({ withCity = true, className = "" }: { withCity?: boolean; className?: string }) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const tick = () => setTime(fmt());
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  const [hh, mm] = time.split(":");
  return (
    <span className={`mono-label ${className}`}>
      {withCity && <span className="text-muted">{site.city}&nbsp;</span>}
      <time suppressHydrationWarning>
        {hh}
        <span className="blink">:</span>
        {mm}
      </time>
    </span>
  );
}

export function StatusBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`status mono-label ${className}`}>
      <span className="status-dot" aria-hidden="true" />
      Принимаем проекты
    </span>
  );
}
