"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Currency } from "@/lib/types";

export type InsuranceFormState = { error?: string } | undefined;

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readForm(formData: FormData) {
  const insurer_name = str(formData, "insurer_name");
  const currency = formData.get("currency");
  const premium_value = formData.get("premium_value");

  if (!insurer_name || (currency !== "BRL" && currency !== "EUR")) {
    return null;
  }

  return {
    insurer_name,
    policy_number: str(formData, "policy_number"),
    coverage_description: str(formData, "coverage_description"),
    coverage_start_date: str(formData, "coverage_start_date"),
    coverage_end_date: str(formData, "coverage_end_date"),
    premium_value:
      typeof premium_value === "string" && premium_value ? Number(premium_value) : null,
    currency: currency as Currency,
    is_active: formData.get("is_active") === "on",
    notes: str(formData, "notes"),
  };
}

export async function createInsurance(
  propertyId: string,
  _prevState: InsuranceFormState,
  formData: FormData
): Promise<InsuranceFormState> {
  const values = readForm(formData);
  if (!values) {
    return { error: "Preencha ao menos a seguradora e a moeda." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("insurance_policies")
    .insert({ ...values, property_id: propertyId, updated_by: user?.id });

  if (error) {
    return { error: "Não foi possível salvar o seguro. Tente de novo." };
  }

  revalidatePath(`/imoveis/${propertyId}`);
  redirect(`/imoveis/${propertyId}`);
}

export async function updateInsurance(
  id: string,
  propertyId: string,
  _prevState: InsuranceFormState,
  formData: FormData
): Promise<InsuranceFormState> {
  const values = readForm(formData);
  if (!values) {
    return { error: "Preencha ao menos a seguradora e a moeda." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("insurance_policies")
    .update({ ...values, updated_by: user?.id })
    .eq("id", id);

  if (error) {
    return { error: "Não foi possível salvar as alterações. Tente de novo." };
  }

  revalidatePath(`/imoveis/${propertyId}`);
  redirect(`/imoveis/${propertyId}`);
}

export async function deleteInsurance(id: string, propertyId: string) {
  "use server";
  const supabase = await createClient();
  await supabase.from("insurance_policies").delete().eq("id", id);
  revalidatePath(`/imoveis/${propertyId}`);
}
