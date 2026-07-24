"use client";

import { useActionState, useRef } from "react";
import type { DocumentFormState } from "@/app/imoveis/[id]/documentos/actions";
import type { LeaseContract, InsurancePolicy } from "@/lib/types";

export function DocumentUploadForm({
  contracts,
  policies,
  action,
}: {
  contracts: LeaseContract[];
  policies: InsurancePolicy[];
  action: (state: DocumentFormState, formData: FormData) => Promise<DocumentFormState>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (
    prevState: DocumentFormState,
    formData: FormData
  ) => {
    const result = await action(prevState, formData);
    if (!result?.error) {
      formRef.current?.reset();
    }
    return result;
  }, undefined);

  return (
    <form ref={formRef} action={formAction} className="mt-4 space-y-3 border-t border-slate-100 pt-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="file" className="text-xs font-medium text-slate-700">
            Arquivo (PDF ou JPEG)
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".pdf,.jpg,.jpeg"
            required
            className="w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="document_type" className="text-xs font-medium text-slate-700">
            Tipo
          </label>
          <select
            id="document_type"
            name="document_type"
            required
            defaultValue="Outro"
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs text-slate-900"
          >
            <option value="Contrato">Contrato</option>
            <option value="Apólice de Seguro">Apólice de Seguro</option>
            <option value="Espelho IPTU/IMI">Espelho IPTU/IMI</option>
            <option value="Nada Consta">Nada Consta</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label htmlFor="reference_date" className="text-xs font-medium text-slate-700">
            Data de referência
          </label>
          <input
            id="reference_date"
            name="reference_date"
            type="date"
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs text-slate-900"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="related_contract_id" className="text-xs font-medium text-slate-700">
            Contrato relacionado
          </label>
          <select
            id="related_contract_id"
            name="related_contract_id"
            defaultValue=""
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs text-slate-900"
          >
            <option value="">Nenhum</option>
            {contracts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tenant_name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="related_insurance_id" className="text-xs font-medium text-slate-700">
            Seguro relacionado
          </label>
          <select
            id="related_insurance_id"
            name="related_insurance_id"
            defaultValue=""
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs text-slate-900"
          >
            <option value="">Nenhum</option>
            {policies.map((p) => (
              <option key={p.id} value={p.id}>
                {p.insurer_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Enviar documento"}
      </button>
    </form>
  );
}
