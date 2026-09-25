const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Rolling digits; the parent animates each `.odo-strip` to its `data-digit`. */
export function Odometer({ value }: { value: string }) {
  return (
    <span className="odo" aria-label={value} role="img">
      {[...value].map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="odo-digit" aria-hidden="true">
            <span className="odo-strip" data-digit={ch}>
              {DIGITS.map((d, k) => (
                <span key={k}>{d}</span>
              ))}
            </span>
            <span className="odo-sizer">{ch}</span>
          </span>
        ) : (
          <span key={i} className="odo-char" aria-hidden="true">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
