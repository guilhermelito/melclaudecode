"use client";

import { use } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { createInsurance } from "../actions";
import { InsuranceFormFields } from "@/components/insurance-form-fields";

export default function NovoSeguroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [state, formAction, pending] = useActionState(
    createInsurance.bind(null, id),
    undefined
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-6">
        <Link href={`/imoveis/${id}`} className="text-sm text-slate-500 hover:text-slate-900">
          ← Voltar ao imóvel
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">Novo seguro</h1>
      </header>

      <form
        action={formAction}
        className="max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <InsuranceFormFields />

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
          {pending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
