-- =============================================================================
-- Adopta un Olvidado — finales felices
--
-- Se corre DESPUÉS de schema.sql.
--
-- Un perro adoptado tiene dos fotos que cuentan cosas distintas: la del rescate,
-- que es con la que buscó hogar, y la de su nueva familia. Las dos juntas son la
-- prueba de que esto funciona, y es lo que convence a quien duda si adoptar.
--
-- Por eso la foto de la familia va en columnas propias en vez de reemplazar a
-- la original. Sobrescribirla perdería el "antes" para siempre, y el antes es
-- justo la mitad de la historia.
--
-- UNA FOTO DE FAMILIA POR PERRO. Una galería de varias sería más rica, pero
-- necesita su propia tabla con orden y borrado individual. Si hace falta se
-- agrega después sin tirar nada de esto.
--
-- Es seguro correrlo más de una vez.
-- =============================================================================

alter table public.animals
  add column if not exists foto_familia      text not null default '',
  add column if not exists foto_familia_path text not null default '',
  add column if not exists foto_familia_pos  text not null default '50% 50%',
  add column if not exists historia_final    text not null default '',
  add column if not exists fecha_adopcion    text not null default '';

comment on column public.animals.foto_familia is
  'URL pública de la foto con su nueva familia. La del rescate sigue en "photo".';
comment on column public.animals.foto_familia_path is
  'Ruta en el almacenamiento, para poder borrarla al reemplazarla.';
comment on column public.animals.historia_final is
  'Cómo le va en su nuevo hogar. Se muestra en la página de Finales felices.';
comment on column public.animals.fecha_adopcion is
  'Texto libre, por ejemplo "marzo de 2026". Libre a propósito: muchas veces solo se recuerda el mes.';

-- No hace falta tocar políticas: las de schema.sql y usuarios-del-panel.sql
-- aplican a la fila entera, así que las columnas nuevas nacen protegidas igual
-- que el resto.
