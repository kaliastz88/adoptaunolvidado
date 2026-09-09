function Home({ onSeeDog, onNavigate }) {
  const { Button, DogCard, StatCounter } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const { Modal } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [open, setOpen] = React.useState(false);

  // Las historias son los perros que ya encontraron familia. Se leen de la base
  // en vez de estar escritas aquí, así que marcar a alguien como "Adoptado" en
  // el panel lo mueve solo del catálogo a esta sección.
  const [historias, setHistorias] = React.useState([]);

  React.useEffect(() => {
    let vivo = true;
    window.db.listAnimals()
      .then((todos) => {
        if (vivo) setHistorias(todos.filter((a) => a.status === 'Adoptado').slice(0, 3));
      })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);

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
        <window.CarruselPerritos onSeeDog={onSeeDog} />
      </section>

      {/* Stats */}
      <section style={{ padding: '0 48px 64px', display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        <StatCounter value="+60" label="perritos con hogar" />
        <StatCounter value="4" label="fundadoras" tone="neutral" />
        <StatCounter value="100%" label="adopción responsable" tone="neutral" />
      </section>

      {/* Stories — solo aparece si hay perros adoptados que contar. Una sección
          vacía en la portada se lee como un sitio a medio hacer; mejor que no
          esté hasta que haya una historia real. */}
      {historias.length > 0 ? (
        <section style={{ padding: '64px 48px', background: 'var(--surface-alt)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Historias que transforman vidas</span>
            <h2 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '10px 0 32px' }}>De la calle a un hogar para siempre</h2>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {historias.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSeeDog(s)}
                  style={{ flex: '1 1 300px', background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', overflow: 'hidden', cursor: 'pointer' }}
                >
                  <div style={{
                    height: 160,
                    background: s.photo
                      ? `${s.photo_pos || 'center'}/cover no-repeat url(${s.photo})`
                      : 'linear-gradient(120deg, var(--sage-100), var(--blue-100))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sage-600)',
                  }}>
                    {!s.photo ? <i data-lucide="images" style={{ width: 32, height: 32 }} /> : null}
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ font: 'var(--font-h4)', color: 'var(--text-primary)' }}>{s.name}</div>
                    <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: '6px 0 0' }}>
                      {s.bio || 'Encontró su hogar para siempre.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <Button variant="secondary" icon="arrow-right" onClick={() => onNavigate('historias')}>Ver todas las historias</Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* Aliados */}
      <section style={{ padding: '72px 48px', maxWidth: 1000, margin: '0 auto' }}>
        <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-sponsor)', textTransform: 'uppercase' }}>Aliados</span>
        <h2 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '10px 0 18px' }}>Las grandes historias comienzan con una alianza.</h2>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', maxWidth: 720 }}>
          En Adopta un Olvidado creemos que cambiar la vida de un perrito no es una tarea que podamos hacer solos. Hoy reconocemos a <b>Hotel PupuClub</b>, que abrió sus puertas como hogar temporal y espacio de rehabilitación para nuestros rescatados.
        </p>
        <div style={{ display: 'flex', gap: 14, marginTop: 22 }}>
          <Button variant="secondary" icon="play">Conoce la historia de Snow</Button>
          <Button variant="sponsor" icon="hand-heart" onClick={() => onNavigate('alianza')}>Quiero aliarme como marca</Button>
        </div>
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="¡Dona hoy!">
        <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', marginBottom: 16 }}>"Un gesto tuyo puede ser el comienzo de su historia feliz."</p>
        <window.BloqueDonacion variante="sponsor" />
      </Modal>
    </div>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Home };
