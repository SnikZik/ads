import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5F2EC',
        'paper-dim': '#ECE7DC',
        ink: '#0B0B0F',
        'ink-soft': '#2A2A30',
        'ink-mute': '#6B6B72',
        purple: '#4B2BE0',
        lilac: '#C7BBF5',
      },
      fontFamily: {
        display: ['var(--font-archivo-black)', 'system-ui', 'sans-serif'],
        body: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
