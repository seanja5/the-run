'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRunStore } from '@/store/useRunStore'
import { NODE_DATA } from '@/data/nodes'

const GATE_DISMISS_MS = 5000

export default function GateCard() {
  const activeNode = useRunStore((s) => s.activeNode)
  const panelOpen = useRunStore((s) => s.panelOpen)
  const setActiveNode = useRunStore((s) => s.setActiveNode)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const node = activeNode ? NODE_DATA.find((n) => n.id === activeNode) : null
  const isGate = node?.type === 'gate'
  const visible = isGate && !panelOpen

  useEffect(() => {
    if (visible) {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
      dismissTimer.current = setTimeout(() => {
        setActiveNode(null)
      }, GATE_DISMISS_MS)
    }
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
    }
  }, [visible, activeNode, setActiveNode])

  return (
    <AnimatePresence>
      {visible && node && (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, x: 20, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: '42vh',
            right: 'clamp(16px, 4vw, 40px)',
            width: 'clamp(220px, 26vw, 300px)',
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            zIndex: 30,
          }}
        >
          <div className="glass" style={{ padding: '20px 22px' }}>
            {/* Gate index tag */}
            <div style={{
              fontSize: '10px',
              color: '#FF8C42',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 8,
              fontWeight: 600,
            }}>
              // Gate
            </div>

            <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700, color: '#EEF2FF' }}>
              {node.label}
            </h3>
            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#C8D6E5', letterSpacing: '0.05em' }}>
              {node.sublabel}
            </p>
            <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'rgba(200,214,229,0.75)', lineHeight: 1.5 }}>
              {node.content.description}
            </p>

            {/* Tech chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
              {node.content.tech.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>

            {/* Link */}
            {node.content.link && (
              <a
                href={node.content.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  color: '#FF8C42',
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                {node.content.linkLabel ?? 'View Project'} →
              </a>
            )}

            {/* Dismiss progress bar */}
            <div style={{ marginTop: 14, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 1, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: GATE_DISMISS_MS / 1000, ease: 'linear' }}
                style={{ height: '100%', background: '#FF8C42', borderRadius: 1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
