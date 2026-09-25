import { site } from "@/data/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusBadge } from "@/components/ui/LiveClock";
import { BriefForm } from "./BriefForm";

export function Contact() {
  return (
    <section id="contact" data-section="contact" className="section contact">
      <SectionLabel index="11" label="Заявка" />
      <h2 className="contact-title">
        <span className="contact-line" data-reveal>
          <span className="fill-hover">Давайте создадим</span>
        </span>
        <span className="contact-line" data-reveal>
          <span className="fill-hover">что-то невероятное</span>
        </span>
      </h2>
      <div className="contact-grid">
        <div className="contact-info">
          <p className="contact-lead" data-reveal>
            Расскажите об идее — за 24 часа вернёмся с первыми мыслями, сроками и вилкой бюджета. Бесплатно и без обязательств.
          </p>
          <div className="contact-link" data-reveal>
            <span className="mono-label text-muted">Почта</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <div className="contact-link" data-reveal>
            <span className="mono-label text-muted">Telegram</span>
            <a href={site.telegramUrl} target="_blank" rel="noreferrer">
              {site.telegram}
            </a>
          </div>
          <div className="contact-link" data-reveal>
            <span className="mono-label text-muted">Телефон</span>
            <a href={site.phoneHref}>{site.phone}</a>
          </div>
          <div data-reveal>
            <StatusBadge />
          </div>
        </div>
        <div className="contact-form-wrap" data-reveal>
          <span id="portal-anchor" className="portal-anchor" aria-hidden="true" />
          <BriefForm />
        </div>
      </div>
    </section>
  );
}
