import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { updateObligation } from "../../actions";
import { EditObligationForm } from "./edit-form";
import type { RecurringObligation } from "@/lib/types";

export default async function EditarObrigacaoPage({
  params,
}: {
  params: Promise<{ id: string; obligationId: string }>;
}) {
  await requireUser();
  const { id, obligationId } = await params;

  const supabase = await createClient();
  const { data: obligation } = await supabase
    .from("recurring_obligations")
    .select("*")
    .eq("id", obligationId)
    .maybeSingle<RecurringObligation>();

  if (!obligation) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-6">
        <Link href={`/imoveis/${id}`} className="text-sm text-slate-500 hover:text-slate-900">
          ← Voltar ao imóvel
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">Editar obrigação</h1>
      </header>

      <EditObligationForm
        obligation={obligation}
        action={updateObligation.bind(null, obligationId, id)}
      />
    </div>
  );
}
