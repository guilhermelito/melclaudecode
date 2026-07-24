import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { countryLabels } from "@/lib/format";
import type { Property } from "@/lib/types";

export default async function ImovelDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;

  const supabase = await createClient();
  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle<Property>();

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <Link href="/imoveis" className="text-sm text-slate-500 hover:text-slate-900">
            ← Imóveis
          </Link>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-900">
              {property.nickname}
            </h1>
            <StatusBadge status={property.status} />
          </div>
        </div>
        <Link
          href={`/imoveis/${property.id}/editar`}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Editar
        </Link>
      </header>

      <dl className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-4 rounded-xl border border-slate-200 bg-white p-6 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">País</dt>
          <dd className="mt-0.5 text-slate-900">{countryLabels[property.country]}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Matrícula</dt>
          <dd className="mt-0.5 text-slate-900">
            {property.registration_number || "—"}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-slate-500">Endereço</dt>
          <dd className="mt-0.5 text-slate-900">{property.full_address}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-slate-500">Observações</dt>
          <dd className="mt-0.5 whitespace-pre-wrap text-slate-900">
            {property.notes || "—"}
          </dd>
        </div>
      </dl>

      <p className="mt-6 text-sm text-slate-400">
        Titularidade, contrato, seguro, obrigações e documentos entram aqui numa
        próxima etapa.
      </p>
    </div>
  );
}
