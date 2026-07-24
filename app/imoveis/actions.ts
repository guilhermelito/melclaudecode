"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Country, PropertyStatus } from "@/lib/types";

export type PropertyFormState = { error?: string } | undefined;

function readPropertyForm(formData: FormData) {
  const nickname = formData.get("nickname");
  const full_address = formData.get("full_address");
  const country = formData.get("country");
  const status = formData.get("status");
  const registration_number = formData.get("registration_number");
  const notes = formData.get("notes");

  if (
    typeof nickname !== "string" ||
    !nickname.trim() ||
    typeof full_address !== "string" ||
    !full_address.trim() ||
    (country !== "BR" && country !== "PT") ||
    (status !== "Ocupado" && status !== "Vago" && status !== "Airbnb-Temporada")
  ) {
    return null;
  }

  return {
    nickname: nickname.trim(),
    full_address: full_address.trim(),
    country: country as Country,
    status: status as PropertyStatus,
    registration_number:
      typeof registration_number === "string" && registration_number.trim()
        ? registration_number.trim()
        : null,
    notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
  };
}

export async function createProperty(
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  const values = readPropertyForm(formData);
  if (!values) {
    return { error: "Preencha ao menos apelido, endereço, país e status." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("properties")
    .insert({ ...values, updated_by: user?.id })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Não foi possível salvar o imóvel. Tente de novo." };
  }

  revalidatePath("/imoveis");
  redirect(`/imoveis/${data.id}`);
}

export async function updateProperty(
  id: string,
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  const values = readPropertyForm(formData);
  if (!values) {
    return { error: "Preencha ao menos apelido, endereço, país e status." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("properties")
    .update({ ...values, updated_by: user?.id })
    .eq("id", id);

  if (error) {
    return { error: "Não foi possível salvar as alterações. Tente de novo." };
  }

  revalidatePath("/imoveis");
  revalidatePath(`/imoveis/${id}`);
  redirect(`/imoveis/${id}`);
}
