import * as THREE from 'three'
import type { NodeData } from '@/types'

// Y = 0 in data — resolved at runtime via getHeightAt()
// Z axis: -120 = peak (top), +120 = valley (bottom)
// Groomed corridor: |X| < 20. Nodes alternate sides slightly.

export const NODE_DATA: NodeData[] = [
  {
    id: 'remnants',
    type: 'gate',
    label: 'Remnants',
    sublabel: 'Shopify E-Commerce',
    worldPos: new THREE.Vector3(-10, 0, -85),
    color: '#FF8C42',
    content: {
      description:
        'A full Shopify e-commerce web experience for a designer clothing brand. Custom Figma mockups, Photoshop assets, theme customization, PR press kit, and international shipping logic.',
      tech: ['Shopify', 'Figma', 'Adobe Photoshop', 'Liquid'],
      link: 'https://seanjandrews.com/remnants.html',
      linkLabel: 'View Project',
    },
  },
  {
    id: 'remote-lightbox',
    type: 'gate',
    label: 'Remote Lightbox',
    sublabel: 'Hardware · REVOLVE',
    worldPos: new THREE.Vector3(12, 0, -55),
    color: '#FF8C42',
    content: {
      description:
        'REVOLVE — a remote-controlled LED desktop lightbox. Custom hardware build with 3D-printed components, electronics, and wireless remote control functionality.',
      tech: ['Hardware', 'Electronics', '3D Printing', 'LED'],
      link: 'https://seanjandrews.com/remote-lightbox.html',
      linkLabel: 'View Project',
    },
  },
  {
    id: 'led-sign',
    type: 'gate',
    label: 'LED Sign',
    sublabel: 'Custom LED Build',
    worldPos: new THREE.Vector3(-8, 0, -25),
    color: '#FF8C42',
    content: {
      description:
        'Revolve Underground LED Sign — a fully custom LED sign built from scratch with microcontroller programming, wiring, and enclosure design.',
      tech: ['LEDs', 'Arduino', 'Electronics', 'Fabrication'],
      link: 'https://seanjandrews.com/led-sign.html',
      linkLabel: 'View Project',
    },
  },
  {
    id: 'plant-health',
    type: 'gate',
    label: 'Plant Health Monitor',
    sublabel: 'IoT Sensor System',
    worldPos: new THREE.Vector3(14, 0, 5),
    color: '#FF8C42',
    content: {
      description:
        'An IoT system that monitors plant health using soil moisture, light, and temperature sensors. Displays real-time data with alerts for suboptimal conditions.',
      tech: ['IoT', 'Arduino', 'Sensors', 'Python'],
      link: 'https://seanjandrews.com/plant-health-monitor.html',
      linkLabel: 'View Project',
    },
  },
  {
    id: 'realrehab',
    type: 'lodge',
    label: 'RealRehab',
    sublabel: 'iOS · Supabase · BLE',
    worldPos: new THREE.Vector3(-5, 0, 30),
    color: '#FFCD6B',
    content: {
      description:
        'Wearable-connected physical therapy platform for ACL rehabilitation. A BLE-enabled knee brace streams real-time IMU data to a SwiftUI app, providing live motion feedback for patients doing at-home rehab. Physical therapists can monitor progress and adjust plans remotely via a Supabase-backed dashboard.',
      tech: ['SwiftUI', 'Supabase', 'BLE', 'CoreMotion', 'iOS', 'Swift'],
      link: 'https://seanjandrews.com/realrehab.html',
      linkLabel: 'View Case Study',
    },
  },
  {
    id: 'hyde-closet',
    type: 'lodge',
    label: 'Hyde Closet',
    sublabel: 'UX/UI Case Study',
    worldPos: new THREE.Vector3(10, 0, 55),
    color: '#FFCD6B',
    content: {
      description:
        'A UX/UI design case study for a personal wardrobe management app. Covers the full design process — user research, journey mapping, wireframing, and high-fidelity prototyping in Figma.',
      tech: ['Figma', 'UX Research', 'Prototyping', 'User Testing'],
      link: 'https://seanjandrews.com/hyde-closet.html',
      linkLabel: 'View Case Study',
    },
  },
  {
    id: 'underline-cooling',
    type: 'lodge',
    label: 'Underline Cooling',
    sublabel: 'Engineering Design',
    worldPos: new THREE.Vector3(-12, 0, 75),
    color: '#FFCD6B',
    content: {
      description:
        'An engineering project designing an innovative cooling system. Involves thermal analysis, CAD modeling, and iterative prototyping to optimize heat dissipation for a target application.',
      tech: ['SolidWorks', 'CAD', 'Thermal Engineering', 'Prototyping'],
      link: 'https://seanjandrews.com/underline-cooling.html',
      linkLabel: 'View Project',
    },
  },
  {
    id: 'unity',
    type: 'lodge',
    label: 'Unity Games',
    sublabel: 'Game Design Portfolio',
    worldPos: new THREE.Vector3(8, 0, 95),
    color: '#FFCD6B',
    content: {
      description:
        'A game design portfolio built in Unity. Includes Black Friday Stage 5 — a fast-paced action game — and StayOrCash, a strategy/decision game. Demonstrates C# scripting, physics, UI systems, and level design.',
      tech: ['Unity', 'C#', 'Game Design', 'Level Design', 'Physics'],
      link: 'https://seanjandrews.com/unity.html',
      linkLabel: 'View Games',
    },
  },
  {
    id: 'whats-next',
    type: 'lodge',
    label: "What's Next?",
    sublabel: 'Get in Touch',
    worldPos: new THREE.Vector3(0, 0, 115),
    color: '#FFCD6B',
    content: {
      description:
        "BS Innovation, Technology & Design · University of Miami · Available May 2026",
      tech: [],
      isContact: true,
    },
  },
]
