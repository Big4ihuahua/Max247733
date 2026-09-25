import { NextResponse } from "next/server";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const name = str(body.name, 100);
  const contact = str(body.contact, 100);
  if (name.length < 2 || contact.length < 5) {
    return NextResponse.json({ ok: false, error: "Укажите имя и контакт" }, { status: 422 });
  }

  const types = Array.isArray(body.types) ? body.types.map((t) => str(t, 60)).filter(Boolean).slice(0, 10) : [];
  const budget = typeof body.budget === "number" && Number.isFinite(body.budget) ? Math.round(body.budget) : null;
  const text = [
    "Новая заявка с сайта",
    `Имя: ${name}`,
    `Контакт: ${contact}`,
    `Email: ${str(body.email, 120) || "—"}`,
    `Тип: ${types.join(", ") || "—"}`,
    `Бюджет: ${budget ? `${budget.toLocaleString("ru-RU")} ₽` : "—"}`,
    `Сроки: ${str(body.timeline, 60) || "—"}`,
    `Задача: ${str(body.message, 2000) || "—"}`,
  ].join("\n");

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) return NextResponse.json({ ok: false, error: "Не удалось отправить заявку" }, { status: 502 });
  } else if (process.env.NODE_ENV !== "production") {
    console.info(`[contact]\n${text}`);
  }

  return NextResponse.json({ ok: true });
}
