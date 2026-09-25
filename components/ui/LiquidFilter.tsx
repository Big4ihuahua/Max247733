/** Shared SVG filter for the case hover effect: liquid displacement plus an RGB channel split. */
export function LiquidFilter() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <filter id="liquid" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
        <feTurbulence id="liquid-turb" type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed="4" result="noise" />
        <feDisplacementMap id="liquid-disp" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" result="disp" />
        <feColorMatrix in="disp" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
        <feOffset id="liquid-offset" in="red" dx="0" dy="0" result="redShift" />
        <feColorMatrix in="disp" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cyan" />
        <feBlend in="redShift" in2="cyan" mode="screen" />
      </filter>
    </svg>
  );
}
