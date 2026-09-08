import React from 'react';

export function StatCounter({ value, label, tone = 'brand' }) {
  const bg = tone === 'brand' ? 'var(--surface-brand-soft)' : 'var(--surface-alt)';
  const fg = tone === 'brand' ? 'var(--action-primary)' : 'var(--text-primary)';
  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        background: bg,
        padding: 'var(--space-8) var(--space-6)',
        textAlign: 'center',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ font: 'var(--font-stat)', color: fg }}>{value}</div>
      <div style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
    </div>
  );
}
