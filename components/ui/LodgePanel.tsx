'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRunStore } from '@/store/useRunStore'
import { NODE_DATA } from '@/data/nodes'
import ContactPanel from './ContactPanel'

export default function LodgePanel() {
  const panelOpen = useRunStore((s) => s.panelOpen)
  const activeNode = useRunStore((s) => s.activeNode)
  const setPanelOpen = useRunStore((s) => s.setPanelOpen)
  const setActiveNode = useRunStore((s) => s.setActiveNode)
  const setMode = useRunStore((s) => s.setMode)

  const node = activeNode ? NODE_DATA.find((n) => n.id === activeNode) : null
  const isLodge = node?.type === 'lodge'
  const isContact = node?.content.isContact

  // Pause autopilot when panel open
  useEffect(() => {
    // No direct camera pause needed — CameraRig reads panelOpen from store
  }, [panelOpen])

  const handleClose = () => {
    setPanelOpen(false)
    setActiveNode(null)
    // Resume autopilot if it was the active mode
    setMode('autopilot')
  }

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && panelOpen) handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panelOpen])

  if (isContact && panelOpen && isLodge) {
    return <ContactPanel onClose={handleClose} />
  }

  return (
    <AnimatePresence>
      {panelOpen && isLodge && node && !isContact && (
        <motion.div
          key={node.id}
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
            background: 'rgba(13,10,30,0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <div
            className="glass"
            style={{
              width: 'min(660px, 92vw)',
              maxHeight: '88vh',
              overflowY: 'auto',
              padding: 'clamp(24px, 4vw, 40px)',
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
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
              marginBottom: 10,
              fontWeight: 600,
            }}>
              // Lodge
            </div>

            {/* Title */}
            <h2 style={{ margin: '0 0 6px', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, color: '#EEF2FF' }}>
              {node.label}
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#FFCD6B', letterSpacing: '0.08em', fontWeight: 500 }}>
              {node.sublabel}
            </p>

            {/* Description */}
            <p style={{
              margin: '0 0 24px',
              fontSize: 'clamp(13px, 1.8vw, 15px)',
              color: 'rgba(200,214,229,0.88)',
              lineHeight: 1.7,
            }}>
              {node.content.description}
            </p>

            {/* Tech stack */}
            {node.content.tech.length > 0 && (
              <>
                <div style={{ fontSize: '10px', color: '#C8D6E5', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10, opacity: 0.6 }}>
                  Stack
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
                  {node.content.tech.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
              </>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 24 }} />

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {node.content.link && (
                <a
                  href={node.content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 22px',
                    background: 'rgba(255,205,107,0.12)',
                    border: '1px solid rgba(255,205,107,0.35)',
                    borderRadius: 999,
                    color: '#FFCD6B',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    transition: 'background 0.2s',
                  }}
                >
                  {node.content.linkLabel ?? 'View Project'} →
                </a>
              )}
              <button
                onClick={handleClose}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 22px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 999,
                  color: '#C8D6E5',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                ← Continue Run
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
