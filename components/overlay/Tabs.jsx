import React from 'react';

export function Tabs({ options = [], value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)', padding: 4, gap: 4, fontFamily: 'var(--font-body)' }}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            onClick={() => onChange && onChange(opt)}
            style={{
              border: 'none',
              cursor: 'pointer',
              padding: '10px 20px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              background: active ? 'var(--action-sponsor)' : 'transparent',
              color: active ? '#fff' : 'var(--text-secondary)',
              transition: 'var(--transition-hover)',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
