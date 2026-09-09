import React from 'react';

// photoPos es un valor de background-position, por ejemplo '50% 25%'.
// Sin él, la tarjeta recorta siempre desde el centro y en las fotos verticales
// eso corta justo la cara del perro, que es lo único que importa de la foto.
export function DogCard({ name, age, size, photo, photoPos = 'center', tone = 'available', onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        background: 'var(--surface-card)',
        boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'var(--transition-hover)',
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: 'var(--font-body)',
        width: 260,
      }}
    >
      <div
        style={{
          height: 200,
          background: photo ? `${photoPos}/cover no-repeat url(${photo})` : 'var(--blue-100)',
          display: photo ? 'block' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!photo ? <i data-lucide="dog" style={{ width: 40, height: 40, color: 'var(--blue-400)' }} /> : null}
      </div>
      <div style={{ padding: 'var(--space-card-pad)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ font: 'var(--font-h4)', color: 'var(--text-primary)' }}>{name}</span>
          {tone === 'adopted' ? (
            <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--sage-600)', background: 'var(--status-success-bg)', padding: '3px 10px', borderRadius: 'var(--radius-pill)' }}>Adoptado</span>
          ) : null}
        </div>
        <span style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>{age} · {size}</span>
      </div>
    </div>
  );
}
