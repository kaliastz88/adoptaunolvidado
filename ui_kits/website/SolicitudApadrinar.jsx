// =============================================================================
// Apadrinar a un perro concreto — pantalla pública.
//
// Se abre desde el botón "Apadrinar" de la ficha de cada perro. Empieza por el
// perro y no por el monto, que es toda la diferencia con donar: sin saber a
// quién apadrina cada persona, no hay forma de mandarle noticias de su ahijado,
// que es justo lo que el sitio promete a cambio.
//
// Registra la intención, no un cobro. Mientras Mercado Pago no esté conectado,
// el equipo contacta a la persona para acordar cómo hacer el aporte. Es
// preferible a fingir un cobro que hoy no existe.
// =============================================================================

const MONTOS_APADRINAR = ['$200 MXN al mes', '$500 MXN al mes', '$1,000 MXN al mes', 'Otra cantidad, lo platicamos'];

function SolicitudApadrinar({ dog, onBack }) {
  const { Button, Input, Select } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [form, setForm] = React.useState({
    nombre: '', correo: '', telefono: '', ciudad: '', monto: '', mensaje: '',
  });
  const [error, setError] = React.useState('');
  const [enviando, setEnviando] = React.useState(false);
  const [enviada, setEnviada] = React.useState(false);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const nombreAnimal = (dog && dog.name) || '';
  function set(c, v) { setForm((f) => ({ ...f, [c]: v })); }

  function fallar(msg) {
    setError(msg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function enviar() {
    if (!form.nombre.trim()) return fallar('Escribe tu nombre.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
      return fallar('Ese correo no parece válido. Es por donde te mandaremos las noticias.');
    }
    if (!form.monto) return fallar('Elige cuánto te gustaría aportar al mes.');

    setEnviando(true);
    setError('');
    try {
      await window.db.crearSolicitudApadrinar({
        ...form,
        animal_id: (dog && dog.id) || null,
        animal_nombre: nombreAnimal,
      });
      setEnviada(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      fallar('No pudimos enviar tu solicitud. ' + e.message);
    } finally {
      setEnviando(false);
    }
  }

  if (enviada) {
    return (
      <div style={{ padding: '64px 48px', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: 'var(--surface-brand-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          color: 'var(--action-sponsor)',
        }}>
          <i data-lucide="hand-heart" style={{ width: 34, height: 34 }} />
        </div>
        <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-primary)', margin: '0 0 14px' }}>
          Gracias por acompañar a {nombreAnimal}
        </h1>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 28 }}>
          Te escribiremos a <b>{form.correo}</b> para acordar cómo hacer tu aporte. A partir de
          ahí te mandaremos noticias de {nombreAnimal} hasta el día que encuentre familia.
        </p>
        <Button variant="primary" icon="arrow-left" onClick={onBack}>Volver</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '48px', maxWidth: 640, margin: '0 auto' }}>
      <button onClick={onBack} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', font: 'var(--font-body-sm)', marginBottom: 24, fontFamily: 'var(--font-body)' }}>
        <i data-lucide="arrow-left" style={{ width: 16, height: 16 }} /> Volver
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12, flexWrap: 'wrap' }}>
        {dog && dog.photo ? (
          <div style={{ width: 88, height: 88, borderRadius: 'var(--radius-card)', flexShrink: 0, background: `${dog.photo_pos || 'center'}/cover no-repeat url(${dog.photo})` }} />
        ) : null}
        <div>
          <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-sponsor)', textTransform: 'uppercase' }}>Apadrinar</span>
          <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-primary)', margin: '8px 0 0' }}>
            {nombreAnimal ? `Quiero apadrinar a ${nombreAnimal}` : 'Quiero apadrinar'}
          </h1>
        </div>
      </div>

      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 12 }}>
        Apadrinar no es adoptar. {nombreAnimal || 'El perrito'} se queda en su hogar temporal, y tu
        aporte mensual cubre su comida, su veterinario y sus cuidados mientras espera familia.
      </p>
      <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', marginBottom: 32 }}>
        A cambio te mandamos noticias suyas, y te avisamos el día que lo adopten. Puedes dejar de
        apadrinar cuando quieras, sin explicaciones.
      </p>

      {error ? (
        <div style={{ background: 'var(--terracotta-50)', border: '1px solid var(--terracotta-500)', color: 'var(--terracotta-600)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 24, font: 'var(--font-body-sm)' }}>
          {error}
        </div>
      ) : null}

      <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: 28, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Select label="¿Cuánto te gustaría aportar al mes? *" options={MONTOS_APADRINAR}
                value={form.monto} onChange={(e) => set('monto', e.target.value)}
                placeholder="Elige una cantidad" />
        <Input label="Tu nombre *" placeholder="Ej. María Fernanda López"
               value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
        <Input label="Correo *" type="email" placeholder="tu@correo.com"
               value={form.correo} onChange={(e) => set('correo', e.target.value)} />
        <Input label="Teléfono o WhatsApp" placeholder="Ej. 55 1234 5678"
               value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
        <Input label="Ciudad y estado" placeholder="Ej. Ciudad de México"
               value={form.ciudad} onChange={(e) => set('ciudad', e.target.value)} />
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
            ¿Quieres decirnos algo?
          </span>
          <textarea
            value={form.mensaje}
            onChange={(e) => set('mensaje', e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder={nombreAnimal ? `¿Por qué elegiste a ${nombreAnimal}?` : 'Cuéntanos'}
            style={{
              font: 'var(--font-body-base)', padding: '12px 16px', borderRadius: 'var(--radius-input)',
              border: '1.5px solid var(--border-default)', resize: 'vertical', fontFamily: 'var(--font-body)',
            }}
          />
        </label>
      </div>

      {/* Se dice de frente que el cobro todavía no es automático. Prometer un
          cargo mensual que nadie va a hacer solo genera desconfianza cuando la
          persona nota que nunca le cobraron. */}
      <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)', marginBottom: 24 }}>
        Todavía no tenemos cobro automático en línea. Nos pondremos en contacto contigo para
        acordar la forma más cómoda de hacer tu aporte.
      </p>

      <Button variant="sponsor" icon="hand-heart" wag onClick={enviar} disabled={enviando}>
        {enviando ? 'Enviando...' : `Apadrinar a ${nombreAnimal || 'un rescatado'}`}
      </Button>
    </div>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, SolicitudApadrinar };
