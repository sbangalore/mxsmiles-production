export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // CSS optimization for production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          mergeRules: true,
          minifyFontValues: true,
          minifyGradients: true,
          normalizeWhitespace: true,
        }],
      },
    }),
  },
}
