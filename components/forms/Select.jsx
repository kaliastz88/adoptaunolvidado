import React from 'react';

export function Select({ label, options = [], value, onChange, placeholder = 'Selecciona' }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)' }}>
      {label ? (
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
      ) : null}
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: '100%',
            appearance: 'none',
            font: 'var(--font-body-base)',
            padding: '12px 40px 12px 16px',
            borderRadius: 'var(--radius-input)',
            border: `1.5px solid ${focus ? 'var(--border-focus)' : 'var(--border-default)'}`,
            outline: 'none',
            boxShadow: focus ? 'var(--focus-ring)' : 'none',
            background: 'var(--surface-card)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <i data-lucide="chevron-down" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-secondary)', pointerEvents: 'none' }} />
      </div>
    </label>
  );
}
