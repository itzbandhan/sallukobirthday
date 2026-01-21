/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    pink: '#ffb7b2', // Example pastel
                    dark: '#ff9aa2',
                    text: '#6b4e4e' // Warm brown text
                }
            },
            fontFamily: {
                // We can add fonts later
            }
        },
    },
    plugins: [],
}
