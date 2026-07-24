import type { Country, Currency } from "@/lib/types";

export const countryLabels: Record<Country, string> = {
  BR: "Brasil",
  PT: "Portugal",
};

export function formatCurrency(value: number | null, currency: Currency) {
  if (value === null) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);
}

// Datas vêm do Postgres como "YYYY-MM-DD"; evitamos `new Date()` aqui porque
// ele interpreta como UTC meia-noite e pode exibir o dia errado conforme o
// fuso do navegador.
export function formatDate(value: string | null) {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}
