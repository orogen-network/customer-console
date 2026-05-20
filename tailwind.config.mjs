/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Geological palette: dark crust + igneous accents.
        // Names match landing-site; extra steps (1000, 850, 50) added per
        // design-reference/README.md token table.
        crust: {
          1000: "#06080a",
          950: "#0b0d10",
          900: "#11141a",
          850: "#161a22",
          800: "#1a1f29",
          700: "#252b38",
          600: "#36404f",
          500: "#4f5b6e",
          400: "#7c8597",
          300: "#a5acbb",
          200: "#cdd1da",
          100: "#e9ebef",
          50: "#f5f6f8",
        },
        magma: {
          600: "#d97706",
          500: "#f59e0b",
          400: "#fbbf24",
          300: "#fcd34d",
        },
        crystal: {
          600: "#10b981",
          500: "#34d399",
          400: "#6ee7b7",
          300: "#a7f3d0",
        },
        ruby: {
          600: "#dc2626",
          500: "#ef4444",
          400: "#f87171",
          300: "#fca5a5",
        },
        sky: {
          600: "#0284c7",
          500: "#0ea5e9",
          400: "#38bdf8",
          300: "#7dd3fc",
        },
        violet: {
          600: "#7c3aed",
          500: "#8b5cf6",
          400: "#a78bfa",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
        display: [
          "Instrument Serif",
          "ui-serif",
          "Georgia",
          "Cambria",
          "serif",
        ],
      },
      fontSize: {
        "display-xl": ["48px", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-lg": ["36px", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-md": ["30px", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        title: ["22px", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        "btn-primary": "inset 0 1px 0 rgba(255,255,255,0.18)",
      },
    },
  },
  plugins: [],
};
