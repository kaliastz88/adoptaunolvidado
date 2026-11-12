// Abre un mensaje directo de Instagram con la cuenta de Adopta. Es donde el
// equipo contesta todos los días, así que es el camino más corto para que una
// persona interesada hable con alguien de verdad.
function enlaceMensajeInstagram() {
  const usuario = (window.REDES.usuario || '').replace(/^@/, '');
  return usuario ? `https://ig.me/m/${usuario}` : window.REDES.instagram;
}

function Voluntario() {
  const { Seccion, Galeria, useFotos } = window.UI;
  const { Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  // Fotos de voluntarios y hogares temporales (panel → Fotos). La fundadora
  // las va a mandar; mientras no existan, la página se ve completa sin ellas.
  const fotos = useFotos('voluntarios') || [];

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const parrafo = { font: 'var(--font-body-base)', color: 'var(--text-secondary)', margin: '0 0 14px' };
  const escribir = () => window.open(enlaceMensajeInstagram(), '_blank', 'noopener');

  return (
    <Seccion tono="arena" ancho={1000}>
      {/* Título mediano y centrado, como lo pidió la fundadora. */}
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 48px' }}>
        <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>Voluntario</span>
        <h1 style={{ font: 'var(--font-h2)', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '12px 0 0' }}>
          ¿Te gustaría ayudar como voluntario o ser hogar temporal?
        </h1>
      </div>

      {/* HOGAR TEMPORAL — va primero y más grande: la fundadora quiere darle
          la importancia que antes no tenía al estar perdido entre las
          formas de aliarse. */}
      <div style={{ background: 'var(--blue-600)', color: '#fff', borderRadius: 'var(--radius-card)', padding: 'clamp(28px, 5vw, 48px)', marginBottom: 32, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <i data-lucide="home" style={{ width: 28, height: 28, color: 'var(--amber-500)' }} />
          <h2 style={{ font: 'var(--font-h3)', color: '#fff', margin: 0 }}>¿Quieres ser hogar temporal?</h2>
        </div>
        <div style={{ maxWidth: 760 }}>
          <p style={{ ...parrafo, color: 'rgba(255,255,255,0.88)', font: 'var(--font-body-lg)' }}>
            A veces, para cambiar la vida de un perrito no hace falta adoptarlo para siempre, solo abrirle las puertas de tu casa por un tiempo. Tú pones el amor, el espacio, la paciencia y la oportunidad de enseñarle lo bonito que es vivir en un hogar: recibir cariño, aprender rutinas, confiar nuevamente y descubrir lo que significa sentirse seguro.
          </p>
          <p style={{ ...parrafo, color: 'rgba(255,255,255,0.88)' }}>
            <b style={{ color: '#fff' }}>Nosotras nos encargamos de la comida, los gastos veterinarios y de acompañarte durante todo el proceso.</b> Tú no estarás solo en el camino; seremos un equipo.
          </p>
          <p style={{ ...parrafo, color: 'rgba(255,255,255,0.88)' }}>
            Tu casa puede convertirse en ese lugar de transición que un perrito necesita para recuperarse, prepararse para su nueva vida y, finalmente, encontrar a su familia definitiva.
          </p>
          <p style={{ font: 'var(--font-h4)', color: 'var(--amber-500)', margin: '22px 0 24px' }}>
            Sé ese puente entre una historia difícil y una segunda oportunidad.
          </p>
          <Button variant="sponsor" icon="home" wag onClick={escribir}>Quiero ser hogar temporal</Button>
        </div>
      </div>

      {/* VOLUNTARIO */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', padding: 'clamp(28px, 5vw, 44px)', boxShadow: 'var(--shadow-card)', marginBottom: fotos.length ? 48 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <i data-lucide="hand-heart" style={{ width: 26, height: 26, color: 'var(--action-primary)' }} />
          <h2 style={{ font: 'var(--font-h3)', color: 'var(--text-primary)', margin: 0 }}>¿Quieres ser voluntario?</h2>
        </div>
        <div style={{ maxWidth: 760 }}>
          <p style={parrafo}>
            Hay muchas formas de ayudar y cada una puede hacer una diferencia enorme. Puedes acompañarnos al santuario, donde hay muchísimos perritos esperando algo tan sencillo y tan importante como un paseo, un abrazo, un momento de cariño o simplemente compartir un rato con ellos.
          </p>
          <p style={parrafo}>
            También puedes ayudarnos a <b>tomar fotos, crear videos y contar sus historias</b> para compartirlas en nuestras redes y aumentar sus posibilidades de encontrar una familia.
          </p>
          <p style={parrafo}>
            ¿Tienes una comunidad en redes? ¡También puedes ser parte del cambio desde ahí! Ayúdanos a compartir nuestras historias, difundir a nuestros perritos y promover nuestra merch, cuyos ingresos nos ayudan a cubrir sus gastos veterinarios.
          </p>
          <p style={{ font: 'var(--font-body-base)', fontWeight: 700, color: 'var(--text-primary)', margin: '18px 0 24px' }}>
            No importa cuánto tiempo tengas ni cuál sea tu talento: hay una forma de ayudar que puede cambiar una vida.
          </p>
          <Button variant="primary" icon="send" onClick={escribir}>Quiero ser voluntario</Button>
          <p style={{ font: 'var(--font-caption)', color: 'var(--text-secondary)', margin: '12px 0 0' }}>
            Te abrimos un mensaje en Instagram ({window.REDES.usuario}) para platicar.
          </p>
        </div>
      </div>

      <Galeria fotos={fotos} />
    </Seccion>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Voluntario };
window.enlaceMensajeInstagram = enlaceMensajeInstagram;
