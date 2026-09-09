function Historias({ onSeeDog, onNavigate }) {
  const { Badge, Button } = window.AdoptaUnOlvidadoDesignSystem_167478;

  // Las historias de éxito son, literalmente, los perros marcados como
  // "Adoptado" en el panel. No hay una lista aparte que mantener al día: al
  // cambiarle el estado a un perro, se mueve solo del catálogo a esta página.
  const [historias, setHistorias] = React.useState(null);

  React.useEffect(() => {
    let vivo = true;
    window.db.listAnimals()
      .then((todos) => { if (vivo) setHistorias(todos.filter((a) => a.status === 'Adoptado')); })
      .catch(() => { if (vivo) setHistorias([]); });
    return () => { vivo = false; };
  }, []);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 48px' }}>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--status-success)', textTransform: 'uppercase' }}>Historias de éxito</span>
      <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-primary)', margin: '12px 0 16px' }}>{T('historias.titulo', 'Cada adopción cambia dos vidas.')}</h1>
      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 660 }}>
        {T('historias.intro', 'Estas son algunas de las transformaciones que hemos acompañado. Rescatar es solo el comienzo.')}
      </p>

      {historias === null ? (
        <p style={{ font: 'var(--font-body-base)', color: 'var(--text-muted)' }}>Cargando historias...</p>
      ) : historias.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: '48px 32px', textAlign: 'center' }}>
          <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
            Todavía no hemos publicado ninguna historia de adopción. Aquí va a aparecer
            cada perrito que encuentre su hogar.
          </p>
          <Button variant="primary" icon="paw-print" onClick={() => onNavigate('catalogo')}>
            Conoce a los que siguen esperando
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22 }}>
          {historias.map((s) => (
            <div
              key={s.id}
              onClick={() => onSeeDog(s)}
              style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', overflow: 'hidden', cursor: 'pointer' }}
            >
              <div style={{
                height: 180,
                background: s.photo
                  ? `${s.photo_pos || 'center'}/cover no-repeat url(${s.photo})`
                  : 'linear-gradient(120deg, var(--sage-100), var(--blue-100))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sage-600)',
              }}>
                {!s.photo ? <i data-lucide="images" style={{ width: 34, height: 34 }} /> : null}
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                  <h3 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: 0 }}>{s.name}</h3>
                  <Badge tone="success" icon="check">Adoptado</Badge>
                </div>
                <p style={{ font: 'var(--font-body-base)', color: 'var(--text-primary)', margin: '0 0 12px' }}>
                  {s.bio || 'Encontró la familia que lo estaba esperando.'}
                </p>
                <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
                  {[s.age, s.size].filter(Boolean).join(' · ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {historias && historias.length > 0 ? (
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <p style={{ font: 'var(--font-h3)', color: 'var(--status-success)', marginBottom: 20 }}>¿Quieres ser parte de la próxima historia?</p>
          <Button variant="primary" icon="paw-print" onClick={() => onNavigate('catalogo')}>Conoce a nuestros perritos</Button>
        </div>
      ) : null}
    </div>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Historias };
