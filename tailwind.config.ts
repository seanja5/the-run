import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:   '#0D0A1E',
        violet: '#3D1C58',
        horizon:'#FF6B35',
        snow:   '#EEF2FF',
        gate:   '#FF8C42',
        amber:  '#FFCD6B',
        ui:     '#C8D6E5',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
