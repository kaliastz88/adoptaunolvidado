function Historias({ onSeeDog, onNavigate }) {
  const { Seccion, Encabezado, Tarjeta } = window.UI;
  const { Badge, Button } = window.AdoptaUnOlvidadoDesignSystem_167478;

  // Los finales felices son, literalmente, los perros marcados como "Adoptado"
  // en el panel. No hay una lista aparte que mantener al día: al cambiarle el
  // estado a un perro se mueve solo del catálogo a esta página.
  const [finales, setFinales] = React.useState(null);

  React.useEffect(() => {
    let vivo = true;
    window.db.listAnimals()
      .then((todos) => { if (vivo) setFinales(todos.filter((a) => a.status === 'Adoptado')); })
      .catch(() => { if (vivo) setFinales([]); });
    return () => { vivo = false; };
  }, []);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  // El antes y el ahora, lado a lado. Es la pieza central de la página: una
  // foto de un perro feliz no dice nada por sí sola; junto a la del rescate lo
  // dice todo. Si todavía no hay foto de familia, la del rescate ocupa el ancho
  // completo en vez de dejar un hueco.
  function AntesYAhora({ a }) {
    const tieneFamilia = !!a.foto_familia;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: tieneFamilia ? '1fr 1fr' : '1fr', height: 230 }}>
        <div style={{
          position: 'relative',
          background: a.photo
            ? `${a.photo_pos || 'center'}/cover no-repeat url(${a.photo})`
            : 'linear-gradient(120deg, var(--blue-100), var(--terracotta-50))',
        }}>
          {tieneFamilia ? <span style={etiquetaFoto}>Antes</span> : null}
        </div>
        {tieneFamilia ? (
          <div style={{
            position: 'relative',
            background: `${a.foto_familia_pos || 'center'}/cover no-repeat url(${a.foto_familia})`,
            borderLeft: '3px solid var(--surface-card)',
          }}>
            <span style={{ ...etiquetaFoto, background: 'var(--status-success)' }}>Ahora</span>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Seccion tono="crema" ancho={1060}>
      <Encabezado
        eyebrow="Finales felices"
        titulo={T('historias.titulo', 'Cada adopción cambia dos vidas.')}
        entrada={T('historias.intro', 'Estas son algunas de las transformaciones que hemos acompañado. Rescatar es solo el comienzo.')}
      />

      <div style={{ marginTop: 44 }}>
        {finales === null ? (
          <p style={{ font: 'var(--font-body-base)', color: 'var(--text-muted)' }}>Cargando finales felices...</p>
        ) : finales.length === 0 ? (
          <Tarjeta style={{ padding: '48px 32px', textAlign: 'center' }}>
            <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
              Todavía no hemos publicado ningún final feliz. Aquí va a aparecer cada
              perrito que encuentre su hogar.
            </p>
            <Button variant="primary" icon="paw-print" onClick={() => onNavigate('catalogo')}>
              Conoce a los que siguen esperando
            </Button>
          </Tarjeta>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 26, alignItems: 'start' }}>
            {finales.map((a, i) => (
              <Tarjeta
                key={a.id}
                onClick={() => onSeeDog(a)}
                style={{ marginTop: i % 2 === 1 ? 30 : 0 }}
              >
                <AntesYAhora a={a} />
                <div style={{ padding: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                    <h3 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: 0 }}>{a.name}</h3>
                    <Badge tone="success" icon="check">Adoptado</Badge>
                  </div>
                  {a.fecha_adopcion ? (
                    <div style={{ font: 'var(--font-caption)', color: 'var(--status-success)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: 10 }}>
                      Encontró familia en {a.fecha_adopcion}
                    </div>
                  ) : null}
                  <p style={{ font: 'var(--font-body-base)', color: 'var(--text-primary)', margin: '0 0 12px' }}>
                    {a.historia_final || a.bio || 'Encontró la familia que lo estaba esperando.'}
                  </p>
                  <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
                    {[a.age, a.size].filter(Boolean).join(' · ')}
                  </span>
                </div>
              </Tarjeta>
            ))}
          </div>
        )}
      </div>

      {finales && finales.length > 0 ? (
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <p style={{ font: 'var(--font-h3)', color: 'var(--status-success)', marginBottom: 20 }}>
            ¿Quieres ser parte del próximo final feliz?
          </p>
          <Button variant="primary" icon="paw-print" wag onClick={() => onNavigate('catalogo')}>Conoce a nuestros perritos</Button>
        </div>
      ) : null}
    </Seccion>
  );
}

const etiquetaFoto = {
  position: 'absolute', top: 12, left: 12,
  background: 'var(--blue-600)', color: '#fff',
  font: 'var(--font-caption)', fontWeight: 700,
  padding: '4px 12px', borderRadius: 'var(--radius-pill)',
  textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)',
};

window.WebsiteScreens = { ...window.WebsiteScreens, Historias };
