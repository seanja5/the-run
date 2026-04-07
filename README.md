# The Run 🎿

> An interactive 3D ski mountain portfolio — ski down and discover my projects.

**Live:** [world.seanjandrews.com](https://world.seanjandrews.com)  
**Main portfolio:** [seanjandrews.com](https://seanjandrews.com)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| 3D | React Three Fiber, Three.js, Drei, Postprocessing |
| Shaders | Custom GLSL (terrain, gate glow, snow particles) |
| Animation | GSAP, Framer Motion |
| State | Zustand |
| Audio | Howler.js |
| Terrain | Simplex Noise heightmap (257×257 vertices) |
| Styling | Tailwind CSS, Space Grotesk font |

---

## Running Locally

```bash
git clone https://github.com/seanja5/the-run.git
cd the-run
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Audio files in `/public/audio/` are placeholders. Add your own royalty-free MP3s for wind ambience, ski carve, gate whoosh, and lodge chime.

---

## Project Structure

```
the-run/
├── app/                    # Next.js App Router
├── components/
│   ├── canvas/             # All R3F / Three.js components (inside <Canvas>)
│   │   ├── Scene.tsx       # Lighting, fog, scene root
│   │   ├── Terrain.tsx     # Snow mountain with custom shader
│   │   ├── CameraRig.tsx   # Autopilot spline + manual WASD
│   │   ├── Trees.tsx       # 600 instanced pine trees
│   │   ├── SnowParticles.tsx  # 4000 snow particles
│   │   ├── Gate.tsx        # Glowing orange gate arch
│   │   ├── Lodge.tsx       # Warm cabin with porch light
│   │   └── ProjectNodes.tsx   # Places all nodes on mountain
│   └── ui/                 # DOM overlay components
│       ├── IntroScreen.tsx  # "Drop In →" landing
│       ├── HUD.tsx          # Progress bar, mode toggle, mute
│       ├── GateCard.tsx     # Brief floating project card (4s)
│       ├── LodgePanel.tsx   # Full frosted-glass project panel
│       ├── ContactPanel.tsx # "What's Next?" contact lodge
│       └── EndScreen.tsx    # "That's my run." end screen
├── shaders/                # GLSL shaders
├── data/nodes.ts           # All 9 project nodes with content
├── lib/terrain.ts          # Heightmap generation + getHeightAt()
├── lib/spline.ts           # Autopilot camera spline
├── store/useRunStore.ts    # Zustand global state
└── hooks/                  # useKeyboard, useAudio, useNodeProximity, useMobileDetect
```

---

## Controls

| Input | Action |
|-------|--------|
| WASD / Arrow Keys | Take manual control + carve |
| Mouse move | Parallax look (autopilot) |
| Space | Toggle to manual mode |
| Escape | Return to autopilot |
| Touch drag (mobile) | Carve left/right |

---

## Project Nodes

| Node | Type | Z position |
|------|------|-----------|
| Remnants | Gate | -85 |
| Remote Lightbox | Gate | -55 |
| LED Sign | Gate | -25 |
| Plant Health Monitor | Gate | +5 |
| RealRehab | Lodge | +30 |
| Hyde Closet | Lodge | +55 |
| Underline Cooling | Lodge | +75 |
| Unity Games | Lodge | +95 |
| What's Next? (Contact) | Lodge | +115 |

---

## Deployment

This project deploys to Vercel with zero config. To set up the custom domain:

1. Push to GitHub and import the repo at [vercel.com](https://vercel.com)
2. Deploy — Vercel generates a `*.vercel.app` URL
3. Go to **Project Settings → Domains**
4. Add `world.seanjandrews.com`
5. Vercel provides a CNAME record:
   ```
   Type:  CNAME
   Name:  world
   Value: cname.vercel-dns.com
   ```
6. Add this CNAME in your DNS provider (Squarespace / Namecheap / GoDaddy)
7. Wait ~10 minutes — SSL is auto-provisioned

---

## Adding Audio

Place these files in `/public/audio/`:
- `wind-ambient.mp3` — looping wind ambience
- `gate-whoosh.mp3` — gate pass-through SFX
- `lodge-chime.mp3` — lodge arrival SFX
- `ski-carve.mp3` — carving SFX

Recommended: [Freesound.org](https://freesound.org) for royalty-free files.

---

*Built by Sean Andrews — BS Innovation, Technology & Design, University of Miami · 2026*
