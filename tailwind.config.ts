import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
      fontFamily: {
        rajdhani: ["var(--font-rajdhani)"],
        orbitron: ["var(--font-orbitron)"],
        audiowide: ["var(--font-audiowide)"],
        // Use system fonts as fallbacks for the other fonts
        syncopate: ["system-ui", "sans-serif"],
        cinzel: ["serif"],
        electrolize: ["system-ui", "sans-serif"],
        michroma: ["system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0px)" },
        },
        "pulse-glow": {
          "0%": { boxShadow: "0 0 5px rgba(0, 168, 255, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(0, 168, 255, 0.7)" },
          "100%": { boxShadow: "0 0 5px rgba(0, 168, 255, 0.3)" },
        },
        "pulse-slow": {
          "0%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
          "100%": { opacity: "0.3" },
        },
        "border-glow": {
          "0%": {
            borderColor: "rgba(0, 168, 255, 0.3)",
            boxShadow: "0 0 15px rgba(0, 168, 255, 0.3)",
          },
          "50%": {
            borderColor: "rgba(0, 168, 255, 0.6)",
            boxShadow: "0 0 25px rgba(0, 168, 255, 0.6)",
          },
          "100%": {
            borderColor: "rgba(0, 168, 255, 0.3)",
            boxShadow: "0 0 15px rgba(0, 168, 255, 0.3)",
          },
        },
        "scan-effect": {
          "0%": { top: "-100%" },
          "100%": { top: "100%" },
        },
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%": { opacity: "0.2", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.5)" },
          "100%": { opacity: "0.2", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "pulse-slow": "pulse-slow 5s ease-in-out infinite",
        "border-glow": "border-glow 3s ease-in-out infinite",
        "scan-effect": "scan-effect 8s ease-in-out infinite",
        rotate: "rotate 10s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
