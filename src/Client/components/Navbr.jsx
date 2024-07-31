import "../styles/Navbar.css";
import { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

export default function Navbar() {
  const [user, setUser] = useState({
    name: "Abdelhak Kaid",
    email: "k_abdelhak@djeezy.dz",
    tel: "07792345606",
  });
  //------------------
  const [anchorEl, setAnchorEl] = useState(null);

  const openPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <nav className="navbar">
      <div className="navbarElt">
        <h3>{user.name}</h3>
        <div onClick={openPopover}>
          <img
            className="pdp"
            src="../src/assets/anonyme.png"
            alt="photo_profil"
          />
        </div>
      </div>

      <Popover
        style={{ borderRadius: 30 }}
        open={open}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="infoBox">
          <div className="infoBoxImg">
            <img
              className="pdp"
              src="../src/assets/anonyme.png"
              alt="photo_profil"
            />
          </div>
          <div className="infoElt">
            <h3>Nom:</h3>
            <h3 className="var"> {user.name}</h3>
          </div>
          <div className="infoElt">
            <h3>Email:</h3>
            <h3 className="var">{user.email}</h3>
          </div>
          <div className="infoElt">
            <h3>Télephone:</h3>
            <h3 className="var">{user.tel}</h3>
          </div>
        </div>
      </Popover>
    </nav>
  );
}
