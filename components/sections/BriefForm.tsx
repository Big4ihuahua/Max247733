"use client";

import { useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { sceneStore } from "@/lib/scene-store";
import { formatPrice, pad2 } from "@/lib/format";
import { site } from "@/data/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowIcon } from "@/components/ui/Icons";

const TYPES = ["Сайт", "Интернет-магазин", "Веб-приложение", "Мобильное приложение", "Программа", "Telegram-бот", "Другое"];
const TIMELINES = ["Срочно, до месяца", "1–3 месяца", "3–6 месяцев", "Не горит"];
const STEPS = ["Тип проекта", "Бюджет", "Сроки", "Контакты"];
const BUDGET = { min: 50_000, max: 3_000_000, step: 50_000 };

type Brief = {
  types: string[];
  budget: number;
  timeline: string;
  name: string;
  contact: string;
  email: string;
  message: string;
};
type Errors = Partial<Record<keyof Brief, string>>;

const INITIAL: Brief = { types: [], budget: 300_000, timeline: "", name: "", contact: "", email: "", message: "" };

export function validateStep(step: number, d: Brief): Errors {
  const e: Errors = {};
  if (step === 0 && d.types.length === 0) e.types = "Выберите хотя бы один вариант";
  if (step === 2 && !d.timeline) e.timeline = "Выберите сроки";
  if (step === 3) {
    if (d.name.trim().length < 2) e.name = "Как к вам обращаться?";
    const c = d.contact.trim();
    const isTelegram = /^@?[a-zA-Z0-9_]{5,32}$/.test(c);
    const isPhone = /^\+?[\d\s()-]{10,20}$/.test(c) && c.replace(/\D/g, "").length >= 10;
    if (!isTelegram && !isPhone) e.contact = "Укажите Telegram (@username) или телефон";
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = "Проверьте email";
  }
  return e;
}

export function BriefForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Brief>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const body = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const dir = useRef(1);
  const firstRender = useRef(true);

  useIsoLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!body.current || prefersReducedMotion()) return;
    gsap.fromTo(
      body.current,
      { x: 40 * dir.current, autoAlpha: 0, filter: "blur(6px)" },
      { x: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.7, ease: "expo.out", clearProps: "filter" },
    );
  }, [step, status]);

  const set = <K extends keyof Brief>(key: K, value: Brief[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const shake = () => {
    if (prefersReducedMotion()) return;
    gsap.fromTo(form.current, { x: -8 }, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
  };

  const next = () => {
    const e = validateStep(step, data);
    if (Object.keys(e).length) {
      setErrors(e);
      shake();
      return;
    }
    setErrors({});
    dir.current = 1;
    setStep((s) => s + 1);
  };

  const back = () => {
    dir.current = -1;
    setErrors({});
    setStep((s) => s - 1);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) return next();
    const errs = validateStep(step, data);
    if (Object.keys(errs).length) {
      setErrors(errs);
      shake();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      dir.current = 1;
      setStatus("done");
      sceneStore.set({ contactSuccess: true, burst: sceneStore.state.burst + 1 });
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setData(INITIAL);
    setStep(0);
    setStatus("idle");
    sceneStore.set({ contactSuccess: false });
  };

  if (status === "done") {
    return (
      <div className="brief is-done" aria-live="polite">
        <div ref={body} className="brief-success">
          <div id="success-anchor" className="success-anchor" aria-hidden="true">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="36" />
              <path d="M33 52 L45 64 L69 38" />
            </svg>
          </div>
          <p className="success-title">Спасибо!</p>
          <p className="text-muted">Ответим в течение часа. Если срочно — пишите в Telegram {site.telegram}.</p>
          <button type="button" className="btn-text" onClick={reset}>
            Отправить ещё одну заявку
          </button>
        </div>
      </div>
    );
  }

  const pct = ((data.budget - BUDGET.min) / (BUDGET.max - BUDGET.min)) * 100;
  const err = (key: keyof Brief) =>
    errors[key] ? (
      <span id={`err-${key}`} className="field-error" role="alert">
        {errors[key]}
      </span>
    ) : null;

  return (
    <form ref={form} className="brief" onSubmit={submit} noValidate aria-label="Бриф на разработку">
      <div className="brief-progress">
        <span className="mono-label">
          <span className="text-mint">{pad2(step + 1)}</span> / {pad2(STEPS.length)} · {STEPS[step]}
        </span>
        <span className="brief-bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} />
        </span>
      </div>

      <div ref={body} className="brief-body">
        {step === 0 && (
          <fieldset>
            <legend className="brief-q">Что будем создавать?</legend>
            <div className="chips">
              {TYPES.map((t) => {
                const on = data.types.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    className={`chip ${on ? "is-active" : ""}`}
                    aria-pressed={on}
                    onClick={() => set("types", on ? data.types.filter((x) => x !== t) : [...data.types, t])}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            {err("types")}
          </fieldset>
        )}

        {step === 1 && (
          <div className="brief-budget">
            <label className="brief-q" htmlFor="brief-budget">
              Какой бюджет закладываете?
            </label>
            <output className="budget-value" htmlFor="brief-budget">
              {data.budget >= BUDGET.max ? `от ${formatPrice(BUDGET.max)} ₽` : `до ${formatPrice(data.budget)} ₽`}
            </output>
            <input
              id="brief-budget"
              className="range"
              type="range"
              min={BUDGET.min}
              max={BUDGET.max}
              step={BUDGET.step}
              value={data.budget}
              onChange={(e) => set("budget", Number(e.target.value))}
              style={{ "--p": `${pct}%` } as React.CSSProperties}
            />
            <div className="range-scale mono-label">
              <span>50 тыс</span>
              <span>1,5 млн</span>
              <span>3 млн+</span>
            </div>
          </div>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="brief-q">Когда нужно запуститься?</legend>
            <div className="chips">
              {TIMELINES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`chip ${data.timeline === t ? "is-active" : ""}`}
                  aria-pressed={data.timeline === t}
                  onClick={() => set("timeline", t)}
                >
                  {t}
                </button>
              ))}
            </div>
            {err("timeline")}
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="brief-q">Как с вами связаться?</legend>
            <div className="fields">
              <div className="field">
                <input
                  id="brief-name"
                  placeholder=" "
                  autoComplete="name"
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "err-name" : undefined}
                />
                <label htmlFor="brief-name">Имя *</label>
                {err("name")}
              </div>
              <div className="field">
                <input
                  id="brief-contact"
                  placeholder=" "
                  autoComplete="tel"
                  value={data.contact}
                  onChange={(e) => set("contact", e.target.value)}
                  aria-invalid={!!errors.contact}
                  aria-describedby={errors.contact ? "err-contact" : undefined}
                />
                <label htmlFor="brief-contact">Telegram или телефон *</label>
                {err("contact")}
              </div>
              <div className="field field-wide">
                <input
                  id="brief-email"
                  type="email"
                  placeholder=" "
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "err-email" : undefined}
                />
                <label htmlFor="brief-email">Email</label>
                {err("email")}
              </div>
              <div className="field field-wide">
                <textarea id="brief-message" placeholder=" " value={data.message} onChange={(e) => set("message", e.target.value)} rows={4} />
                <label htmlFor="brief-message">Коротко о задаче</label>
              </div>
            </div>
          </fieldset>
        )}
      </div>

      {status === "error" && (
        <p className="field-error" role="alert">
          Не получилось отправить. Попробуйте ещё раз или напишите на {site.email}.
        </p>
      )}

      <div className="brief-nav">
        {step > 0 ? (
          <button type="button" className="btn-text" onClick={back}>
            ← Назад
          </button>
        ) : (
          <span className="brief-legal">Ответим в течение часа</span>
        )}
        <MagneticButton type="submit" variant="primary" disabled={status === "sending"}>
          {step < STEPS.length - 1 ? "Далее" : status === "sending" ? "Отправляем…" : "Отправить заявку"} <ArrowIcon />
        </MagneticButton>
      </div>
    </form>
  );
}
