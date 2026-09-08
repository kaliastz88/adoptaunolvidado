import React from 'react';

export function Input({ label, placeholder, type = 'text', value, onChange, error }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)' }}>
      {label ? (
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
      ) : null}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          font: 'var(--font-body-base)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-input)',
          border: `1.5px solid ${error ? 'var(--terracotta-500)' : focus ? 'var(--border-focus)' : 'var(--border-default)'}`,
          outline: 'none',
          boxShadow: focus ? 'var(--focus-ring)' : 'none',
          transition: 'var(--transition-hover)',
          background: 'var(--surface-card)',
          color: 'var(--text-primary)',
        }}
      />
      {error ? (
        <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--terracotta-600)' }}>{error}</span>
      ) : null}
    </label>
  );
}
