-- Reject new videos while preserving all previously stored video metadata and files.
-- Every record kind may upload images, PDF, DOCX, and plain TXT; RLS unchanged.
begin;

-- Historic video rows must continue to satisfy CHECK constraints. A BEFORE
-- INSERT trigger below blocks new videos, and the Storage MIME allowlist does
-- not permit new video uploads.
alter table public.record_attachments
 drop constraint record_attachments_kind_check;
alter table public.record_attachments
 add constraint record_attachments_kind_check
 check(kind in ('image','video','pdf','docx','txt','link'));

alter table public.record_attachments
 drop constraint record_attachments_check;
alter table public.record_attachments
 add constraint record_attachments_check check(
  (kind='link' and storage_path is null and url ~ '^https?://[^[:space:]]+$'
   and length(url)<=2000 and size is null and mime_type is null)
  or (kind<>'link' and url is null and storage_path is not null
   and size between 1 and 10485760 and (
    (kind='image' and mime_type in ('image/jpeg','image/png','image/webp','image/gif'))
    or (kind='video' and mime_type in ('video/mp4','video/webm')) -- historic rows only
    or (kind='pdf' and mime_type='application/pdf')
    or (kind='docx' and mime_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    or (kind='txt' and mime_type='text/plain')
   ))
 );

create or replace function public.stamp_attachment() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from public.records where id=new.record_id and workspace_id=new.workspace_id
  and kind in ('project','experiment','learning','north_star','goal','opportunity','idea','hypothesis','research','objective','kr'))
 then raise exception 'Este tipo de ficha no admite adjuntos';end if;
 if new.kind='video' then
  raise exception 'No se pueden subir vídeos. Solo imágenes, PDF, DOCX o TXT.';
 end if;
 if new.kind='link' then
  if new.url is null or new.url !~ '^https?://[^[:space:]]+$' then
   raise exception 'Introduce un enlace http:// o https:// válido';
  end if;
 else
  if new.storage_path is null or new.mime_type is null or new.size is null then
   raise exception 'Faltan datos del archivo';
  end if;
  if new.storage_path !~ ('^'||new.workspace_id::text||'/'||new.record_id::text||'/'||new.id::text||'\.(png|jpg|jpeg|webp|gif|pdf|docx|txt)$')
  then raise exception 'Ruta de adjunto inválida';end if;
 end if;
 new.created_by:=auth.uid();
 new.created_at:=now();
 return new;
end $$;

revoke all on function public.stamp_attachment() from public,anon,authenticated;

update storage.buckets
set allowed_mime_types=array[
 'image/jpeg','image/png','image/webp','image/gif',
 'application/pdf',
 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
 'text/plain'
]
where id='record-attachments';

notify pgrst, 'reload schema';
commit;
