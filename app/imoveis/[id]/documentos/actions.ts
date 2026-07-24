"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DocumentType } from "@/lib/types";

export type DocumentFormState = { error?: string } | undefined;

const DOCUMENT_TYPES: DocumentType[] = [
  "Contrato",
  "Apólice de Seguro",
  "Espelho IPTU/IMI",
  "Nada Consta",
  "Outro",
];

export async function uploadDocument(
  propertyId: string,
  _prevState: DocumentFormState,
  formData: FormData
): Promise<DocumentFormState> {
  const file = formData.get("file");
  const document_type = formData.get("document_type");
  const reference_date = formData.get("reference_date");
  const related_contract_id = formData.get("related_contract_id");
  const related_insurance_id = formData.get("related_insurance_id");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecione um arquivo." };
  }
  if (!DOCUMENT_TYPES.includes(document_type as DocumentType)) {
    return { error: "Selecione o tipo de documento." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${propertyId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("documentos")
    .upload(path, file, { contentType: file.type || undefined });

  if (uploadError) {
    return { error: "Não foi possível enviar o arquivo. Tente de novo." };
  }

  const { error: insertError } = await supabase.from("documents").insert({
    property_id: propertyId,
    related_contract_id:
      typeof related_contract_id === "string" && related_contract_id ? related_contract_id : null,
    related_insurance_id:
      typeof related_insurance_id === "string" && related_insurance_id
        ? related_insurance_id
        : null,
    document_type: document_type as DocumentType,
    file_path: path,
    reference_date:
      typeof reference_date === "string" && reference_date ? reference_date : null,
    uploaded_by: user?.id,
  });

  if (insertError) {
    await supabase.storage.from("documentos").remove([path]);
    return { error: "Não foi possível salvar o documento. Tente de novo." };
  }

  revalidatePath(`/imoveis/${propertyId}`);
  return undefined;
}

export async function deleteDocument(id: string, propertyId: string, filePath: string) {
  "use server";
  const supabase = await createClient();
  await supabase.storage.from("documentos").remove([filePath]);
  await supabase.from("documents").delete().eq("id", id);
  revalidatePath(`/imoveis/${propertyId}`);
}
