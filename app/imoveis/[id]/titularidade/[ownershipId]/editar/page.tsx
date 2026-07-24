import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { updateOwnership } from "../../actions";
import { EditOwnershipForm } from "./edit-form";
import type { PropertyOwnership } from "@/lib/types";

export default async function EditarTitularidadePage({
  params,
}: {
  params: Promise<{ id: string; ownershipId: string }>;
}) {
  await requireUser();
  const { id, ownershipId } = await params;

  const supabase = await createClient();
  const { data: ownership } = await supabase
    .from("property_ownership")
    .select("*")
    .eq("id", ownershipId)
    .maybeSingle<PropertyOwnership>();

  if (!ownership) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-6">
        <Link href={`/imoveis/${id}`} className="text-sm text-slate-500 hover:text-slate-900">
          ← Voltar ao imóvel
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">Editar titularidade</h1>
      </header>

      <EditOwnershipForm
        ownership={ownership}
        action={updateOwnership.bind(null, ownershipId, id)}
      />
    </div>
  );
}
