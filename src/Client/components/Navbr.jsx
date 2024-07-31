import "../styles/Navbar.css";
import { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Navbar() {
  const [user, setUser] = useState({
    name: "Abdelhak Kaid",
    email: "k_abdelhak@djeezy.dz",
    tel: "07792345606",
  });

  const [isOpen, setIsOpen] = useState(false);

  function togglePopover() {
    console.log("Popover toggled");
    setIsOpen(!isOpen);
  }

  return (
    <nav className="navbr">
      <div
        className="navbarElt"
      >
        <h3>{user.name}</h3>
        <div onClick={togglePopover}>
          <img
            className="pdp"
            src="../src/assets/anonyme.png"
            alt="photo_profil"
          />
        </div>
      </div>

      {isOpen && (
        <Box
          className="infoBox"
         
        >
          <div className="infoBoxImg">
            <img
              className="pdp"
              src="../src/assets/anonyme.png"
              alt="photo_profil"
            />
          </div>
          <div className="infoElt">
            <h3>Nom:</h3>
            <h3 className="var">{user.name}</h3>
          </div>
          <div className="infoElt">
            <h3>Email:</h3>
            <h3 className="var">{user.email}</h3>
          </div>
          <div className="infoElt">
            <h3>Télephone:</h3>
            <h3 className="var">{user.tel}</h3>
          </div>
        </Box>
      )}
    </nav>
  );
}
