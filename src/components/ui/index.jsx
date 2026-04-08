import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown, XCircle } from 'lucide-react';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Button = ({ children, className, variant = 'primary', size = 'md', style: userStyle, ...props }) => {
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
      color: 'var(--bg-main)',
      border: '1px solid var(--primary)',
    },
    secondary: {
      background: 'var(--bg-card)',
      color: 'var(--text-main)',
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
      style={{ ...base, ...variants[variant], ...sizes[size], ...userStyle }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className, style: userStyle, ...props }) => {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        padding: 24,
        transition: 'all 0.25s',
        ...userStyle
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

export const Input = ({ label, error, className, style: userStyle, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>{label}</label>}
      <input
        style={{
          width: '100%',
          background: 'var(--bg-main)',
          border: `1px solid ${error ? 'var(--status-hot)' : 'var(--border)'}`,
          color: 'var(--text-main)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          fontSize: 14,
          transition: 'all 0.25s',
          ...userStyle
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

export const Accordion = ({ title, icon: Icon, defaultOpen = false, children, className, headerRight }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <Card className={className} style={{ padding: 0, overflow: 'clip', display: 'flex', flexDirection: 'column' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 16px',
          background: 'var(--bg-main)',
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
          borderBottom: isOpen ? '1px solid var(--border)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icon && <Icon size={14} style={{ color: 'var(--primary)' }} />}
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {headerRight && <div onClick={e => e.stopPropagation()}>{headerRight}</div>}
          <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </div>
      </button>
      <div style={{ padding: isOpen ? '14px 16px' : 0, maxHeight: isOpen ? 2000 : 0, overflow: isOpen ? 'visible' : 'hidden', opacity: isOpen ? 1 : 0, transition: 'all 0.3s ease' }}>
        {children}
      </div>
    </Card>
  );
};

export const Modal = ({ onClose, title, children, width = 520 }) => {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const mainEl = document.querySelector('.app-main');
    setTarget(mainEl || document.body);
  }, []);

  if (!target) return null;

  return createPortal(
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 9999, transition: 'all 0.3s ease' }} onClick={onClose}>
      <div className="animate-slide-in-right" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: width, maxWidth: '100%', background: 'var(--bg-card)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', boxShadow: '-24px 0 48px rgba(0,0,0,0.6)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{title || ''}</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: '50%', marginLeft: 'auto' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}>
            <XCircle size={24} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {children}
        </div>
      </div>
    </div>,
    target
  );
};
