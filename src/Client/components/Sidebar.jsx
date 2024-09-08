import { useState } from "react";
import { v4 as uuid } from "uuid";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Navigate, NavLink, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import Administrateur from "./Administrateur";
import { useAuth } from "../components/AuthContext";

function Sidebar({ open, user, handleToggle, params, onLogout }) {
  // Redirection conditionnelle basée sur le rôle de l'utilisateur
  const location = useLocation();
  if (location.pathname === "/") {
    if (user && user.role === "download") {
      return <Navigate to="/download" />;
    } else {
      return <Navigate to="/upload" />;
    }
  }
  const { token, setToken } = useAuth();
  const [navbar, setNavBar] = useState(params);
  const handleLogout = () => {
    onLogout();
  };
  const menuItemUp = [
    user.role !== "download" && {
      path: "/upload",
      name: "Envoyer un fichier",
      icon: (
        <img
          src="./../../src/assets/Folder_send.svg"
          alt="logo_download"
          style={
            open
              ? { width: "20px", height: "20px" }
              : { width: "23px", height: "23px", paddingLeft: "2px" }
          }
        />
      ),
      func: function () {
        setNavBar({
          upload: true,
          download: false,
          admin: false,
          gestRep: false,
          gestUtils: false,
          creatCompt: false,
          notifs: false,
        });
      },
      couleur: function () {
        return navbar.upload;
      },
      id: uuid(),
    },
    user.role !== "upload" && {
      path: "/download",
      name: "Télecharger un fichier",
      icon: (
        <CloudDownloadOutlinedIcon
          style={
            open
              ? { width: "20px", height: "20px" }
              : { width: "23px", height: "23px", paddingLeft: "2px" }
          }
        />
      ),
      func: function () {
        setNavBar({
          upload: false,
          download: true,
          admin: false,
          gestRep: false,
          gestUtils: false,
          creatCompt: false,
          notifs: false,
        });
      },
      couleur: function () {
        return navbar.download;
      },
      id: uuid(),
    },
    user.role === "admin" && {
      path: "/admin",
      name: "Administrateur",
      icon: (
        <img
          className="admin"
          src="./../../src/assets/security-user.svg"
          alt="logo_admin"
          style={
            open
              ? { width: "20px", height: "20px" }
              : { width: "23px", height: "23px", paddingLeft: "2px" }
          }
        />
      ),
      func: function () {
        setNavBar((prev) => ({
          upload: false,
          download: false,
          admin: !prev.admin,
          gestRep: false,
          gestUtils: false,
          creatCompt: false,
          notifs: false,
        }));
      },
      couleur: function () {
        return navbar.admin;
      },
      id: uuid(),
    },
  ].filter(Boolean);
  const menuItemDown = [
    user.role === "admin" && {
      path: "/notifications",
      name: "Notifications",
      icon: (
        <img
          src="./../../src/assets/notification.svg"
          alt="logo_notifs"
          style={
            open
              ? { width: "20px", height: "20px" }
              : { width: "23px", height: "23px", paddingLeft: "2px" }
          }
        />
      ),
      func: function () {
        setNavBar((prev) => ({
          upload: false,
          download: false,
          admin: false,
          gestRep: false,
          gestUtils: false,
          creatCompt: false,
          notifs: true,
        }));
      },
      couleur: function () {
        return navbar.notifs;
      },
      id: uuid(),
    },
    {
      path: "/login",
      name: "Déconnexion",
      icon: (
        <img
          src="./../../src/assets/logo_deconnexion.svg"
          alt="logo_deconnexion"
          style={
            open
              ? { width: "20px", height: "20px" }
              : { width: "23px", height: "23px", paddingLeft: "2px" }
          }
        />
      ),
      func: handleLogout,
      couleur: function () {
        return false;
      },
      id: uuid(),
    },
  ].filter(Boolean);
  return (
    <div className="container">
      <div className={open ? "sidebar-open" : "sidebar-close"}>
        <div
          className="top-logo"
          style={
            !open
              ? {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }
              : null
          }
        >
          <div onClick={handleToggle}>
            <img
              className={open ? "bars-open" : "bars-close"}
              src="./../../src/assets/Menu.svg"
              alt="menu"
              style={
                open
                  ? { width: "25px", height: "25px" }
                  : { width: "25px", height: "25px" }
              }
            />
          </div>
        </div>

        <div className="options" style={!open ? { alignItems: "center" } : {}}>
          <div className="optionsUp" style={{ gap: open ? "1.2vh" : "2vh" }}>
            {menuItemUp.map((item) => {
              return item.name === "Administrateur" ? (
                <div
                  key={item.id}
                  className={open ? "linkSpe" : "link-close"}
                  onClick={!open ? item.func : null}
                  style={{
                    backgroundColor:
                      !open && item.couleur() ? "#f8cece" : "null",
                  }}
                >
                  {open ? (
                    <Administrateur
                      state={navbar}
                      handleAdmin={item.func}
                      handleGestRep={() => {
                        setNavBar((prev) => ({
                          upload: false,
                          download: false,
                          admin: true,
                          gestRep: true,
                          gestUtils: false,
                          creatCompt: false,
                          notifs: false,
                        }));
                      }}
                      handleGestUtils={() => {
                        setNavBar((prev) => ({
                          upload: false,
                          download: false,
                          admin: true,
                          gestRep: false,
                          gestUtils: true,
                          creatCompt: false,
                          notifs: false,
                        }));
                      }}
                      handleCreatCompte={() => {
                        setNavBar((prev) => ({
                          upload: false,
                          download: false,
                          admin: true,
                          gestRep: false,
                          gestUtils: false,
                          creatCompt: true,
                          notifs: false,
                        }));
                      }}
                    />
                  ) : (
                    <div className="iconUp">{item.icon}</div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  key={item.id}
                  className={open ? "link-open" : "link-close"}
                  activeclassname="active"
                  onClick={item.func}
                  style={{
                    backgroundColor: item.couleur() ? "#f8cece" : "null",
                  }}
                >
                  <div className="iconUp">{item.icon}</div>
                  {open ? <div className="link_text">{item.name}</div> : null}
                </NavLink>
              );
            })}
          </div>

          <div className="optionsDown" style={{ gap: open ? "1.2vh" : "2vh" }}>
          {menuItemDown.map((item) => {
            return item.name === "Déconnexion" ? 
              <div
                  className={open ? "link-open" : "link-close"}
                  activeclassname="active"
                  onClick={item.func}
                  style={{
                    backgroundColor: item.couleur() ? "#f8cece" : "null",
                  }}
                >
                  <div className="iconDown">{item.icon}</div>
                  {open ? <div className="link_text">{item.name}</div> : null}
                </div>
                :(
                <NavLink
                  to={item.path}
                  key={item.id}
                  className={open ? "link-open" : "link-close"}
                  activeclassname="active"
                  onClick={item.func}
                  style={{
                    backgroundColor: item.couleur() ? "#f8cece" : "null",
                  }}
                >
                  <div className="iconDown">{item.icon}</div>
                  {open ? <div className="link_text">{item.name}</div> : null}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
