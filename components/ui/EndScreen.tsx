'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRunStore } from '@/store/useRunStore'

export default function EndScreen() {
  const ended = useRunStore((s) => s.ended)
  const panelOpen = useRunStore((s) => s.panelOpen)

  return (
    <AnimatePresence>
      {ended && !panelOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(13,10,30,0.88)',
            backdropFilter: 'blur(12px)',
            zIndex: 50,
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            textAlign: 'center',
            padding: '24px',
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ fontSize: '11px', color: '#C8D6E5', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}
          >
            Bottom of the mountain
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700, color: '#EEF2FF', margin: '0 0 8px' }}
          >
            That's my run.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ delay: 1.3 }}
            style={{ fontSize: '14px', color: '#C8D6E5', margin: '0 0 36px' }}
          >
            Thanks for skiing with me.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <EndLink href="https://seanjandrews.com" label="Portfolio" />
            <EndLink href="https://www.linkedin.com/in/seanja" label="LinkedIn" />
            <EndLink href="mailto:sean.andrews.710@gmail.com" label="Email" />
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            onClick={() => window.location.reload()}
            style={{
              marginTop: 32,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 999,
              color: 'rgba(200,214,229,0.5)',
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: '11px',
              letterSpacing: '0.12em',
              padding: '9px 22px',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            ↺ Run It Again
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function EndLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      style={{
        padding: '10px 24px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: 999,
        color: '#EEF2FF',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textDecoration: 'none',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </a>
  )
}
