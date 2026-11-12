import React from 'react';

// Catalog card. Editorial direction (Nov 2026): name in the serif, in caps,
// and a "Conócelo →" link underlined in brand yellow, like the founder's
// reference. Keyboard-accessible when clickable.
// NOTE: _ds_bundle.js holds the compiled copy the browser runs — keep in sync.
export function DogCard({ name, age, size, photo, photoPos = 'center', tone = 'available', onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      style={{
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        background: 'var(--surface-card)',
        boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'var(--transition-hover)',
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: 'var(--font-body)',
        width: '100%',
        maxWidth: 320,
      }}
    >
      <div style={{
        aspectRatio: '4 / 3.4',
        background: photo ? `${photoPos}/cover no-repeat url(${photo})` : 'linear-gradient(150deg, var(--blue-100), var(--amber-50))',
        display: photo ? 'block' : 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        {!photo ? <i data-lucide="dog" style={{ width: 40, height: 40, color: 'var(--blue-400)' }} /> : null}
        {tone === 'adopted' ? (
          <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--sage-600)', background: 'var(--status-success-bg)', padding: '3px 10px', borderRadius: 'var(--radius-pill)' }}>Adoptado</span>
        ) : null}
      </div>
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>{name}</span>
        <span style={{ font: 'var(--font-caption)', color: 'var(--text-secondary)' }}>{[age, size].filter(Boolean).join(' · ')}</span>
        {onClick ? (
          <span style={{ marginTop: 10, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--action-primary)', display: 'inline-flex', alignItems: 'center', gap: 6, borderBottom: '1.5px solid var(--amber-500)', alignSelf: 'flex-start', paddingBottom: 2 }}>
            Conócelo <span aria-hidden="true" style={{ transition: 'transform 220ms', transform: hover ? 'translateX(3px)' : 'none' }}>→</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}
