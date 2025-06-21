 module.exports = {
    content: [
        './index.html', 
        './src/**/*.{js,ts,jsx,tsx}',
        './src/ui/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            keyframes: {
                fade: {
                '0%, 100%': { opacity: '0.2' },
                '50%': { opacity: '1' },
                }
            },

            animation: {
                fade: 'fade 1.5s ease-in-out infinite',
            },
            
            colors: {
                "accent": "#3B82F6",
            }
        },
    },
    variants: {},
    plugins: [],
};