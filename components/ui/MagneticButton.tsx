"use client";

import type { ReactNode, MouseEventHandler } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  variant?: "primary" | "ghost" | "circle";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
  target?: string;
  rel?: string;
};

export function MagneticButton({ children, href, variant = "primary", className = "", type = "button", ...rest }: Props) {
  const ref = useMagnetic<HTMLElement>();
  const cls = `btn btn-${variant} ${className}`;
  const inner = (
    <span className="btn-inner" data-magnetic-inner>
      {children}
    </span>
  );
  if (href) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cls} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type={type} className={cls} {...rest}>
      {inner}
    </button>
  );
}
