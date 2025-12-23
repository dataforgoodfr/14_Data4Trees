export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        mdl: "920px", // seuil de taille d'écran personnalisé
      },
    },
  },
  plugins: [],
};
