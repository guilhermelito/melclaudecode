-- Bucket privado para os documentos (contratos, apólices, espelhos de IPTU/IMI etc).
-- Privado porque são documentos sensíveis: acesso só via signed URL gerada no servidor.
insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', false)
on conflict (id) do nothing;

create policy "authenticated full access to documentos"
  on storage.objects for all to authenticated
  using (bucket_id = 'documentos')
  with check (bucket_id = 'documentos');
