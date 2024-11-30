/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Inclui o arquivo HTML principal
    "./src/**/*.{js,ts,jsx,tsx}", // Inclui arquivos no diretório src
  ],
  theme: {
    extend: {}, // Personalizações adicionais podem ser feitas aqui
  },
  plugins: [],
};
