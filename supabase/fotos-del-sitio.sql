-- =============================================================================
-- Adopta un Olvidado — fotos del sitio (álbumes)
--
-- Se corre DESPUÉS de usuarios-del-panel.sql, porque usa es_aprobado().
--
-- POR QUÉ EXISTE:
-- Las fotos de los perros viven en la tabla animals. Pero el sitio necesita
-- muchas otras: las cuatro fundadoras, los finales felices de perritos que se
-- adoptaron antes de que existiera el panel, voluntarios, logos de aliados,
-- la merch... Antes cada una obligaba a tocar el código. Ahora se suben desde
-- el panel, en la pestaña "Fotos", cada una en su álbum.
--
-- UN SOLO TIPO DE FILA PARA TODOS LOS ÁLBUMES. Cada foto trae un título, una
-- descripción y un enlace opcionales; cada página usa los que le sirven (la
-- fundadora usa título = nombre, el aliado usa enlace = su Instagram, etc.).
--
-- Las fotos se guardan en el mismo bucket "mascotas" que ya existe, así que no
-- hay que crear almacenamiento nuevo.
--
-- Es seguro correrlo más de una vez: no borra ni duplica nada.
-- =============================================================================

create table if not exists public.site_photos (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  album       text        not null,
  titulo      text        not null default '',
  descripcion text        not null default '',
  enlace      text        not null default '',
  photo       text        not null default '',
  photo_path  text        not null default '',
  photo_pos   text        not null default '50% 50%',
  orden       int         not null default 0
);

create index if not exists site_photos_album_idx
  on public.site_photos (album, orden, created_at);


-- -----------------------------------------------------------------------------
-- SEGURIDAD
--   Leer     → cualquiera (el sitio las muestra sin iniciar sesión)
--   Escribir → solo el equipo aprobado del panel
-- -----------------------------------------------------------------------------

alter table public.site_photos enable row level security;

drop policy if exists "fotos_lectura_publica" on public.site_photos;
create policy "fotos_lectura_publica"
  on public.site_photos for select
  using (true);

drop policy if exists "fotos_insertar_aprobado" on public.site_photos;
create policy "fotos_insertar_aprobado"
  on public.site_photos for insert
  to authenticated
  with check (public.es_aprobado());

drop policy if exists "fotos_actualizar_aprobado" on public.site_photos;
create policy "fotos_actualizar_aprobado"
  on public.site_photos for update
  to authenticated
  using (public.es_aprobado())
  with check (public.es_aprobado());

drop policy if exists "fotos_borrar_aprobado" on public.site_photos;
create policy "fotos_borrar_aprobado"
  on public.site_photos for delete
  to authenticated
  using (public.es_aprobado());


-- -----------------------------------------------------------------------------
-- TEXTOS QUE CAMBIARON (notas de la fundadora, noviembre 2026)
--
-- Estos textos ya existían en site_texts con el valor viejo, y el valor de la
-- base gana sobre el del código. Solo se actualizan si siguen EXACTAMENTE como
-- estaban: si alguien ya los editó desde el panel, se respeta su versión.
-- -----------------------------------------------------------------------------

update public.site_texts
   set valor = 'Síguenos en nuestras redes y sé parte de esta comunidad que trabaja para cambiar sus vidas.',
       updated_at = now()
 where clave = 'contacto.intro'
   and valor = 'La forma más rápida de encontrarnos es por Instagram, ahí contestamos todos los días.';

update public.site_texts
   set valor = 'Historias que comenzaron con abandono y encontraron un hogar, una familia y una nueva oportunidad. Porque rescatar es solo el comienzo. Gracias a los que confían en nosotras.',
       updated_at = now()
 where clave = 'historias.intro'
   and valor = 'Estas son algunas de las transformaciones que hemos acompañado. Rescatar es solo el comienzo.';

update public.site_texts
   set valor = 'En Adopta un Olvidado creemos que cambiar la vida de un perrito no es una tarea que podamos hacer solos. Hoy reconocemos a Hotel ThePupClub.mx, que abrió sus puertas como hogar temporal y espacio de rehabilitación para nuestros rescatados.',
       updated_at = now()
 where clave = 'home.aliados.texto'
   and valor = 'En Adopta un Olvidado creemos que cambiar la vida de un perrito no es una tarea que podamos hacer solos. Hoy reconocemos a Hotel PupuClub, que abrió sus puertas como hogar temporal y espacio de rehabilitación para nuestros rescatados.';


-- -----------------------------------------------------------------------------
-- TEXTO NUEVO: frase manuscrita sobre la foto de la portada
-- (rediseño de noviembre 2026). Se puede editar o dejar vacía desde el panel.
-- -----------------------------------------------------------------------------

insert into public.site_texts (clave, valor, seccion, etiqueta, ayuda, multilinea, orden) values
  ('home.frase', 'Ellos también sienten', 'Portada', 'Frase manuscrita sobre la foto', 'Va en letra manuscrita sobre la foto grande. Déjala vacía para quitarla.', false, 35)
on conflict (clave) do nothing;
