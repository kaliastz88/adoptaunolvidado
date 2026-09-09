-- =============================================================================
-- Adopta un Olvidado — información de salud de cada animal
--
-- Se corre DESPUÉS de schema.sql.
--
-- La presentación de adoptables que lleva el equipo registra dos datos que la
-- tabla original no contemplaba, y son de los primeros que pregunta quien va a
-- adoptar: si ya está vacunado y esterilizado, y si tiene alguna condición
-- médica. Guardarlos en su propia columna, en vez de mezclarlos con la
-- historia, permite mostrarlos como ficha y algún día filtrar por ellos.
--
-- Es seguro correrlo más de una vez.
-- =============================================================================

alter table public.animals
  add column if not exists salud          text not null default '',
  add column if not exists estatus_medico text not null default '';

comment on column public.animals.salud is
  'Protocolo de salud: vacunación, esterilización, desparasitación.';
comment on column public.animals.estatus_medico is
  'Condición médica actual. "Saludable" o el padecimiento que tenga.';

-- No hace falta tocar las políticas: las de schema.sql y usuarios-del-panel.sql
-- aplican a la fila completa, así que las columnas nuevas quedan protegidas
-- igual que el resto desde el momento en que existen.
