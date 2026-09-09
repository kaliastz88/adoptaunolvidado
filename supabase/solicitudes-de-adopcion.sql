-- =============================================================================
-- Adopta un Olvidado — solicitudes de adopción
--
-- Se corre DESPUÉS de usuarios-del-panel.sql y aviso-por-correo.sql.
--
-- Además de crear la tabla, este archivo reescribe la función que avisa de las
-- solicitudes de acceso, para que las dos clases de aviso compartan el mismo
-- código de envío en vez de tener dos copias que se desincronicen.
--
-- Es seguro correrlo más de una vez.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. LA SOLICITUD
--
-- animal_id se pone en null si el animal se borra, pero animal_nombre guarda una
-- copia del nombre. Sin esa copia, borrar a un perro dejaría solicitudes
-- huérfanas sin forma de saber por quién habían preguntado.
--
-- Los límites de largo no son cosmética. Cualquiera en internet puede insertar
-- aquí sin tener cuenta, que es justo lo que queremos, así que conviene que
-- nadie pueda volcar megabytes de texto en un solo envío.
-- -----------------------------------------------------------------------------

create table if not exists public.adoption_requests (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  animal_id      uuid references public.animals(id) on delete set null,
  animal_nombre  text not null default '',

  -- Contacto
  nombre         text not null,
  edad           text not null default '',
  correo         text not null,
  telefono       text not null,
  ciudad         text not null default '',

  -- Vivienda
  vivienda       text not null default '',
  propiedad      text not null default '',
  permiso_renta  text not null default '',
  patio          text not null default '',
  protegido      text not null default '',

  -- Quiénes viven ahí
  personas       text not null default '',
  ninos          text not null default '',
  acuerdo        text not null default '',
  alergias       text not null default '',

  -- Otras mascotas
  otras_mascotas text not null default '',
  esterilizadas  text not null default '',
  mascotas_antes text not null default '',

  -- Compromiso
  responsable    text not null default '',
  horas_solo     text not null default '',
  donde_duerme   text not null default '',
  si_te_mudas    text not null default '',
  gastos         text not null default '',
  esteriliza     text not null default '',
  seguimiento    text not null default '',
  motivo         text not null default '',

  -- Seguimiento interno del equipo
  estado         text not null default 'nueva' check (estado in ('nueva', 'en revisión', 'aprobada', 'rechazada')),
  notas          text not null default '',

  constraint solicitud_de_tamano_razonable check (
    length(nombre) between 1 and 120
    and length(correo) between 3 and 160
    and length(telefono) between 1 and 40
    and length(motivo) <= 2000
    and length(mascotas_antes) <= 2000
    and length(si_te_mudas) <= 2000
    and length(notas) <= 4000
  )
);

create index if not exists adoption_requests_created_idx on public.adoption_requests (created_at desc);
create index if not exists adoption_requests_estado_idx  on public.adoption_requests (estado);


-- -----------------------------------------------------------------------------
-- 2. SEGURIDAD
--
-- Esta tabla es al revés que las demás. Cualquiera puede ESCRIBIR sin tener
-- cuenta, porque el formulario está abierto al público. Pero nadie de fuera
-- puede LEER, porque cada fila trae nombre, teléfono, correo y domicilio de una
-- persona real.
--
-- Ojo al escribir código contra esta tabla: como el público no tiene permiso de
-- lectura, un insert que pida de vuelta la fila insertada falla. Hay que
-- insertar sin .select().
-- -----------------------------------------------------------------------------

alter table public.adoption_requests enable row level security;

drop policy if exists "solicitudes_enviar_publico" on public.adoption_requests;
create policy "solicitudes_enviar_publico"
  on public.adoption_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "solicitudes_leer_aprobado" on public.adoption_requests;
create policy "solicitudes_leer_aprobado"
  on public.adoption_requests for select
  to authenticated
  using (public.es_aprobado());

drop policy if exists "solicitudes_actualizar_aprobado" on public.adoption_requests;
create policy "solicitudes_actualizar_aprobado"
  on public.adoption_requests for update
  to authenticated
  using (public.es_aprobado())
  with check (public.es_aprobado());

drop policy if exists "solicitudes_borrar_aprobado" on public.adoption_requests;
create policy "solicitudes_borrar_aprobado"
  on public.adoption_requests for delete
  to authenticated
  using (public.es_aprobado());


-- -----------------------------------------------------------------------------
-- 3. ENVÍO DE CORREO, UNA SOLA VEZ PARA TODOS LOS AVISOS
--
-- Antes esta lógica vivía duplicada dentro del disparador de solicitudes de
-- acceso. Ahora hay una sola función y los dos avisos la llaman.
--
-- Devuelve texto en vez de fallar, porque quien la llama corre dentro de la
-- transacción que está guardando algo importante: una cuenta nueva o la
-- solicitud de adopción de una persona. Un problema de correo no puede tumbar
-- ninguna de las dos.
-- -----------------------------------------------------------------------------

create or replace function public.enviar_correo_a_admins(asunto text, cuerpo_html text)
returns text
language plpgsql
security definer
set search_path = public, net, vault, extensions
as $$
declare
  clave         text;
  destinatarios jsonb;
