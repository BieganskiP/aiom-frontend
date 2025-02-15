import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
      colors: {
        // Base colors
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Primary (Orange)
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
        },

        // Background (Dark Blue)
        bg: {
          700: "var(--background-700)",
          800: "var(--background-800)",
          900: "var(--background-900)",
        },

        // Accent (Lighter Blue)
        accent: {
          400: "var(--accent-400)",
          500: "var(--accent-500)",
          600: "var(--accent-600)",
        },

        // Neutral/Gray
        neutral: {
          50: "var(--neutral-50)",
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          500: "var(--neutral-500)",
        },

        // Error states
        error: {
          50: "var(--error-50)",
          500: "var(--error-500)",
          600: "var(--error-600)",
        },
      },
    },
  },
} satisfies Config;
