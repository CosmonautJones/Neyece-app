import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: "#FF6B6B",
          light: "#FF8A8A",
          dark: "#E85555",
        },
        yellow: {
          DEFAULT: "#FFD93D",
          light: "#FFE566",
          dark: "#E6C235",
        },
        cream: {
          DEFAULT: "#FFF8F0",
          dark: "#F5EDE3",
        },
        dark: {
          DEFAULT: "#2D2D2D",
          light: "#4A4A4A",
          lighter: "#6B6B6B",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        // Swap to Fraunces + Nunito when Google Fonts are available in production
        display: ["var(--font-fraunces)", "var(--font-geist-sans)", "serif"],
        body: ["var(--font-nunito)", "var(--font-geist-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
