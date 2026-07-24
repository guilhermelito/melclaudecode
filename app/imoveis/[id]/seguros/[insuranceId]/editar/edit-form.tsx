"use client";

import { useActionState } from "react";
import { InsuranceFormFields } from "@/components/insurance-form-fields";
import type { InsuranceFormState } from "@/app/imoveis/[id]/seguros/actions";
import type { InsurancePolicy } from "@/lib/types";

export function EditInsuranceForm({
  policy,
  action,
}: {
  policy: InsurancePolicy;
  action: (
    state: InsuranceFormState,
    formData: FormData
  ) => Promise<InsuranceFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <InsuranceFormFields policy={policy} />

      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
