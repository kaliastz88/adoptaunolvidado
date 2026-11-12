// Enlaces de Instagram que la fundadora pidió poner en esta página.
const REEL_ATLAS = 'https://www.instagram.com/reel/DdDZ5RyhfHQ/';

function Aliados({ onNavigate }) {
  const { Seccion, useFotos } = window.UI;
  const { Button } = window.AdoptaUnOlvidadoDesignSystem_167478;

  // Logos de otros aliados, subidos desde el panel (Fotos → Logos de aliados).
  // El aliado destacado va escrito aquí porque su texto cuenta una historia
  // concreta (la de Atlas) que no cabe en un campo de formulario.
  const otros = useFotos('aliados') || [];

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  // "Hogar temporal" salió de esta lista a pedido de la fundadora: no es una
  // alianza de marca, tiene su propio espacio en la página Voluntario.
  const WAYS = [
    { icon: 'stethoscope', title: 'Servicios veterinarios', body: [
      <React.Fragment key="1"><b>Tu ayuda también puede salvar una vida.</b> Si eres veterinario o cuentas con una clínica, puedes apoyarnos ofreciendo consultas, cirugías o tratamientos a precio aliado. Cada atención nos permite seguir cuidando a nuestros olvidados y darles la oportunidad de recuperarse y encontrar un hogar.</React.Fragment>,
      <b key="2">Súmate y ayúdanos a seguir salvando vidas.</b>,
    ] },
    { icon: 'megaphone', title: 'Difusión de marca', body: [
      'Comparte nuestras redes, historias y casos de rescate con tu comunidad. Muchas veces, una publicación compartida puede llegar justo a la persona que necesitamos para cambiar una vida: un adoptante, un donador, un hogar temporal o alguien dispuesto a ayudar.',
      <b key="2">Ayúdanos a compartir, porque compartir también salva vidas.</b>,
    ] },
    { icon: 'package', title: 'Donación en especie', body: [
      'Alimento, medicamentos, camas, transportadoras y material de cuidado.',
    ] },
  ];

  return (
    <Seccion tono="ambar" ancho={1000}>
      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 44px' }}>
        <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-sponsor-text)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>Aliados</span>
        <h1 style={{ font: 'var(--font-h2)', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '12px 0 16px' }}>Las grandes historias comienzan con una alianza.</h1>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', margin: 0 }}>
          En Adopta un Olvidado creemos que cambiar la vida de un perrito no es una tarea que podamos hacer solos. Cada rescate es posible gracias a personas y marcas que deciden sumarse.
        </p>
      </div>

      {/* ALIADO DESTACADO */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: 36, marginBottom: 56, display: 'flex', gap: 36, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '0 0 auto', margin: '0 auto' }}>
          <div style={{ width: 180, height: 180, borderRadius: '50%', overflow: 'hidden', background: '#16452f', boxShadow: 'var(--shadow-lg)' }}>
            <img src="../../assets/aliados/the-pup-club-mx.jpg" alt="Logo de The Pup Club MX"
                 style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.04)', display: 'block' }} />
          </div>
        </div>
        <div style={{ flex: '1 1 380px', minWidth: 260 }}>
          <span style={{ font: 'var(--font-caption)', color: 'var(--action-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>Aliado destacado</span>
          <h2 style={{ font: 'var(--font-h3)', color: 'var(--text-primary)', margin: '8px 0 4px' }}>Hotel ThePupClub.mx</h2>
          <p style={{ font: 'var(--font-h4)', fontWeight: 500, color: 'var(--action-primary)', margin: '0 0 14px' }}>Un hogar temporal puede cambiarlo todo.</p>
          <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', margin: '0 0 12px' }}>
            The Pup Club es un hotel lleno de diversión para perritos y, ahora, también se ha convertido en un lugar muy especial para nuestros rescatados. Nos abrieron sus puertas para recibir temporalmente a uno de nuestros perritos y transformar este espacio en un lugar de <b>rehabilitación, entrenamiento y socialización</b>, donde podamos acompañar de cerca cada paso de su recuperación hasta encontrar a su familia ideal.
          </p>
          <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
            Hoy, ese perrito es <b>Atlas</b>. Aquí empieza una nueva etapa para él: aprender, confiar, jugar y descubrir que la vida también puede ser bonita.
          </p>
          <Button variant="secondary" icon="play" onClick={() => window.open(REEL_ATLAS, '_blank', 'noopener')}>Mira el video de Atlas</Button>
        </div>
      </div>

      {otros.length > 0 ? (
        <div style={{ marginBottom: 56, textAlign: 'center' }}>
          <h2 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '0 0 20px' }}>También nos acompañan</h2>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
            {otros.map((a) => {
              const logo = (
                <div title={a.titulo} style={{ width: 120, textAlign: 'center' }}>
                  <div style={{ width: 120, height: 120, borderRadius: '50%', background: `#fff ${a.photo_pos || 'center'}/cover no-repeat url(${a.photo})`, boxShadow: 'var(--shadow-card)' }}
                       role="img" aria-label={a.titulo ? `Logo de ${a.titulo}` : 'Logo de un aliado'} />
                  {a.titulo ? <div style={{ font: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)', marginTop: 8 }}>{a.titulo}</div> : null}
                </div>
              );
              return a.enlace
                ? <a key={a.id} href={a.enlace} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{logo}</a>
                : <div key={a.id}>{logo}</div>;
            })}
          </div>
        </div>
      ) : null}

      <h2 style={{ font: 'var(--font-h3)', color: 'var(--text-primary)', margin: '0 0 20px', textAlign: 'center' }}>Formas de aliarte</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginBottom: 20 }}>
        {WAYS.map((w) => (
          <div key={w.title} style={{ background: '#fff', borderRadius: 'var(--radius-card)', padding: 26 }}>
            <i data-lucide={w.icon} style={{ width: 24, height: 24, color: 'var(--action-primary)' }} />
            <h3 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '12px 0 8px' }}>{w.title}</h3>
            {w.body.map((t, k) => (
              <p key={k} style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: k ? '10px 0 0' : 0 }}>{t}</p>
            ))}
          </div>
        ))}
      </div>
      <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', textAlign: 'center', margin: '0 0 40px' }}>
        ¿Quieres abrirle tu casa a un rescatado?{' '}
        <a onClick={() => onNavigate('voluntario')} style={{ cursor: 'pointer', fontWeight: 600 }}>Conoce cómo ser hogar temporal →</a>
      </p>

      <div style={{ textAlign: 'center' }}>
        <Button variant="sponsor" icon="hand-heart" onClick={() => onNavigate('alianza')}>Quiero aliarme como marca</Button>
      </div>
    </Seccion>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Aliados };
