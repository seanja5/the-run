'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface IntroScreenProps {
  onStart: () => void
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [fading, setFading] = useState(false)

  const handleStart = () => {
    setFading(true)
    setTimeout(onStart, 800)
  }

  return (
    <AnimatePresence>
      {!fading && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'linear-gradient(180deg, #0D0A1E 0%, #1A0F2E 60%, #3D1C58 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            fontFamily: 'var(--font-space-grotesk), sans-serif',
          }}
        >
          {/* Mountain SVG silhouette */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <svg
              width="320"
              height="140"
              viewBox="0 0 320 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginBottom: '2rem', opacity: 0.85 }}
            >
              {/* Back mountain (larger) */}
              <path
                d="M160 10 L290 130 L30 130 Z"
                fill="url(#mtnGrad)"
                opacity="0.6"
              />
              {/* Front left peak */}
              <path
                d="M60 50 L130 130 L0 130 Z"
                fill="url(#mtnGrad2)"
                opacity="0.8"
              />
              {/* Front right peak */}
              <path
                d="M255 40 L320 130 L190 130 Z"
                fill="url(#mtnGrad2)"
                opacity="0.8"
              />
              {/* Snow caps */}
              <path d="M160 10 L183 44 L137 44 Z" fill="#EEF2FF" opacity="0.9" />
              <path d="M60 50 L73 70 L47 70 Z" fill="#EEF2FF" opacity="0.7" />
              <path d="M255 40 L268 62 L242 62 Z" fill="#EEF2FF" opacity="0.7" />
              <defs>
                <linearGradient id="mtnGrad" x1="160" y1="10" x2="160" y2="130" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3D1C58" />
                  <stop offset="100%" stopColor="#0D0A1E" />
                </linearGradient>
                <linearGradient id="mtnGrad2" x1="160" y1="40" x2="160" y2="130" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2A1840" />
                  <stop offset="100%" stopColor="#0D0A1E" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            style={{
              fontSize: 'clamp(28px, 5vw, 52px)',
              fontWeight: 700,
              color: '#EEF2FF',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: 0,
              textShadow: '0 0 40px rgba(100,60,180,0.5)',
            }}
          >
            Sean Andrews
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.9 }}
            style={{
              fontSize: 'clamp(11px, 1.5vw, 14px)',
              color: '#C8D6E5',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              margin: '12px 0 0',
              fontWeight: 400,
            }}
          >
            Innovation &middot; Technology &middot; Design
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            style={{
              width: 60,
              height: 1,
              background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
              margin: '28px 0',
            }}
          />

          {/* Drop In Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,140,66,0.18)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
            style={{
              background: 'rgba(255,140,66,0.1)',
              border: '1px solid rgba(255,140,66,0.5)',
              borderRadius: '999px',
              color: '#FF8C42',
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              padding: '14px 40px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              textTransform: 'uppercase',
            }}
          >
            Drop In &rarr;
          </motion.button>

          {/* Hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            transition={{ delay: 2, duration: 1 }}
            style={{
              position: 'absolute',
              bottom: '32px',
              fontSize: '11px',
              color: '#C8D6E5',
              letterSpacing: '0.1em',
            }}
          >
            WASD · Arrow Keys · Touch to ski
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
