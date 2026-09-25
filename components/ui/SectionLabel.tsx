export function SectionLabel({ index, label, className = "" }: { index: string; label: string; className?: string }) {
  return (
    <div className={`section-label mono-label ${className}`} data-reveal>
      <span className="text-mint">{index}</span>
      <span className="section-label-line" />
      <span>{label}</span>
    </div>
  );
}
