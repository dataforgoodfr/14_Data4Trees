export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        a4t: {
          // Palette principale
          night: "#0f0f0f",
          onyx: "#424242",
          "brunswick-green": "#224d41",
          "green-kelly": "#54b025",
          "yellow-green": "#99cf16",
          blue: "#2d6db4",
          "vert-de-gris": "#3fafb6",

          // Couleurs spécifiques
          "fresque-foret": "#f98038",
          alabaster: "#f5f4eb",
          white: "#ffffff",

          // Aliases sémantiques (optionnel, pour clarifier l'intention)
          primary: "#54b025", // vert kelly
          secondary: "#224d41", // brunswick green
          accent: "#f98038", // fresque de la forêt
          neutral: "#f5f4eb", // alabaster
        },
      },
      fontFamily: {
        // Titre principal : Phosphate Solid
        "a4t-title-primary": [
          "Phosphate Solid",
          "Phosphate",
          "Impact",
          ...defaultTheme.fontFamily.sans,
        ],

        // Titre secondaire : Century Gothic Black
        "a4t-title-secondary": [
          "Century Gothic",
          "Century Gothic Black",
          ...defaultTheme.fontFamily.sans,
        ],

        // Corps principal : Arial
        "a4t-body-primary": ["Arial", ...defaultTheme.fontFamily.sans],

        // Corps secondaire : Open Sans
        "a4t-body-secondary": ["Open Sans", ...defaultTheme.fontFamily.sans],
      },
      screens: {
        mdl: "920px",
      },
    },
  },
  plugins: [],
};