begin
  select decrypted_secret into clave
  from vault.decrypted_secrets
  where name = 'resend_api_key';

  if clave is null or clave = 'CLAVE_DE_RESEND_AQUI' then
    return 'sin clave de Resend configurada';
  end if;

  -- Solo quien está aprobado. Mandarle el correo a una cuenta pendiente sería
  -- filtrarle datos personales a alguien a quien todavía no se le dio acceso.
  select jsonb_agg(email) into destinatarios
  from public.panel_users
  where status = 'aprobado';

  if destinatarios is null then
    return 'no hay nadie aprobado a quien avisar';
  end if;

  perform net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || clave
    ),
    body := jsonb_build_object(
      'from',    'Adopta un Olvidado <onboarding@resend.dev>',
      'to',      destinatarios,
      'subject', asunto,
      'html',    cuerpo_html
    )
  );
  return 'encolado';
end;
$$;


-- Envoltorio visual para que los dos correos se vean iguales.
create or replace function public.plantilla_correo(titulo text, cuerpo text, texto_boton text)
returns text
language sql
immutable
as $$
  select
    '<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a">'
    '<h2 style="color:#021C4B;margin:0 0 16px">' || titulo || '</h2>'
    || cuerpo ||
    '<p style="margin:24px 0">'
    '<a href="https://kaliastz88.github.io/adoptaunolvidado/ui_kits/website/admin.html" '
    'style="background:#021C4B;color:#fff;text-decoration:none;padding:12px 24px;'
    'border-radius:999px;font-weight:600;display:inline-block">' || texto_boton || '</a></p>'
    '<p style="font-size:13px;color:#6b7280">Adopta un Olvidado</p>'
    '</div>';
$$;


-- -----------------------------------------------------------------------------
-- 4. AVISO CUANDO ALGUIEN APLICA POR UNA MASCOTA
--
-- El bloque de excepciones es obligatorio por la misma razón de siempre: el
-- disparador corre dentro de la transacción que guarda la solicitud. Si fallara
-- sin capturar el error, la persona vería que su solicitud no se envió, cuando
-- lo único que pasó fue que el correo no salió.
-- -----------------------------------------------------------------------------

create or replace function public.avisar_solicitud_de_adopcion()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  begin
    perform public.enviar_correo_a_admins(
      'Nueva solicitud de adopción para ' || coalesce(nullif(new.animal_nombre, ''), 'un animal'),
      public.plantilla_correo(
        'Nueva solicitud de adopción',
        '<p style="font-size:15px;line-height:1.6"><b>' || new.nombre || '</b> quiere adoptar a <b>'
          || coalesce(nullif(new.animal_nombre, ''), 'un animal') || '</b>.</p>'
          '<table style="font-size:14px;line-height:1.8;border-collapse:collapse">'
          '<tr><td style="color:#6b7280;padding-right:16px">Correo</td><td>' || new.correo || '</td></tr>'
          '<tr><td style="color:#6b7280;padding-right:16px">Teléfono</td><td>' || new.telefono || '</td></tr>'
          '<tr><td style="color:#6b7280;padding-right:16px">Ciudad</td><td>' || coalesce(nullif(new.ciudad, ''), '—') || '</td></tr>'
          '<tr><td style="color:#6b7280;padding-right:16px">Vivienda</td><td>' || coalesce(nullif(new.vivienda, ''), '—') || '</td></tr>'
          '</table>'
          '<p style="font-size:15px;line-height:1.6">Entra al panel para leer todas sus respuestas.</p>',
        'Ver la solicitud'
      )
    );
  exception when others then
    raise warning 'No se pudo encolar el aviso de adopción de %: %', new.correo, sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists al_recibir_solicitud_avisar on public.adoption_requests;
create trigger al_recibir_solicitud_avisar
  after insert on public.adoption_requests
  for each row execute function public.avisar_solicitud_de_adopcion();


-- -----------------------------------------------------------------------------
-- 5. EL AVISO DE ACCESO PASA A USAR LA MISMA FUNCIÓN
--
-- Reemplaza la versión de aviso-por-correo.sql. El comportamiento visible no
-- cambia; lo que cambia es que ya no hay dos copias del código de envío.
-- -----------------------------------------------------------------------------

create or replace function public.avisar_solicitud_de_acceso()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if new.status <> 'pendiente' then
    return new;
  end if;

  begin
    perform public.enviar_correo_a_admins(
      'Alguien pidió acceso al panel: ' || new.email,
      public.plantilla_correo(
        'Nueva solicitud de acceso',
        '<p style="font-size:15px;line-height:1.6"><b>' || new.email || '</b> creó una cuenta '
        'en el panel de administración y está esperando aprobación. Por ahora no puede ver ni '
        'cambiar nada.</p>'
        '<p style="font-size:15px;line-height:1.6">Si la reconoces, apruébala desde la pestaña '
        '<b>Usuarios</b>. Si no sabes quién es, ignórala o recházala.</p>',
        'Abrir el panel'
      )
    );
  exception when others then
    raise warning 'No se pudo encolar el aviso de acceso de %: %', new.email, sqlerrm;
  end;
  return new;
end;
$$;


-- =============================================================================
-- LISTO.
--
-- LÍMITE DEL REMITENTE DE PRUEBA:
-- Mientras el remitente sea 'onboarding@resend.dev', Resend solo entrega al
-- correo dueño de la cuenta de Resend, aunque la función mande la lista completa
-- de personas aprobadas. Para que les llegue a todas hay que verificar un
-- dominio propio en Resend y cambiar el 'from' en enviar_correo_a_admins.
--
-- SOBRE EL CORREO NO DESEADO:
-- El formulario es público a propósito, así que cualquiera puede enviar
-- solicitudes falsas. Los límites de largo evitan envíos enormes, pero no la
-- cantidad. Si algún día llega basura en volumen, lo que toca es agregar una
-- verificación tipo captcha, y eso sí necesita una Edge Function.
-- =============================================================================
