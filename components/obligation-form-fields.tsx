import type { RecurringObligation } from "@/lib/types";

export function ObligationFormFields({
  obligation,
}: {
  obligation?: RecurringObligation;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="obligation_type" className="text-sm font-medium text-slate-700">
            Tipo
          </label>
          <input
            id="obligation_type"
            name="obligation_type"
            required
            placeholder="IPTU, IMI, Bombeiros, Condomínio..."
            defaultValue={obligation?.obligation_type}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="frequency" className="text-sm font-medium text-slate-700">
            Frequência
          </label>
          <input
            id="frequency"
            name="frequency"
            required
            placeholder="Anual, Mensal..."
            defaultValue={obligation?.frequency}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="payment_responsible"
            className="text-sm font-medium text-slate-700"
          >
            Quem paga
          </label>
          <select
            id="payment_responsible"
            name="payment_responsible"
            required
            defaultValue={obligation?.payment_responsible ?? "Nós"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            <option value="Nós">Nós</option>
            <option value="Inquilino">Inquilino</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="final_responsible"
            className="text-sm font-medium text-slate-700"
          >
            Responsável final pelo custo
          </label>
          <select
            id="final_responsible"
            name="final_responsible"
            required
            defaultValue={obligation?.final_responsible ?? "Nós"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            <option value="Nós">Nós</option>
            <option value="Inquilino">Inquilino</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="next_due_date" className="text-sm font-medium text-slate-700">
            Próximo vencimento
          </label>
          <input
            id="next_due_date"
            name="next_due_date"
            type="date"
            defaultValue={obligation?.next_due_date ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="estimated_value" className="text-sm font-medium text-slate-700">
            Valor estimado
          </label>
          <input
            id="estimated_value"
            name="estimated_value"
            type="number"
            step="0.01"
            min={0}
            defaultValue={obligation?.estimated_value ?? ""}
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
            defaultValue={obligation?.currency ?? "BRL"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            <option value="BRL">R$ BRL</option>
            <option value="EUR">€ EUR</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="current_status" className="text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          id="current_status"
          name="current_status"
          required
          defaultValue={obligation?.current_status ?? "Em dia"}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        >
          <option value="Em dia">Em dia</option>
          <option value="Pendente">Pendente</option>
          <option value="Aguardando reembolso">Aguardando reembolso</option>
          <option value="Vencido">Vencido</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-slate-700">
          Observações
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          defaultValue={obligation?.notes ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>
    </>
  );
}
