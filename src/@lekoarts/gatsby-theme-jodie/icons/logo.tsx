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
