export const formatPrice = (n: number) => new Intl.NumberFormat("ru-RU").format(Math.round(n)).replace(/\u00a0/g, " ");

export const pad2 = (n: number) => String(n).padStart(2, "0");
