-- =============================================================================
-- Adopta un Olvidado — punto de enfoque de cada foto
--
-- Se corre DESPUÉS de schema.sql.
--
-- La tarjeta del catálogo recorta la foto a un rectángulo fijo. Recortaba
-- siempre desde el centro, y en las fotos verticales, que son casi todas porque
-- se toman con el celular, eso corta justo la cara del perro.
--
-- La solución no es recortar el archivo, porque entonces se pierde el resto de
-- la foto para siempre y no se puede rectificar. Se guarda dónde mirar, y cada
-- lugar donde aparece la imagen la encuadra según ese punto. El archivo queda
-- intacto y el encuadre se puede corregir cuantas veces haga falta.
--
-- El valor es un background-position de CSS: dos porcentajes, horizontal y
-- vertical. '50% 50%' es el centro; '50% 25%' mira hacia arriba.
--
-- Es seguro correrlo más de una vez.
-- =============================================================================

alter table public.animals
  add column if not exists photo_pos text not null default '50% 50%';

comment on column public.animals.photo_pos is
  'Punto de enfoque de la foto como background-position de CSS, por ejemplo "50% 25%".';
