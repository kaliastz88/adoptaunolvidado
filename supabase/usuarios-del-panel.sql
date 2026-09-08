-- =============================================================================
-- Adopta un Olvidado — registro de personas para el panel de administración
--
-- Se corre DESPUÉS de schema.sql. Reemplaza las políticas de escritura que ese
-- archivo creó, así que el orden importa.
--
-- CÓMO USARLO:
--   Supabase → SQL Editor → New query → pegar todo → Run
--
-- Es seguro correrlo más de una vez.
--
-- QUÉ RESUELVE:
-- El panel vive en una URL pública. Con schema.sql, cualquier persona que
-- lograra una cuenta podía escribir en el catálogo, porque las políticas solo
-- pedían estar autenticado. Ahora estar autenticado no alcanza: hay que estar
-- además aprobado por alguien que ya tiene acceso.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. QUIÉNES PUEDEN USAR EL PANEL
--
-- Una fila por persona registrada. Registrarse crea la fila en estado
-- 'pendiente', que no da permiso a nada. Alguien con rol 'owner' la pasa a
-- 'aprobado'.
--
-- Para quitarle el acceso a alguien se usa 'rechazado', no se borra la fila. Si
-- se borrara, la persona volvería a verse como una solicitud nueva y podría ser
-- aprobada por descuido.
-- -----------------------------------------------------------------------------

create table if not exists public.panel_users (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  role        text not null default 'admin'      check (role in ('owner', 'admin')),
  status      text not null default 'pendiente'  check (status in ('pendiente', 'aprobado', 'rechazado')),
  created_at  timestamptz not null default now(),
  decided_at  timestamptz,
  decided_by  uuid references auth.users(id)
);

create index if not exists panel_users_status_idx on public.panel_users (status);


-- -----------------------------------------------------------------------------
-- 2. FUNCIONES DE PERMISO
--
-- SECURITY DEFINER no es un detalle: sin él, una política sobre panel_users que
-- consulta panel_users se llama a sí misma y Postgres falla con recursión
-- infinita. Al correr como el dueño de la función, la consulta interna no vuelve
-- a pasar por las políticas.
--
-- search_path fijo para que nadie pueda anteponer un esquema propio y hacer que
-- la función lea otra tabla.
-- -----------------------------------------------------------------------------

create or replace function public.es_aprobado()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.panel_users
    where user_id = auth.uid() and status = 'aprobado'
  );
$$;

create or replace function public.es_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.panel_users
    where user_id = auth.uid() and status = 'aprobado' and role = 'owner'
  );
$$;

grant execute on function public.es_aprobado() to authenticated;
grant execute on function public.es_owner()    to authenticated;


-- -----------------------------------------------------------------------------
-- 3. AL REGISTRARSE, QUEDA EN ESPERA
--
-- El disparador corre cada vez que nace un usuario en auth.users. Crea su
-- solicitud automáticamente, así el navegador nunca decide en qué estado entra
-- alguien: lo decide la base de datos.
-- -----------------------------------------------------------------------------

create or replace function public.crear_solicitud_de_panel()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.panel_users (user_id, email, role, status)
  values (new.id, new.email, 'admin', 'pendiente')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_solicitud_de_panel();


-- -----------------------------------------------------------------------------
-- 4. SEGURIDAD DE LA TABLA DE USUARIOS
--
-- Cada quien ve su propia solicitud, para saber si ya fue aprobada.
-- Solo un owner ve la lista completa y decide.
--
-- Nadie puede insertar a mano: la única vía es el disparador de arriba, que al
-- ser SECURITY DEFINER no pasa por estas políticas. Sin esa restricción alguien
-- podría crearse su propia fila ya aprobada.
-- -----------------------------------------------------------------------------

alter table public.panel_users enable row level security;

drop policy if exists "panel_users_ver_lo_propio_o_todo_si_owner" on public.panel_users;
create policy "panel_users_ver_lo_propio_o_todo_si_owner"
  on public.panel_users for select
  to authenticated
  using (user_id = auth.uid() or public.es_owner());

-- El owner no puede modificar su propia fila. Es una red de seguridad: si se
-- degradara o se rechazara a sí mismo por error, nadie quedaría para aprobar a
-- nadie y habría que arreglarlo a mano en Supabase.
drop policy if exists "panel_users_decidir_solo_owner" on public.panel_users;
create policy "panel_users_decidir_solo_owner"
  on public.panel_users for update
  to authenticated
  using (public.es_owner() and user_id <> auth.uid())
  with check (public.es_owner() and user_id <> auth.uid());


-- -----------------------------------------------------------------------------
-- 5. LAS MASCOTAS AHORA EXIGEN ESTAR APROBADO
--
-- Estas políticas reemplazan las de schema.sql, que solo pedían estar
-- autenticado. Se borran las viejas por nombre para que no queden dos políticas
-- activas: Postgres las combina con OR y la más permisiva ganaría.
-- -----------------------------------------------------------------------------

drop policy if exists "animals_insertar_autenticado"  on public.animals;
drop policy if exists "animals_actualizar_autenticado" on public.animals;
drop policy if exists "animals_borrar_autenticado"     on public.animals;

create policy "animals_insertar_aprobado"
  on public.animals for insert
  to authenticated
  with check (public.es_aprobado());

create policy "animals_actualizar_aprobado"
  on public.animals for update
  to authenticated
  using (public.es_aprobado())
  with check (public.es_aprobado());

create policy "animals_borrar_aprobado"
  on public.animals for delete
  to authenticated
  using (public.es_aprobado());


-- -----------------------------------------------------------------------------
-- 6. LAS FOTOS TAMBIÉN
-- -----------------------------------------------------------------------------

drop policy if exists "mascotas_subir_autenticado"      on storage.objects;
drop policy if exists "mascotas_actualizar_autenticado"  on storage.objects;
drop policy if exists "mascotas_borrar_autenticado"      on storage.objects;

create policy "mascotas_subir_aprobado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'mascotas' and public.es_aprobado());

create policy "mascotas_actualizar_aprobado"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'mascotas' and public.es_aprobado())
  with check (bucket_id = 'mascotas' and public.es_aprobado());

create policy "mascotas_borrar_aprobado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'mascotas' and public.es_aprobado());


-- -----------------------------------------------------------------------------
-- 7. LA PRIMERA DUEÑA
--
-- La cuenta que ya existía queda como owner aprobada. Sin este paso nadie
-- podría aprobar a nadie y el panel quedaría cerrado para todos.
--
-- Si algún día hay que rehacer el proyecto desde cero, cambia el correo por el
-- de quien deba quedar al mando.
-- -----------------------------------------------------------------------------

insert into public.panel_users (user_id, email, role, status, decided_at)
select id, email, 'owner', 'aprobado', now()
from auth.users
where email = 'kaliastz88@gmail.com'
on conflict (user_id) do update
  set role = 'owner', status = 'aprobado', decided_at = now();


-- =============================================================================
-- LISTO.
--
-- Falta cambiar dos ajustes en Supabase → Authentication → Providers → Email:
--
--   a) ACTIVAR "Enable sign ups"
--      Sin esto nadie puede registrarse. Ahora es seguro tenerlo abierto:
--      registrarse ya no da permiso a nada hasta que un owner apruebe.
--
--   b) DESACTIVAR "Confirm email"
--      El correo de confirmación no aporta seguridad aquí, porque el permiso lo
--      da la aprobación y no el correo. Y el servidor de correo que Supabase da
--      gratis solo entrega a miembros del proyecto, así que a las voluntarias
--      nunca les llegaría el mensaje y se quedarían trabadas.
-- =============================================================================
