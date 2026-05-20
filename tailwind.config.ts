import type { Config } from "tailwindcss";

const stoneVar = (n: number) => `rgb(var(--stone-${n}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        stone: {
          50:  stoneVar(50),
          100: stoneVar(100),
          200: stoneVar(200),
          300: stoneVar(300),
          400: stoneVar(400),
          500: stoneVar(500),
          600: stoneVar(600),
          700: stoneVar(700),
          800: stoneVar(800),
          900: stoneVar(900),
          950: stoneVar(950),
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono:  ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
