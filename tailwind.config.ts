import type { Config } from "tailwindcss";

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            colors: {
                bg: "var(--background)",
                "bg-light": "var(--background-light)",
                "bg-lighter": "var(--background-lighter)",
                "bg-lightest": "var(--background-lightest)",
                "bg-light-transparent": "var(--background-light-transparent)",
                primary: "var(--primary)",
                secondary: "var(--secondary)",
                tertiary: "var(--tertiary)",
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            borderRadius: {
                lg: "1rem",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
