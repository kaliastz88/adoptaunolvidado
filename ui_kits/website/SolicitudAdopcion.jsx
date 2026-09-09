// =============================================================================
// Formulario de solicitud de adopción — pantalla pública
//
// Se abre desde el botón "Adoptar a ..." de la ficha del perro. Cualquiera
// puede enviarlo sin tener cuenta; las políticas de la base permiten escribir
// aquí pero no leer, porque cada solicitud trae datos personales.
//
// Las preguntas viven en SECCIONES, como datos y no como JSX repetido. Agregar,
// quitar o reordenar una pregunta es editar una línea de esta lista, y el
// nombre de cada campo tiene que coincidir con su columna en la tabla
// adoption_requests.
// =============================================================================

const SECCIONES = [
  {
    titulo: 'Tus datos',
    campos: [
      { n: 'nombre',   etiqueta: 'Nombre completo', req: true, ph: 'Ej. María Fernanda López' },
      { n: 'edad',     etiqueta: 'Tu edad', ph: 'Ej. 32' },
      { n: 'correo',   etiqueta: 'Correo', req: true, tipo: 'email', ph: 'tu@correo.com' },
      { n: 'telefono', etiqueta: 'Teléfono o WhatsApp', req: true, ph: 'Ej. 55 1234 5678' },
      { n: 'ciudad',   etiqueta: 'Ciudad y estado', ph: 'Ej. Guadalajara, Jalisco' },
    ],
  },
  {
    titulo: 'Tu vivienda',
    campos: [
      { n: 'vivienda',      etiqueta: '¿Dónde vives?', ops: ['Casa', 'Departamento', 'Otro'] },
      { n: 'propiedad',     etiqueta: '¿La vivienda es propia o rentada?', ops: ['Propia', 'Rentada', 'De un familiar'] },
      { n: 'permiso_renta', etiqueta: 'Si rentas, ¿te permiten tener mascotas?', ops: ['Sí', 'No', 'No aplica'] },
      { n: 'patio',         etiqueta: '¿Tienes patio, jardín o azotea?', ops: ['Sí', 'No'] },
      { n: 'protegido',     etiqueta: '¿Ventanas, balcones y bardas están protegidos?', ops: ['Sí', 'No', 'Todavía no, pero los protegería'] },
    ],
  },
  {
    titulo: 'Quiénes viven contigo',
    campos: [
      { n: 'personas', etiqueta: '¿Cuántas personas viven en tu casa?', ph: 'Ej. 4' },
      { n: 'ninos',    etiqueta: '¿Hay niños? ¿De qué edades?', ph: 'Ej. dos, de 6 y 10 años' },
      { n: 'acuerdo',  etiqueta: '¿Todos en casa están de acuerdo con adoptar?', ops: ['Sí, todos', 'Todavía falta hablarlo', 'No todos'] },
      { n: 'alergias', etiqueta: '¿Alguien tiene alergia a los animales?', ops: ['No', 'Sí'] },
    ],
  },
  {
    titulo: 'Otras mascotas',
    campos: [
      { n: 'otras_mascotas', etiqueta: '¿Qué otras mascotas tienes ahora?', ph: 'Ej. una perra de 5 años. Si no tienes, escribe "ninguna"' },
      { n: 'esterilizadas',  etiqueta: '¿Están esterilizadas y vacunadas?', ops: ['Sí', 'No', 'No aplica'] },
      { n: 'mascotas_antes', etiqueta: '¿Has tenido mascotas antes? ¿Qué pasó con ellas?', largo: true, ph: 'Cuéntanos con confianza. Nos ayuda a entender tu experiencia.' },
    ],
  },
  {
    titulo: 'El compromiso',
    campos: [
      { n: 'responsable',  etiqueta: '¿Quién se hará cargo de él día a día?', ph: 'Ej. yo y mi pareja' },
      { n: 'horas_solo',   etiqueta: '¿Cuántas horas pasaría solo al día?', ops: ['Menos de 4 horas', 'Entre 4 y 8 horas', 'Más de 8 horas'] },
      { n: 'donde_duerme', etiqueta: '¿Dónde dormiría?', ops: ['Dentro de casa', 'En el patio o jardín', 'Todavía no lo decido'] },
      { n: 'si_te_mudas',  etiqueta: '¿Qué harías si te mudas, viajas o cambia tu situación?', largo: true, ph: 'Es la pregunta más importante para nosotras.' },
      { n: 'gastos',       etiqueta: '¿Puedes cubrir sus gastos de comida y veterinario?', ops: ['Sí', 'Creo que sí', 'No estoy segura'] },
      { n: 'esteriliza',   etiqueta: '¿Te comprometes a esterilizarlo si aún no lo está?', ops: ['Sí', 'No'] },
      { n: 'seguimiento',  etiqueta: '¿Aceptas que hagamos una visita o llamada de seguimiento?', ops: ['Sí', 'No'] },
      { n: 'motivo',       etiqueta: '¿Por qué quieres adoptarlo?', req: true, largo: true, ph: 'Cuéntanos qué te movió a elegirlo.' },
    ],
  },
];

