import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        accent:  "#E8690A",
        canvas:  "#F1F4F9",
        surface: "#FFFFFF",
        panel:   "#FFFFFF",
      },
      fontFamily: {
        sans:    ["'DM Sans'",             "system-ui", "sans-serif"],
        display: ["'Plus Jakarta Sans'",   "system-ui", "sans-serif"],
        mono:    ["'DM Mono'",             "monospace"],
      },
      boxShadow: {
        sm: "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
        md: "0 4px 16px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.04)",
        lg: "0 10px 40px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
