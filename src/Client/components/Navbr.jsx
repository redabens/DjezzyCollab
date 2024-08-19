import "../styles/Navbar.css";
import { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Navbar({user}) {
  const [isOpen, setIsOpen] = useState(false);

  function togglePopover() {
    console.log("Popover toggled");
    setIsOpen(!isOpen);
  }

  return (
    <nav className="navbr">
      <div className="navbarElt">
        <h3 style={{ fontSize: "0.9em" }}>{`${user.firstName} ${user.lastName}`}</h3>
        <div onClick={togglePopover}>
          <img
            className="pdp"
            src="../src/assets/anonyme.png"
            alt="photo_profil"
          />
        </div>
      </div>

      {isOpen && (
        <Box className="infoBox">
          <div className="infoBoxImg">
            <img
              style={{ width: "6.5vh", height: "6.5vh", borderRadius: "50%" }}
              src="../src/assets/anonyme.png"
              alt="photo_profil"
            />
          </div>
          <div className="infoElt">
            <h3>Nom:</h3>
            <h3 className="var">{`${user.firstName} ${user.lastName}`}</h3>
          </div>
          <div className="infoElt">
            <h3>Email:</h3>
            <h3 className="var">{user.email}</h3>
          </div>
          <div className="infoElt">
            <h3>Directory Path:</h3>
            <h3 className="var">{user.DirPath}</h3>
          </div>
          <div className="infoElt">
            <h3>Role:</h3>
            <h3 className="var">{user.role}</h3>
          </div>
        </Box>
      )}
    </nav>
  );
}
