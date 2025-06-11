import "./global.css"
import "@fortawesome/fontawesome-free/css/all.css"

export const onClientEntry = () => {
  // Simple redirect only from exact root
  if (typeof window !== "undefined" && window.location.pathname === "/") {
    window.location.replace("/biography");
  }
};