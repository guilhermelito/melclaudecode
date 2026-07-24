import Link from "next/link";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import { buildAlerts } from "@/lib/alerts";
import { formatDate } from "@/lib/format";
import type { InsurancePolicy, LeaseContract, Property, RecurringObligation } from "@/lib/types";

const severityStyles = {
  vencido: "border-red-500 bg-red-50",
  atencao: "border-amber-500 bg-amber-50",
} as const;

const severityLabel = { vencido: "Vencido", atencao: "Vence em breve" } as const;

export default async function HomePage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [
    { data: properties },
    { data: contracts },
    { data: policies },
    { data: obligations },
  ] = await Promise.all([
    supabase.from("properties").select("*").returns<Property[]>(),
    supabase.from("lease_contracts").select("*").returns<LeaseContract[]>(),
    supabase.from("insurance_policies").select("*").returns<InsurancePolicy[]>(),
    supabase.from("recurring_obligations").select("*").returns<RecurringObligation[]>(),
  ]);

  const alerts = buildAlerts({
    properties: properties ?? [],
    contracts: contracts ?? [],
    policies: policies ?? [],
    obligations: obligations ?? [],
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">SisteMel</h1>
          <p className="text-sm text-slate-500">Olá, {user.email}</p>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm text-slate-500 hover:text-slate-900">
            Sair
          </button>
        </form>
      </header>

      <nav className="mb-8 flex flex-wrap gap-4 text-sm font-medium">
        <Link href="/imoveis" className="text-slate-900 underline">
          Imóveis
        </Link>
        <Link href="/contratos" className="text-slate-900 underline">
          Contratos
        </Link>
        <Link href="/seguros" className="text-slate-900 underline">
          Seguros
        </Link>
        <Link href="/obrigacoes" className="text-slate-900 underline">
          Obrigações
        </Link>
      </nav>

      <section className="max-w-3xl">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">
          O que precisa de atenção
        </h2>

        {alerts.length === 0 && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Tudo em dia — nenhum contrato, seguro ou obrigação vencendo nos próximos dias.
          </p>
        )}

        <ul className="space-y-2">
          {alerts.map((alert) => (
            <li key={alert.id}>
              <Link
                href={`/imoveis/${alert.propertyId}`}
                className={`block rounded-lg border-l-4 px-4 py-3 text-sm hover:brightness-95 ${severityStyles[alert.severity]}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="font-medium text-slate-900">
                      {alert.propertyNickname}
                    </span>{" "}
                    <span className="text-slate-500">· {alert.category}</span>
                    <p className="text-slate-700">{alert.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {severityLabel[alert.severity]}
                    </p>
                    {alert.date && (
                      <p className="text-slate-600">{formatDate(alert.date)}</p>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
