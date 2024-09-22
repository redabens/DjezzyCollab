import "../styles/Navbar.css";
import { useState } from "react";
import Box from "@mui/material/Box";

export default function Navbar({ user, userPath }) {
  const [isOpen, setIsOpen] = useState(false);

  function togglePopover() {
    console.log("Popover toggled");
    setIsOpen(!isOpen);
  }

  return (
    <nav className="navbr">
      <div className="navbarElt">
        <h3 style={{ fontSize: "0.9em" }}>{`${user.username}`}</h3>
        <div onClick={togglePopover}>
          <img
            className="pdp"
            src="../src/assets/profile-circle.svg"
            alt="photo_profil"
          />
        </div>
      </div>

      {isOpen && (
        <Box className="infoBox">
          <div className="infoBoxImg">
            <img
              style={{ width: "6.5vh", height: "6.5vh", borderRadius: "50%" }}
              src="../src/assets/profile-circle.svg"
              alt="photo_profil"
            />
          </div>
          <div className="infoElt">
            <h3>Nom d'utilisateur:</h3>
            <h3 className="var">{`${user.username}`}</h3>
          </div>
          <div className="infoElt">
            <h3>Directory Path:</h3>
            <h3 className="var">{userPath}</h3>
          </div>
          <div className="infoElt">
            <h3>Supression des fichiers:</h3>
            <h3 className="var">
              {user.ableToDelete ? "autorisé" : "non autorisé"}
            </h3>
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
