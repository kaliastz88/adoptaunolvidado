// =============================================================================
// Portada — rediseño de noviembre 2026 siguiendo la referencia de la fundadora:
// foto grande a la derecha sobre crema, fila «Conoce a nuestros perros»,
// mosaico de bloques azul / foto / crema, y estrellas doradas como las del logo.
//
// Las fotos salen, en este orden: álbum «Portada» del panel → fotos de los
// perritos en adopción → un bloque azul con el logo. Así la página se ve
// completa desde el primer día y mejora sola en cuanto se suben fotos.
// =============================================================================

function Home({ onSeeDog, onNavigate }) {
  const { Button, Modal, DogCard } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const { Seccion, Encabezado, Tarjeta, PatitaFoto, Estrella, Antecedente, useFotos } = window.UI;
  const [donarAbierto, setDonarAbierto] = React.useState(false);
  const angosto = window.useEsAngosto(820);

  const portada = useFotos('portada') || [];
  const [esperando, setEsperando] = React.useState([]);
  const [historias, setHistorias] = React.useState([]);
  const [fotoPatita, setFotoPatita] = React.useState('');

  React.useEffect(() => {
    let vivo = true;
    window.db.listAnimals()
      .then((todos) => {
        if (!vivo) return;
        // Barajados: la portada no debe mostrar siempre a los mismos.
        const e = todos.filter((a) => a.status !== 'Adoptado');
        for (let k = e.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [e[k], e[j]] = [e[j], e[k]]; }
        setEsperando(e);
        setHistorias(todos.filter((a) => a.status === 'Adoptado').slice(0, 3));
        const conFamilia = todos.find((a) => a.foto_familia);
        const conFoto = todos.find((a) => a.photo);
        setFotoPatita((conFamilia && conFamilia.foto_familia) || (conFoto && conFoto.photo) || '');
      })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const conFoto = esperando.filter((a) => a.photo).map((a) => ({ src: a.photo, pos: a.photo_pos }));
  const fotos = [...portada.map((f) => ({ src: f.photo, pos: f.photo_pos })), ...conFoto];
  const fotoHero = fotos[0];
  const fotoMosaico1 = fotos[1];
  const fotoMosaico2 = fotos[2];

  const fraseManuscrita = T('home.frase', 'Ellos también sienten');

  return (
    <div>
      {/* ================= HERO ================= */}
      <section style={{ position: 'relative', background: 'var(--surface-page)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: angosto ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', minHeight: angosto ? 0 : 520 }}>
          {/* Texto */}
          <div style={{
            order: angosto ? 2 : 1, position: 'relative', zIndex: 1,
            padding: angosto ? '36px 20px 48px' : '96px 48px 80px max(48px, calc((100vw - 1200px) / 2 + 40px))',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            {!angosto ? <Estrella size={26} style={{ position: 'absolute', top: 70, left: 'max(20px, calc((100vw - 1200px) / 2 + 8px))' }} /> : null}
            <h1 style={{ font: 'var(--font-hero)', color: 'var(--text-primary)', margin: '0 0 20px', maxWidth: 540 }}>
              {T('home.titulo', 'Un gesto tuyo puede ser el comienzo de su historia feliz.')}
            </h1>
            <p style={{ font: 'var(--font-eyebrow)', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 14px', maxWidth: 440, lineHeight: 1.7 }}>
              {T('home.eyebrow', 'Rescate · rehabilitación · adopción responsable')}
            </p>
            <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', margin: '0 0 28px', maxWidth: 480 }}>
              {T('home.subtitulo', 'Rescatamos, rehabilitamos y encontramos el hogar correcto para cada perrito olvidado.')}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button variant="cta" icon="paw-print" wag onClick={() => onNavigate('catalogo')}>Conoce a nuestros perros →</Button>
              <Button variant="secondary" icon="heart" onClick={() => setDonarAbierto(true)}>Dona hoy</Button>
            </div>
          </div>

          {/* Foto */}
          <div style={{ order: angosto ? 1 : 2, position: 'relative', minHeight: angosto ? 300 : 520 }}>
            {fotoHero ? (
              <div role="img" aria-label="Uno de nuestros rescatados" style={{
                position: 'absolute', inset: 0,
                background: `${fotoHero.pos || 'center'}/cover no-repeat url(${fotoHero.src})`,
              }} />
            ) : (
              // Sin fotos todavía: un cielo azul con el logo, como su insignia.
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 55% 45%, var(--blue-500), var(--blue-600) 60%, var(--blue-800))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="../../assets/logo/adopta-un-olvidado-logo-dorado.png" alt="" style={{ width: angosto ? 180 : 260, borderRadius: '50%', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }} />
                {[[12, 18, 22], [78, 22, 16], [86, 70, 26], [20, 76, 14], [60, 12, 12]].map(([x, y, s], i) => (
                  <Estrella key={i} size={s} style={{ position: 'absolute', left: `${x}%`, top: `${y}%` }} />
                ))}
              </div>
            )}
            {/* Fundido hacia el crema, para que la foto se integre con el texto. */}
            {!angosto ? <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, var(--surface-page) 0%, rgba(248,242,232,0) 22%)' }} /> : null}
            {fraseManuscrita ? (
              <div style={{ position: 'absolute', right: angosto ? 18 : 48, top: angosto ? 18 : 48, textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--font-script)', fontSize: angosto ? '2rem' : '2.8rem', lineHeight: 1, color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.45)', display: 'block', maxWidth: 220 }}>
                  {fraseManuscrita}
                </span>
                <Estrella size={18} style={{ marginLeft: 'auto', marginTop: 6 }} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ================= CONOCE A NUESTROS PERROS ================= */}
      <section style={{ background: 'var(--surface-alt)', padding: 'clamp(48px, 7vw, 72px) clamp(20px, 5vw, 48px)', borderTop: '1px solid rgba(8,43,92,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: angosto ? '1fr' : '280px minmax(0, 1fr)', gap: angosto ? 28 : 40, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Antecedente>Ellos todavía esperan</Antecedente>
            <h2 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '12px 0 14px' }}>Conoce a nuestros perros</h2>
            <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
              Cada uno tiene una historia, una personalidad y un corazón enorme. Solo necesitan una familia que los elija.
            </p>
            <button onClick={() => onNavigate('catalogo')} style={{
              background: 'none', border: 'none', padding: '0 0 3px', cursor: 'pointer', fontFamily: 'var(--font-body)',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--action-primary)',
              borderBottom: '1.5px solid var(--amber-500)',
            }}>Ver todos los perros →</button>
          </div>
          {esperando.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
              {esperando.slice(0, 4).map((d) => (
                <DogCard key={d.id} name={d.name} age={d.age} size={d.size} photo={d.photo} photoPos={d.photo_pos} onClick={() => onSeeDog(d)} />
              ))}
            </div>
          ) : (
            <div style={{ border: '1.5px dashed rgba(8,43,92,0.2)', borderRadius: 'var(--radius-card)', padding: 32, textAlign: 'center', color: 'var(--text-secondary)' }}>
              Aquí aparecen los perritos en adopción en cuanto se cargan en el panel.
            </div>
          )}
        </div>
      </section>

      {/* ================= MOSAICO ================= */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: angosto ? '1fr' : [fotoMosaico1 && '1fr', '1.15fr', '1fr', fotoMosaico2 && '1fr', '1.15fr'].filter(Boolean).join(' '),
      }}>
        {fotoMosaico1 ? <div role="img" aria-label="Uno de nuestros rescatados" style={{ minHeight: 260, background: `${fotoMosaico1.pos || 'center'}/cover no-repeat url(${fotoMosaico1.src})` }} /> : null}

        <div style={{ background: 'var(--blue-600)', color: '#fff', padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ font: 'var(--font-eyebrow)', color: 'var(--amber-500)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Los olvidados</span>
          <h3 style={{ font: 'var(--font-h3)', color: '#fff', margin: '10px 0 12px' }}>Los que llevan más tiempo esperando.</h3>
          <p style={{ font: 'var(--font-body-sm)', color: 'rgba(255,255,255,0.85)', margin: '0 0 22px' }}>
            Algunos llevan meses. Otros llevan años. Y siguen esperando que alguien los vea.
          </p>
          <button onClick={() => onNavigate('catalogo')} style={{
            alignSelf: 'flex-start', background: 'transparent', color: 'var(--amber-500)', cursor: 'pointer',
            border: '1.5px solid var(--amber-500)', borderRadius: 'var(--radius-button)', padding: '11px 18px',
            fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>Conoce sus historias →</button>
        </div>

        {/* La cifra real de la fundadora (+60), editable desde el panel. */}
        <div style={{ background: 'var(--blue-800)', color: '#fff', padding: '40px 28px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <Estrella size={16} style={{ position: 'absolute', top: 24, left: 26 }} />
          <Estrella size={22} style={{ position: 'absolute', bottom: 30, right: 28 }} />
          <span style={{ font: 'var(--font-eyebrow)', color: 'var(--amber-500)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Desde que empezamos</span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 4.2rem)', lineHeight: 1, margin: '12px 0 6px' }}>{T('home.stat1.valor', '+60')}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--amber-500)' }}>{T('home.stat1.etiqueta', 'perritos con hogar')}</div>
          <p style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.75)', margin: '14px 0 0', maxWidth: 200 }}>No es solo un número: es una vida que cambió.</p>
        </div>

        {fotoMosaico2 ? <div role="img" aria-label="Uno de nuestros rescatados" style={{ minHeight: 260, background: `${fotoMosaico2.pos || 'center'}/cover no-repeat url(${fotoMosaico2.src})` }} /> : null}

        <div style={{ background: 'var(--surface-page)', padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          <Antecedente>¿Quieres ayudar?</Antecedente>
          <h3 style={{ font: 'var(--font-h3)', color: 'var(--text-primary)', margin: '10px 0 12px' }}>Hay muchas formas de hacer la diferencia.</h3>
          <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: '0 0 22px' }}>
            Puedes adoptar, apadrinar, ser hogar temporal, donar o compartir su historia.
          </p>
          <div><Button variant="cta" size="sm" onClick={() => onNavigate('voluntario')}>Quiero ayudar →</Button></div>
        </div>
      </section>

      {/* ================= FINALES FELICES ================= */}
      {historias.length > 0 ? (
        <Seccion tono="crema">
          <Antecedente>Finales felices</Antecedente>
          <h2 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '12px 0 32px' }}>De la calle a un hogar para siempre</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 22 }}>
            {historias.map((s) => (
              <Tarjeta key={s.id} onClick={() => onSeeDog(s)}>
                <div style={{
                  aspectRatio: '4 / 3',
                  background: (s.foto_familia || s.photo)
                    ? `${(s.foto_familia ? s.foto_familia_pos : s.photo_pos) || 'center'}/cover no-repeat url(${s.foto_familia || s.photo})`
                    : 'linear-gradient(120deg, var(--blue-100), var(--amber-50))',
                }} />
                <div style={{ padding: 20 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>{s.name}</div>
                  <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: '6px 0 0' }}>
                    {s.historia_final || 'Encontró su hogar para siempre.'}
                  </p>
                </div>
              </Tarjeta>
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            <Button variant="primary" onClick={() => onNavigate('historias')}>Ver todos los finales felices →</Button>
          </div>
        </Seccion>
      ) : null}

      {/* ================= PATITA ================= */}
      <Seccion tono="crema" py={72}>
        <div style={{ display: 'flex', gap: 56, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <PatitaFoto src={fotoPatita} ancho={angosto ? 240 : 300} />
          <div style={{ flex: '1 1 340px', minWidth: 260, maxWidth: 520 }}>
            <p style={{ font: 'var(--font-h3)', color: 'var(--text-primary)', margin: 0 }}>
              {T('home.patita.texto', 'Ninguno de ellos eligió la calle. Pero tú sí puedes elegir sacarlos de ahí.')}
            </p>
            {T('home.patita.firma', 'Las cuatro fundadoras de Adopta un Olvidado') ? (
              <p style={{ fontFamily: 'var(--font-script)', fontSize: '1.9rem', color: 'var(--action-primary)', margin: '18px 0 0' }}>
                — {T('home.patita.firma', 'Las cuatro fundadoras de Adopta un Olvidado')}
              </p>
            ) : null}
          </div>
        </div>
      </Seccion>

      {/* ================= ALIADOS ================= */}
      <Seccion tono="azul" py={72}>
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 440px', minWidth: 260 }}>
            <Encabezado
              tono="azul"
              eyebrow="Aliados"
              titulo={T('home.aliados.titulo', 'Las grandes historias comienzan con una alianza.')}
              entrada={T('home.aliados.texto', 'En Adopta un Olvidado creemos que cambiar la vida de un perrito no es una tarea que podamos hacer solos. Hoy reconocemos a Hotel ThePupClub.mx, que abrió sus puertas como hogar temporal y espacio de rehabilitación para nuestros rescatados.')}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <Button variant="cta" icon="hand-heart" wag onClick={() => onNavigate('alianza')}>Quiero aliarme como marca</Button>
              <button onClick={() => onNavigate('aliados')} style={{
                background: 'transparent', color: '#fff', cursor: 'pointer', border: '1.5px solid rgba(255,255,255,0.6)',
                borderRadius: 'var(--radius-button)', padding: '13px 22px', fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
              }}>Conoce a nuestros aliados</button>
            </div>
          </div>
          <div style={{ flex: '0 1 260px', display: 'flex', justifyContent: 'center', margin: '0 auto' }}>
            <div style={{ width: 220, height: 220, borderRadius: '50%', overflow: 'hidden', background: '#16452f', boxShadow: '0 0 0 6px rgba(255,195,40,0.9), var(--shadow-lg)' }}>
              <img src="../../assets/aliados/the-pup-club-mx.jpg" alt="Logo de The Pup Club MX, nuestro aliado destacado"
                   style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.04)', display: 'block' }} />
            </div>
          </div>
        </div>
      </Seccion>

      {/* ================= CIERRE ================= */}
      <Seccion tono="ambar" py={64}>
        <div style={{ textAlign: 'center' }}>
          <Estrella size={24} style={{ margin: '0 auto 14px' }} />
          <h2 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '0 0 12px' }}>
            {esperando.length > 0 ? `${esperando.length} esperan hoy.` : 'Cada uno espera su segunda oportunidad.'}
          </h2>
          <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', margin: '0 auto 28px', maxWidth: 520 }}>
            Adoptar, apadrinar o donar. Cualquiera de las tres cambia una vida esta semana.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" icon="paw-print" wag onClick={() => onNavigate('catalogo')}>Ver a los perritos</Button>
            <Button variant="secondary" icon="hand-heart" onClick={() => onNavigate('apadrina')}>Apadrinar a uno</Button>
          </div>
        </div>
      </Seccion>

      <Modal open={donarAbierto} onClose={() => setDonarAbierto(false)} title="¡Dona hoy!">
        <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', marginBottom: 16 }}>"Un gesto tuyo puede ser el comienzo de su historia feliz."</p>
        <window.BloqueDonacion variante="sponsor" />
      </Modal>
    </div>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Home };
