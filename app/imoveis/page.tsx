import Link from "next/link";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { countryLabels } from "@/lib/format";
import type { Property } from "@/lib/types";

export default async function ImoveisPage() {
  await requireUser();
  const supabase = await createClient();
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("nickname")
    .returns<Property[]>();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
            ← Início
          </Link>
          <h1 className="mt-1 text-xl font-semibold text-slate-900">Imóveis</h1>
        </div>
        <Link
          href="/imoveis/novo"
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Novo imóvel
        </Link>
      </header>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Não foi possível carregar os imóveis. Verifique a conexão com o Supabase.
        </p>
      )}

      {!error && properties && properties.length === 0 && (
        <p className="text-sm text-slate-500">
          Nenhum imóvel cadastrado ainda.{" "}
          <Link href="/imoveis/novo" className="font-medium text-slate-900 underline">
            Cadastrar o primeiro
          </Link>
          .
        </p>
      )}

      {!error && properties && properties.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Apelido</th>
                <th className="px-4 py-3 font-medium">País</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Endereço</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/imoveis/${property.id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {property.nickname}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {countryLabels[property.country]}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={property.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">{property.full_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
