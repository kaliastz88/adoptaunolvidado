function Donar() {
  const IMPACT = [
    { icon: 'stethoscope', title: 'Atención veterinaria', body: 'Consultas, curaciones, vacunas y desparasitación para cada rescatado.' },
    { icon: 'bone', title: 'Alimentación diaria', body: 'Comida adecuada durante todo su proceso de recuperación.' },
    { icon: 'house-heart', title: 'Hogar temporal', body: 'Un espacio seguro donde rehabilitarse mientras encuentra familia.' },
  ];
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 48px' }}>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-cta)', textTransform: 'uppercase' }}>Donar</span>
      <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-primary)', margin: '12px 0 16px' }}>{T('donar.titulo', 'Tu donación es el primer paso de su nueva vida.')}</h1>
      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 660 }}>
        {T('donar.intro', 'Cada aporte se convierte en atención médica, alimento y un lugar seguro donde sanar. Así es como tu ayuda se transforma en una historia feliz.')}
      </p>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 340px', minWidth: 300, background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: 28 }}>
          <window.BloqueDonacion variante="cta" />
        </div>
        <div style={{ flex: '1 1 320px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {IMPACT.map((i) => (
            <div key={i.title} style={{ display: 'flex', gap: 14, background: 'var(--surface-alt)', borderRadius: 'var(--radius-card)', padding: 20 }}>
              <i data-lucide={i.icon} style={{ width: 24, height: 24, color: 'var(--action-cta)', flexShrink: 0 }} />
              <div>
                <h4 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '0 0 4px' }}>{i.title}</h4>
                <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: 0 }}>{i.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Donar };
