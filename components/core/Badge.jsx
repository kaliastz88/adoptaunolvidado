import React from 'react';

const TONES = {
  success: { bg: 'var(--status-success-bg)', fg: 'var(--sage-600)' },
  info: { bg: 'var(--status-info-bg)', fg: 'var(--blue-700)' },
  warning: { bg: 'var(--status-warning-bg)', fg: 'var(--amber-600)' },
  neutral: { bg: 'var(--surface-sunken)', fg: 'var(--text-secondary)' },
};

export function Badge({ children, tone = 'neutral', icon = null }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 14px',
        borderRadius: 'var(--radius-tag)',
        background: t.bg,
        color: t.fg,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 'var(--text-xs)',
        letterSpacing: 'var(--tracking-wide)',
      }}
    >
      {icon ? <i data-lucide={icon} style={{ width: 13, height: 13 }} /> : null}
      {children}
    </span>
  );
}
