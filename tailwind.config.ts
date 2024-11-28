import type { Config } from "tailwindcss"

export const pxToEm = (value?: number | string) => `${Number(value) / 16}em`

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: pxToEm(375),
      sm: pxToEm(768),
      md: pxToEm(834),
      lg: pxToEm(1024),
      xl: pxToEm(1280),
      xxl: pxToEm(1440),
    },
    extend: {
      gridTemplateColumns: {
        "connectors-grid": "repeat(auto-fill, minmax(200px, 1fr))",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        black: "#14161C",
        "lavander-sky": "#A1A1D6",
        charcoal: "#464C5E",
        "raisin-black": "#262933",
        "light-blue": "#aecbfc",
        "dark-grey": "#646876",
        "medium-grey": "#6f727c",
        "nebula-from": "#EC796B",
        "nebula-to": "#D672EF",
      },
    },
  },
  plugins: [],
} satisfies Config
