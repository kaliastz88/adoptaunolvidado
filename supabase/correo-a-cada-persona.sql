-- =============================================================================
-- Adopta un Olvidado — un correo por persona, no uno con todas en copia
--
-- Se corre DESPUÉS de solicitudes-de-adopcion.sql. Reemplaza
-- enviar_correo_a_admins por una versión que manda un mensaje independiente a
-- cada integrante del equipo.
--
-- POR QUÉ:
-- La versión anterior mandaba UNA petición con la lista completa de correos.
-- Resend rechaza la petición entera si un solo destinatario no le gusta, y
-- mientras el remitente sea el de prueba solo acepta el correo dueño de la
-- cuenta. Con una sola persona aprobada funcionaba; en cuanto se aprobara a la
-- segunda, TODOS los avisos habrían dejado de llegar, incluidos los de la
-- primera, y sin ningún aviso de que eso estaba pasando.
--
-- Mandando uno por persona, un destinatario rechazado ya no arrastra a los
-- demás. Cada quien recibe el suyo o no, de forma independiente.
-- =============================================================================

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
  select decrypted_secret into clave
  from vault.decrypted_secrets
  where name = 'resend_api_key';

  if clave is null or clave = 'CLAVE_DE_RESEND_AQUI' then
    return 'sin clave de Resend configurada';
  end if;

  -- Solo quien está aprobado. Avisarle a una cuenta pendiente sería filtrarle
  -- datos personales a alguien a quien todavía no se le dio acceso.
  for persona in
    select email from public.panel_users where status = 'aprobado'
  loop
    perform net.http_post(
      url     := 'https://api.resend.com/emails',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || clave
      ),
      body := jsonb_build_object(
        'from',    'Adopta un Olvidado <onboarding@resend.dev>',
        'to',      jsonb_build_array(persona.email),
        'subject', asunto,
        'html',    cuerpo_html
      )
    );
    enviados := enviados + 1;
  end loop;

  if enviados = 0 then
    return 'no hay nadie aprobado a quien avisar';
  end if;
  return 'encolados: ' || enviados;
end;
$$;


-- -----------------------------------------------------------------------------
-- Para revisar a quién le llegó y a quién no:
--
--   select r.status_code,
--          r.content::jsonb ->> 'message' as motivo_del_rechazo,
--          r.created
--   from net._http_response r
--   order by r.created desc
--   limit 20;
--
-- 200 significa entregado a Resend. 403 con un mensaje sobre "testing emails"
-- significa que ese destinatario no es el dueño de la cuenta de Resend y que
-- hace falta verificar un dominio propio para poder escribirle.
-- =============================================================================
