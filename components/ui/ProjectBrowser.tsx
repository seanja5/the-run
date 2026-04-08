'use client'

import { useState, useEffect } from 'react'
import { NODE_DATA } from '@/data/nodes'
import { useSceneStore } from '@/store/useSceneStore'

export default function ProjectBrowser() {
  const activeId = useSceneStore((s) => s.activeProjectId)
  const setActive = useSceneStore((s) => s.setActiveProject)
  const activeNode = NODE_DATA.find((n) => n.id === activeId) ?? null

  return (
    <>
      {/* Bottom project strip */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        background: 'linear-gradient(to top, rgba(5,3,15,0.95) 60%, transparent)',
        padding: '24px 24px 20px',
      }}>
        {/* Label */}
        <div style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          fontSize: '9px',
          letterSpacing: '0.2em',
          color: 'rgba(200,214,229,0.45)',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          Projects
        </div>

        {/* Scrollable project list */}
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 2,
          scrollbarWidth: 'none',
        }}>
          {NODE_DATA.map((node) => {
            const active = node.id === activeId
            const isContact = node.content.isContact
            return (
              <button
                key={node.id}
                onClick={() => setActive(active ? null : node.id)}
                style={{
                  flexShrink: 0,
                  background: active
                    ? `rgba(${isContact ? '255,205,107' : '255,140,66'},0.15)`
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active
                    ? (isContact ? 'rgba(255,205,107,0.6)' : 'rgba(255,140,66,0.6)')
                    : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 10,
                  padding: '8px 14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-space-grotesk), sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: active
                    ? (isContact ? '#FFCD6B' : '#FF8C42')
                    : '#EEF2FF',
                  whiteSpace: 'nowrap',
                }}>
                  {node.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-space-grotesk), sans-serif',
                  fontSize: '9px',
                  color: 'rgba(200,214,229,0.55)',
                  letterSpacing: '0.04em',
                  marginTop: 2,
                  whiteSpace: 'nowrap',
                }}>
                  {node.sublabel}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Project detail panel */}
      <ProjectPanel node={activeNode} onClose={() => setActive(null)} />
    </>
  )
}

function ProjectPanel({ node, onClose }: { node: typeof NODE_DATA[0] | null; onClose: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (node) {
      // Small delay so the panel animates in after project selection
      const t = setTimeout(() => setVisible(true), 80)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [node])

  if (!node) return null

  const isContact = node.content.isContact
  const accentColor = isContact ? '#FFCD6B' : '#FF8C42'

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: 28,
      transform: `translateY(-50%) translateX(${visible ? 0 : -20}px)`,
      opacity: visible ? 1 : 0,
      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      zIndex: 30,
      width: 'clamp(260px, 28vw, 340px)',
      background: 'rgba(8,5,20,0.82)',
      border: `1px solid rgba(${isContact ? '255,205,107' : '255,140,66'},0.25)`,
      borderRadius: 16,
      backdropFilter: 'blur(20px)',
      padding: '22px 24px',
      fontFamily: 'var(--font-space-grotesk), sans-serif',
    }}>
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 12,
          right: 14,
          background: 'none',
          border: 'none',
          color: 'rgba(200,214,229,0.5)',
          fontSize: '18px',
          cursor: 'pointer',
          lineHeight: 1,
          padding: 4,
        }}
      >
        ×
      </button>

      {/* Header */}
      <div style={{
        fontSize: '9px',
        letterSpacing: '0.22em',
        color: 'rgba(200,214,229,0.4)',
        textTransform: 'uppercase',
        marginBottom: 6,
      }}>
        {node.sublabel}
      </div>
      <div style={{
        fontSize: 'clamp(16px, 2vw, 20px)',
        fontWeight: 700,
        color: accentColor,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        marginBottom: 12,
        lineHeight: 1.2,
      }}>
        {node.label}
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: `linear-gradient(90deg, ${accentColor}40, transparent)`,
        marginBottom: 14,
      }} />

      {/* Description */}
      <p style={{
        fontSize: '12px',
        lineHeight: 1.65,
        color: 'rgba(200,214,229,0.8)',
        margin: '0 0 16px',
      }}>
        {node.content.description}
      </p>

      {/* Tech chips */}
      {node.content.tech.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 18 }}>
          {node.content.tech.map((t) => (
            <span key={t} className="chip" style={{ fontSize: '9px' }}>{t}</span>
          ))}
        </div>
      )}

      {/* CTA */}
      {node.content.link && (
        <a
          href={node.content.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: `rgba(${isContact ? '255,205,107' : '255,140,66'},0.12)`,
            border: `1px solid ${accentColor}80`,
            borderRadius: 999,
            color: accentColor,
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '9px 20px',
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
        >
          {node.content.linkLabel ?? 'View Project'} →
        </a>
      )}

      {isContact && (
        <div style={{ fontSize: '11px', color: 'rgba(200,214,229,0.6)', lineHeight: 1.6 }}>
          <div>📍 University of Miami</div>
          <div style={{ marginTop: 4 }}>
            <a href="mailto:sean@seanjandrews.com" style={{ color: '#FFCD6B', textDecoration: 'none' }}>
              sean@seanjandrews.com
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
