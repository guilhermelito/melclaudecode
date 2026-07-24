"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Currency, ObligationStatus, Responsible } from "@/lib/types";

export type ObligationFormState = { error?: string } | undefined;

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readForm(formData: FormData) {
  const obligation_type = str(formData, "obligation_type");
  const payment_responsible = formData.get("payment_responsible");
  const final_responsible = formData.get("final_responsible");
  const frequency = str(formData, "frequency");
  const currency = formData.get("currency");
  const current_status = formData.get("current_status");
  const estimated_value = formData.get("estimated_value");

  if (
    !obligation_type ||
    !frequency ||
    (payment_responsible !== "Nós" && payment_responsible !== "Inquilino") ||
    (final_responsible !== "Nós" && final_responsible !== "Inquilino") ||
    (currency !== "BRL" && currency !== "EUR") ||
    !["Em dia", "Pendente", "Aguardando reembolso", "Vencido"].includes(
      current_status as string
    )
  ) {
    return null;
  }

  return {
    obligation_type,
    payment_responsible: payment_responsible as Responsible,
    final_responsible: final_responsible as Responsible,
    frequency,
    next_due_date: str(formData, "next_due_date"),
    estimated_value:
      typeof estimated_value === "string" && estimated_value
        ? Number(estimated_value)
        : null,
    currency: currency as Currency,
    current_status: current_status as ObligationStatus,
    notes: str(formData, "notes"),
  };
}

export async function createObligation(
  propertyId: string,
  _prevState: ObligationFormState,
  formData: FormData
): Promise<ObligationFormState> {
  const values = readForm(formData);
  if (!values) {
    return { error: "Preencha tipo, responsáveis, frequência, moeda e status." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("recurring_obligations")
    .insert({ ...values, property_id: propertyId, updated_by: user?.id });

  if (error) {
    return { error: "Não foi possível salvar a obrigação. Tente de novo." };
  }

  revalidatePath(`/imoveis/${propertyId}`);
  redirect(`/imoveis/${propertyId}`);
}

export async function updateObligation(
  id: string,
  propertyId: string,
  _prevState: ObligationFormState,
  formData: FormData
): Promise<ObligationFormState> {
  const values = readForm(formData);
  if (!values) {
    return { error: "Preencha tipo, responsáveis, frequência, moeda e status." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("recurring_obligations")
    .update({ ...values, updated_by: user?.id })
    .eq("id", id);

  if (error) {
    return { error: "Não foi possível salvar as alterações. Tente de novo." };
  }

  revalidatePath(`/imoveis/${propertyId}`);
  redirect(`/imoveis/${propertyId}`);
}

export async function deleteObligation(id: string, propertyId: string) {
  "use server";
  const supabase = await createClient();
  await supabase.from("recurring_obligations").delete().eq("id", id);
  revalidatePath(`/imoveis/${propertyId}`);
}
