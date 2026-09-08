import React from 'react';

export function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
      <span
        onClick={() => onChange && onChange(!checked)}
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          border: `1.5px solid ${checked ? 'var(--action-primary)' : 'var(--border-default)'}`,
          background: checked ? 'var(--action-primary)' : 'var(--surface-card)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'var(--transition-hover)',
          flexShrink: 0,
        }}
      >
        {checked ? <i data-lucide="check" style={{ width: 14, height: 14, color: '#fff' }} /> : null}
      </span>
      <span style={{ font: 'var(--font-body-base)', color: 'var(--text-primary)' }}>{label}</span>
    </label>
  );
}
