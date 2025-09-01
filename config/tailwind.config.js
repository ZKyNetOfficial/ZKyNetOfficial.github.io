/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        '../*.html',
        '../src/**/*.html',
        '../src/assets/js/**/*.js',
        '../src/assets/**/*.{js,ts,jsx,tsx,vue}'
    ],
    theme: {
        extend: {
            colors: {
                'zky-blue': '#1e3a8a',
                'zky-purple': '#7c3aed',
                'zky-dark': '#0f172a',
                'zky-light': '#f8fafc'
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif']
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'bounce-slow': 'bounce 2s infinite'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                }
            },
            backdropBlur: {
                xs: '2px'
            }
        }
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
};
