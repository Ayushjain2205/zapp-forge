import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
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
        forge: {
          ember: "#FF7B00",
          flame: "#FF4D00",
          heat: "#FF2A00",
          metal: "#CCCCCC",
          spark: "#FFCC00",
          coal: "#1A1A1A",
          smoke: "#333333",
        },
        purple: {
          950: "#270A4A",
        },
        yellow: {
          400: "#FFD700",
        },
        orange: {
          500: "#FF4D00",
        },
        pink: {
          500: "#FF0080",
        },
        indigo: {
          600: "#6200EA",
        },
        blue: {
          "300": "#94b2fa",
          "500": "#326DF5",
          "700": "#1F326F",
        },
        gray: colors.zinc,
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ["var(--font-orbitron)", "Aeonik", "sans-serif"],
        display: ["var(--font-space-grotesk)", "Aeonik", "sans-serif"],
        body: ["var(--font-barlow)", "Aeonik", "system-ui", "sans-serif"],
        sans: ['"Aeonik"', ...defaultTheme.fontFamily.sans],
        mono: ['"Aeonik Mono"', ...defaultTheme.fontFamily.mono],
      },
      animation: {
        float: "float 10s ease-in-out infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        spark: "spark 0.5s ease-out forwards",
        forge: "forge 3s ease-in-out infinite",
        glow: "glow 1.5s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-20px) translateX(10px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        spark: {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(45deg)", opacity: "0" },
        },
        forge: {
          "0%": { filter: "brightness(1) contrast(1)" },
          "50%": { filter: "brightness(1.3) contrast(1.2)" },
          "100%": { filter: "brightness(1) contrast(1)" },
        },
        glow: {
          "0%": {
            boxShadow:
              "0 0 5px rgba(255, 123, 0, 0.5), 0 0 10px rgba(255, 77, 0, 0.3)",
          },
          "100%": {
            boxShadow:
              "0 0 10px rgba(255, 123, 0, 0.8), 0 0 20px rgba(255, 77, 0, 0.5)",
          },
        },
      },
    },
  },
  plugins: [typography, animate, require("tailwindcss-animate")],
};

export default config;
