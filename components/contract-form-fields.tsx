import type { LeaseContract } from "@/lib/types";

export function ContractFormFields({ contract }: { contract?: LeaseContract }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="tenant_name" className="text-sm font-medium text-slate-700">
            Inquilino
          </label>
          <input
            id="tenant_name"
            name="tenant_name"
            required
            defaultValue={contract?.tenant_name}
            placeholder="Ou 'Airbnb/Temporada'"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lease_type" className="text-sm font-medium text-slate-700">
            Tipo de locação
          </label>
          <select
            id="lease_type"
            name="lease_type"
            required
            defaultValue={contract?.lease_type ?? "Direto"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            <option value="Direto">Direto</option>
            <option value="Imobiliária">Imobiliária</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="agency_name" className="text-sm font-medium text-slate-700">
          Imobiliária (se aplicável)
        </label>
        <input
          id="agency_name"
          name="agency_name"
          defaultValue={contract?.agency_name ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="start_date" className="text-sm font-medium text-slate-700">
            Início
          </label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={contract?.start_date ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contract_end_date" className="text-sm font-medium text-slate-700">
            Fim do contrato
          </label>
          <input
            id="contract_end_date"
            name="contract_end_date"
            type="date"
            defaultValue={contract?.contract_end_date ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="next_readjustment_date"
            className="text-sm font-medium text-slate-700"
          >
            Próximo reajuste
          </label>
          <input
            id="next_readjustment_date"
            name="next_readjustment_date"
            type="date"
            defaultValue={contract?.next_readjustment_date ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="readjustment_index"
            className="text-sm font-medium text-slate-700"
          >
            Índice de reajuste
          </label>
          <input
            id="readjustment_index"
            name="readjustment_index"
            placeholder="IGPM, IPCA..."
            defaultValue={contract?.readjustment_index ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="rent_value" className="text-sm font-medium text-slate-700">
            Valor do aluguel
          </label>
          <input
            id="rent_value"
            name="rent_value"
            type="number"
            step="0.01"
            min={0}
            defaultValue={contract?.rent_value ?? ""}
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
            defaultValue={contract?.currency ?? "BRL"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            <option value="BRL">R$ BRL</option>
            <option value="EUR">€ EUR</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="relevant_clause" className="text-sm font-medium text-slate-700">
          Cláusula relevante
        </label>
        <textarea
          id="relevant_clause"
          name="relevant_clause"
          rows={2}
          defaultValue={contract?.relevant_clause ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={contract?.is_active ?? true}
          className="rounded border-slate-300"
        />
        Contrato ativo
      </label>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-slate-700">
          Observações
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          defaultValue={contract?.notes ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>
    </>
  );
}
