// =============================================================================
// Formulario de alianza con marcas — pantalla pública.
//
// Se abre desde el botón "Quiero aliarme como marca", que está en la portada y
// en la página de Aliados. Antes no hacía nada.
//
// Igual que el de adopción: cualquiera lo envía sin tener cuenta, pero los
// datos de contacto solo los ve el equipo con acceso aprobado.
// =============================================================================

// Se pueden marcar varias. Guardarlas unidas por comas alcanza para lo único
// que hay que hacer con ellas: leerlas y contactar a la marca.
const FORMAS_DE_AYUDAR = [
  'Donativo económico',
  'Donativo en especie (alimento, medicinas, insumos)',
  'Hogar temporal o espacio físico',
  'Servicios veterinarios',
  'Difusión en nuestras redes o tienda',
  'Servicios profesionales (diseño, legal, contabilidad, transporte)',
  'Evento o campaña conjunta',
  'Otra forma, la explico abajo',
];

function SolicitudAlianza({ onBack }) {
  const { Button, Input, Checkbox } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [form, setForm] = React.useState({
    marca: '', giro: '', sitio: '',
    contacto: '', puesto: '', correo: '', telefono: '', ciudad: '',
    mensaje: '',
  });
  const [formas, setFormas] = React.useState([]);
  const [error, setError] = React.useState('');
  const [enviando, setEnviando] = React.useState(false);
  const [enviada, setEnviada] = React.useState(false);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  function set(campo, valor) { setForm((f) => ({ ...f, [campo]: valor })); }

  function alternar(opcion, marcada) {
    setFormas((prev) => (marcada ? prev.concat(opcion) : prev.filter((o) => o !== opcion)));
  }

  async function enviar() {
    if (!form.marca.trim())    { return fallar('Escribe el nombre de tu marca.'); }
    if (!form.contacto.trim()) { return fallar('Escribe tu nombre.'); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
      return fallar('Ese correo no parece válido. Es por donde te vamos a contestar.');
    }
    if (formas.length === 0) { return fallar('Marca al menos una forma en la que te gustaría participar.'); }

    setEnviando(true);
    setError('');
    try {
      await window.db.crearSolicitudAlianza({ ...form, formas: formas.join(', ') });
      setEnviada(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError('No pudimos enviar tu solicitud. ' + e.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setEnviando(false);
    }
  }

  function fallar(msg) {
    setError(msg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          Gracias, {form.contacto.split(' ')[0]}
        </h1>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 28 }}>
          Recibimos la propuesta de <b>{form.marca}</b>. Vamos a leerla con calma y te
          escribiremos a <b>{form.correo}</b> para platicar de cómo trabajar juntos.
        </p>
        <Button variant="primary" icon="arrow-left" onClick={onBack}>Volver al sitio</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '48px', maxWidth: 720, margin: '0 auto' }}>
      <button onClick={onBack} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', font: 'var(--font-body-sm)', marginBottom: 24, fontFamily: 'var(--font-body)' }}>
        <i data-lucide="arrow-left" style={{ width: 16, height: 16 }} /> Volver
      </button>

      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-sponsor)', textTransform: 'uppercase' }}>Aliados</span>
      <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-primary)', margin: '10px 0 14px' }}>Aliemos a tu marca con el rescate</h1>
      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 620 }}>
        No hace falta ser una empresa grande ni donar dinero. Un hogar temporal, unos
        kilos de alimento, una consulta veterinaria o una publicación en tus redes
        cambian la vida de un perrito. Cuéntanos qué puedes aportar.
      </p>

      {error ? (
        <div style={{ background: 'var(--terracotta-50)', border: '1px solid var(--terracotta-500)', color: 'var(--terracotta-600)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 24, font: 'var(--font-body-sm)' }}>
          {error}
        </div>
      ) : null}

      <section style={estiloTarjeta}>
        <h2 style={estiloTitulo}>Tu marca</h2>
        <div style={estiloColumna}>
          <Input label="Nombre de la marca o empresa *" placeholder="Ej. Hotel PupuClub"
                 value={form.marca} onChange={(e) => set('marca', e.target.value)} />
          <Input label="¿A qué se dedica?" placeholder="Ej. hotel y guardería para perros"
                 value={form.giro} onChange={(e) => set('giro', e.target.value)} />
          <Input label="Sitio web o Instagram" placeholder="Ej. @tumarca o tumarca.com"
                 value={form.sitio} onChange={(e) => set('sitio', e.target.value)} />
        </div>
      </section>

      <section style={estiloTarjeta}>
        <h2 style={estiloTitulo}>Cómo te contactamos</h2>
        <div style={estiloColumna}>
          <Input label="Tu nombre *" placeholder="Ej. María Fernanda López"
                 value={form.contacto} onChange={(e) => set('contacto', e.target.value)} />
          <Input label="Tu puesto" placeholder="Ej. fundadora, gerente de marketing"
                 value={form.puesto} onChange={(e) => set('puesto', e.target.value)} />
          <Input label="Correo *" type="email" placeholder="tu@marca.com"
                 value={form.correo} onChange={(e) => set('correo', e.target.value)} />
          <Input label="Teléfono o WhatsApp" placeholder="Ej. 55 1234 5678"
                 value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
          <Input label="Ciudad y estado" placeholder="Ej. Ciudad de México"
                 value={form.ciudad} onChange={(e) => set('ciudad', e.target.value)} />
        </div>
      </section>

      <section style={estiloTarjeta}>
        <h2 style={estiloTitulo}>¿Cómo te gustaría participar? *</h2>
        <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
          Marca todas las que apliquen. Nada de esto es un compromiso todavía.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FORMAS_DE_AYUDAR.map((o) => (
            <Checkbox key={o} label={o} checked={formas.includes(o)} onChange={(v) => alternar(o, v)} />
          ))}
        </div>
      </section>

      <section style={estiloTarjeta}>
        <h2 style={estiloTitulo}>Cuéntanos más</h2>
        <textarea
          value={form.mensaje}
          onChange={(e) => set('mensaje', e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="¿Qué te gustaría hacer con nosotras? ¿Hay algo que te haya movido a escribirnos?"
          style={{
            width: '100%', boxSizing: 'border-box',
            font: 'var(--font-body-base)', padding: '12px 16px', borderRadius: 'var(--radius-input)',
            border: '1.5px solid var(--border-default)', resize: 'vertical', fontFamily: 'var(--font-body)',
          }}
        />
      </section>

      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
        <Button variant="sponsor" icon="hand-heart" wag onClick={enviar} disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar propuesta'}
        </Button>
        <span style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)' }}>
          Tus datos solo los ve el equipo de Adopta un Olvidado.
        </span>
      </div>
    </div>
  );
}

const estiloTarjeta = {
  background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)',
  padding: 28, marginBottom: 24,
};
const estiloTitulo = { font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '0 0 20px' };
const estiloColumna = { display: 'flex', flexDirection: 'column', gap: 18 };

window.WebsiteScreens = { ...window.WebsiteScreens, SolicitudAlianza };
