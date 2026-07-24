import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { updateInsurance } from "../../actions";
import { EditInsuranceForm } from "./edit-form";
import type { InsurancePolicy } from "@/lib/types";

export default async function EditarSeguroPage({
  params,
}: {
  params: Promise<{ id: string; insuranceId: string }>;
}) {
  await requireUser();
  const { id, insuranceId } = await params;

  const supabase = await createClient();
  const { data: policy } = await supabase
    .from("insurance_policies")
    .select("*")
    .eq("id", insuranceId)
    .maybeSingle<InsurancePolicy>();

  if (!policy) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-6">
        <Link href={`/imoveis/${id}`} className="text-sm text-slate-500 hover:text-slate-900">
          ← Voltar ao imóvel
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">Editar seguro</h1>
      </header>

      <EditInsuranceForm
        policy={policy}
        action={updateInsurance.bind(null, insuranceId, id)}
      />
    </div>
  );
}
