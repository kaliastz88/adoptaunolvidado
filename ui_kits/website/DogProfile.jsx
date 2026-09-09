function DogProfile({ dog, onBack, onAdoptar }) {
  const { Button, Badge } = window.AdoptaUnOlvidadoDesignSystem_167478;

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  if (!dog) {
    return (
      <div style={{ padding: '48px', maxWidth: 1000, margin: '0 auto' }}>
        <p style={{ font: 'var(--font-body-base)', color: 'var(--text-muted)' }}>No encontramos a ese animal.</p>
        <Button variant="ghost" icon="arrow-left" onClick={onBack}>Volver al catálogo</Button>
      </div>
    );
  }

  const esGato = dog.species === 'Gato';
  const adoptado = dog.status === 'Adoptado';

  const FACTS = [
    { icon: esGato ? 'cat' : 'dog', label: 'Especie', value: dog.species },
    { icon: 'calendar', label: 'Edad', value: dog.age || '—' },
    { icon: 'ruler', label: 'Tamaño', value: dog.size || '—' },
    { icon: 'heart', label: 'Estado', value: dog.status },
  ];

  return (
    <div style={{ padding: '48px', maxWidth: 1000, margin: '0 auto' }}>
      <button onClick={onBack} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', font: 'var(--font-body-sm)', marginBottom: 24, fontFamily: 'var(--font-body)' }}>
        <i data-lucide="arrow-left" style={{ width: 16, height: 16 }} /> Volver al catálogo
      </button>

      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        {/* La foto real cuando existe; el degradado de marca como respaldo. */}
        <div style={{
          width: 380, height: 420, borderRadius: 'var(--radius-card)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue-500)',
          background: dog.photo
            ? `${dog.photo_pos || 'center'}/cover no-repeat url(${dog.photo})`
            : 'linear-gradient(150deg, var(--blue-100), var(--terracotta-50))',
        }}>
          {!dog.photo ? <i data-lucide={esGato ? 'cat' : 'dog'} style={{ width: 56, height: 56 }} /> : null}
        </div>

        <div style={{ flex: 1, minWidth: 280 }}>
          <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-primary)', margin: '0 0 16px' }}>{dog.name}</h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
            {FACTS.map((f) => (
              <div key={f.label} style={{ background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', padding: '14px 10px', textAlign: 'center' }}>
                <i data-lucide={f.icon} style={{ width: 20, height: 20, color: 'var(--action-primary)' }} />
                <div style={{ font: 'var(--font-2xs)', fontSize: 11, color: 'var(--text-muted)', marginTop: 6, textTransform: 'uppercase' }}>{f.label}</div>
                <div style={{ font: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{f.value}</div>
              </div>
            ))}
          </div>

          <h3 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)' }}>Sobre {dog.name}</h3>
          <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)' }}>
            {dog.bio || `Todavía estamos escribiendo la historia de ${dog.name}. Escríbenos si quieres conocerle.`}
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '16px 0 24px' }}>
            {adoptado ? <Badge tone="success" icon="check">Ya tiene familia</Badge> : null}
            {dog.energy ? <Badge tone="info">Energía {dog.energy.toLowerCase()}</Badge> : null}
            {dog.compat ? <Badge tone="neutral">Compatible con {dog.compat.toLowerCase()}</Badge> : null}
          </div>

          {/* Lo primero que pregunta quien va a adoptar: si está vacunado y
              esterilizado, y si tiene alguna condición médica. Va antes de los
              botones para que se lea sin tener que desplazarse. */}
          {dog.salud || dog.estatus_medico ? (
            <div style={{ background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', padding: '18px 20px', margin: '0 0 24px' }}>
              {dog.salud ? (
                <div style={{ display: 'flex', gap: 10, marginBottom: dog.estatus_medico ? 12 : 0 }}>
                  <i data-lucide="syringe" style={{ width: 18, height: 18, color: 'var(--action-primary)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ font: 'var(--font-2xs)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Protocolo de salud</div>
                    <div style={{ font: 'var(--font-body-sm)', color: 'var(--text-primary)' }}>{dog.salud}</div>
                  </div>
                </div>
              ) : null}
              {dog.estatus_medico ? (
                <div style={{ display: 'flex', gap: 10 }}>
                  <i data-lucide="stethoscope" style={{ width: 18, height: 18, color: 'var(--action-primary)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ font: 'var(--font-2xs)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estatus médico</div>
                    <div style={{ font: 'var(--font-body-sm)', color: 'var(--text-primary)' }}>{dog.estatus_medico}</div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: 14 }}>
            <Button variant="primary" icon="heart" disabled={adoptado} onClick={() => onAdoptar(dog)}>
              {adoptado ? `${dog.name} ya fue adoptado` : `Adoptar a ${dog.name}`}
            </Button>
            <Button variant="sponsor" icon="hand-heart">Apadrinar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, DogProfile };
