-- =============================================================================
-- Adopta un Olvidado — solicitudes de alianza con marcas
--
-- Se corre DESPUÉS de solicitudes-de-adopcion.sql, porque reutiliza las
-- funciones enviar_correo_a_admins y plantilla_correo que ese archivo define.
--
-- Mismo planteamiento que las solicitudes de adopción: el formulario es público
-- y cualquiera puede enviarlo sin cuenta, pero los datos de contacto solo los
-- ve el equipo con acceso aprobado.
--
-- Es seguro correrlo más de una vez.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. LA SOLICITUD
-- -----------------------------------------------------------------------------

create table if not exists public.ally_requests (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),

  marca        text not null,
  giro         text not null default '',
  sitio        text not null default '',

  contacto     text not null,
  puesto       text not null default '',
  correo       text not null,
  telefono     text not null default '',
  ciudad       text not null default '',

  -- Varias formas de participar a la vez, unidas por comas. Se guarda como
  -- texto y no como arreglo porque solo hay que mostrarlo y contactar a la
  -- marca; un arreglo complicaría el formulario sin dar nada a cambio.
  formas       text not null default '',
  mensaje      text not null default '',

  estado       text not null default 'nueva' check (estado in ('nueva', 'en conversación', 'aliada', 'descartada')),
  notas        text not null default '',

  constraint alianza_de_tamano_razonable check (
    length(marca) between 1 and 140
    and length(contacto) between 1 and 140
    and length(correo) between 3 and 160
    and length(mensaje) <= 2000
    and length(notas) <= 4000
  )
);

create index if not exists ally_requests_created_idx on public.ally_requests (created_at desc);


-- -----------------------------------------------------------------------------
-- 2. SEGURIDAD
--
-- Escribir: cualquiera, incluso sin cuenta. Es un formulario público.
-- Leer: solo quien está aprobado. Cada fila trae el correo y el teléfono de una
-- persona real que trabaja en esa marca.
--
-- Al programar contra esta tabla hay que insertar sin .select(), porque el
-- público no tiene permiso de lectura y pedir de vuelta la fila insertada haría
-- fallar un envío que en realidad se guardó bien.
-- -----------------------------------------------------------------------------

alter table public.ally_requests enable row level security;

drop policy if exists "alianzas_enviar_publico" on public.ally_requests;
create policy "alianzas_enviar_publico"
  on public.ally_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "alianzas_leer_aprobado" on public.ally_requests;
create policy "alianzas_leer_aprobado"
  on public.ally_requests for select
  to authenticated
  using (public.es_aprobado());

drop policy if exists "alianzas_actualizar_aprobado" on public.ally_requests;
create policy "alianzas_actualizar_aprobado"
  on public.ally_requests for update
  to authenticated
  using (public.es_aprobado())
  with check (public.es_aprobado());

drop policy if exists "alianzas_borrar_aprobado" on public.ally_requests;
create policy "alianzas_borrar_aprobado"
  on public.ally_requests for delete
  to authenticated
  using (public.es_aprobado());


-- -----------------------------------------------------------------------------
-- 3. AVISO AL EQUIPO
--
-- Igual que en adopciones, el envío va envuelto en un bloque que captura
-- cualquier error. El disparador corre dentro de la transacción que guarda la
-- solicitud: si fallara sin capturarlo, la marca vería que su mensaje no se
-- envió cuando lo único que pasó fue que el correo no salió.
-- -----------------------------------------------------------------------------

create or replace function public.avisar_solicitud_de_alianza()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  begin
    perform public.enviar_correo_a_admins(
      'Una marca quiere aliarse: ' || new.marca,
      public.plantilla_correo(
        'Nueva solicitud de alianza',
        '<p style="font-size:15px;line-height:1.6"><b>' || new.marca || '</b> quiere aliarse '
          'con Adopta un Olvidado.</p>'
          '<table style="font-size:14px;line-height:1.8;border-collapse:collapse">'
          '<tr><td style="color:#6b7280;padding-right:16px">Contacto</td><td>' || new.contacto
            || coalesce(nullif(', ' || new.puesto, ', '), '') || '</td></tr>'
          '<tr><td style="color:#6b7280;padding-right:16px">Correo</td><td>' || new.correo || '</td></tr>'
          '<tr><td style="color:#6b7280;padding-right:16px">Teléfono</td><td>' || coalesce(nullif(new.telefono, ''), '—') || '</td></tr>'
          '<tr><td style="color:#6b7280;padding-right:16px">Giro</td><td>' || coalesce(nullif(new.giro, ''), '—') || '</td></tr>'
          '<tr><td style="color:#6b7280;padding-right:16px">Cómo quiere ayudar</td><td>' || coalesce(nullif(new.formas, ''), '—') || '</td></tr>'
          '</table>'
          '<p style="font-size:15px;line-height:1.6">Entra al panel para leer su mensaje completo.</p>',
        'Ver la solicitud'
      )
    );
  exception when others then
    raise warning 'No se pudo encolar el aviso de alianza de %: %', new.marca, sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists al_recibir_alianza_avisar on public.ally_requests;
create trigger al_recibir_alianza_avisar
  after insert on public.ally_requests
  for each row execute function public.avisar_solicitud_de_alianza();


-- =============================================================================
-- LISTO.
--
-- El aviso se manda a todas las personas aprobadas del panel, pero mientras
-- Resend use el remitente de prueba 'onboarding@resend.dev' solo se entrega al
-- correo dueño de la cuenta de Resend. Para que le llegue a todo el equipo hay
-- que verificar un dominio propio y cambiar el 'from' en enviar_correo_a_admins.
-- =============================================================================
