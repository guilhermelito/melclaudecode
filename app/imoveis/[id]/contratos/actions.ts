"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Currency, LeaseType } from "@/lib/types";

export type ContractFormState = { error?: string } | undefined;

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readForm(formData: FormData) {
  const tenant_name = str(formData, "tenant_name");
  const lease_type = formData.get("lease_type");
  const currency = formData.get("currency");
  const rent_value = formData.get("rent_value");

  if (!tenant_name || (lease_type !== "Direto" && lease_type !== "Imobiliária")) {
    return null;
  }
  if (currency !== "BRL" && currency !== "EUR") {
    return null;
  }

  return {
    tenant_name,
    lease_type: lease_type as LeaseType,
    agency_name: str(formData, "agency_name"),
    start_date: str(formData, "start_date"),
    contract_end_date: str(formData, "contract_end_date"),
    next_readjustment_date: str(formData, "next_readjustment_date"),
    readjustment_index: str(formData, "readjustment_index"),
    rent_value: typeof rent_value === "string" && rent_value ? Number(rent_value) : null,
    currency: currency as Currency,
    relevant_clause: str(formData, "relevant_clause"),
    is_active: formData.get("is_active") === "on",
    notes: str(formData, "notes"),
  };
}

export async function createContract(
  propertyId: string,
  _prevState: ContractFormState,
  formData: FormData
): Promise<ContractFormState> {
  const values = readForm(formData);
  if (!values) {
    return { error: "Preencha ao menos inquilino, tipo de locação e moeda." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("lease_contracts")
    .insert({ ...values, property_id: propertyId, updated_by: user?.id });

  if (error) {
    return { error: "Não foi possível salvar o contrato. Tente de novo." };
  }

  revalidatePath(`/imoveis/${propertyId}`);
  redirect(`/imoveis/${propertyId}`);
}

export async function updateContract(
  id: string,
  propertyId: string,
  _prevState: ContractFormState,
  formData: FormData
): Promise<ContractFormState> {
  const values = readForm(formData);
  if (!values) {
    return { error: "Preencha ao menos inquilino, tipo de locação e moeda." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("lease_contracts")
    .update({ ...values, updated_by: user?.id })
    .eq("id", id);

  if (error) {
    return { error: "Não foi possível salvar as alterações. Tente de novo." };
  }

  revalidatePath(`/imoveis/${propertyId}`);
  redirect(`/imoveis/${propertyId}`);
}

export async function deleteContract(id: string, propertyId: string) {
  "use server";
  const supabase = await createClient();
  await supabase.from("lease_contracts").delete().eq("id", id);
  revalidatePath(`/imoveis/${propertyId}`);
}
