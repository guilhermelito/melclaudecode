import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { updateContract } from "../../actions";
import { EditContractForm } from "./edit-form";
import type { LeaseContract } from "@/lib/types";

export default async function EditarContratoPage({
  params,
}: {
  params: Promise<{ id: string; contractId: string }>;
}) {
  await requireUser();
  const { id, contractId } = await params;

  const supabase = await createClient();
  const { data: contract } = await supabase
    .from("lease_contracts")
    .select("*")
    .eq("id", contractId)
    .maybeSingle<LeaseContract>();

  if (!contract) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-6">
        <Link href={`/imoveis/${id}`} className="text-sm text-slate-500 hover:text-slate-900">
          ← Voltar ao imóvel
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">Editar contrato</h1>
      </header>

      <EditContractForm
        contract={contract}
        action={updateContract.bind(null, contractId, id)}
      />
    </div>
  );
}
