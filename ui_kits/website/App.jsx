function Logo({ inverse }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img src="../../assets/logo/adopta-un-olvidado-logo.png" alt="Adopta un Olvidado" style={{ height: 34, width: 34 }} />
      <span style={{ font: '700 20px var(--font-display)', color: inverse ? '#fff' : 'var(--blue-600)' }}>
        Adopta <em style={{ fontStyle: 'italic', fontWeight: 400 }}>un Olvidado</em>
      </span>
    </span>
  );
}

const NAV = ['Adopta', 'Apadrina', 'Historias', 'Aliados', 'Voluntario', 'Nuestra historia', 'Preguntas frecuentes', 'Contacto'];
const ROUTES = { 'Adopta': 'catalogo', 'Apadrina': 'apadrina', 'Historias': 'historias', 'Aliados': 'aliados', 'Voluntario': 'voluntario', 'Nuestra historia': 'historia', 'Preguntas frecuentes': 'faq', 'Contacto': 'contacto' };

function App() {
  const [route, setRoute] = React.useState('home');
  const [profileDog, setProfileDog] = React.useState(null);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const { Home } = window.WebsiteScreens;
  const { Catalogo } = window.WebsiteScreens;
  const { DogProfile } = window.WebsiteScreens;
  const { Historia } = window.WebsiteScreens;
  const { FAQ } = window.WebsiteScreens;
  const { Apadrina } = window.WebsiteScreens;
  const { Voluntario } = window.WebsiteScreens;
  const { Donar } = window.WebsiteScreens;
  const { Historias } = window.WebsiteScreens;
  const { Aliados } = window.WebsiteScreens;
  const { Contacto } = window.WebsiteScreens;
  const { SolicitudAdopcion } = window.WebsiteScreens;
  const { SolicitudAlianza } = window.WebsiteScreens;
  const { SolicitudApadrinar } = window.WebsiteScreens;
  const { Button } = window.AdoptaUnOlvidadoDesignSystem_167478;

  function goProfile(dog) { setProfileDog(dog); setRoute('perfil'); }

  // Cambiar de pantalla siempre desde arriba: llegar a la mitad de un
  // formulario porque la pantalla anterior venía con scroll desorienta.
  function irA(r) { setRoute(r); window.scrollTo({ top: 0 }); }

  // La solicitud arranca arriba del todo: es una pantalla larga y llegar a la
  // mitad del formulario porque la anterior venía con scroll desorienta.
  function goSolicitud(dog) {
    setProfileDog(dog);
    setRoute('solicitud');
    window.scrollTo({ top: 0 });
  }

  function goApadrinar(dog) {
    setProfileDog(dog);
    setRoute('apadrinar');
    window.scrollTo({ top: 0 });
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-page)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', zIndex: 20, borderBottom: '1px solid var(--border-subtle)' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => setRoute('home')}><Logo /></span>
        <nav style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {NAV.map((n) => (
            <a key={n} onClick={() => setRoute(ROUTES[n] || 'home')} style={{ font: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>{n}</a>
          ))}
          <Button variant="cta" icon="heart" wag size="sm" onClick={() => setRoute('donar')}>Donar</Button>
          <a href="admin.html" style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)', marginLeft: 4 }} title="Panel de administración">
            <i data-lucide="settings" style={{ width: 16, height: 16 }} />
          </a>
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        {route === 'home' && <Home onSeeDog={goProfile} onNavigate={irA} />}
        {route === 'catalogo' && <Catalogo onSeeDog={goProfile} />}
        {route === 'perfil' && <DogProfile dog={profileDog} onBack={() => setRoute('catalogo')} onAdoptar={goSolicitud} onApadrinar={goApadrinar} />}
        {route === 'solicitud' && <SolicitudAdopcion dog={profileDog} onBack={() => setRoute('perfil')} />}
        {route === 'historia' && <Historia />}
        {route === 'faq' && <FAQ />}
        {route === 'apadrina' && <Apadrina onSeeDog={goProfile} onNavigate={irA} />}
        {route === 'apadrinar' && <SolicitudApadrinar dog={profileDog} onBack={() => setRoute('perfil')} />}
        {route === 'voluntario' && <Voluntario />}
        {route === 'donar' && <Donar />}
        {route === 'historias' && <Historias onSeeDog={goProfile} onNavigate={setRoute} />}
        {route === 'aliados' && <Aliados onNavigate={irA} />}
        {route === 'alianza' && <SolicitudAlianza onBack={() => setRoute('aliados')} />}
        {route === 'contacto' && <Contacto />}
      </main>

      <footer style={{ background: 'var(--blue-900)', color: 'var(--text-on-dark)', padding: '48px', marginTop: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <Logo inverse />
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {NAV.map((n) => <span key={n} onClick={() => setRoute(ROUTES[n] || 'home')} style={{ font: 'var(--font-body-sm)', opacity: 0.85, cursor: 'pointer' }}>{n}</span>)}
          </div>
          <a
            href={window.REDES.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram de Adopta un Olvidado, ${window.REDES.usuario}`}
            style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text-on-dark)', textDecoration: 'none' }}
          >
            <i data-lucide="instagram" style={{ width: 20, height: 20 }} />
            <span style={{ font: 'var(--font-body-sm)', opacity: 0.85 }}>{window.REDES.usuario}</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

window.App = App;
