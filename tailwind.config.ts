import type { Config } from "tailwindcss";

export default {
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#F6FAFF",
        foreground: "#333333",
        primary: {
          DEFAULT: "#007BFF",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#FFB347",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#E3EFFE",
          foreground: "#333333",
        },
        muted: {
          DEFAULT: "#7D7D7D",
          foreground: "#F6FAFF",
        },
        destructive: {
          DEFAULT: "#F8D7DA",
          foreground: "#333333",
        },
        success: {
          DEFAULT: "#DFF6DF",
          foreground: "#333333",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;