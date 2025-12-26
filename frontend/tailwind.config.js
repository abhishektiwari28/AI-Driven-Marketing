/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: "#4f46e5", // Indigo 600
                secondary: "#64748b", // Slate 500
                dark: "#0f172a", // Slate 900
                glass: "rgba(255, 255, 255, 0.1)",
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
