import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { updateProperty } from "@/app/imoveis/actions";
import { EditPropertyForm } from "./edit-form";
import type { Property } from "@/lib/types";

export default async function EditarImovelPage({
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
      <header className="mb-6">
        <Link
          href={`/imoveis/${id}`}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← {property.nickname}
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">Editar imóvel</h1>
      </header>

      <EditPropertyForm property={property} action={updateProperty.bind(null, id)} />
    </div>
  );
}
