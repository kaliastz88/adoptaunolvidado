// =============================================================================
// Estructura del sitio: encabezado, navegación, pie y rutas.
//
// Rediseño de noviembre 2026, siguiendo la referencia de la fundadora: barra
// azul marino con el logo como insignia que «cuelga» sobre la página (así se
// integra y no parece una estampita), menú agrupado y pie con frase en letra
// manuscrita.
// =============================================================================

function LogoInsignia({ size = 76 }) {
  // Marco circular con el fondo del logo: el PNG trae esquinas blancas y así
  // nunca se ven, sobre ningún fondo.
  return (
    <span style={{
      display: 'block', width: size, height: size, borderRadius: '50%', overflow: 'hidden',
      background: '#0B1D47', boxShadow: '0 6px 18px rgba(4, 18, 48, 0.35)', flexShrink: 0,
    }}>
      <img src="../../assets/logo/adopta-un-olvidado-logo-dorado.png" alt="Adopta un Olvidado — inicio"
           style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.03)', display: 'block' }} />
    </span>
  );
}

// El menú agrupado. Antes eran nueve enlaces sueltos que se partían en dos
// renglones; agrupados caben en uno y se entiende qué es cada cosa.
const MENU = [
  { label: 'Adopta', ruta: 'catalogo' },
  { label: 'Finales felices', ruta: 'historias' },
  { label: 'Cómo ayudar', hijos: [
    { label: 'Apadrina', ruta: 'apadrina', icon: 'hand-heart' },
    { label: 'Voluntario y hogar temporal', ruta: 'voluntario', icon: 'home' },
    { label: 'Aliados', ruta: 'aliados', icon: 'handshake' },
    { label: 'Dona', ruta: 'donar', icon: 'heart' },
  ] },
  { label: 'Nosotras', hijos: [
    { label: 'Nuestra historia', ruta: 'historia', icon: 'book-heart' },
    { label: 'Preguntas frecuentes', ruta: 'faq', icon: 'circle-help' },
    { label: 'Contacto', ruta: 'contacto', icon: 'mail' },
  ] },
  { label: 'Tienda', ruta: 'tienda' },
];

