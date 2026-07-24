import Link from "next/link";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { ObligationStatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { RecurringObligation } from "@/lib/types";

type Row = RecurringObligation & { properties: { nickname: string } | null };

export default async function ObrigacoesPage() {
  await requireUser();
  const supabase = await createClient();
  const { data: obligations, error } = await supabase
    .from("recurring_obligations")
    .select("*, properties(nickname)")
    .order("next_due_date", { nullsFirst: false })
    .returns<Row[]>();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-6">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
          ← Início
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">
          Obrigações recorrentes
        </h1>
        <p className="text-sm text-slate-500">Todos os imóveis, ordenado por vencimento.</p>
      </header>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Não foi possível carregar as obrigações.
        </p>
      )}

      {!error && obligations && obligations.length === 0 && (
        <p className="text-sm text-slate-500">Nenhuma obrigação cadastrada ainda.</p>
      )}

      {!error && obligations && obligations.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Imóvel</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Vencimento</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {obligations.map((ob) => (
                <tr key={ob.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/imoveis/${ob.property_id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {ob.properties?.nickname ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{ob.obligation_type}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(ob.next_due_date)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatCurrency(ob.estimated_value, ob.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <ObligationStatusBadge status={ob.current_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
