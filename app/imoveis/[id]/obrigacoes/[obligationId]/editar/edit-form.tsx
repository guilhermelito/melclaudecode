"use client";

import { useActionState } from "react";
import { ObligationFormFields } from "@/components/obligation-form-fields";
import type { ObligationFormState } from "@/app/imoveis/[id]/obrigacoes/actions";
import type { RecurringObligation } from "@/lib/types";

export function EditObligationForm({
  obligation,
  action,
}: {
  obligation: RecurringObligation;
  action: (
    state: ObligationFormState,
    formData: FormData
  ) => Promise<ObligationFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <ObligationFormFields obligation={obligation} />

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
