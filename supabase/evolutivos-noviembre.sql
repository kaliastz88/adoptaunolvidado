-- =============================================================================
-- Adopta un Olvidado — evolutivos de noviembre 2026
--
-- Se corre DESPUÉS de todos los demás archivos. Es seguro correrlo más de una
-- vez: no borra ni duplica datos.
--
-- Qué agrega:
--   1. Lista interna de alertas de adoptantes (pestaña «Alertas» del panel).
--   2. Copia automática de cada solicitud a un Google Sheet.      → APAGADA hasta
--   3. Correo de confirmación al adoptante.                        → activarla
--   4. Un arreglo de seguridad en las funciones de correo.
--
-- Lo 2 y lo 3 quedan instalados pero sin hacer nada hasta que se configuren
-- (ver «CÓMO ACTIVAR», al final). Mientras tanto no afectan nada.
-- =============================================================================

create extension if not exists pg_net;


-- -----------------------------------------------------------------------------
-- 1. ALERTAS DE ADOPTANTES
--
-- Registro interno de personas con las que una adopción no resultó bien. Solo
-- el equipo aprobado puede leerlo o escribirlo; el público no tiene ningún
-- permiso. NO se comparte con terceros (ver aviso de privacidad).
-- -----------------------------------------------------------------------------

create table if not exists public.adopter_alerts (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  nombre         text not null,
  correo         text not null default '',
  telefono       text not null default '',
  motivo         text not null,
  registrado_por text not null default coalesce(auth.jwt() ->> 'email', ''),
  solicitud_id   uuid references public.adoption_requests(id) on delete set null,
  constraint alerta_de_tamano_razonable check (
    length(nombre) between 1 and 120
    and length(correo) <= 160
    and length(telefono) <= 40
    and length(motivo) between 1 and 2000
  )
);

create index if not exists adopter_alerts_created_idx on public.adopter_alerts (created_at desc);

alter table public.adopter_alerts enable row level security;

drop policy if exists "alertas_leer_aprobado" on public.adopter_alerts;
create policy "alertas_leer_aprobado" on public.adopter_alerts
  for select to authenticated using (public.es_aprobado());

drop policy if exists "alertas_crear_aprobado" on public.adopter_alerts;
create policy "alertas_crear_aprobado" on public.adopter_alerts
  for insert to authenticated with check (public.es_aprobado());

drop policy if exists "alertas_editar_aprobado" on public.adopter_alerts;
create policy "alertas_editar_aprobado" on public.adopter_alerts
  for update to authenticated using (public.es_aprobado()) with check (public.es_aprobado());

drop policy if exists "alertas_borrar_aprobado" on public.adopter_alerts;
create policy "alertas_borrar_aprobado" on public.adopter_alerts
  for delete to authenticated using (public.es_aprobado());


-- -----------------------------------------------------------------------------
-- 2. AYUDANTES
-- -----------------------------------------------------------------------------

-- Lee un secreto del vault. Devuelve null si no existe o sigue con el texto de
-- ejemplo, así cada función sabe si su parte está configurada.
create or replace function public.leer_secreto(nombre_secreto text)
returns text
language sql
stable
security definer
set search_path = public, vault
as $$
  select nullif(nullif(decrypted_secret, ''), 'PENDIENTE')
  from vault.decrypted_secrets
  where name = nombre_secreto
  limit 1;
$$;

