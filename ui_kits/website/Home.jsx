function Home({ onSeeDog, onNavigate }) {
  const { Button, Modal } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const { Seccion, Encabezado, Cifra, FranjaHuellas, Tarjeta } = window.UI;
  const [open, setOpen] = React.useState(false);

  // Las historias son los perros que ya encontraron familia. Se leen de la base
  // en vez de estar escritas aquí, así que marcar a alguien como "Adoptado" en
  // el panel lo mueve solo del catálogo a esta sección.
  const [historias, setHistorias] = React.useState([]);
  const [cuantos, setCuantos] = React.useState(0);

  React.useEffect(() => {
    let vivo = true;
    window.db.listAnimals()
      .then((todos) => {
        if (!vivo) return;
        setHistorias(todos.filter((a) => a.status === 'Adoptado').slice(0, 3));
        setCuantos(todos.filter((a) => a.status !== 'Adoptado').length);
      })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  return (
    <div>
      {/* HERO — asimétrico a propósito. El texto pesa más que la imagen porque
          la frase es lo que convence; el carrusel acompaña. */}
      <section style={{
        position: 'relative',
        padding: '72px 48px 96px',
        background: 'linear-gradient(165deg, var(--blue-50) 0%, var(--surface-page) 55%, var(--terracotta-50) 100%)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', gap: 56,
        }}>
          <div style={{ flex: '1 1 480px', minWidth: 300 }}>
            <span style={{
              font: 'var(--font-eyebrow)', color: 'var(--action-primary)',
              textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)',
            }}>
              {T('home.eyebrow', 'Rescate · rehabilitación · adopción responsable')}
            </span>

            {/* clamp deja que el título crezca con la pantalla sin pasarse en
                celular. Un tamaño fijo obliga a elegir entre uno pequeño en
                escritorio o uno que se desborda en móvil. */}
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(38px, 5.4vw, 66px)', lineHeight: 1.03,
              letterSpacing: '-0.03em', color: 'var(--text-primary)',
              margin: '18px 0 22px',
            }}>
              {T('home.titulo', 'Un gesto tuyo puede ser el comienzo de su historia feliz.')}
            </h1>

            <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 520 }}>
              {T('home.subtitulo', 'Rescatamos, rehabilitamos y encontramos el hogar correcto para cada perrito olvidado.')}
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Button variant="cta" icon="heart" wag size="lg" onClick={() => setOpen(true)}>Dona hoy</Button>
              <Button variant="secondary" icon="paw-print" size="lg" onClick={() => onNavigate('catalogo')}>Conoce a nuestros perritos</Button>
            </div>
          </div>

          <window.CarruselPerritos onSeeDog={onSeeDog} />
        </div>
      </section>

      {/* CIFRAS sobre azul a sangre. El bloque de color es lo que rompe la
          sucesión de crema y hace que el sitio deje de leerse plano. */}
      <Seccion tono="azul" curva py={64}>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'space-around', flexWrap: 'wrap' }}>
          <Cifra tono="azul" valor={T('home.stat1.valor', '+60')} etiqueta={T('home.stat1.etiqueta', 'perritos con hogar')} />
          <Cifra tono="azul" valor={T('home.stat2.valor', '4')} etiqueta={T('home.stat2.etiqueta', 'fundadoras')} />
          <Cifra tono="azul" valor={T('home.stat3.valor', '100%')} etiqueta={T('home.stat3.etiqueta', 'adopción responsable')} />
        </div>
      </Seccion>

      <FranjaHuellas tono="azul" />

      {/* HISTORIAS — solo aparece si hay perros adoptados que contar. Una
          sección vacía en la portada se lee como un sitio a medio hacer. */}
      {historias.length > 0 ? (
        <Seccion tono="crema" curva>
          <Encabezado
            eyebrow="Historias que transforman vidas"
            titulo="De la calle a un hogar para siempre"
          />
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 40, alignItems: 'flex-start' }}>
            {historias.map((s, i) => (
              <Tarjeta
                key={s.id}
                onClick={() => onSeeDog(s)}
                // El desfase vertical alternado quita la rigidez de la retícula
                // sin romperla. Es el gesto más barato contra lo plano.
                style={{ flex: '1 1 300px', marginTop: i === 1 ? 28 : 0 }}
              >
                <div style={{
                  height: 200,
                  background: s.photo
                    ? `${s.photo_pos || 'center'}/cover no-repeat url(${s.photo})`
                    : 'linear-gradient(120deg, var(--sage-100), var(--blue-100))',
                  position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute', top: 14, left: 14,
                    background: 'var(--status-success)', color: '#fff',
                    font: 'var(--font-body-sm)', fontWeight: 700,
                    padding: '6px 13px', borderRadius: 'var(--radius-pill)',
                  }}>Ya tiene familia</span>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ font: 'var(--font-h4)', color: 'var(--text-primary)' }}>{s.name}</div>
                  <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: '8px 0 0' }}>
                    {s.bio || 'Encontró su hogar para siempre.'}
                  </p>
                </div>
              </Tarjeta>
            ))}
          </div>
          <div style={{ marginTop: 36 }}>
            <Button variant="secondary" icon="arrow-right" onClick={() => onNavigate('historias')}>Ver todas las historias</Button>
          </div>
        </Seccion>
      ) : null}

      {/* ALIADOS sobre ámbar, el tercer color de la marca. Tres tonos alternados
          bastan para dar ritmo; un cuarto empezaría a verse desordenado. */}
      <Seccion tono="ambar" curva>
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 460px', minWidth: 300 }}>
            <Encabezado
              tono="ambar"
              eyebrow="Aliados"
              titulo={T('home.aliados.titulo', 'Las grandes historias comienzan con una alianza.')}
              entrada={T('home.aliados.texto', 'En Adopta un Olvidado creemos que cambiar la vida de un perrito no es una tarea que podamos hacer solos. Hoy reconocemos a Hotel PupuClub, que abrió sus puertas como hogar temporal y espacio de rehabilitación para nuestros rescatados.')}
            />
            <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
              <Button variant="sponsor" icon="hand-heart" wag onClick={() => onNavigate('alianza')}>Quiero aliarme como marca</Button>
            </div>
          </div>
          <div style={{ flex: '0 1 280px', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 220, height: 220, borderRadius: '50%',
              background: 'var(--surface-card)', boxShadow: 'var(--shadow-lg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--action-sponsor)',
            }}>
              <i data-lucide="hand-heart" style={{ width: 72, height: 72 }} />
            </div>
          </div>
        </div>
      </Seccion>

      {/* CIERRE — última llamada antes del pie. Terminar en crema y sin nada
          más desaprovecha el único momento en que alguien ya leyó todo. */}
      <Seccion tono="terracota" curva py={72}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            {cuantos > 0 ? `${cuantos} esperan hoy.` : 'Cada uno espera su segunda oportunidad.'}
          </h2>
          <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', margin: '0 auto 28px', maxWidth: 520 }}>
            Adoptar, apadrinar o donar. Cualquiera de las tres cambia una vida esta semana.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="cta" icon="paw-print" wag onClick={() => onNavigate('catalogo')}>Ver a los perritos</Button>
            <Button variant="sponsor" icon="hand-heart" onClick={() => onNavigate('apadrina')}>Apadrinar a uno</Button>
          </div>
        </div>
      </Seccion>

      <Modal open={open} onClose={() => setOpen(false)} title="¡Dona hoy!">
        <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', marginBottom: 16 }}>"Un gesto tuyo puede ser el comienzo de su historia feliz."</p>
        <window.BloqueDonacion variante="sponsor" />
      </Modal>
    </div>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Home };
