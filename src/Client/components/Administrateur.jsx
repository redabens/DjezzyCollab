import { useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import { NavLink } from "react-router-dom";
import "../styles/Administrateur.css";
import { styled } from "@mui/material/styles";
import { Typography } from "antd";

const StyledListItemText = styled(ListItemText)({
  all: "unset",
  color: "#121212",
  fontFamily: "Noto Sans, sans-serif",
  fontSize: "0.7em",
  fontWeight: "600",
  textDecoration: "none",
});

export default function Administrateur({
  state,
  handleAdmin,
  handleGestRep,
  handleGestUtils,
  handleCreatCompte,
}) {
  return (
    <>
      <List
        component="div"
        className="admin"
        disablePadding
        sx={{ all: "unset" }}
      >
        <ListItemButton
          onClick={handleAdmin}
          className="adminis"
          sx={{
            backgroundColor: state.admin ? "#F8CECE" : null,
            color: "#121212",
            padding: "10px",
            border: "2px solid #f8cece",
            borderRadius: "10px 10px 10px 10px",
            gap: "1rem",
            "&:hover": {
              backgroundColor: state.admin ? "#f8cece" : "unset", // Remove hover background
              color: "unset", // Remove hover color change
            },
          }}
        >
          <ListItemIcon sx={{ all: "unset" }}>
            {state.admin ? (
              <ExpandLess style={{ width: "28px", height: "28px" }} />
            ) : (
              <img
                className="admin"
                src="./src/assets/security-user.svg"
                alt="menu"
                style={{ width: "28px", height: "28px" }}
              />
            )}
          </ListItemIcon>
          <StyledListItemText
            disableTypography
            primary={
              <Typography
                variant="body2"
                style={{
                  fontSize: "2em",
                  fontWeight: 650,
                  color: "black",
                }}
              >
                Administrateur
              </Typography>
            }
          />
        </ListItemButton>
        <Collapse
          in={state.admin}
          timeout="auto"
          unmountOnExit
          sx={{
            "&:active": {
              backgroundColor: "unset", // Remove active background
              color: "unset", // Remove active color change
            },
            "&:focus": {
              backgroundColor: "unset", // Remove focus background
              color: "unset", // Remove focus color change
            },
          }}
        >
          <List
            component="div"
            disablePadding
            sx={{
              all: "unset",
              display: "flex",
              flexDirection: "column",
              gap: "1vh",
              pt: "1vh",
              alignItems: "center",
            }}
          >
            <NavLink
              to="/admin/gestion-repertoires"
              className="linkSpe"
              style={{
                width: "85%",
                borderRadius: "8px 8px 8px 8px",
                backgroundColor: state.gestRep ? "#f8cece" : "null",
              }}
            >
              <ListItemButton
                onClick={handleGestRep}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1rem",
                  pt: 0.5,
                  pb: 0.5,
                  alignItems: "center",
                  borderRadius: "8px 8px 8px 8px",
                }}
              >
                <ListItemIcon sx={{ all: "unset" }}>
                  <img
                    className="gestRep"
                    src="./../../src/assets/layer.svg"
                    alt="gest rep"
                    style={{ width: "28px", height: "28px" }}
                  />
                </ListItemIcon>
                <StyledListItemText primary="Gestion répertoires" />
              </ListItemButton>
            </NavLink>
            <NavLink
              to="/admin/gestion-utilisateurs"
              className="linkSpe"
              style={{
                width: "85%",
                borderRadius: "8px 8px 8px 8px",
                backgroundColor: state.gestUtils ? "#f8cece" : "null",
              }}
            >
              <ListItemButton
                onClick={handleGestUtils}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1rem",
                  pt: 0.5,
                  pb: 0.5,
                  alignItems: "center",
                  borderRadius: "8px 8px 8px 8px",
                }}
              >
                <ListItemIcon sx={{ all: "unset" }}>
                  <img
                    className="gestUtil"
                    src="./../../src/assets/Group.svg"
                    alt="gest Util"
                    style={{ width: "28px", height: "28px" }}
                  />
                </ListItemIcon>
                <ListItemText primary="Gestion Utilisateurs" />
              </ListItemButton>
            </NavLink>
            <NavLink
              to="/admin/creation-comptes"
              className="linkSpe"
              style={{
                width: "85%",
                borderRadius: "8px 8px 8px 8px",
                backgroundColor: state.creatCompt ? "#f8cece" : "null",
              }}
            >
              <ListItemButton
                onClick={handleCreatCompte}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1rem",
                  pt: 0.5,
                  pb: 0.5,
                  alignItems: "center",
                  borderRadius: "8px 8px 8px 8px",
                }}
              >
                <ListItemIcon sx={{ all: "unset" }}>
                  <img
                    className="creatCompt"
                    src="./../../src/assets/Group_add.svg"
                    alt="creatCompt"
                    style={{ width: "28px", height: "28px" }}
                  />
                </ListItemIcon>
                <ListItemText primary="Creation Compte" />
              </ListItemButton>
            </NavLink>
          </List>
        </Collapse>
      </List>
    </>
  );
}
