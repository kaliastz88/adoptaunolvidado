function Voluntario() {
  const { Seccion, Encabezado, Tarjeta } = window.UI;
  const { Input, Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  return (
    <Seccion tono="arena" ancho={720}>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Voluntario</span>
      <h1 style={{ font: 'var(--font-h1)', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '12px 0 16px' }}>¿Quieres ser voluntario?</h1>
      <div style={{ background: 'var(--status-warning-bg)', border: '1px solid var(--amber-200)', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: 28, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <i data-lucide="alert-triangle" style={{ width: 18, height: 18, color: 'var(--amber-600)', flexShrink: 0, marginTop: 2 }} />
        <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-primary)', margin: 0 }}>
          Placeholder — el brief solo confirmó el título de esta sección; aún no hay copy final sobre cómo funciona el voluntariado. Este formulario es un layout de ejemplo, no texto listo para publicar.
        </p>
      </div>
      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 28 }}>
        Cuéntanos un poco de ti y te contactaremos con las formas en que puedes ayudar — paseos, transporte, hogares temporales, eventos y más.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: 28 }}>
        <Input label="Nombre completo" placeholder="Escribe tu nombre" />
        <Input label="Correo" placeholder="tucorreo@email.com" />
        <Input label="¿Cómo te gustaría ayudar?" placeholder="Paseos, transporte, hogar temporal..." />
        <Button variant="primary" icon="hand-heart">Enviar</Button>
      </div>
    </Seccion>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Voluntario };
