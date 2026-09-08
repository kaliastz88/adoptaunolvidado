function Contacto() {
  const { Input, Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  return (
    <div style={{ maxWidth: 940, margin: '0 auto', padding: '56px 48px' }}>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Contacto</span>
      <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-primary)', margin: '12px 0 16px' }}>Escríbenos, te respondemos.</h1>
      <div style={{ background: 'var(--status-warning-bg)', border: '1px solid var(--amber-200)', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: 32, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <i data-lucide="alert-triangle" style={{ width: 18, height: 18, color: 'var(--amber-600)', flexShrink: 0, marginTop: 2 }} />
        <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-primary)', margin: 0 }}>
          Placeholder — faltan los datos reales de contacto (correo, teléfono, Instagram, ciudad). Reemplázalos antes de publicar.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 340px', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 16, background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: 28 }}>
          <Input label="Nombre completo" placeholder="Escribe tu nombre" />
          <Input label="Correo" placeholder="tucorreo@email.com" />
          <Input label="Mensaje" placeholder="¿En qué podemos ayudarte?" />
          <Button variant="primary" icon="send">Enviar mensaje</Button>
        </div>
        <div style={{ flex: '1 1 260px', minWidth: 240, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { icon: 'mail', label: 'Correo', value: '[pendiente]' },
            { icon: 'phone', label: 'Línea de apadrinamiento', value: '[pendiente]' },
            { icon: 'camera', label: 'Instagram', value: '[pendiente]' },
            { icon: 'map-pin', label: 'Ciudad', value: '[pendiente]' },
          ].map((c) => (
            <div key={c.label} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', padding: 16 }}>
              <i data-lucide={c.icon} style={{ width: 20, height: 20, color: 'var(--action-primary)', flexShrink: 0 }} />
              <div>
                <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{c.label}</div>
                <div style={{ font: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{c.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Contacto };
