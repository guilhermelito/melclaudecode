"use client";

import { useActionState } from "react";
import { PropertyFormFields } from "@/components/property-form-fields";
import type { PropertyFormState } from "@/app/imoveis/actions";
import type { Property } from "@/lib/types";

export function EditPropertyForm({
  property,
  action,
}: {
  property: Property;
  action: (state: PropertyFormState, formData: FormData) => Promise<PropertyFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <PropertyFormFields property={property} />

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
