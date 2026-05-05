import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        brand: "#F57C00",
        "brand-hover": "#E06500",
        "brand-light": "#FEF3E2",
        sidebar: "#0B1120",
        "sidebar-hover": "#131D30",
        "sidebar-active": "#1A2844",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
    },
  },

  plugins: [],
};

export default config;