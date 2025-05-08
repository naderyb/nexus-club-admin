/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
            futuristic: ['"Orbitron"', 'sans-serif'],
            },
            colors: {
            neonBlue: "#00FFFF",
            darkBg: "#0a0f1f",
            },
        },
    },
    plugins: [],
};