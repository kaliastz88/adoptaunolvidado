-- =============================================================================
-- Adopta un Olvidado — esquema completo de base de datos y almacenamiento
--
-- CÓMO USARLO:
--   1. Entra a tu proyecto en https://supabase.com
--   2. Menú lateral → SQL Editor → New query
--   3. Copia y pega TODO este archivo
--   4. Presiona Run (o Cmd+Enter)
--
-- Es seguro correrlo más de una vez: no duplica nada ni borra tus datos.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. TABLA DE ANIMALES
--
-- Los nombres de las columnas coinciden exactamente con los campos que ya usa
-- el formulario del panel, para no tener que traducir nada entre el navegador
-- y la base de datos.
--
-- La foto se guarda en DOS columnas a propósito:
--   photo      = la URL pública, que es lo que muestra el sitio
--   photo_path = la ruta interna del archivo dentro del almacenamiento
-- Sin photo_path no habría forma de borrar la foto anterior al reemplazarla,
-- y el almacenamiento se llenaría de archivos huérfanos que igual se cobran.
-- -----------------------------------------------------------------------------

create table if not exists public.animals (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text        not null,
  species     text        not null default 'Perro',
  age         text        not null default '',
  size        text        not null default 'Mediano',
  status      text        not null default 'Disponible',
  energy      text        not null default 'Media',
  compat      text        not null default '',
  bio         text        not null default '',
  photo       text        not null default '',
  photo_path  text        not null default ''
);

-- Ordenar el catálogo por fecha es la consulta más frecuente del sitio.
create index if not exists animals_created_at_idx
  on public.animals (created_at desc);


-- -----------------------------------------------------------------------------
-- 2. SEGURIDAD DE LA TABLA (Row Level Security)
--
-- Esto es lo que hace que sea seguro publicar la clave "anon" en el código del
-- sitio. Sin estas políticas, cualquiera con la clave podría borrar la tabla.
--
--   Leer      → cualquiera, incluso sin iniciar sesión (el catálogo es público)
--   Escribir  → solo un usuario que inició sesión en el panel
-- -----------------------------------------------------------------------------

alter table public.animals enable row level security;

drop policy if exists "animals_lectura_publica" on public.animals;
create policy "animals_lectura_publica"
  on public.animals for select
  using (true);

drop policy if exists "animals_insertar_autenticado" on public.animals;
create policy "animals_insertar_autenticado"
  on public.animals for insert
  to authenticated
  with check (true);

drop policy if exists "animals_actualizar_autenticado" on public.animals;
create policy "animals_actualizar_autenticado"
  on public.animals for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "animals_borrar_autenticado" on public.animals;
create policy "animals_borrar_autenticado"
  on public.animals for delete
  to authenticated
  using (true);


-- -----------------------------------------------------------------------------
-- 3. ALMACENAMIENTO DE FOTOS
--
-- Un bucket público llamado "mascotas". Público significa que las imágenes se
-- pueden ver por URL sin iniciar sesión, que es justo lo que necesita el sitio.
-- NO significa que cualquiera pueda subir o borrar: eso lo controlan las
-- políticas de abajo.
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('mascotas', 'mascotas', true)
on conflict (id) do update set public = true;

drop policy if exists "mascotas_lectura_publica" on storage.objects;
create policy "mascotas_lectura_publica"
  on storage.objects for select
  using (bucket_id = 'mascotas');

drop policy if exists "mascotas_subir_autenticado" on storage.objects;
create policy "mascotas_subir_autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'mascotas');

drop policy if exists "mascotas_actualizar_autenticado" on storage.objects;
create policy "mascotas_actualizar_autenticado"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'mascotas')
  with check (bucket_id = 'mascotas');

drop policy if exists "mascotas_borrar_autenticado" on storage.objects;
create policy "mascotas_borrar_autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'mascotas');


-- -----------------------------------------------------------------------------
-- 4. DATOS DE EJEMPLO
--
-- Son los seis perros que hasta ahora estaban escritos a mano dentro del
-- catálogo. Sirven para que el sitio no arranque vacío y para poder probar los
-- filtros. Bórralos cuando cargues los animales reales.
--
-- Solo se insertan si la tabla está completamente vacía, así que volver a
-- correr este archivo nunca te va a duplicar registros.
-- -----------------------------------------------------------------------------

insert into public.animals (name, species, age, size, status, energy, compat, bio)
select *
from (values
  ('Kiwi',      'Perro', '3–5 meses', 'Pequeño', 'Disponible', 'Alta',  'Niños, otros perros', 'Rescatado en la calle, muy juguetón y sociable.'),
  ('Melón',     'Perro', '1–5 años',  'Mediano', 'Disponible', 'Media', 'Niños',               'Llegó muy asustado y hoy es el primero en saludar a todos.'),
  ('Sienna',    'Perro', '1 año',     'Grande',  'Disponible', 'Media', 'Niños',               'Tranquila y cariñosa, ideal para familias.'),
  ('Barcelona', 'Gato',  '5–8 años',  'Mediano', 'Adoptado',   'Baja',  'Adultos solos',       'Le gusta la tranquilidad y las siestas largas.'),
  ('Carmina',   'Perro', '4 años',    'Pequeño', 'En proceso', 'Alta',  'Niños, otros perros', 'Pequeña, veloz y convencida de que cabe en cualquier regazo.'),
  ('Snow',      'Perro', 'Senior',    'Grande',  'Adoptado',   'Baja',  'Adultos solos',       'Pasó sus últimos años de calle esperando; hoy duerme en un sillón.')
) as seed (name, species, age, size, status, energy, compat, bio)
where not exists (select 1 from public.animals);


-- =============================================================================
-- LISTO.
--
-- Lo que falta hacer a mano en el panel de Supabase:
--
--   a) Authentication → Users → Add user → Create new user
--      Tu correo, tu contraseña, y activa "Auto Confirm User".
--      Ese será el único usuario que puede entrar al panel de administración.
--
--   b) Authentication → Providers → Email → desactiva "Enable sign ups"
--      Sin esto, cualquiera podría registrarse solo y darse acceso al panel.
-- =============================================================================
