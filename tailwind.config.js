module.exports = {
  purge: ['./components/**/*.tsx', './pages/**/*.tsx'],
  theme: {
    fontFamily: {
      sans: ["Public Sans", "sans-serif"],
    },
    extend: {
      fontSize: {
        '7xl': '6rem',
        yuge: "14vw"
      },
      colors: {
        midGray: '#131B2A'
      },
      zIndex: {
        '-10': '-10',
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            fontWeight: 300,
            a: {
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 'inherit'
            },
            'h2, h3, h4, h5': {
              color: theme('colors.gray.500'),
              fontSize: theme('fontSize.3xl'),
              fontWeight: theme('fontWeight.extrabold'),
              marginBottom: theme('margin.5'),
              lineHeight: theme('lineHeight.tight')
            },
            h3: {
              fontSize: theme('fontSize.2xl')
            },
            h4: {
              fontSize: theme('fontSize.xl')
            },
            'ul, ol': {
              paddingLeft: theme('padding.4')
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.700'),
            },
            'ol > li::before': {
              color: theme('colors.gray.700'),
            },
            code: {
              fontWeight: 'inherit',
              color: theme('colors.gray.700'),
              borderRadius: theme('border.sm'),
              padding: theme('padding.1'),
              fontFamily: "'Public Sans', sans-serif",
              background: theme('colors.gray.200')
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            pre: {
              fontSize: theme('fontSize.base')
            },
            'pre code::after': {
              content: 'none'
            },
            '.property-access': {
              color: 'white'
            }
          },
        }
      })
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('precss')
  ]
}
