function Home({ onSeeDog, onNavigate }) {
  const { Button, DogCard, StatCounter } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const { Tabs, Modal } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState('Mensual');
  const [amount, setAmount] = React.useState('$150 MIL');

  const STORIES = [
    { name: 'Valiente', note: 'Rescatado de la calle. Hoy vive en un hogar con jardín.' },
    { name: 'Dorito', note: 'De la desconfianza al primer abrazo — ahora tiene familia.' },
    { name: 'Nona', note: 'Encontrada herida. Recuperada y adoptada meses después.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 40, padding: '64px 48px', background: 'linear-gradient(180deg, var(--blue-50), var(--surface-page))' }}>
        <div style={{ flex: '1 1 460px', minWidth: 320 }}>
          <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>Rescate · rehabilitación · adopción responsable</span>
          <h1 style={{ font: 'var(--font-hero)', color: 'var(--text-primary)', margin: '14px 0 20px' }}>Un gesto tuyo puede ser el comienzo de su historia feliz.</h1>
          <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 28 }}>Rescatamos, rehabilitamos y encontramos el hogar correcto para cada perrito olvidado.</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Button variant="cta" icon="heart" wag onClick={() => setOpen(true)}>Dona hoy</Button>
            <Button variant="secondary" icon="paw-print" onClick={() => onNavigate('catalogo')}>Conoce a nuestros perritos</Button>
          </div>
        </div>
        <div style={{ flex: '1 1 320px', minWidth: 280, maxWidth: 380, height: 420, borderRadius: 'var(--radius-xl)', background: 'linear-gradient(160deg, var(--blue-200), var(--terracotta-100))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', color: 'var(--blue-700)' }}>
            <i data-lucide="image" style={{ width: 56, height: 56 }} />
            <p style={{ font: 'var(--font-body-sm)', marginTop: 10 }}>Foto editorial del perrito<br />(pendiente material real)</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 48px 64px', display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        <StatCounter value="+60" label="perritos con hogar" />
        <StatCounter value="4" label="fundadoras" tone="neutral" />
        <StatCounter value="100%" label="adopción responsable" tone="neutral" />
      </section>

      {/* Stories */}
      <section style={{ padding: '64px 48px', background: 'var(--surface-alt)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Historias que transforman vidas</span>
          <h2 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '10px 0 32px' }}>De la calle a un hogar para siempre</h2>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {STORIES.map((s) => (
              <div key={s.name} style={{ flex: '1 1 300px', background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                <div style={{ height: 160, background: 'linear-gradient(120deg, var(--sage-100), var(--blue-100))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sage-600)' }}>
                  <i data-lucide="images" style={{ width: 32, height: 32 }} />
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ font: 'var(--font-h4)', color: 'var(--text-primary)' }}>{s.name}</div>
                  <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>{s.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aliados */}
      <section style={{ padding: '72px 48px', maxWidth: 1000, margin: '0 auto' }}>
        <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-sponsor)', textTransform: 'uppercase' }}>Aliados</span>
        <h2 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '10px 0 18px' }}>Las grandes historias comienzan con una alianza.</h2>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', maxWidth: 720 }}>
          En Adopta un Olvidado creemos que cambiar la vida de un perrito no es una tarea que podamos hacer solos. Hoy reconocemos a <b>Hotel PupuClub</b>, que abrió sus puertas como hogar temporal y espacio de rehabilitación para nuestros rescatados.
        </p>
        <div style={{ display: 'flex', gap: 14, marginTop: 22 }}>
          <Button variant="secondary" icon="play">Conoce la historia de Snow</Button>
          <Button variant="sponsor" icon="hand-heart">Quiero aliarme como marca</Button>
        </div>
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="¡Dona hoy!">
        <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', marginBottom: 16 }}>"Un gesto tuyo puede ser el comienzo de su historia feliz."</p>
        <Tabs options={['Dona una vez', 'Mensual']} value={mode} onChange={setMode} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '18px 0' }}>
          {['$50 MIL', '$100 MIL', '$150 MIL', '$200 MIL'].map((a) => (
            <button key={a} onClick={() => setAmount(a)} style={{
              padding: '14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600,
              border: amount === a ? '2px solid var(--action-sponsor)' : '1.5px solid var(--border-default)',
              background: amount === a ? 'var(--amber-50)' : '#fff',
            }}>{a} COP</button>
          ))}
        </div>
        <Button variant="sponsor" style={{ width: '100%' }}>Dona hoy</Button>
      </Modal>
    </div>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Home };
