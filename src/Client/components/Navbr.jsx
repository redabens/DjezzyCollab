import "../styles/Navbar.css";
import { useState } from "react";
export default function Navbr() {
  const [name, setName] = useState("Abdelhak Kaid");
  return (
    <nav className="navbar">
      <div className="navbarElt">
        <h3>{name}</h3>
        <img
          className="pdp"
          src="../src/assets/anonyme.png"
          alt="photo_profil"
        />
      </div>
    </nav>
  );
}