-- Escapa texto escrito por el público antes de meterlo en un correo HTML. Sin
-- esto, alguien podría escribir HTML en su nombre y alterar el correo.
create or replace function public.html_seguro(t text)
returns text
language sql
immutable
as $$
  select replace(replace(replace(replace(replace(coalesce(t, ''),
    '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;'), '''', '&#39;');
$$;

-- Remitente de los correos. Mientras no haya dominio verificado en Resend, se
-- usa el de prueba (que solo entrega a la dueña de la cuenta de Resend).
create or replace function public.remitente_correo()
returns text
language sql
stable
security definer
set search_path = public, vault
as $$
  select coalesce(public.leer_secreto('correo_remitente'), 'Adopta un Olvidado <onboarding@resend.dev>');
$$;


-- -----------------------------------------------------------------------------
-- 3. CORREOS
--
-- El aviso al equipo ahora usa el remitente configurado: en cuanto se verifique
-- el dominio, les llega a todas las personas aprobadas y no solo a la dueña de
-- la cuenta de Resend.
-- -----------------------------------------------------------------------------

create or replace function public.enviar_correo_a_admins(asunto text, cuerpo_html text)
returns text
language plpgsql
security definer
set search_path = public, net, vault, extensions
as $$
declare
  clave    text;
  persona  record;
  enviados int := 0;
begin
  clave := public.leer_secreto('resend_api_key');
  if clave is null or clave = 'CLAVE_DE_RESEND_AQUI' then
    return 'sin clave de Resend configurada';
  end if;

  for persona in
    select email from public.panel_users where status = 'aprobado'
  loop
    perform net.http_post(
      url     := 'https://api.resend.com/emails',
      headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || clave),
      body    := jsonb_build_object('from', public.remitente_correo(), 'to', jsonb_build_array(persona.email),
                                    'subject', asunto, 'html', cuerpo_html)
    );
    enviados := enviados + 1;
  end loop;

  if enviados = 0 then
    return 'no hay nadie aprobado a quien avisar';
  end if;
  return 'encolados: ' || enviados;
end;
$$;

-- Correo a una persona de fuera (el adoptante). SOLO se manda si hay un
-- remitente de dominio propio configurado: con el remitente de prueba Resend lo
-- rechazaría de todos modos.
create or replace function public.enviar_correo_a_persona(para text, asunto text, cuerpo_html text)
returns text
language plpgsql
security definer
set search_path = public, net, vault, extensions
as $$
declare
  clave text := public.leer_secreto('resend_api_key');
  remitente text := public.leer_secreto('correo_remitente');
begin
  if clave is null or clave = 'CLAVE_DE_RESEND_AQUI' then return 'sin clave de Resend'; end if;
  if remitente is null then return 'sin dominio propio configurado'; end if;
  if para is null or para !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return 'correo inválido'; end if;

  perform net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || clave),
    body    := jsonb_build_object('from', remitente, 'to', jsonb_build_array(para),
                                  'subject', asunto, 'html', cuerpo_html)
  );
  return 'encolado';
end;
$$;

-- Plantilla con los colores de la marca, para correos al público.
create or replace function public.plantilla_publica(titulo text, cuerpo text)
returns text
language sql
immutable
as $$
  select
    '<div style="background:#F8F2E8;padding:32px 16px;font-family:Helvetica,Arial,sans-serif">'
    '<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden">'
    '<div style="background:#082B5C;padding:20px 28px;border-bottom:3px solid #FFC328">'
    '<span style="color:#ffffff;font-size:18px;font-weight:bold">Adopta un Olvidado</span></div>'
    '<div style="padding:28px;color:#13213A">'
    '<h2 style="color:#082B5C;margin:0 0 16px;font-family:Georgia,serif;font-weight:normal">' || titulo || '</h2>'
    || cuerpo ||
    '<p style="margin:28px 0 0;font-size:15px;color:#082B5C">Con cariño,<br><b>Equipo Adopta un Olvidado</b></p>'
    '</div></div>'
    '<p style="text-align:center;font-size:12px;color:#6b7280;margin:16px 0 0">'
    'Instagram: <a href="https://www.instagram.com/adoptaunolvidadomx/" style="color:#082B5C">@adoptaunolvidadomx</a></p>'
    '</div>';
$$;

-- «Recibimos tu solicitud de adopción para Miguel…» — texto de la fundadora.
create or replace function public.confirmar_solicitud_de_adopcion()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  animal text := coalesce(nullif(public.html_seguro(new.animal_nombre), ''), 'uno de nuestros rescatados');
begin
  begin
    perform public.enviar_correo_a_persona(
      new.correo,
      'Recibimos tu solicitud de adopción para ' || coalesce(nullif(new.animal_nombre, ''), 'uno de nuestros rescatados'),
      public.plantilla_publica(
        '¡Gracias por tu solicitud!',
        '<p style="font-size:16px;line-height:1.6">Hola ' || public.html_seguro(new.nombre) || ',</p>'
        '<p style="font-size:16px;line-height:1.6">Recibimos tu solicitud de adopción para <b>' || animal || '</b>. '
        'Agradecemos mucho tu postulación.</p>'
        '<p style="font-size:16px;line-height:1.6">Revisaremos tu caso lo antes posible y nos comunicaremos '
        'contigo por este medio o por WhatsApp.</p>'
      )
    );
  exception when others then
    raise warning 'No se pudo encolar la confirmación para %: %', new.correo, sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists al_recibir_solicitud_confirmar on public.adoption_requests;
create trigger al_recibir_solicitud_confirmar
  after insert on public.adoption_requests
  for each row execute function public.confirmar_solicitud_de_adopcion();


-- -----------------------------------------------------------------------------
-- 4. COPIA AUTOMÁTICA A GOOGLE SHEETS
--
-- Cada vez que se crea, cambia o borra una solicitud (adopción, padrino o
-- alianza), la base manda la fila a un pequeño script de Google
-- (integraciones/google-sheets/Codigo.gs) que la escribe en el Sheet. Así el
-- Sheet siempre está al día, incluido el estado que el equipo cambia en el
-- panel.
--
-- Si falla (Google caído, script mal pegado), la solicitud se guarda igual:
-- el envío va en su propio bloque de excepciones y pg_net lo manda aparte.
-- -----------------------------------------------------------------------------

create or replace function public.enviar_a_sheets(tabla text, accion text, fila jsonb)
returns text
language plpgsql
security definer
set search_path = public, net, vault, extensions
as $$
declare
  url     text := public.leer_secreto('sheets_webhook_url');
  secreto text := public.leer_secreto('sheets_secreto');
begin
  if url is null or secreto is null then return 'Google Sheets sin configurar'; end if;
  perform net.http_post(
    url     := url,
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body    := jsonb_build_object('secreto', secreto, 'tabla', tabla, 'accion', accion, 'fila', fila)
  );
  return 'encolado';
end;
$$;

create or replace function public.copiar_a_sheets()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  begin
    if tg_op = 'DELETE' then
      perform public.enviar_a_sheets(tg_table_name, 'borrar', to_jsonb(old));
      return old;
    end if;
    perform public.enviar_a_sheets(tg_table_name, 'guardar', to_jsonb(new));
  exception when others then
    raise warning 'No se pudo copiar a Google Sheets (%): %', tg_table_name, sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists copiar_a_sheets on public.adoption_requests;
create trigger copiar_a_sheets after insert or update or delete on public.adoption_requests
  for each row execute function public.copiar_a_sheets();

drop trigger if exists copiar_a_sheets on public.sponsorship_requests;
create trigger copiar_a_sheets after insert or update or delete on public.sponsorship_requests
  for each row execute function public.copiar_a_sheets();

drop trigger if exists copiar_a_sheets on public.ally_requests;
create trigger copiar_a_sheets after insert or update or delete on public.ally_requests
  for each row execute function public.copiar_a_sheets();

-- Para mandar al Sheet todo lo que ya existía antes de conectarlo. Se corre a
-- mano una sola vez:   select public.enviar_todo_a_sheets();
create or replace function public.enviar_todo_a_sheets()
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  r record;
  n int := 0;
begin
  if public.leer_secreto('sheets_webhook_url') is null then return 'Google Sheets sin configurar'; end if;
  for r in select to_jsonb(t) as f from public.adoption_requests t order by created_at loop
    perform public.enviar_a_sheets('adoption_requests', 'guardar', r.f); n := n + 1;
  end loop;
  for r in select to_jsonb(t) as f from public.sponsorship_requests t order by created_at loop
    perform public.enviar_a_sheets('sponsorship_requests', 'guardar', r.f); n := n + 1;
  end loop;
  for r in select to_jsonb(t) as f from public.ally_requests t order by created_at loop
    perform public.enviar_a_sheets('ally_requests', 'guardar', r.f); n := n + 1;
  end loop;
  return 'encoladas: ' || n;
end;
$$;


-- -----------------------------------------------------------------------------
-- 5. SEGURIDAD: nadie de fuera puede llamar estas funciones
--
-- En Supabase, toda función del esquema public se puede llamar desde internet
-- con la clave pública del sitio. Sin esto, cualquiera podría leer los
-- secretos, mandar correos a nombre de Adopta o llenar el Sheet de basura.
-- Los disparadores siguen funcionando porque corren con permisos de la base.
-- -----------------------------------------------------------------------------

revoke execute on function public.leer_secreto(text)                          from public, anon, authenticated;
revoke execute on function public.remitente_correo()                          from public, anon, authenticated;
revoke execute on function public.enviar_correo_a_admins(text, text)          from public, anon, authenticated;
revoke execute on function public.enviar_correo_a_persona(text, text, text)   from public, anon, authenticated;
revoke execute on function public.enviar_a_sheets(text, text, jsonb)          from public, anon, authenticated;
revoke execute on function public.enviar_todo_a_sheets()                      from public, anon, authenticated;


-- =============================================================================
-- CÓMO ACTIVAR (más adelante, cuando esté cada cosa)
--
-- A) GOOGLE SHEETS — cuando exista el Sheet y su script (ver
--    integraciones/google-sheets/LEEME.md). Reemplaza los dos valores y corre:
--
--   select vault.create_secret('https://script.google.com/macros/s/.../exec', 'sheets_webhook_url');
--   select vault.create_secret('LA-MISMA-CLAVE-QUE-PUSISTE-EN-EL-SCRIPT', 'sheets_secreto');
--   select public.enviar_todo_a_sheets();   -- copia lo que ya existía
--
-- B) CORREO DE CONFIRMACIÓN — cuando el dominio esté verificado en Resend.
--    Reemplaza el dominio y corre:
--
--   select vault.create_secret('Adopta un Olvidado <hola@TU-DOMINIO>', 'correo_remitente');
--
-- Si un secreto ya existe y quieres cambiarlo, primero bórralo:
--   delete from vault.secrets where name = 'sheets_webhook_url';
-- =============================================================================
