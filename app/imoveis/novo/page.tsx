"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createProperty } from "@/app/imoveis/actions";
import { PropertyFormFields } from "@/components/property-form-fields";

export default function NovoImovelPage() {
  const [state, formAction, pending] = useActionState(createProperty, undefined);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-6">
        <Link href="/imoveis" className="text-sm text-slate-500 hover:text-slate-900">
          ← Imóveis
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">Novo imóvel</h1>
      </header>

      <form
        action={formAction}
        className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <PropertyFormFields />

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
          {pending ? "Salvando..." : "Salvar imóvel"}
        </button>
      </form>
    </div>
  );
}
