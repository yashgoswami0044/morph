import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Button = ({ children, className, variant = 'primary', size = 'md', ...props }) => {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-md)',
    fontWeight: 500,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'all 0.25s',
    outline: 'none',
    border: 'none',
  };

  const variants = {
    primary: {
      background: 'linear-gradient(to bottom, var(--primary-light), var(--primary-dark))',
      color: '#080a0f',
      border: '1px solid var(--primary)',
    },
    secondary: {
      background: 'var(--bg-card)',
      color: 'white',
      border: '1px solid var(--border)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--primary)',
      border: '1px solid var(--border-highlight)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)',
      border: '1px solid transparent',
    },
    danger: {
      background: 'rgba(248,113,113,0.1)',
      color: '#F87171',
      border: '1px solid rgba(248,113,113,0.3)',
    },
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: 13 },
    md: { padding: '8px 16px', fontSize: 14 },
    lg: { padding: '12px 24px', fontSize: 16, fontWeight: 600 },
  };

  return (
    <button
      style={{ ...base, ...variants[variant], ...sizes[size] }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        padding: 24,
        transition: 'all 0.25s',
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

export const Input = ({ label, error, className, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>{label}</label>}
      <input
        style={{
          width: '100%',
          background: 'var(--bg-main)',
          border: `1px solid ${error ? 'var(--status-hot)' : 'var(--border)'}`,
          color: 'white',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          fontSize: 14,
          transition: 'all 0.25s',
        }}
        className={className}
        {...props}
      />
      {error && <span style={{ fontSize: 12, color: 'var(--status-hot)' }}>{error}</span>}
    </div>
  );
};

export const Badge = ({ children, variant = 'gray', className, style: userStyle, ...props }) => {
  const variants = {
    hot:     { background: 'rgba(248,113,113,0.12)', color: '#F87171', border: '1px solid rgba(248,113,113,0.25)' },
    warm:    { background: 'rgba(251,191,36,0.12)',  color: '#FBBF24', border: '1px solid rgba(251,191,36,0.25)' },
    nurture: { background: 'rgba(96,165,250,0.12)',  color: '#60A5FA', border: '1px solid rgba(96,165,250,0.25)' },
    success: { background: 'rgba(52,211,153,0.12)',  color: '#34D399', border: '1px solid rgba(52,211,153,0.25)' },
    gray:    { background: 'rgba(156,163,175,0.12)', color: '#9CA3AF', border: '1px solid rgba(156,163,175,0.25)' },
    outline: { background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--border)' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: 'var(--radius-sm)',
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        ...(variants[variant] || variants.gray),
        ...userStyle,
      }}
      className={className}
      {...props}
    >
      {children}
    </span>
  );
};
