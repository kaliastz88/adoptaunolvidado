function Apadrina({ onSeeDog, onNavigate }) {
  const { Button, DogCard } = window.AdoptaUnOlvidadoDesignSystem_167478;

  // Se muestran perros reales, no un texto genérico. Apadrinar empieza por
  // elegir a quién, así que la página tiene que poner caras enfrente.
  const [perros, setPerros] = React.useState([]);

  React.useEffect(() => {
    let vivo = true;
    window.db.listAnimals()
      .then((todos) => {
        if (!vivo) return;
        const esperando = todos.filter((a) => a.status !== 'Adoptado');
        // Los de energía baja y los mayores son los que más tardan en ser
        // adoptados, así que son los que más necesitan un padrino.
        setPerros(esperando.slice(0, 3));
      })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const PASOS = [
    { icon: 'paw-print', titulo: 'Eliges a quién', texto: 'Entras al catálogo y escoges al perrito que quieres acompañar. Con nombre y cara, no una causa abstracta.' },
    { icon: 'calendar-check', titulo: 'Defines tu aporte', texto: 'Decides cuánto quieres dar al mes. Cubre su comida, su veterinario y sus cuidados mientras espera familia.' },
    { icon: 'mail', titulo: 'Recibes sus noticias', texto: 'Te contamos cómo va tu ahijado, y te avisamos el día que encuentre hogar. Puedes dejar de apadrinar cuando quieras.' },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 48px' }}>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-sponsor)', textTransform: 'uppercase' }}>Apadrina</span>
      <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-primary)', margin: '12px 0 20px' }}>{T('apadrina.titulo', 'Acompaña una historia hasta su final feliz.')}</h1>
      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 16, maxWidth: 680 }}>
        {T('apadrina.intro', 'Cuando apadrinas a uno de nuestros rescatados, te conviertes en parte de su camino: desde su recuperación hasta el momento en que encuentra una familia que lo ame para siempre.')}
      </p>

      {/* La diferencia con donar se explica de frente. Es la primera duda de
          cualquiera que llega aquí, y dejarla sin responder cuesta apoyos. */}
      <div style={{ background: 'var(--surface-alt)', borderRadius: 'var(--radius-card)', padding: '20px 24px', marginBottom: 40, maxWidth: 680 }}>
        <p style={{ font: 'var(--font-body-base)', color: 'var(--text-primary)', margin: 0 }}>
          <b>¿En qué se diferencia de donar?</b> Donar apoya a todos los rescatados a la vez y
          se usa donde haga más falta. Apadrinar es hacerte cargo de <b>uno en particular</b>, cada
          mes, y recibir noticias suyas hasta que lo adopten. Apadrinar tampoco es adoptar: el
          perrito se queda en su hogar temporal.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 48 }}>
        {PASOS.map((p, i) => (
          <div key={p.titulo} style={{ background: 'var(--surface-alt)', borderRadius: 'var(--radius-card)', padding: 28 }}>
            <i data-lucide={p.icon} style={{ width: 26, height: 26, color: 'var(--action-sponsor)' }} />
            <h3 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '14px 0 8px' }}>
              {i + 1}. {p.titulo}
            </h3>
            <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', margin: 0 }}>{p.texto}</p>
          </div>
        ))}
      </div>

      {perros.length > 0 ? (
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ font: 'var(--font-h3)', color: 'var(--text-primary)', margin: '0 0 8px' }}>Están esperando un padrino</h2>
          <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', margin: '0 0 24px' }}>
            Entra a su ficha y presiona <b>Apadrinar</b>.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {perros.map((d) => (
              <DogCard key={d.id} name={d.name} age={d.age} size={d.size}
                       photo={d.photo} photoPos={d.photo_pos}
                       tone="available" onClick={() => onSeeDog(d)} />
            ))}
          </div>
        </section>
      ) : null}

      <div style={{ textAlign: 'center' }}>
        <Button variant="sponsor" icon="paw-print" wag onClick={() => onNavigate('catalogo')}>
          Ver a todos y elegir a mi ahijado
        </Button>
        <p style={{ font: 'var(--font-h3)', color: 'var(--action-sponsor)', margin: '40px 0 0' }}>
          Ser padrino es acompañar una historia, ser parte de una transformación.
        </p>
      </div>
    </div>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Apadrina };
