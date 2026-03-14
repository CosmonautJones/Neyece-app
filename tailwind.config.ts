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
          DEFAULT: "#ff6b4a",
          light: "#ff8c6e",
        },
        yellow: {
          DEFAULT: "#ffd166",
          light: "#ffe566",
        },
        cream: {
          DEFAULT: "#fef8f0",
          dark: "#f5e6d3",
        },
        warm: "#fff4e6",
        soft: "#f5e6d3",
        green: "#06d6a0",
        orange: "#ff9d3d",
        ink: "#1e1206",
        brown: "#5c3d1e",
        muted: "#a08060",
        // Keep dark family for non-landing usage
        dark: {
          DEFAULT: "#2D2D2D",
          light: "#4A4A4A",
          lighter: "#6B6B6B",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Nunito", "sans-serif"],
      },
      boxShadow: {
        "brutal-sm": "2px 2px 0 #1e1206",
        brutal: "4px 4px 0 #1e1206",
        "brutal-lg": "6px 6px 0 #1e1206",
        "brutal-hover": "7px 7px 0 #1e1206",
        "brutal-coral": "6px 6px 0 #c94040",
        "brutal-coral-sm": "3px 3px 0 var(--tw-shadow-color, #ff6b4a)",
      },
      keyframes: {
        "marquee-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-5deg)" },
          "50%": { transform: "translateY(-12px) rotate(5deg)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "marquee-scroll": "marquee-scroll 22s linear infinite",
        float: "float 4s ease-in-out infinite",
        bounce: "bounce 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
