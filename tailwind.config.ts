import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#ff2442",
          "red-light": "#fff0f3",
          "red-dark": "#e01e3a",
        },
      },
    },
  },
  plugins: [],
};

export default config;