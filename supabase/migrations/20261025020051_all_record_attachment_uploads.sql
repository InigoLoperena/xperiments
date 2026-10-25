-- Reuse private attachments for every record type, including projects and MVPs.
-- Keep workspace matching, path checks, attribution, and all existing RLS policies.
begin;
create or replace function public.stamp_attachment() returns trigger
language plpgsql security definer set search_path='' as $$ begin
 if not exists(select 1 from public.records where id=new.record_id and workspace_id=new.workspace_id
   and kind in ('project','experiment','learning','north_star','goal','opportunity','idea','hypothesis','research','objective','kr'))
 then raise exception 'Este tipo de ficha no admite adjuntos';end if;
 if new.kind='link' then
  if new.url is null or new.url !~ '^https?://[^[:space:]]+$' then raise exception 'Introduce un enlace http:// o https:// válido';end if;
 else
  if new.storage_path is null or new.mime_type is null or new.size is null then raise exception 'Faltan datos del archivo';end if;
  if new.storage_path !~ ('^'||new.workspace_id::text||'/'||new.record_id::text||'/'||new.id::text||'\.(png|jpg|jpeg|webp|gif|mp4|webm|pdf|docx)$') then raise exception 'Ruta de adjunto inválida';end if;
 end if;
 new.created_by:=auth.uid();new.created_at:=now();return new;
end $$;
-- Trigger-only: do not expose this function as a client RPC.
revoke all on function public.stamp_attachment() from public,anon,authenticated;
notify pgrst, 'reload schema';
commit;
