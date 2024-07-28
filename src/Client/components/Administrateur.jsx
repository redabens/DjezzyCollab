import { useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
export default function Administrateur() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <List component="div">
        <ListItemButton
          onClick={handleClick}
          style={{ backgroundColor: open ? "#F8CECE" : "#FFFFFF" }}
        >
          <ListItemIcon>
            {open ? (
              <ExpandLess />
            ) : (
              <img
                className="admin"
                src="./src/assets/security-user.svg"
                alt="menu"
                style={{ width: "30px", height: "30px" }}
              />
            )}
          </ListItemIcon>
          <ListItemText primary="Administrateur" />
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <img
                  className="gestRep"
                  src="./src/assets/layer.svg"
                  alt="gest rep"
                  style={{ width: "30px", height: "30px" }}
                />
              </ListItemIcon>
              <ListItemText primary="Gestion répertoires" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <img
                  className="gestUtil"
                  src="./src/assets/Group.svg"
                  alt="gest Util"
                  style={{ width: "30px", height: "30px" }}
                />
              </ListItemIcon>
              <ListItemText primary="Gestion Utilisateurs" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <img
                  className="creatCompt"
                  src="./src/assets/Group_add.svg"
                  alt="creatCompt"
                  style={{ width: "30px", height: "30px" }}
                />
              </ListItemIcon>
              <ListItemText primary="Creation Compte" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </>
  );
}
