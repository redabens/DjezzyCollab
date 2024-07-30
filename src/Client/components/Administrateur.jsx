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
import { Typography } from '@mui/material';

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
        disablepadding="true"
        sx={{ all: "unset" }}
      >
        <ListItemButton
          onClick={handleAdmin}
          className="adminis"
          sx={{
            minHeight:'52px',
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
          <ListItemIcon sx={{ all: "unset",padding:0 }} disablepadding="true">
            { state.admin ? (
              <ExpandLess style={{ width: "24px", height: "24px" }} />
            ) : (
              <img
                className="admin"
                src="./src/assets/security-user.svg"
                alt="menu"
                style={{ width: "24px", height: "24px" }}
              />
            )}
          </ListItemIcon>
          {open ? <StyledListItemText
            disableTypography
            primary={
              <Typography
                variant="div"
                style={{
                  fontFamily: "Noto Sans, sans-serif",
                  fontSize: "1.45em",
                  fontWeight: 600,
                  color: '#121212',
                  textDecoration: "none",
                }}
              >
                Administrateur
              </Typography>
            }
          /> : null}
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
            disablepadding="true"
            sx={{
              all: "unset",
              display: "flex",
              flexDirection: "column",
              gap: "0.8vh",
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
                    style={{ width: "24px", height: "24px" }}
                  />
                </ListItemIcon>
                <StyledListItemText disableTypography
                  primary={
                    <Typography
                      variant="div"
                      style={{
                        fontFamily: "Noto Sans, sans-serif",
                        fontSize: "1.4em",
                        fontWeight: 500,
                        color: '#121212',
                        textDecoration: "none",
                      }}
                    >
                      Gestion Répertoires
                    </Typography>
                  } />
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
                    style={{ width: "24px", height: "24px" }}
                  />
                </ListItemIcon>
                <StyledListItemText disableTypography
                  primary={
                    <Typography
                      variant="div"
                      style={{
                        fontFamily: "Noto Sans, sans-serif",
                        fontSize: "1.4em",
                        fontWeight: 500,
                        color: '#121212',
                        textDecoration: "none",
                      }}
                    >
                      Gestion Utilisateurs
                    </Typography>
                  } />
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
                    style={{ width: "24px", height: "24px" }}
                  />
                </ListItemIcon>
                <StyledListItemText disableTypography
                  primary={
                    <Typography
                      variant="div"
                      style={{
                        fontFamily: "Noto Sans, sans-serif",
                        fontSize: "1.4em",
                        fontWeight: 500,
                        color: '#121212',
                        textDecoration: "none",
                      }}
                    >
                      Creation Compte
                    </Typography>
                  } />
              </ListItemButton>
            </NavLink>
          </List>
        </Collapse>
      </List>
    </>
  );
}
