-- =============================================================================
-- Adopta un Olvidado — textos editables del sitio
--
-- Se corre DESPUÉS de usuarios-del-panel.sql, porque usa es_aprobado().
--
-- POR QUÉ EXISTE:
-- Cambiar una frase de la portada obligaba a tocar el código y volver a
-- publicar. Ahora los textos que suelen cambiar viven aquí y se editan desde el
-- panel, sin programar nada.
--
-- NO ES UN GESTOR DE CONTENIDO COMPLETO, y eso es a propósito. Solo están los
-- textos que de verdad cambian: títulos, presentaciones, cifras de impacto y
-- datos de contacto. La estructura de las páginas sigue en el código, donde no
-- se puede romper por accidente.
--
-- CADA TEXTO TIENE UN VALOR POR DEFECTO EN EL CÓDIGO. Si esta tabla no carga,
-- por lo que sea, el sitio se ve exactamente igual que hoy. La base mejora el
-- sitio, no lo sostiene.
--
-- Es seguro correrlo más de una vez: no pisa lo que ya se haya editado.
-- =============================================================================

create table if not exists public.site_texts (
  clave       text primary key,
  valor       text not null default '',
  seccion     text not null default '',
  etiqueta    text not null default '',
  ayuda       text not null default '',
  multilinea  boolean not null default false,
  orden       int not null default 0,
  updated_at  timestamptz not null default now()
);


-- -----------------------------------------------------------------------------
-- SEGURIDAD
--
-- Lectura pública: el sitio los necesita sin que nadie inicie sesión.
-- Escritura: solo el equipo aprobado. No se permite insertar ni borrar filas
-- desde el navegador, únicamente cambiar el valor de las que existen: la lista
-- de textos editables la define el código, no quien usa el panel.
-- -----------------------------------------------------------------------------

alter table public.site_texts enable row level security;

drop policy if exists "textos_lectura_publica" on public.site_texts;
create policy "textos_lectura_publica"
  on public.site_texts for select
  using (true);

drop policy if exists "textos_editar_aprobado" on public.site_texts;
create policy "textos_editar_aprobado"
  on public.site_texts for update
  to authenticated
  using (public.es_aprobado())
  with check (public.es_aprobado());


-- -----------------------------------------------------------------------------
-- LOS TEXTOS
--
-- El "on conflict do update" solo refresca las etiquetas y el orden, nunca el
-- valor. Así se puede volver a correr este archivo para agregar textos nuevos
-- sin borrar lo que el equipo ya haya escrito.
-- -----------------------------------------------------------------------------

insert into public.site_texts (clave, valor, seccion, etiqueta, ayuda, multilinea, orden) values

  ('home.eyebrow', 'Rescate · rehabilitación · adopción responsable', 'Portada', 'Línea pequeña de arriba', 'Aparece en mayúsculas sobre el título principal.', false, 10),
  ('home.titulo', 'Un gesto tuyo puede ser el comienzo de su historia feliz.', 'Portada', 'Título principal', 'Lo primero que se lee al entrar al sitio.', true, 20),
  ('home.subtitulo', 'Rescatamos, rehabilitamos y encontramos el hogar correcto para cada perrito olvidado.', 'Portada', 'Frase de presentación', '', true, 30),
  ('home.stat1.valor', '+60', 'Portada', 'Cifra 1', 'Ej. +60', false, 40),
  ('home.stat1.etiqueta', 'perritos con hogar', 'Portada', 'Texto de la cifra 1', '', false, 50),
  ('home.stat2.valor', '4', 'Portada', 'Cifra 2', '', false, 60),
  ('home.stat2.etiqueta', 'fundadoras', 'Portada', 'Texto de la cifra 2', '', false, 70),
  ('home.stat3.valor', '100%', 'Portada', 'Cifra 3', '', false, 80),
  ('home.stat3.etiqueta', 'adopción responsable', 'Portada', 'Texto de la cifra 3', '', false, 90),
  ('home.aliados.titulo', 'Las grandes historias comienzan con una alianza.', 'Portada', 'Título de la sección de aliados', '', true, 100),
  ('home.aliados.texto', 'En Adopta un Olvidado creemos que cambiar la vida de un perrito no es una tarea que podamos hacer solos. Hoy reconocemos a Hotel PupuClub, que abrió sus puertas como hogar temporal y espacio de rehabilitación para nuestros rescatados.', 'Portada', 'Texto de la sección de aliados', 'Aquí se menciona a las marcas aliadas.', true, 110),

  ('catalogo.titulo', 'Cada uno espera su segunda oportunidad', 'Adopta', 'Título del catálogo', '', true, 10),
  ('catalogo.subtitulo', 'Filtra por especie y tamaño para encontrar a tu nuevo compañero de vida.', 'Adopta', 'Frase de presentación', '', true, 20),

  ('apadrina.titulo', 'Acompaña una historia hasta su final feliz.', 'Apadrina', 'Título', '', true, 10),
  ('apadrina.intro', 'Cuando apadrinas a uno de nuestros rescatados, te conviertes en parte de su camino: desde su recuperación hasta el momento en que encuentra una familia que lo ame para siempre.', 'Apadrina', 'Frase de presentación', '', true, 20),

  ('donar.titulo', 'Tu donación es el primer paso de su nueva vida.', 'Donar', 'Título', '', true, 10),
  ('donar.intro', 'Cada aporte se convierte en atención médica, alimento y un lugar seguro donde sanar. Así es como tu ayuda se transforma en una historia feliz.', 'Donar', 'Frase de presentación', '', true, 20),

  ('historias.titulo', 'Cada adopción cambia dos vidas.', 'Historias', 'Título', '', true, 10),
  ('historias.intro', 'Estas son algunas de las transformaciones que hemos acompañado. Rescatar es solo el comienzo.', 'Historias', 'Frase de presentación', '', true, 20),

  ('contacto.intro', 'La forma más rápida de encontrarnos es por Instagram, ahí contestamos todos los días.', 'Contacto', 'Frase de presentación', '', true, 10),
  ('contacto.correo', '', 'Contacto', 'Correo de contacto', 'Déjalo vacío si no quieres publicarlo. Vacío significa que no aparece en el sitio.', false, 20),
  ('contacto.telefono', '', 'Contacto', 'Teléfono o WhatsApp', 'Déjalo vacío si no quieres publicarlo.', false, 30),
  ('contacto.ciudad', 'Ciudad de México', 'Contacto', 'Ciudad', '', false, 40)

on conflict (clave) do update set
  seccion    = excluded.seccion,
  etiqueta   = excluded.etiqueta,
  ayuda      = excluded.ayuda,
  multilinea = excluded.multilinea,
  orden      = excluded.orden;
