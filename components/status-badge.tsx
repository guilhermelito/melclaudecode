import type { PropertyStatus } from "@/lib/types";

const styles: Record<PropertyStatus, string> = {
  Ocupado: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Vago: "bg-slate-100 text-slate-600 ring-slate-500/20",
  "Airbnb-Temporada": "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
};

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {status}
    </span>
  );
}
