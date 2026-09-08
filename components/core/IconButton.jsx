import React from 'react';

export function IconButton({ icon, label, size = 40, tone = 'default', onClick }) {
  const [hover, setHover] = React.useState(false);
  const toneColor = tone === 'brand' ? 'var(--action-primary)' : 'var(--text-secondary)';
  return (
    <button
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--radius-pill)',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: hover ? 'var(--surface-brand-soft)' : 'var(--surface-sunken)',
        color: toneColor,
        transition: 'var(--transition-hover)',
      }}
    >
      <i data-lucide={icon} style={{ width: size * 0.45, height: size * 0.45 }} />
    </button>
  );
}
