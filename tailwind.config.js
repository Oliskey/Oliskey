/** Oliskey design tokens. Colours come from CSS variables in src/index.css so light and dark share one set of names. */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'] },
      colors: {
        page: v('page'), surface: v('surface'), raised: v('raised'), line: v('line'),
        ink: v('ink'), muted: v('muted'), faint: v('faint'),
        accent: v('accent'), 'accent-ink': v('accent-ink'), 'on-accent': v('on-accent'),
        navy: '#0A1A3A', electric: '#1F6BFF',
      },
      fontSize: {
        display: ['clamp(2.5rem, 5.6vw, 4.75rem)', { lineHeight: '1.03', letterSpacing: '-0.035em', fontWeight: '700' }],
        title: ['clamp(2rem, 3.6vw, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.03em', fontWeight: '700' }],
        section: ['clamp(1.5rem, 2.4vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '650' }],
        lead: ['clamp(1.0625rem, 1.3vw, 1.25rem)', { lineHeight: '1.55' }],
      },
      borderRadius: { card: '22px', control: '999px' },
      transitionTimingFunction: { glide: 'cubic-bezier(0.32,0.72,0,1)', respond: 'cubic-bezier(0.2,0.8,0.2,1)', exit: 'cubic-bezier(0.3,0,0.8,0.15)' },
      maxWidth: { page: '1200px', read: '680px' },
    },
  },
  plugins: [],
};
