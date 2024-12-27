import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
        },
        neutral: {
          50: "var(--neutral-50)",
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          700: "var(--neutral-700)",
          800: "var(--neutral-800)",
        },
        error: {
          50: "var(--error-50)",
          500: "var(--error-500)",
          600: "var(--error-600)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
