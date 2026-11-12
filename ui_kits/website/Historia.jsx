function Historia() {
  const { Seccion, Galeria, useFotos } = window.UI;
  // Las fotos se suben desde el panel → Fotos → «Fundadoras» y «Nuestra historia».
  const fundadoras = useFotos('fundadoras') || [];
  const galeria = useFotos('historia') || [];

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  // Texto de la fundadora, notas de noviembre 2026.
  const steps = [
    { icon: 'heart-pulse', title: 'Rescate y recuperación', body: 'Atendemos sus necesidades físicas y emocionales. Brindamos atención veterinaria, curaciones, vacunas, desparasitación, esterilización y todo lo necesario para que puedan comenzar a recuperarse.' },
    { icon: 'sparkles', title: 'Rehabilitación', body: 'Porque algunas heridas no se ven, trabajamos también en su mente y en sus emociones. A través del entrenamiento, la socialización, el cariño y la convivencia en hogares temporales, los ayudamos a recuperar la confianza en las personas y en el mundo que los rodea.' },
    { icon: 'graduation-cap', title: 'Preparación para una nueva vida', body: 'Les enseñamos que una casa puede ser un lugar seguro. Aprenden rutinas, convivencia, comandos básicos y herramientas que les permitirán adaptarse de mejor manera a su futuro hogar.' },
    { icon: 'home', title: 'Adopción responsable', body: <React.Fragment>No buscamos simplemente encontrarles una casa. Buscamos <b>la familia correcta para cada historia</b>. Conocemos su personalidad, sus necesidades y su proceso para encontrar un hogar donde realmente puedan ser felices y donde su adopción sea para siempre.</React.Fragment> },
  ];

  const p = { font: 'var(--font-body-lg)', color: 'var(--text-secondary)', margin: '0 0 18px' };

  return (
    <Seccion tono="crema" ancho={900}>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>Nuestra historia</span>
      <h1 style={{ font: 'var(--font-h1)', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '12px 0 28px' }}>Nació del amor, la empatía y el compromiso de cuatro amigas.</h1>

      <p style={p}>Antes de existir Adopta un Olvidado, cada una de nosotras ya había decidido hacer algo por aquellos perros que la sociedad muchas veces prefiere no mirar.</p>
      <p style={p}>Rescatábamos, ayudábamos, buscábamos hogares y acompañábamos historias difíciles por separado. Con el tiempo, algunos rescates nos fueron uniendo, comenzamos a trabajar juntas y descubrimos que, cuando sumábamos nuestras habilidades, podíamos llegar mucho más lejos.</p>
      <p style={{ ...p, color: 'var(--text-primary)' }}>Así nació <b>Adopta un Olvidado</b>.</p>

      {/* LAS FUNDADORAS — solo aparece cuando hay fotos en el panel. */}
      {fundadoras.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 190px))', justifyContent: 'center', gap: 28, margin: '40px 0 44px' }}>
          {fundadoras.map((f) => (
            <figure key={f.id} style={{ margin: 0, textAlign: 'center' }}>
              <div role="img" aria-label={f.titulo || 'Fundadora de Adopta un Olvidado'} style={{
                aspectRatio: '1 / 1', borderRadius: '50%', boxShadow: 'var(--shadow-card)',
                border: '4px solid var(--amber-500)',
                background: `${f.photo_pos || 'center'}/cover no-repeat url(${f.photo})`,
              }} />
              {f.titulo ? <figcaption style={{ font: 'var(--font-h4)', fontSize: 'var(--text-md)', color: 'var(--text-primary)', marginTop: 14 }}>{f.titulo}</figcaption> : null}
              {f.descripcion ? <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: '4px 0 0' }}>{f.descripcion}</p> : null}
            </figure>
          ))}
        </div>
      ) : null}

      <p style={p}>En México, miles de perros viven en las calles, expuestos al hambre, al maltrato, a enfermedades y a la indiferencia. Muchos pasan meses o incluso años esperando que alguien los vea. Nosotros creemos que <b style={{ color: 'var(--text-primary)' }}>ningún perro debería ser invisible y que todos merecen la oportunidad de conocer el amor, la seguridad y la tranquilidad de una familia.</b></p>
      <p style={p}>Pero para nosotras, rescatar no significa simplemente sacar a un perro de la calle.</p>
      <p style={p}>Significa acompañarlo en todo el proceso hasta que esté listo para comenzar una nueva vida.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, margin: '40px 0' }}>
        {steps.map((s) => (
          <div key={s.title} style={{ background: 'var(--surface-alt)', borderRadius: 'var(--radius-card)', padding: 24 }}>
            <i data-lucide={s.icon} style={{ width: 26, height: 26, color: 'var(--action-primary)' }} />
            <h3 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '12px 0 8px' }}>{s.title}</h3>
            <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', margin: '56px auto 0', maxWidth: 680 }}>
        <p style={{ font: 'var(--font-h3)', color: 'var(--action-primary)', margin: '0 0 16px' }}>Rescatar es solo el comienzo.</p>
        <p style={p}>Nuestra verdadera misión es <b style={{ color: 'var(--text-primary)' }}>transformar una vida, devolverles la confianza y demostrarles que aquello que vivieron no tiene que definir lo que les espera.</b></p>
        <p style={{ ...p, margin: 0 }}>Porque detrás de cada perro olvidado hay una historia que todavía puede tener un final feliz.</p>
      </div>

      {galeria.length > 0 ? (
        <div style={{ marginTop: 56 }}>
          <Galeria fotos={galeria} min={240} />
        </div>
      ) : null}
    </Seccion>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Historia };
