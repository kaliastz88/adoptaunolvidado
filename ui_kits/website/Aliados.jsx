function Aliados() {
  const { Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const WAYS = [
    { icon: 'home', title: 'Hogar temporal', body: 'Abre tus puertas como espacio de rehabilitación para nuestros rescatados.' },
    { icon: 'stethoscope', title: 'Servicios veterinarios', body: 'Apoya con consultas, cirugías o tratamientos a precio aliado.' },
    { icon: 'megaphone', title: 'Difusión de marca', body: 'Comparte nuestras historias con tu comunidad y amplifica cada rescate.' },
    { icon: 'package', title: 'Donación en especie', body: 'Alimento, medicamentos, camas, transportadoras y material de cuidado.' },
  ];
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 48px' }}>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-sponsor)', textTransform: 'uppercase' }}>Aliados</span>
      <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-primary)', margin: '12px 0 16px' }}>Las grandes historias comienzan con una alianza.</h1>
      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 700 }}>
        En Adopta un Olvidado creemos que cambiar la vida de un perrito no es una tarea que podamos hacer solos. Cada rescate es posible gracias a personas y marcas que deciden sumarse.
      </p>

      <div style={{ background: 'var(--surface-brand-soft)', borderRadius: 'var(--radius-card)', padding: 32, marginBottom: 44, display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ width: 120, height: 120, borderRadius: 'var(--radius-md)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue-400)', flexShrink: 0 }}>
          <i data-lucide="building-2" style={{ width: 36, height: 36 }} />
        </div>
        <div style={{ flex: '1 1 320px', minWidth: 280 }}>
          <span style={{ font: 'var(--font-caption)', color: 'var(--action-primary)', fontWeight: 700, textTransform: 'uppercase' }}>Aliado destacado</span>
          <h3 style={{ font: 'var(--font-h3)', color: 'var(--text-primary)', margin: '8px 0 10px' }}>Hotel PupuClub</h3>
          <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
            Abrió sus puertas como hogar temporal y espacio de rehabilitación para nuestros rescatados, acompañando de cerca la recuperación de Snow.
          </p>
          <Button variant="secondary" icon="play">Conoce la historia de Snow</Button>
        </div>
      </div>

      <h2 style={{ font: 'var(--font-h3)', color: 'var(--text-primary)', marginBottom: 20 }}>Formas de aliarte</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 44 }}>
        {WAYS.map((w) => (
          <div key={w.title} style={{ background: 'var(--surface-alt)', borderRadius: 'var(--radius-card)', padding: 22 }}>
            <i data-lucide={w.icon} style={{ width: 24, height: 24, color: 'var(--action-sponsor)' }} />
            <h4 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '12px 0 6px' }}>{w.title}</h4>
            <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: 0 }}>{w.body}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <Button variant="sponsor" icon="hand-heart">Quiero aliarme como marca</Button>
      </div>
    </div>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Aliados };
