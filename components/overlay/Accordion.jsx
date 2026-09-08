import React from 'react';

export function Accordion({ items = [] }) {
  const [openIdx, setOpenIdx] = React.useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-body)' }}>
      {items.map((item, i) => {
        const isOpen = i === openIdx;
        return (
          <div key={item.q} style={{ borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden' }}>
            <button
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '18px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                font: 'var(--font-h4)', color: 'var(--text-primary)', textAlign: 'left',
              }}
            >
              {item.q}
              <i data-lucide={isOpen ? 'minus' : 'plus'} style={{ width: 18, height: 18, color: 'var(--action-primary)', flexShrink: 0 }} />
            </button>
            {isOpen ? (
              <div style={{ padding: '0 20px 18px', font: 'var(--font-body-base)', color: 'var(--text-secondary)' }}>
                {item.a}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
