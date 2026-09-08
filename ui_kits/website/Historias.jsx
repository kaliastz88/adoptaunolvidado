function Historias() {
  const { Badge, Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const STORIES = [
    { name: 'Valiente', before: 'Rescatado de la calle, desnutrido y con miedo al contacto humano.', after: 'Hoy vive en un hogar con jardín y duerme en la cama de su familia.', months: '8 meses de rehabilitación' },
    { name: 'Snow', before: 'Llegó a Hotel PupuClub como hogar temporal tras un rescate complicado.', after: 'Recuperó su confianza y encontró la familia correcta.', months: '5 meses de rehabilitación' },
    { name: 'Dorito', before: 'Desconfiaba de todos; no dejaba que nadie se le acercara.', after: 'Su primer abrazo fue el día que conoció a su familia adoptiva.', months: '6 meses de rehabilitación' },
    { name: 'Nona', before: 'Encontrada herida en la carretera, necesitó cirugía y cuidados largos.', after: 'Adoptada meses después por una familia que la esperaba.', months: '10 meses de rehabilitación' },
  ];
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 48px' }}>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--status-success)', textTransform: 'uppercase' }}>Historias de éxito</span>
      <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-primary)', margin: '12px 0 16px' }}>Cada adopción cambia dos vidas.</h1>
      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 660 }}>
        Estas son algunas de las transformaciones que hemos acompañado. Rescatar es solo el comienzo.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22 }}>
        {STORIES.map((s) => (
          <div key={s.name} style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
            <div style={{ height: 180, background: 'linear-gradient(120deg, var(--sage-100), var(--blue-100))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sage-600)' }}>
              <i data-lucide="images" style={{ width: 34, height: 34 }} />
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <h3 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: 0 }}>{s.name}</h3>
                <Badge tone="success" icon="check">Adoptado</Badge>
              </div>
              <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)', margin: '0 0 10px' }}>Antes — {s.before}</p>
              <p style={{ font: 'var(--font-body-base)', color: 'var(--text-primary)', margin: '0 0 12px' }}>Ahora — {s.after}</p>
              <span style={{ font: 'var(--font-caption)', color: 'var(--status-success)', fontWeight: 600 }}>{s.months}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 48 }}>
        <p style={{ font: 'var(--font-h3)', color: 'var(--status-success)', marginBottom: 20 }}>¿Quieres ser parte de la próxima historia?</p>
        <Button variant="primary" icon="paw-print">Conoce a nuestros perritos</Button>
      </div>
    </div>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Historias };
