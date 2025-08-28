module.exports = {
  plugins: {
    tailwindcss: { config: require('path').resolve(__dirname, 'tailwind.config.js') },
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  }
}