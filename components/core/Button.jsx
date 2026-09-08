import React from 'react';

const VARIANT_STYLES = {
  primary: {
    background: 'var(--action-primary)',
    color: 'var(--text-on-brand)',
    border: '1px solid transparent',
  },
  cta: {
    background: 'var(--action-cta)',
    color: 'var(--text-on-brand)',
    border: '1px solid transparent',
  },
  sponsor: {
    background: 'var(--action-sponsor)',
    color: 'var(--text-on-brand)',
    border: '1px solid transparent',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--action-primary)',
    border: '1.5px solid var(--border-brand)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid transparent',
  },
};

const SIZE_STYLES = {
  sm: { padding: '8px 16px', fontSize: 'var(--text-sm)' },
  md: { padding: '12px 22px', fontSize: 'var(--text-base)' },
  lg: { padding: '16px 30px', fontSize: 'var(--text-md)' },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  wag = false,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const s = SIZE_STYLES[size] || SIZE_STYLES.md;

  let background = v.background;
  if (!disabled && hover) {
    if (variant === 'primary') background = 'var(--action-primary-hover)';
    if (variant === 'cta') background = 'var(--action-cta-hover)';
    if (variant === 'sponsor') background = 'var(--action-sponsor-hover)';
    if (variant === 'secondary') background = 'var(--surface-brand-soft)';
    if (variant === 'ghost') background = 'var(--surface-sunken)';
  }

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        borderRadius: 'var(--radius-button)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transform: active ? 'scale(0.97)' : 'scale(1)',
        transition: 'var(--transition-hover), transform var(--duration-fast) var(--ease-standard)',
        ...v,
        ...s,
        background,
        ...style,
      }}
      {...rest}
    >
      {icon ? (
        <i
          data-lucide={icon}
          style={{
            width: 18,
            height: 18,
            transition: 'var(--transition-wag)',
            transform: wag && hover ? 'rotate(-10deg)' : 'rotate(0deg)',
          }}
        />
      ) : null}
      {children}
    </button>
  );
}
