"use client";

import { useActionState } from "react";
import { OwnershipFormFields } from "@/components/ownership-form-fields";
import type { OwnershipFormState } from "@/app/imoveis/[id]/titularidade/actions";
import type { PropertyOwnership } from "@/lib/types";

export function EditOwnershipForm({
  ownership,
  action,
}: {
  ownership: PropertyOwnership;
  action: (
    state: OwnershipFormState,
    formData: FormData
  ) => Promise<OwnershipFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <OwnershipFormFields ownership={ownership} />

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
