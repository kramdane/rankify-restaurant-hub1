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
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#F8F9FE",
        foreground: "#1A1F2C",
        primary: {
          DEFAULT: "#1A1F2C",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#222222",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#F4F7FE",
          foreground: "#1A1F2C",
        },
        muted: {
          DEFAULT: "#8E9196",
          foreground: "#F8F9FE",
        },
        destructive: {
          DEFAULT: "#F8D7DA",
          foreground: "#1A1F2C",
        },
        success: {
          DEFAULT: "#DFF6DF",
          foreground: "#1A1F2C",
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