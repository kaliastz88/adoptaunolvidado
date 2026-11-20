// =============================================================================
// Aviso de privacidad.
//
// Los formularios piden nombre, teléfono, correo y datos del hogar, y la ley
// mexicana de protección de datos personales exige informar para qué se usan
// ANTES de recabarlos. Por eso existe esta página y la casilla obligatoria en
// cada formulario.
//
// IMPORTANTE: es un texto base escrito en noviembre de 2026. Debe revisarlo
// una persona con conocimientos legales antes de considerarlo definitivo,
// sobre todo el apartado del registro interno de incidentes.
//
// El texto vive en un solo componente que usan dos lugares: la página
// completa y la ventana que se abre desde la casilla de los formularios (para
// no perder lo que la persona ya escribió).
// =============================================================================

const AVISO_ACTUALIZADO = 'noviembre de 2026';

function TextoAvisoPrivacidad() {
  const correo = T('contacto.correo', '');
  const h = { font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '28px 0 10px' };
  const p = { font: 'var(--font-body-base)', color: 'var(--text-secondary)', margin: '0 0 12px' };
  const li = { font: 'var(--font-body-base)', color: 'var(--text-secondary)', marginBottom: 6 };
  const contacto = (
    <React.Fragment>
      por Instagram en <a href={window.REDES.instagram} target="_blank" rel="noopener noreferrer">{window.REDES.usuario}</a>
      {correo ? <React.Fragment> o al correo <a href={`mailto:${correo}`}>{correo}</a></React.Fragment> : null}
    </React.Fragment>
  );

  return (
    <div>
      <h3 style={h}>¿Quién es responsable de tus datos?</h3>
      <p style={p}>
        <b>Adopta un Olvidado</b>, organización de rescate animal con sede en la Ciudad de México,
        es responsable del uso y protección de los datos personales que nos compartes. Puedes
        contactarnos {contacto}.
      </p>

      <h3 style={h}>¿Qué datos recabamos?</h3>
      <p style={p}>A través de los formularios de este sitio podemos pedirte:</p>
      <ul style={{ paddingLeft: 22, margin: '0 0 12px' }}>
        <li style={li}><b>Identificación y contacto:</b> nombre, edad, correo electrónico, teléfono y ciudad.</li>
        <li style={li}><b>Sobre tu hogar</b> (solo en solicitudes de adopción): tipo de vivienda, si es propia o rentada, quiénes viven ahí, otras mascotas y cómo planeas cuidar al animal.</li>
        <li style={li}><b>Sobre tu marca o empresa</b> (solo en propuestas de alianza): nombre de la marca y forma en que te gustaría participar.</li>
      </ul>
      <p style={p}>No te pedimos datos personales sensibles.</p>

      <h3 style={h}>¿Para qué los usamos?</h3>
      <p style={p}>Finalidades necesarias para atender tu solicitud:</p>
      <ul style={{ paddingLeft: 22, margin: '0 0 12px' }}>
        <li style={li}>Evaluar tu solicitud de adopción, apadrinamiento o alianza.</li>
        <li style={li}>Contactarte por correo, teléfono o WhatsApp sobre tu solicitud.</li>
        <li style={li}>Dar seguimiento al animal después de la adopción, como parte de nuestro compromiso de adopción responsable.</li>
        <li style={li}>Llevar un registro interno de solicitudes y de los casos en los que una adopción no resultó adecuada, con el único fin de proteger el bienestar de los animales en futuras adopciones. Este registro solo lo consulta nuestro equipo.</li>
      </ul>
      <p style={p}>
        Finalidad adicional, que puedes rechazar en cualquier momento: enviarte noticias sobre el
        animal que apadrinas y sobre nuestras actividades. Si no la deseas, escríbenos {contacto}.
      </p>

      <h3 style={h}>¿Con quién compartimos tus datos?</h3>
      <p style={p}>
        No vendemos ni cedemos tus datos a otras organizaciones o personas sin tu consentimiento,
        salvo cuando la ley nos obligue. Para operar este sitio usamos proveedores de tecnología
        que guardan o procesan la información por cuenta nuestra y bajo nuestras instrucciones:
        almacenamiento de la base de datos (Supabase), hojas de cálculo del equipo (Google) y
        envío de correos (Resend).
      </p>

      <h3 style={h}>¿Cómo ejercer tus derechos?</h3>
      <p style={p}>
        Tienes derecho a <b>acceder</b> a tus datos, <b>rectificarlos</b> si son inexactos,
        <b> cancelarlos</b> cuando consideres que no se requieren para las finalidades señaladas,
        y <b>oponerte</b> a su uso para fines específicos (derechos ARCO). También puedes revocar
        el consentimiento que nos diste. Para hacerlo, escríbenos {contacto}, indicando tu nombre,
        el derecho que quieres ejercer y un medio para responderte. Te contestaremos en un plazo
        máximo de 20 días hábiles.
      </p>

      <h3 style={h}>Cambios a este aviso</h3>
      <p style={p}>
        Cualquier cambio a este aviso de privacidad se publicará en esta misma página.
      </p>
      <p style={{ ...p, fontStyle: 'italic' }}>Última actualización: {AVISO_ACTUALIZADO}.</p>
    </div>
  );
}

function Privacidad() {
  const { Seccion, Antecedente } = window.UI;
  return (
    <Seccion tono="crema" ancho={760}>
      <Antecedente>Tus datos</Antecedente>
      <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-primary)', margin: '12px 0 8px' }}>Aviso de privacidad</h1>
      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', margin: 0 }}>
        Cuando nos compartes tus datos para adoptar, apadrinar o aliarte, los cuidamos con la
        misma responsabilidad con la que cuidamos a nuestros rescatados.
      </p>
      <TextoAvisoPrivacidad />
    </Seccion>
  );
}

// Casilla obligatoria para los formularios. Se usa un <input> de verdad para
// que funcione con teclado y lectores de pantalla.
function AceptoPrivacidad({ checked, onChange }) {
  const { Modal } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [verAviso, setVerAviso] = React.useState(false);
  return (
    <React.Fragment>
      <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', margin: '0 0 20px', maxWidth: 640 }}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
               style={{ width: 20, height: 20, marginTop: 2, accentColor: 'var(--blue-600)', flexShrink: 0, cursor: 'pointer' }} />
        <span style={{ font: 'var(--font-body-sm)', color: 'var(--text-primary)' }}>
          He leído y acepto el{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); setVerAviso(true); }} style={{ fontWeight: 600, textDecoration: 'underline' }}>
            aviso de privacidad
          </a>
          , y autorizo a Adopta un Olvidado a usar mis datos para atender esta solicitud.
        </span>
      </label>
      <Modal open={verAviso} onClose={() => setVerAviso(false)} title="Aviso de privacidad">
        <div style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: 6 }}>
          <TextoAvisoPrivacidad />
        </div>
      </Modal>
    </React.Fragment>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Privacidad };
window.AceptoPrivacidad = AceptoPrivacidad;
