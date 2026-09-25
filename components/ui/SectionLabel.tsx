import { sectionLabel, sectionNumber, type SectionId } from "@/data/site";

export function SectionLabel({ id, label, className = "" }: { id: SectionId; label?: string; className?: string }) {
  return (
    <div className={`section-label mono-label ${className}`} data-reveal>
      <span className="text-mint">{sectionNumber(id)}</span>
      <span className="section-label-line" />
      <span>{label ?? sectionLabel(id)}</span>
    </div>
  );
}
