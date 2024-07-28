import { useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import "../styles/Administrateur.css"
export default function Administrateur() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <List component="div" className="admin" style={{padding:0}}>
        <ListItemButton
          onClick={handleClick}
          className="adminis"
          sx={{
            backgroundColor: open ? "#F8CECE" : null ,color: '#121212',
            padding: '10px',
            border: '2px solid #f8cece',
            borderRadius: '10px 10px 10px 10px',
            fontFamily: "Noto Sans",
            fontSize: "0.7 em",
            fontWeight: '600',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '1rem',
            textDecoration: 'none',
          }}
        >
          <ListItemIcon>
            {open ? ( <ExpandLess style={{ width: "28px", height: "28px" }}/>) : (
              <img
                className="admin"
                src="./src/assets/security-user.svg"
                alt="menu"
                style={{ width: "28px", height: "28px" }}
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
