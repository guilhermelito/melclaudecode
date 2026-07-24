import type { Property } from "@/lib/types";

export function PropertyFormFields({ property }: { property?: Property }) {
  return (
    <>
      <div className="space-y-1.5">
        <label htmlFor="nickname" className="text-sm font-medium text-slate-700">
          Apelido
        </label>
        <input
          id="nickname"
          name="nickname"
          required
          defaultValue={property?.nickname}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="full_address" className="text-sm font-medium text-slate-700">
          Endereço completo
        </label>
        <input
          id="full_address"
          name="full_address"
          required
          defaultValue={property?.full_address}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="country" className="text-sm font-medium text-slate-700">
            País
          </label>
          <select
            id="country"
            name="country"
            required
            defaultValue={property?.country ?? "BR"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            <option value="BR">Brasil</option>
            <option value="PT">Portugal</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="status" className="text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            required
            defaultValue={property?.status ?? "Vago"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            <option value="Ocupado">Ocupado</option>
            <option value="Vago">Vago</option>
            <option value="Airbnb-Temporada">Airbnb/Temporada</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="registration_number"
          className="text-sm font-medium text-slate-700"
        >
          Matrícula
        </label>
        <input
          id="registration_number"
          name="registration_number"
          defaultValue={property?.registration_number ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-slate-700">
          Observações
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={property?.notes ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>
    </>
  );
}
