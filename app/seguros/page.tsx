import Link from "next/link";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/format";
import type { InsurancePolicy } from "@/lib/types";

type Row = InsurancePolicy & { properties: { nickname: string } | null };

export default async function SegurosPage() {
  await requireUser();
  const supabase = await createClient();
  const { data: policies, error } = await supabase
    .from("insurance_policies")
    .select("*, properties(nickname)")
    .order("coverage_end_date", { nullsFirst: false })
    .returns<Row[]>();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-6">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
          ← Início
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">Seguros</h1>
        <p className="text-sm text-slate-500">Todos os imóveis, ordenado por vencimento.</p>
      </header>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Não foi possível carregar os seguros.
        </p>
      )}

      {!error && policies && policies.length === 0 && (
        <p className="text-sm text-slate-500">Nenhum seguro cadastrado ainda.</p>
      )}

      {!error && policies && policies.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Imóvel</th>
                <th className="px-4 py-3 font-medium">Seguradora</th>
                <th className="px-4 py-3 font-medium">Vigência até</th>
                <th className="px-4 py-3 font-medium">Prêmio</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {policies.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/imoveis/${p.property_id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {p.properties?.nickname ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.insurer_name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(p.coverage_end_date)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatCurrency(p.premium_value, p.currency)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {p.is_active ? "Ativo" : "Inativo"}
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
