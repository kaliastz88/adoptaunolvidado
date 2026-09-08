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
  const { Button } = window.AdoptaUnOlvidadoDesignSystem_167478;

  function goProfile(dog) { setProfileDog(dog); setRoute('perfil'); }

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
        {route === 'home' && <Home onSeeDog={goProfile} onNavigate={setRoute} />}
        {route === 'catalogo' && <Catalogo onSeeDog={goProfile} />}
        {route === 'perfil' && <DogProfile dog={profileDog} onBack={() => setRoute('catalogo')} />}
        {route === 'historia' && <Historia />}
        {route === 'faq' && <FAQ />}
        {route === 'apadrina' && <Apadrina />}
        {route === 'voluntario' && <Voluntario />}
        {route === 'donar' && <Donar />}
        {route === 'historias' && <Historias />}
        {route === 'aliados' && <Aliados />}
        {route === 'contacto' && <Contacto />}
      </main>

      <footer style={{ background: 'var(--blue-900)', color: 'var(--text-on-dark)', padding: '48px', marginTop: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <Logo inverse />
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {NAV.map((n) => <span key={n} onClick={() => setRoute(ROUTES[n] || 'home')} style={{ font: 'var(--font-body-sm)', opacity: 0.85, cursor: 'pointer' }}>{n}</span>)}
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <i data-lucide="camera" style={{ width: 20, height: 20 }} />
          </div>
        </div>
      </footer>
    </div>
  );
}

window.App = App;
