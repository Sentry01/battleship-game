/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#0a0a0a",
        white: "#ffffff",
        dark: "#1a1a2e",
        darker: "#0f0f1a",
        light: "#f8fafc",
        accent: "#6366f1",
        "accent-hover": "#4f46e5",
        "accent-light": "#818cf8",
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
        ocean: "#0ea5e9",
        "ocean-dark": "#0284c7",
        "ocean-light": "#38bdf8",
      },
      spacing: {
        1: "8px",
        2: "16px",
        3: "24px",
        4: "32px",
        5: "40px",
        6: "48px",
      },
      borderRadius: {
        card: "12px",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
