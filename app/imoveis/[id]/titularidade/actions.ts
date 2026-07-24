"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { OwnerType } from "@/lib/types";

export type OwnershipFormState = { error?: string } | undefined;

function readForm(formData: FormData) {
  const owner_name = formData.get("owner_name");
  const owner_type = formData.get("owner_type");
  const percentage = formData.get("percentage");
  const notes = formData.get("notes");

  const percentageNumber = typeof percentage === "string" ? Number(percentage) : NaN;

  if (
    typeof owner_name !== "string" ||
    !owner_name.trim() ||
    (owner_type !== "PJ" && owner_type !== "PF") ||
    Number.isNaN(percentageNumber) ||
    percentageNumber < 0 ||
    percentageNumber > 100
  ) {
    return null;
  }

  return {
    owner_name: owner_name.trim(),
    owner_type: owner_type as OwnerType,
    percentage: percentageNumber,
    notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
  };
}

export async function createOwnership(
  propertyId: string,
  _prevState: OwnershipFormState,
  formData: FormData
): Promise<OwnershipFormState> {
  const values = readForm(formData);
  if (!values) {
    return { error: "Preencha titular, tipo e um percentual entre 0 e 100." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("property_ownership")
    .insert({ ...values, property_id: propertyId, updated_by: user?.id });

  if (error) {
    return { error: "Não foi possível salvar a titularidade. Tente de novo." };
  }

  revalidatePath(`/imoveis/${propertyId}`);
  redirect(`/imoveis/${propertyId}`);
}

export async function updateOwnership(
  id: string,
  propertyId: string,
  _prevState: OwnershipFormState,
  formData: FormData
): Promise<OwnershipFormState> {
  const values = readForm(formData);
  if (!values) {
    return { error: "Preencha titular, tipo e um percentual entre 0 e 100." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("property_ownership")
    .update({ ...values, updated_by: user?.id })
    .eq("id", id);

  if (error) {
    return { error: "Não foi possível salvar as alterações. Tente de novo." };
  }

  revalidatePath(`/imoveis/${propertyId}`);
  redirect(`/imoveis/${propertyId}`);
}

export async function deleteOwnership(id: string, propertyId: string) {
  "use server";
  const supabase = await createClient();
  await supabase.from("property_ownership").delete().eq("id", id);
  revalidatePath(`/imoveis/${propertyId}`);
}
