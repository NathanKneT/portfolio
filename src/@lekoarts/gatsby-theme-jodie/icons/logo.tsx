// import * as React from "react";

// const Logo = () => (
//   <div style={styles.container}>
//     Nathan.R
//   </div>
// );

// const styles = {
//   container: {
//     fontFamily: "'Work Sans', sans-serif", // Utilise la police déclarée dans global.css
//     fontWeight: 400, // Définit le poids de la police
//     fontSize: "1.3rem", // Taille du texte
//     textAlign: "center", // Centrage horizontal
//     color: "#000", // Couleur par défaut (modifiable)
//   },
// };

// export default Logo;

import * as React from "react";
import { withPrefix } from "gatsby";

const Logo = () => (
  <div style={styles.container}>
    <img src={withPrefix("/logo_transp.png")} alt="Logo Nathan.R" style={styles.logo} />
  </div>
);

const styles = {
  container: {
    display: "flex",          // Utilise Flexbox pour aligner correctement l'image
    justifyContent: "center", // Centre l'image horizontalement
    alignItems: "center",    // Centre l'image verticalement
  },
  logo: {
    maxWidth: "400px",       // Ajuste la taille maximale de l'image
    width: "100%",           // La largeur de l'image s'ajuste à l'écran
    height: "auto",          // Maintient le ratio de l'image
    filter: "invert(1)", 
  },
};

export default Logo;
