import type { ObligationStatus, PropertyStatus } from "@/lib/types";

const propertyStyles: Record<PropertyStatus, string> = {
  Ocupado: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Vago: "bg-slate-100 text-slate-600 ring-slate-500/20",
  "Airbnb-Temporada": "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
};

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${propertyStyles[status]}`}
    >
      {status}
    </span>
  );
}

const obligationStyles: Record<ObligationStatus, string> = {
  "Em dia": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Pendente: "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Aguardando reembolso": "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  Vencido: "bg-red-50 text-red-700 ring-red-600/20",
};

export function ObligationStatusBadge({ status }: { status: ObligationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${obligationStyles[status]}`}
    >
      {status}
    </span>
  );
}
