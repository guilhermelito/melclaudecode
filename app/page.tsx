import Link from "next/link";
import { requireUser } from "@/lib/supabase/dal";
import { logout } from "@/app/login/actions";

export default async function HomePage() {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">SisteMel</h1>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            Sair
          </button>
        </form>
      </header>

      <p className="text-sm text-slate-600">
        Login funcionando. Você está autenticado como{" "}
        <span className="font-medium text-slate-900">{user.email}</span>.
      </p>
      <p className="mt-2 text-sm text-slate-400">
        O dashboard de verdade entra aqui numa próxima etapa.
      </p>

      <Link
        href="/imoveis"
        className="mt-6 inline-block text-sm font-medium text-slate-900 underline"
      >
        Ver imóveis →
      </Link>
    </div>
  );
}