// Cuándo pasar al menú de celular. Con matchMedia y no con CSS porque los
// estilos del sitio van en línea.
function useEsAngosto(px = 960) {
  const consulta = `(max-width: ${px}px)`;
  const [angosto, setAngosto] = React.useState(() => window.matchMedia(consulta).matches);
  React.useEffect(() => {
    const mq = window.matchMedia(consulta);
    const f = () => setAngosto(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, [consulta]);
  return angosto;
}

window.useEsAngosto = useEsAngosto;

const estiloEnlaceNav = {
  font: 'var(--font-body-sm)', fontWeight: 600, color: '#fff', cursor: 'pointer',
  background: 'none', border: 'none', padding: '8px 4px', display: 'inline-flex', alignItems: 'center', gap: 4,
  fontFamily: 'var(--font-body)', textDecoration: 'none',
};

function Desplegable({ item, ruta, irA }) {
  const [abierto, setAbierto] = React.useState(false);
  const ref = React.useRef(null);
  const activo = item.hijos.some((h) => h.ruta === ruta);

  React.useEffect(() => {
    if (!abierto) return undefined;
    const fuera = (e) => { if (ref.current && !ref.current.contains(e.target)) setAbierto(false); };
    const esc = (e) => { if (e.key === 'Escape') setAbierto(false); };
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', fuera); document.removeEventListener('keydown', esc); };
  }, [abierto]);

  return (
    <div ref={ref} style={{ position: 'relative' }}
         onMouseEnter={() => setAbierto(true)} onMouseLeave={() => setAbierto(false)}>
      <button aria-expanded={abierto} aria-haspopup="true" onClick={() => setAbierto((v) => !v)}
              style={{ ...estiloEnlaceNav, borderBottom: activo ? '2px solid var(--amber-500)' : '2px solid transparent' }}>
        {item.label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"
             style={{ transform: abierto ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {abierto ? (
        <div style={{ position: 'absolute', top: '100%', left: -12, paddingTop: 10, zIndex: 30 }}>
          <div role="menu" style={{
            background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-lg)',
            padding: 8, minWidth: 250, borderTop: '3px solid var(--amber-500)',
          }}>
            {item.hijos.map((h) => (
              <button key={h.ruta} role="menuitem" onClick={() => { setAbierto(false); irA(h.ruta); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                        padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: h.ruta === ruta ? 'var(--surface-alt)' : 'transparent',
                        font: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-alt)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = h.ruta === ruta ? 'var(--surface-alt)' : 'transparent'; }}>
                <i data-lucide={h.icon} style={{ width: 16, height: 16, color: 'var(--action-primary)' }} />
                {h.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EncabezadoSitio({ ruta, irA }) {
  const { Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const angosto = useEsAngosto();
  const [menuMovil, setMenuMovil] = React.useState(false);

  React.useEffect(() => { setMenuMovil(false); }, [ruta]);
  React.useEffect(() => {
    document.body.style.overflow = menuMovil ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuMovil]);

  const ir = (r) => { setMenuMovil(false); irA(r); };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--blue-600)', boxShadow: '0 2px 0 var(--amber-500)' }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', height: angosto ? 64 : 72, padding: '0 clamp(16px, 4vw, 40px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, position: 'relative',
      }}>
        {/* La insignia sobresale de la barra hacia abajo, como en la referencia. */}
        <button onClick={() => ir('home')} aria-label="Ir al inicio"
                style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', alignSelf: 'flex-start', marginTop: 8, position: 'relative', zIndex: 2 }}>
          <LogoInsignia size={angosto ? 64 : 84} />
        </button>

        {!angosto ? (
          <nav aria-label="Principal" style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            {MENU.map((m) => m.hijos
              ? <Desplegable key={m.label} item={m} ruta={ruta} irA={ir} />
              : (
                <button key={m.label} onClick={() => ir(m.ruta)}
                        style={{ ...estiloEnlaceNav, borderBottom: ruta === m.ruta ? '2px solid var(--amber-500)' : '2px solid transparent' }}>
                  {m.label}
                </button>
              ))}
          </nav>
        ) : null}

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Button variant="cta" icon="heart" wag size="sm" onClick={() => ir('donar')}>Donar</Button>
          {!angosto ? (
            <a href={window.REDES.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${window.REDES.usuario}`} style={{ color: '#fff', display: 'flex' }}>
              <i data-lucide="instagram" style={{ width: 20, height: 20 }} />
            </a>
          ) : (
            <button onClick={() => setMenuMovil((v) => !v)} aria-expanded={menuMovil} aria-label={menuMovil ? 'Cerrar menú' : 'Abrir menú'}
                    style={{ border: 'none', background: 'none', color: '#fff', cursor: 'pointer', padding: 6, display: 'flex' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {menuMovil ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* MENÚ DE CELULAR — panel completo, todo visible sin submenús anidados. */}
      {angosto && menuMovil ? (
        <nav aria-label="Principal" style={{
          position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, background: 'var(--blue-600)',
          overflowY: 'auto', padding: '28px 24px 40px', borderTop: '2px solid var(--amber-500)',
        }}>
          {MENU.map((m) => (
            <div key={m.label} style={{ marginBottom: m.hijos ? 18 : 4 }}>
              {m.hijos ? (
                <React.Fragment>
                  <div style={{ font: 'var(--font-eyebrow)', color: 'var(--amber-500)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '14px 0 6px' }}>{m.label}</div>
                  {m.hijos.map((h) => (
                    <button key={h.ruta} onClick={() => ir(h.ruta)} style={{ ...estiloEnlaceNav, display: 'flex', width: '100%', fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 400, padding: '8px 0' }}>
                      {h.label}
                    </button>
                  ))}
                </React.Fragment>
              ) : (
                <button onClick={() => ir(m.ruta)} style={{ ...estiloEnlaceNav, display: 'flex', width: '100%', fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, padding: '8px 0' }}>
                  {m.label}
                </button>
              )}
            </div>
          ))}
          <a href={window.REDES.instagram} target="_blank" rel="noopener noreferrer" style={{ ...estiloEnlaceNav, marginTop: 20 }}>
            <i data-lucide="instagram" style={{ width: 20, height: 20 }} /> {window.REDES.usuario}
          </a>
        </nav>
      ) : null}
    </header>
  );
}

function Pie({ irA }) {
  const { Estrella } = window.UI;
  const enlaces = [];
  MENU.forEach((m) => (m.hijos ? m.hijos.forEach((h) => enlaces.push(h)) : enlaces.push(m)));
  return (
    <footer style={{ background: 'var(--blue-600)', color: 'var(--text-on-dark)', position: 'relative', zIndex: 1, borderTop: '2px solid var(--amber-500)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '44px clamp(20px, 5vw, 48px) 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <LogoInsignia size={64} />
          <span style={{ fontFamily: 'var(--font-script)', fontSize: '1.85rem', fontWeight: 500, color: '#fff', lineHeight: 1 }}>
            Juntos podemos más <span style={{ color: 'var(--amber-500)' }} aria-hidden="true">♡</span>
          </span>
        </div>
        <a href={window.REDES.instagram} target="_blank" rel="noopener noreferrer"
           aria-label={`Instagram de Adopta un Olvidado, ${window.REDES.usuario}`}
           style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#fff', textDecoration: 'none' }}>
          <i data-lucide="instagram" style={{ width: 20, height: 20 }} />
          <span style={{ font: 'var(--font-body-sm)', fontWeight: 600 }}>{window.REDES.usuario}</span>
        </a>
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px) 32px' }}>
        <nav aria-label="Pie de página" style={{ display: 'flex', gap: '10px 26px', flexWrap: 'wrap', paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          {enlaces.map((e) => (
            <button key={e.ruta} onClick={() => irA(e.ruta)} style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'rgba(255,255,255,0.82)',
              font: 'var(--font-caption)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-body)',
            }}>{e.label}</button>
          ))}
        </nav>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 22 }}>
          <span style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.6)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Estrella size={12} /> Adopta un Olvidado · Ciudad de México
          </span>
          <a href="admin.html" style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.45)' }}>Panel</a>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [route, setRoute] = React.useState('home');
  const [profileDog, setProfileDog] = React.useState(null);

  // Los textos se cargan una sola vez y se guardan en un global que cualquier
  // pantalla puede leer con T(). El contador solo sirve para volver a pintar
  // cuando llegan; hasta entonces se ven los valores por defecto del código.
  const [, setTextosListos] = React.useState(0);
  React.useEffect(() => {
    let vivo = true;
    window.db.cargarTextos()
      .then((mapa) => { if (vivo) { window.TEXTOS = mapa; setTextosListos((n) => n + 1); } })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const S = window.WebsiteScreens;

  // Cambiar de pantalla siempre desde arriba: llegar a la mitad de un
  // formulario porque la pantalla anterior venía con scroll desorienta.
  function irA(r) { setRoute(r); window.scrollTo({ top: 0 }); }
  function goProfile(dog) { setProfileDog(dog); irA('perfil'); }
  function goSolicitud(dog) { setProfileDog(dog); irA('solicitud'); }
  function goApadrinar(dog) { setProfileDog(dog); irA('apadrinar'); }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-page)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <a href="#contenido" style={{ position: 'absolute', left: -9999, top: 0 }}
         onFocus={(e) => { e.currentTarget.style.left = '8px'; }} onBlur={(e) => { e.currentTarget.style.left = '-9999px'; }}>
        Saltar al contenido
      </a>
      <window.Huellas />
      <EncabezadoSitio ruta={route} irA={irA} />

      <main id="contenido" style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {route === 'home' && <S.Home onSeeDog={goProfile} onNavigate={irA} />}
        {route === 'catalogo' && <S.Catalogo onSeeDog={goProfile} />}
        {route === 'perfil' && <S.DogProfile dog={profileDog} onBack={() => irA('catalogo')} onAdoptar={goSolicitud} onApadrinar={goApadrinar} />}
        {route === 'solicitud' && <S.SolicitudAdopcion dog={profileDog} onBack={() => irA('perfil')} />}
        {route === 'historia' && <S.Historia />}
        {route === 'faq' && <S.FAQ />}
        {route === 'apadrina' && <S.Apadrina onSeeDog={goProfile} onNavigate={irA} />}
        {route === 'apadrinar' && <S.SolicitudApadrinar dog={profileDog} onBack={() => irA('perfil')} />}
        {route === 'voluntario' && <S.Voluntario />}
        {route === 'donar' && <S.Donar />}
        {route === 'historias' && <S.Historias onSeeDog={goProfile} onNavigate={irA} />}
        {route === 'aliados' && <S.Aliados onNavigate={irA} />}
        {route === 'alianza' && <S.SolicitudAlianza onBack={() => irA('aliados')} />}
        {route === 'contacto' && <S.Contacto />}
        {route === 'tienda' && <S.Tienda />}
      </main>

      <Pie irA={irA} />
    </div>
  );
}

window.App = App;