function formularioVacio() {
  const f = {};
  SECCIONES.forEach((s) => s.campos.forEach((c) => { f[c.n] = ''; }));
  return f;
}

function SolicitudAdopcion({ dog, onBack }) {
  const { Button, Input, Select } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [form, setForm] = React.useState(formularioVacio);
  const [error, setError] = React.useState('');
  const [enviando, setEnviando] = React.useState(false);
  const [enviada, setEnviada] = React.useState(false);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const nombreAnimal = (dog && dog.name) || '';

  function set(campo, valor) { setForm((f) => ({ ...f, [campo]: valor })); }

  async function enviar() {
    const faltantes = [];
    SECCIONES.forEach((s) => s.campos.forEach((c) => {
      if (c.req && !String(form[c.n]).trim()) faltantes.push(c.etiqueta);
    }));
    if (faltantes.length) {
      setError('Falta contestar: ' + faltantes.join(', ') + '.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
      setError('Ese correo no parece válido. Revísalo, porque es por donde te vamos a contestar.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setEnviando(true);
    setError('');
    try {
      await window.db.crearSolicitudAdopcion({
        ...form,
        animal_id: (dog && dog.id) || null,
        animal_nombre: nombreAnimal,
      });
      setEnviada(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError('No pudimos enviar tu solicitud. ' + e.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setEnviando(false);
    }
  }

  if (enviada) {
    return (
      <div style={{ padding: '64px 48px', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: 'var(--status-success-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          color: 'var(--sage-600)',
        }}>
          <i data-lucide="check" style={{ width: 34, height: 34 }} />
        </div>
        <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-primary)', margin: '0 0 14px' }}>
          Recibimos tu solicitud
        </h1>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 28 }}>
          Gracias por querer darle un hogar{nombreAnimal ? ` a ${nombreAnimal}` : ''}. Vamos a leer tus
          respuestas con calma y te escribiremos a <b>{form.correo}</b>. Puede tardar unos días, porque
          somos un equipo pequeño y revisamos cada solicitud a mano.
        </p>
        <Button variant="primary" icon="arrow-left" onClick={onBack}>Volver al catálogo</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '48px', maxWidth: 720, margin: '0 auto' }}>
      <button onClick={onBack} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', font: 'var(--font-body-sm)', marginBottom: 24, fontFamily: 'var(--font-body)' }}>
        <i data-lucide="arrow-left" style={{ width: 16, height: 16 }} /> Volver
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12, flexWrap: 'wrap' }}>
        {dog && dog.photo ? (
          <div style={{ width: 88, height: 88, borderRadius: 'var(--radius-card)', flexShrink: 0, background: `center/cover no-repeat url(${dog.photo})` }} />
        ) : null}
        <div>
          <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Solicitud de adopción</span>
          <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-primary)', margin: '8px 0 0' }}>
            {nombreAnimal ? `Quiero adoptar a ${nombreAnimal}` : 'Quiero adoptar'}
          </h1>
        </div>
      </div>

      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 620 }}>
        Estas preguntas no son un examen. Nos ayudan a encontrar el hogar correcto para cada
        perro y a evitar que vuelva a quedarse sin casa. Contesta con sinceridad, no hay
        respuestas que te descalifiquen de entrada.
      </p>

      {error ? (
        <div style={{ background: 'var(--terracotta-50)', border: '1px solid var(--terracotta-500)', color: 'var(--terracotta-600)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 24, font: 'var(--font-body-sm)' }}>
          {error}
        </div>
      ) : null}

      {SECCIONES.map((s) => (
        <section key={s.titulo} style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: 28, marginBottom: 24 }}>
          <h2 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '0 0 20px' }}>{s.titulo}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {s.campos.map((c) => (
              <CampoSolicitud key={c.n} campo={c} valor={form[c.n]} onChange={(v) => set(c.n, v)} />
            ))}
          </div>
        </section>
      ))}

      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
        <Button variant="cta" icon="heart" wag onClick={enviar} disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar mi solicitud'}
        </Button>
        <span style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)' }}>
          Tus datos solo los ve el equipo de Adopta un Olvidado.
        </span>
      </div>
    </div>
  );
}

function CampoSolicitud({ campo, valor, onChange }) {
  const { Input, Select } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const etiqueta = campo.etiqueta + (campo.req ? ' *' : '');

  if (campo.ops) {
    return (
      <Select
        label={etiqueta}
        options={campo.ops}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Elige una opción"
      />
    );
  }

  // El sistema de diseño no tiene componente de texto largo, así que va escrito
  // aquí, igual que el de biografía en el panel de administración.
  if (campo.largo) {
    return (
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)' }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{etiqueta}</span>
        <textarea
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder={campo.ph}
          style={{
            font: 'var(--font-body-base)', padding: '12px 16px', borderRadius: 'var(--radius-input)',
            border: '1.5px solid var(--border-default)', resize: 'vertical', fontFamily: 'var(--font-body)',
          }}
        />
      </label>
    );
  }

  return (
    <Input
      label={etiqueta}
      type={campo.tipo || 'text'}
      placeholder={campo.ph}
      value={valor}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, SolicitudAdopcion };
