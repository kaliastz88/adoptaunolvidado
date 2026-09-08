import React from 'react';

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'oklch(20% 0.02 50 / 0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-modal)',
          boxShadow: 'var(--shadow-modal)',
          padding: 'var(--space-8)',
          width: 420,
          maxWidth: '90vw',
          fontFamily: 'var(--font-body)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: 'absolute', top: 16, right: 16, border: 'none', background: 'var(--surface-sunken)',
            width: 32, height: 32, borderRadius: 'var(--radius-pill)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
          }}
        >
          <i data-lucide="x" style={{ width: 16, height: 16 }} />
        </button>
        {title ? <div style={{ font: 'var(--font-h3)', marginBottom: 16, color: 'var(--text-primary)' }}>{title}</div> : null}
        {children}
      </div>
    </div>
  );
}
