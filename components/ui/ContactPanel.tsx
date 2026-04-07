'use client'

import { motion } from 'framer-motion'

interface ContactPanelProps {
  onClose: () => void
}

export default function ContactPanel({ onClose }: ContactPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40,
        padding: '20px',
        background: 'rgba(13,10,30,0.6)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="glass"
        style={{
          width: 'min(520px, 92vw)',
          padding: 'clamp(28px, 4vw, 44px)',
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 999,
            color: '#C8D6E5',
            width: 32,
            height: 32,
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>

        {/* Lodge tag */}
        <div style={{
          fontSize: '10px',
          color: '#FFCD6B',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          marginBottom: 16,
          fontWeight: 600,
        }}>
          // What's Next?
        </div>

        <h2 style={{ margin: '0 0 8px', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, color: '#EEF2FF' }}>
          Sean Andrews
        </h2>

        <p style={{
          margin: '0 0 24px',
          fontSize: '13px',
          color: '#FFCD6B',
          letterSpacing: '0.06em',
          lineHeight: 1.6,
        }}>
          BS Innovation, Technology &amp; Design<br />
          University of Miami &middot; Available May 2026
        </p>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 0 24px' }} />

        {/* Contact links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          <ContactRow icon="✉" label="Email" value="sean.andrews.710@gmail.com" href="mailto:sean.andrews.710@gmail.com" />
          <ContactRow icon="📞" label="Phone" value="(858) 775-9843" href="tel:+18587759843" />
          <ContactRow icon="🌐" label="Portfolio" value="seanjandrews.com" href="https://seanjandrews.com" />
          <ContactRow icon="💼" label="LinkedIn" value="/in/seanja" href="https://www.linkedin.com/in/seanja" />
        </div>

        <button
          onClick={onClose}
          style={{
            padding: '11px 28px',
            background: 'rgba(255,205,107,0.1)',
            border: '1px solid rgba(255,205,107,0.3)',
            borderRadius: 999,
            color: '#FFCD6B',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-space-grotesk), sans-serif',
          }}
        >
          ← Back to the Run
        </button>
      </div>
    </motion.div>
  )
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: string
  label: string
  value: string
  href: string
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        textDecoration: 'none',
        transition: 'background 0.2s',
      }}
    >
      <span style={{ fontSize: '16px', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: '11px', color: '#C8D6E5', letterSpacing: '0.08em', textTransform: 'uppercase', minWidth: 60 }}>
        {label}
      </span>
      <span style={{ fontSize: '13px', color: '#EEF2FF', fontWeight: 500 }}>{value}</span>
    </a>
  )
}
