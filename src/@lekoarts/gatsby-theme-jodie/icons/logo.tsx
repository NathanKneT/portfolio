import * as React from "react";

const Logo = () => (
  <div style={styles.container}>
    Nathan.R
  </div>
);

const styles = {
  container: {
    fontFamily: "'Work Sans', sans-serif", // Utilise la police déclarée dans global.css
    fontWeight: 400, // Définit le poids de la police
    fontSize: "1.8rem", // Taille du texte
    textAlign: "center", // Centrage horizontal
    color: "#000", // Couleur par défaut (modifiable)
  },
};

export default Logo;
