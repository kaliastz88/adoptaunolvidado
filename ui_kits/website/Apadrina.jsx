function Apadrina() {
  const { Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '56px 48px' }}>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-sponsor)', textTransform: 'uppercase' }}>Apadrina</span>
      <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-primary)', margin: '12px 0 20px' }}>Acompaña una historia hasta su final feliz.</h1>
      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 680 }}>
        Cuando apadrinas a uno de nuestros rescatados, te conviertes en parte de su camino: desde su recuperación y rehabilitación hasta el momento en que encuentra una familia que lo ame para siempre.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        <div style={{ background: 'var(--surface-alt)', borderRadius: 'var(--radius-card)', padding: 28 }}>
          <i data-lucide="calendar-check" style={{ width: 26, height: 26, color: 'var(--action-sponsor)' }} />
          <h3 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '14px 0 8px' }}>Aporte mensual automático</h3>
          <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)' }}>
            Realiza tu aporte mensual desde la sección Donar, seleccionando la opción de aporte mensual. Nos permite cubrir a tiempo la manutención, tratamientos y cuidados de nuestros rescatados. Recibirás información y actualizaciones sobre tu ahijado.
          </p>
          <Button variant="sponsor" icon="hand-heart" style={{ marginTop: 16 }}>Elegir aporte mensual</Button>
        </div>
        <div style={{ background: 'var(--surface-alt)', borderRadius: 'var(--radius-card)', padding: 28 }}>
          <i data-lucide="gift" style={{ width: 26, height: 26, color: 'var(--action-sponsor)' }} />
          <h3 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '14px 0 8px' }}>Aporte voluntario</h3>
          <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)' }}>
            Realiza un aporte de valor libre, una vez al mes o las veces que desees apoyarnos. Comunícate con nuestra línea de apadrinamiento y te compartiremos la evolución de tu ahijado hasta encontrar su hogar definitivo.
          </p>
          <Button variant="secondary" icon="message-circle" style={{ marginTop: 16 }}>Contactar línea de apadrinamiento</Button>
        </div>
      </div>

      <p style={{ font: 'var(--font-h3)', color: 'var(--action-sponsor)', textAlign: 'center', margin: '48px 0 0' }}>
        Ser padrino es acompañar una historia, ser parte de una transformación.
      </p>
    </div>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Apadrina };
