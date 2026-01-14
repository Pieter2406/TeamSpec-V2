/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    important: '#root',
    corePlugins: {
        // Disable preflight to avoid conflicts with MUI
        preflight: false,
    },
    theme: {
        extend: {},
    },
    plugins: [],
}
