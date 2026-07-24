import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge, ObligationStatusBadge } from "@/components/status-badge";
import { DeleteButton } from "@/components/delete-button";
import { DocumentUploadForm } from "@/components/document-upload-form";
import { countryLabels, formatCurrency, formatDate } from "@/lib/format";
import { deleteOwnership } from "./titularidade/actions";
import { deleteContract } from "./contratos/actions";
import { deleteInsurance } from "./seguros/actions";
import { deleteObligation } from "./obrigacoes/actions";
import { uploadDocument, deleteDocument } from "./documentos/actions";
import type {
  InsurancePolicy,
  LeaseContract,
  Property,
  PropertyDocument,
  PropertyOwnership,
  RecurringObligation,
} from "@/lib/types";

function SectionHeader({ title, addHref }: { title: string; addHref: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <Link href={addHref} className="text-sm font-medium text-slate-600 hover:text-slate-900">
        + adicionar
      </Link>
    </div>
  );
}

export default async function ImovelDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;

  const supabase = await createClient();
  const [
    { data: property },
    { data: ownerships },
    { data: contracts },
    { data: policies },
    { data: obligations },
    { data: documents },
  ] = await Promise.all([
    supabase.from("properties").select("*").eq("id", id).maybeSingle<Property>(),
    supabase
      .from("property_ownership")
      .select("*")
      .eq("property_id", id)
      .order("owner_name")
      .returns<PropertyOwnership[]>(),
    supabase
      .from("lease_contracts")
      .select("*")
      .eq("property_id", id)
      .order("contract_end_date", { nullsFirst: false })
      .returns<LeaseContract[]>(),
    supabase
      .from("insurance_policies")
      .select("*")
      .eq("property_id", id)
      .order("coverage_end_date", { nullsFirst: false })
      .returns<InsurancePolicy[]>(),
    supabase
      .from("recurring_obligations")
      .select("*")
      .eq("property_id", id)
      .order("next_due_date", { nullsFirst: false })
      .returns<RecurringObligation[]>(),
    supabase
      .from("documents")
      .select("*")
      .eq("property_id", id)
      .order("uploaded_at", { ascending: false })
      .returns<PropertyDocument[]>(),
  ]);

  if (!property) {
    notFound();
  }

  const documentsWithUrls = await Promise.all(
    (documents ?? []).map(async (doc) => {
      const { data: signed } = await supabase.storage
        .from("documentos")
        .createSignedUrl(doc.file_path, 60 * 10);
      return { ...doc, url: signed?.signedUrl ?? null };
    })
  );

  const percentageTotal = (ownerships ?? []).reduce((sum, o) => sum + o.percentage, 0);
  const percentageOff = ownerships && ownerships.length > 0 && Math.abs(percentageTotal - 100) > 0.01;

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

      <div className="mt-6 grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Titularidade */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <SectionHeader title="Titularidade" addHref={`/imoveis/${id}/titularidade/nova`} />

          {percentageOff && (
            <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Os percentuais somam {percentageTotal.toFixed(2)}%, não 100%.
            </p>
          )}

          {(!ownerships || ownerships.length === 0) && (
            <p className="text-sm text-slate-400">Nenhuma titularidade cadastrada.</p>
          )}

          <ul className="space-y-2">
            {ownerships?.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">{o.owner_name}</p>
                  <p className="text-slate-500">
                    {o.owner_type} · {o.percentage}%
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/imoveis/${id}/titularidade/${o.id}/editar`}
                    className="text-sm text-slate-500 hover:text-slate-900"
                  >
                    Editar
                  </Link>
                  <DeleteButton
                    action={deleteOwnership.bind(null, o.id, id)}
                    confirmMessage="Remover esta titularidade?"
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Contratos */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <SectionHeader title="Contratos" addHref={`/imoveis/${id}/contratos/novo`} />

          {(!contracts || contracts.length === 0) && (
            <p className="text-sm text-slate-400">Nenhum contrato cadastrado.</p>
          )}

          <ul className="space-y-2">
            {contracts?.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {c.tenant_name}{" "}
                    {!c.is_active && (
                      <span className="text-xs font-normal text-slate-400">(inativo)</span>
                    )}
                  </p>
                  <p className="text-slate-500">
                    {c.lease_type} · fim {formatDate(c.contract_end_date)} ·{" "}
                    {formatCurrency(c.rent_value, c.currency)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/imoveis/${id}/contratos/${c.id}/editar`}
                    className="text-sm text-slate-500 hover:text-slate-900"
                  >
                    Editar
                  </Link>
                  <DeleteButton
                    action={deleteContract.bind(null, c.id, id)}
                    confirmMessage="Remover este contrato?"
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Seguros */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <SectionHeader title="Seguros" addHref={`/imoveis/${id}/seguros/novo`} />

          {(!policies || policies.length === 0) && (
            <p className="text-sm text-slate-400">Nenhum seguro cadastrado.</p>
          )}

          <ul className="space-y-2">
            {policies?.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {p.insurer_name}{" "}
                    {!p.is_active && (
                      <span className="text-xs font-normal text-slate-400">(inativo)</span>
                    )}
                  </p>
                  <p className="text-slate-500">
                    vigência até {formatDate(p.coverage_end_date)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/imoveis/${id}/seguros/${p.id}/editar`}
                    className="text-sm text-slate-500 hover:text-slate-900"
                  >
                    Editar
                  </Link>
                  <DeleteButton
                    action={deleteInsurance.bind(null, p.id, id)}
                    confirmMessage="Remover este seguro?"
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Obrigações recorrentes */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <SectionHeader title="Obrigações recorrentes" addHref={`/imoveis/${id}/obrigacoes/nova`} />

          {(!obligations || obligations.length === 0) && (
            <p className="text-sm text-slate-400">Nenhuma obrigação cadastrada.</p>
          )}

          <ul className="space-y-2">
            {obligations?.map((ob) => (
              <li
                key={ob.id}
                className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{ob.obligation_type}</p>
                    <ObligationStatusBadge status={ob.current_status} />
                  </div>
                  <p className="text-slate-500">
                    vence {formatDate(ob.next_due_date)} · paga {ob.payment_responsible}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/imoveis/${id}/obrigacoes/${ob.id}/editar`}
                    className="text-sm text-slate-500 hover:text-slate-900"
                  >
                    Editar
                  </Link>
                  <DeleteButton
                    action={deleteObligation.bind(null, ob.id, id)}
                    confirmMessage="Remover esta obrigação?"
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 max-w-4xl rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Documentos</h2>

        {documentsWithUrls.length === 0 && (
          <p className="text-sm text-slate-400">Nenhum documento anexado.</p>
        )}

        <ul className="space-y-2">
          {documentsWithUrls.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-sm"
            >
              <div>
                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-900 hover:underline"
                  >
                    {doc.document_type}
                  </a>
                ) : (
                  <p className="font-medium text-slate-900">{doc.document_type}</p>
                )}
                <p className="text-slate-500">
                  {doc.reference_date ? formatDate(doc.reference_date) : formatDate(doc.uploaded_at.slice(0, 10))}
                </p>
              </div>
              <DeleteButton
                action={deleteDocument.bind(null, doc.id, id, doc.file_path)}
                confirmMessage="Remover este documento?"
              />
            </li>
          ))}
        </ul>

        <DocumentUploadForm
          contracts={contracts ?? []}
          policies={policies ?? []}
          action={uploadDocument.bind(null, id)}
        />
      </section>
    </div>
  );
}
