-- =============================================================================
-- Adopta un Olvidado — aviso por correo cuando alguien pide acceso al panel
--
-- Se corre DESPUÉS de usuarios-del-panel.sql.
--
-- ANTES DE CORRERLO hay que reemplazar CLAVE_DE_RESEND_AQUI, abajo, por la clave
-- real. Si no, el aviso no se manda y el registro sigue funcionando igual.
--
-- CÓMO FUNCIONA:
-- Supabase no puede mandar correos arbitrarios por su cuenta; su servidor de
-- correo gratuito solo manda mensajes de autenticación y solo a miembros del
-- proyecto. Así que la base llama a Resend por HTTP usando pg_net.
--
-- pg_net encola la petición y la manda un proceso aparte. Eso importa: el envío
-- nunca hace esperar a quien se está registrando.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. HERRAMIENTAS
-- -----------------------------------------------------------------------------

create extension if not exists pg_net;


-- -----------------------------------------------------------------------------
-- 2. LA CLAVE DE RESEND, GUARDADA BAJO LLAVE
--
-- Va al vault de Supabase y no en el texto de la función. Así no queda a la
-- vista de nadie que abra el editor de SQL o mire la definición de la función.
-- -----------------------------------------------------------------------------

delete from vault.secrets where name = 'resend_api_key';
select vault.create_secret(
  'CLAVE_DE_RESEND_AQUI',
  'resend_api_key',
  'Clave de Resend para avisar de solicitudes de acceso al panel'
);


-- -----------------------------------------------------------------------------
-- 3. EL AVISO
--
-- Se manda a todas las personas con rol de dueña, tomadas de la propia tabla en
-- vez de escribir un correo fijo. Si mañana cambia quién administra el panel,
-- el aviso la sigue sin tener que tocar este archivo.
--
-- EL BLOQUE DE EXCEPCIONES NO ES OPCIONAL. Este disparador corre dentro de la
-- misma transacción que crea la cuenta. Si fallara sin capturar el error, la
-- transacción se revierte y la persona no podría registrarse. Un problema para
-- mandar un correo jamás debe impedir que alguien pida acceso, así que cualquier
-- falla se anota como advertencia y el registro continúa.
-- -----------------------------------------------------------------------------

create or replace function public.avisar_solicitud_de_acceso()
returns trigger
language plpgsql
security definer
set search_path = public, net, vault, extensions
as $$
declare
  clave        text;
  destinatarios jsonb;
begin
  if new.status <> 'pendiente' then
    return new;
  end if;

  begin
    select decrypted_secret into clave
    from vault.decrypted_secrets
    where name = 'resend_api_key';

    if clave is null or clave = 'CLAVE_DE_RESEND_AQUI' then
      raise warning 'Sin clave de Resend configurada: no se envió el aviso de %', new.email;
      return new;
    end if;

    select jsonb_agg(email) into destinatarios
    from public.panel_users
    where role = 'owner' and status = 'aprobado';

    if destinatarios is null then
      raise warning 'No hay ninguna dueña aprobada a quien avisar.';
      return new;
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
        'subject', 'Alguien pidió acceso al panel: ' || new.email,
        'html',
          '<div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1a1a1a">'
          '<h2 style="color:#021C4B;margin:0 0 16px">Nueva solicitud de acceso</h2>'
          '<p style="font-size:15px;line-height:1.6">'
          '<b>' || new.email || '</b> creó una cuenta en el panel de administración '
          'y está esperando aprobación. Por ahora no puede ver ni cambiar nada.</p>'
          '<p style="font-size:15px;line-height:1.6">Si la reconoces, apruébala desde '
          'la pestaña <b>Usuarios</b>. Si no sabes quién es, ignórala o recházala.</p>'
          '<p style="margin:24px 0">'
          '<a href="https://kaliastz88.github.io/adoptaunolvidado/ui_kits/website/admin.html" '
          'style="background:#021C4B;color:#fff;text-decoration:none;padding:12px 24px;'
          'border-radius:999px;font-weight:600;display:inline-block">Abrir el panel</a></p>'
          '<p style="font-size:13px;color:#6b7280">Adopta un Olvidado</p>'
          '</div>'
      )
    );

  exception when others then
    -- Nunca tumbar un registro por culpa de un correo.
    raise warning 'No se pudo encolar el aviso para %: %', new.email, sqlerrm;
  end;

  return new;
end;
$$;

drop trigger if exists al_pedir_acceso_avisar on public.panel_users;
create trigger al_pedir_acceso_avisar
  after insert on public.panel_users
  for each row execute function public.avisar_solicitud_de_acceso();


-- =============================================================================
-- CÓMO REVISAR SI UN AVISO SALIÓ
--
--   select id, status_code, error_msg, created
--   from net._http_response
--   order by created desc
--   limit 5;
--
-- status_code 200 significa que Resend lo aceptó.
--
-- LÍMITE DEL REMITENTE DE PRUEBA:
-- 'onboarding@resend.dev' solo entrega al correo dueño de la cuenta de Resend.
-- Alcanza para avisarle a una sola persona. Para avisar a varias hay que
-- verificar un dominio propio en Resend y cambiar el 'from' por una dirección
-- de ese dominio.
-- =============================================================================
