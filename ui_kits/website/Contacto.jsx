function Contacto() {
  const { Seccion, Encabezado, Tarjeta } = window.UI;
  const { Input, Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  return (
    <Seccion tono="crema" ancho={940}>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Contacto</span>
      <h1 style={{ font: 'var(--font-h1)', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '12px 0 16px' }}>Escríbenos, te respondemos.</h1>
      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 620 }}>
        {T('contacto.intro', 'La forma más rápida de encontrarnos es por Instagram, ahí contestamos todos los días.')}
      </p>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 340px', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 16, background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: 28 }}>
          <Input label="Nombre completo" placeholder="Escribe tu nombre" />
          <Input label="Correo" placeholder="tucorreo@email.com" />
          <Input label="Mensaje" placeholder="¿En qué podemos ayudarte?" />
          <Button variant="primary" icon="send">Enviar mensaje</Button>
        </div>
        <div style={{ flex: '1 1 260px', minWidth: 240, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Solo se listan los datos que existen de verdad. Un renglón que dice
              "pendiente" en un sitio público se lee como abandono; es mejor que
              no esté hasta que haya un correo y un teléfono reales. */}
          {/* Un dato vacío no se pinta. Así, dejar en blanco el teléfono desde
              el panel lo quita del sitio, en vez de dejar un renglón vacío. */}
          {[
            { icon: 'mail', label: 'Correo', value: T('contacto.correo', ''), href: T('contacto.correo', '') ? 'mailto:' + T('contacto.correo', '') : '' },
            { icon: 'phone', label: 'Teléfono o WhatsApp', value: T('contacto.telefono', '') },
            { icon: 'instagram', label: 'Instagram', value: window.REDES.usuario, href: window.REDES.instagram },
            { icon: 'map-pin', label: 'Ciudad', value: T('contacto.ciudad', 'Ciudad de México') },
          ].filter((c) => c.value).map((c) => {
            const contenido = (
              <React.Fragment>
                <i data-lucide={c.icon} style={{ width: 20, height: 20, color: 'var(--action-primary)', flexShrink: 0 }} />
                <div>
                  <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{c.label}</div>
                  <div style={{ font: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{c.value}</div>
                </div>
              </React.Fragment>
            );
            const estilo = { display: 'flex', gap: 12, alignItems: 'center', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', padding: 16, textDecoration: 'none' };
            return c.href
              ? <a key={c.label} href={c.href} target={/^mailto:/.test(c.href) ? undefined : '_blank'} rel="noopener noreferrer" style={estilo}>{contenido}</a>
              : <div key={c.label} style={estilo}>{contenido}</div>;
          })}
        </div>
      </div>
    </Seccion>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Contacto };
