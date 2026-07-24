import type { PropertyOwnership } from "@/lib/types";

export function OwnershipFormFields({ ownership }: { ownership?: PropertyOwnership }) {
  return (
    <>
      <div className="space-y-1.5">
        <label htmlFor="owner_name" className="text-sm font-medium text-slate-700">
          Titular
        </label>
        <input
          id="owner_name"
          name="owner_name"
          required
          defaultValue={ownership?.owner_name}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="owner_type" className="text-sm font-medium text-slate-700">
            Tipo
          </label>
          <select
            id="owner_type"
            name="owner_type"
            required
            defaultValue={ownership?.owner_type ?? "PF"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            <option value="PF">Pessoa física</option>
            <option value="PJ">Pessoa jurídica</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="percentage" className="text-sm font-medium text-slate-700">
            Percentual
          </label>
          <input
            id="percentage"
            name="percentage"
            type="number"
            min={0}
            max={100}
            step="0.01"
            required
            defaultValue={ownership?.percentage}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-slate-700">
          Observações
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          defaultValue={ownership?.notes ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>
    </>
  );
}
