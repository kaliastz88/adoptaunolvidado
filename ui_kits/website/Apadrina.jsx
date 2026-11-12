function Apadrina({ onSeeDog, onNavigate }) {
  const { Seccion, Encabezado, Tarjeta } = window.UI;
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

  // Textos de la fundadora (notas de noviembre 2026). Los párrafos van en un
  // arreglo para respetar sus saltos de línea.
  const PASOS = [
    { icon: 'paw-print', titulo: 'Eliges a quién', texto: [
      'Entra a nuestro catálogo y conoce a los perritos que hoy necesitan de ti. Porque cuando apadrinas, no ayudas a una causa lejana: estás acompañando a un perrito que tiene nombre, historia y muchas ganas de sentirse querido.',
    ] },
    { icon: 'calendar-check', titulo: 'Defines tu aporte', texto: [
      'Elige el monto que quieras aportar cada mes y ayúdanos a que no le falte nada. Con tu apoyo podemos cubrir su comida, sus cuidados y la atención veterinaria que necesite mientras llega el momento de encontrar su familia.',
    ] },
    { icon: 'mail', titulo: 'Acompáñalo en su camino', texto: [
      'Te iremos contando cómo está tu ahijado, sus avances y sus momentos especiales. Y, por supuesto, serás de los primeros en saberlo cuando encuentre su familia.',
      'Puedes acompañarlo durante el tiempo que quieras y pausar tu apadrinamiento cuando lo necesites.',
    ] },
  ];

  return (
    <Seccion tono="ambar" ancho={1000}>
      {/* Encabezado centrado y más contenido: la fundadora pidió que los
          textos iniciales no fueran «taaan grandes» y que fueran centrados. */}
      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px' }}>
        <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-sponsor-text)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>Apadrina</span>
        <h1 style={{ font: 'var(--font-h2)', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '12px 0 16px' }}>{T('apadrina.titulo', 'Acompaña una historia hasta su final feliz.')}</h1>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', margin: 0 }}>
          {T('apadrina.intro', 'Cuando apadrinas a uno de nuestros rescatados, te conviertes en parte de su camino: desde su recuperación hasta el momento en que encuentra una familia que lo ame para siempre.')}
        </p>
      </div>

      {/* La diferencia con donar se explica de frente. Es la primera duda de
          cualquiera que llega aquí, y dejarla sin responder cuesta apoyos. */}
      <div style={{ background: 'var(--surface-alt)', borderRadius: 'var(--radius-card)', padding: '20px 24px', margin: '0 auto 40px', maxWidth: 720 }}>
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
            {p.texto.map((t, k) => (
              <p key={k} style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', margin: k ? '10px 0 0' : 0 }}>{t}</p>
            ))}
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
    </Seccion>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Apadrina };
