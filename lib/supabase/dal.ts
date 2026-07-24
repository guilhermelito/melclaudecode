import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./server";

// Usa getUser() (não getSession()) porque ele valida o token direto com o
// Supabase Auth, em vez de confiar só no que está no cookie.
export const requireUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
});
