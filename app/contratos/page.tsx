import Link from "next/link";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/format";
import type { LeaseContract } from "@/lib/types";

type Row = LeaseContract & { properties: { nickname: string } | null };

export default async function ContratosPage() {
  await requireUser();
  const supabase = await createClient();
  const { data: contracts, error } = await supabase
    .from("lease_contracts")
    .select("*, properties(nickname)")
    .order("contract_end_date", { nullsFirst: false })
    .returns<Row[]>();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-6">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
          ← Início
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">Contratos</h1>
        <p className="text-sm text-slate-500">Todos os imóveis, ordenado por vencimento.</p>
      </header>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Não foi possível carregar os contratos.
        </p>
      )}

      {!error && contracts && contracts.length === 0 && (
        <p className="text-sm text-slate-500">Nenhum contrato cadastrado ainda.</p>
      )}

      {!error && contracts && contracts.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Imóvel</th>
                <th className="px-4 py-3 font-medium">Inquilino</th>
                <th className="px-4 py-3 font-medium">Fim do contrato</th>
                <th className="px-4 py-3 font-medium">Próximo reajuste</th>
                <th className="px-4 py-3 font-medium">Aluguel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/imoveis/${c.property_id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {c.properties?.nickname ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {c.tenant_name}
                    {!c.is_active && (
                      <span className="ml-1 text-xs text-slate-400">(inativo)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(c.contract_end_date)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(c.next_readjustment_date)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatCurrency(c.rent_value, c.currency)}
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
