/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0f172a', // Slate 900
                secondary: '#334155', // Slate 700
                accent: '#3b82f6', // Blue 500
                brand: {
                    light: '#60a5fa',
                    DEFAULT: '#2563eb',
                    dark: '#1d4ed8',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
