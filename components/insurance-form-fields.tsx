import type { InsurancePolicy } from "@/lib/types";

export function InsuranceFormFields({ policy }: { policy?: InsurancePolicy }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="insurer_name" className="text-sm font-medium text-slate-700">
            Seguradora
          </label>
          <input
            id="insurer_name"
            name="insurer_name"
            required
            defaultValue={policy?.insurer_name}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="policy_number" className="text-sm font-medium text-slate-700">
            Nº da apólice
          </label>
          <input
            id="policy_number"
            name="policy_number"
            defaultValue={policy?.policy_number ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="coverage_description"
          className="text-sm font-medium text-slate-700"
        >
          Cobertura
        </label>
        <input
          id="coverage_description"
          name="coverage_description"
          defaultValue={policy?.coverage_description ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="coverage_start_date"
            className="text-sm font-medium text-slate-700"
          >
            Início da vigência
          </label>
          <input
            id="coverage_start_date"
            name="coverage_start_date"
            type="date"
            defaultValue={policy?.coverage_start_date ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="coverage_end_date"
            className="text-sm font-medium text-slate-700"
          >
            Fim da vigência
          </label>
          <input
            id="coverage_end_date"
            name="coverage_end_date"
            type="date"
            defaultValue={policy?.coverage_end_date ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="premium_value" className="text-sm font-medium text-slate-700">
            Valor do prêmio
          </label>
          <input
            id="premium_value"
            name="premium_value"
            type="number"
            step="0.01"
            min={0}
            defaultValue={policy?.premium_value ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="currency" className="text-sm font-medium text-slate-700">
            Moeda
          </label>
          <select
            id="currency"
            name="currency"
            required
            defaultValue={policy?.currency ?? "BRL"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            <option value="BRL">R$ BRL</option>
            <option value="EUR">€ EUR</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={policy?.is_active ?? true}
          className="rounded border-slate-300"
        />
        Seguro ativo
      </label>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-slate-700">
          Observações
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          defaultValue={policy?.notes ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>
    </>
  );
}
