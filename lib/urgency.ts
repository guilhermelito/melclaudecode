// Limiares de "vence em breve" pro painel de alertas. Ajuste aqui se quiser
// mudar quantos dias de antecedência cada tipo de alerta deve aparecer.
export const CONTRACT_WARNING_DAYS = 60;
export const INSURANCE_WARNING_DAYS = 30;
export const OBLIGATION_WARNING_DAYS = 15;

export type Urgency = "vencido" | "atencao" | "ok";

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = dateStr.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDateUrgency(
  dateStr: string | null,
  warningDays: number
): Urgency | null {
  if (!dateStr) return null;
  const diff = daysUntil(dateStr);
  if (diff < 0) return "vencido";
  if (diff <= warningDays) return "atencao";
  return "ok";
}
