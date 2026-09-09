-- =============================================================================
-- Adopta un Olvidado — apadrinamientos
--
-- Se corre DESPUÉS de solicitudes-de-adopcion.sql, porque reutiliza
-- enviar_correo_a_admins y plantilla_correo.
--
-- QUÉ CAMBIA RESPECTO A UNA DONACIÓN:
-- Apadrinar va ligado a UN perro concreto. Esa es toda la diferencia y es la
-- razón de que exista esta tabla en vez de tratarlo como un donativo mensual
-- más: sin saber a quién apadrina cada persona, no hay forma de mandarle
-- noticias de su ahijado, que es justo lo que el sitio promete.
--
-- animal_nombre guarda una copia del nombre, igual que en las adopciones: si el
-- perro se borra, el apadrinamiento sigue teniendo sentido para el equipo.
--
-- Es seguro correrlo más de una vez.
-- =============================================================================

create table if not exists public.sponsorship_requests (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  animal_id      uuid references public.animals(id) on delete set null,
  animal_nombre  text not null default '',

  nombre         text not null,
  correo         text not null,
  telefono       text not null default '',
  ciudad         text not null default '',

  monto          text not null default '',
  mensaje        text not null default '',

  estado         text not null default 'nueva' check (estado in ('nueva', 'en contacto', 'activo', 'cancelado')),
  notas          text not null default '',

  constraint apadrinamiento_de_tamano_razonable check (
    length(nombre) between 1 and 140
    and length(correo) between 3 and 160
    and length(mensaje) <= 2000
    and length(notas) <= 4000
  )
);

create index if not exists sponsorship_created_idx on public.sponsorship_requests (created_at desc);


-- -----------------------------------------------------------------------------
-- SEGURIDAD
--
-- Igual que adopciones y alianzas: escribe cualquiera, lee solo el equipo
-- aprobado. Insertar sin .select(), porque el público no tiene lectura.
-- -----------------------------------------------------------------------------

alter table public.sponsorship_requests enable row level security;

drop policy if exists "apadrinar_enviar_publico" on public.sponsorship_requests;
create policy "apadrinar_enviar_publico"
  on public.sponsorship_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "apadrinar_leer_aprobado" on public.sponsorship_requests;
create policy "apadrinar_leer_aprobado"
  on public.sponsorship_requests for select
  to authenticated
  using (public.es_aprobado());

drop policy if exists "apadrinar_actualizar_aprobado" on public.sponsorship_requests;
create policy "apadrinar_actualizar_aprobado"
  on public.sponsorship_requests for update
  to authenticated
  using (public.es_aprobado())
  with check (public.es_aprobado());

drop policy if exists "apadrinar_borrar_aprobado" on public.sponsorship_requests;
create policy "apadrinar_borrar_aprobado"
  on public.sponsorship_requests for delete
  to authenticated
  using (public.es_aprobado());


-- -----------------------------------------------------------------------------
-- AVISO AL EQUIPO
-- -----------------------------------------------------------------------------

create or replace function public.avisar_apadrinamiento()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  begin
    perform public.enviar_correo_a_admins(
      'Alguien quiere apadrinar a ' || coalesce(nullif(new.animal_nombre, ''), 'un rescatado'),
      public.plantilla_correo(
        'Nuevo apadrinamiento',
        '<p style="font-size:15px;line-height:1.6"><b>' || new.nombre || '</b> quiere apadrinar a <b>'
          || coalesce(nullif(new.animal_nombre, ''), 'un rescatado') || '</b>.</p>'
          '<table style="font-size:14px;line-height:1.8;border-collapse:collapse">'
          '<tr><td style="color:#6b7280;padding-right:16px">Aporte mensual</td><td>' || coalesce(nullif(new.monto, ''), 'por definir') || '</td></tr>'
          '<tr><td style="color:#6b7280;padding-right:16px">Correo</td><td>' || new.correo || '</td></tr>'
          '<tr><td style="color:#6b7280;padding-right:16px">Teléfono</td><td>' || coalesce(nullif(new.telefono, ''), '—') || '</td></tr>'
          '<tr><td style="color:#6b7280;padding-right:16px">Ciudad</td><td>' || coalesce(nullif(new.ciudad, ''), '—') || '</td></tr>'
          '</table>'
          '<p style="font-size:15px;line-height:1.6">Hay que contactarle para acordar cómo hará el aporte. '
          'Mientras tanto, quedó registrado a quién apadrina, para poder mandarle noticias.</p>',
        'Ver el apadrinamiento'
      )
    );
  exception when others then
    raise warning 'No se pudo encolar el aviso de apadrinamiento de %: %', new.correo, sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists al_recibir_apadrinamiento_avisar on public.sponsorship_requests;
create trigger al_recibir_apadrinamiento_avisar
  after insert on public.sponsorship_requests
  for each row execute function public.avisar_apadrinamiento();


-- =============================================================================
-- NOTA SOBRE EL COBRO
--
-- Esta tabla registra la INTENCIÓN de apadrinar, no un cobro. Mientras Mercado
-- Pago no esté conectado, el equipo contacta a la persona para acordar cómo
-- hacer el aporte. Cuando existan las suscripciones, el formulario podrá
-- mandarla directo al cobro y esta tabla seguirá sirviendo para saber quién
-- apadrina a quién, que es su verdadera razón de ser.
-- =============================================================================
