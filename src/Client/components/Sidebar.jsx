import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { v4 as uuid } from "uuid";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";
import Administrateur from "./Administrateur";
import AdminPage from "../pages/AdminPage";
import Navbr from "./Navbr";

function Sidebar() {

  const [navbar, setNavBar] = useState({
    upload: false,
    download: false,
    admin: false,
    gestRep: false,
    gestUtils: false,
    creatCompt: false,
    notifs: false,
    params: false,
    aide: false,
  });
  const menuItemUp = [
    {
      path: "/upload",
      name: "Uploader un fichier",
      icon: (
        <img
          className="downloads"
          src="./../../src/assets/Folder_send.svg"
          alt="logo_download"
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
          params: false,
          aide: false,
        });
      },
      couleur: function () {
        return navbar.upload;
      },
      id: uuid(),
    },
    {
      path: "/download",
      name: "Downloader un fichier",
      icon: (
        <CloudDownloadOutlinedIcon style={{ width: "28px", height: "28px" }} />
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
          params: false,
          aide: false,
        });
      },
      couleur: function () {
        return navbar.download;
      },
      id: uuid(),
    },
    {
      path: "/admin",
      name: "Administrateur",
      icon: (
        <img
          className="admin"
          src="./../../src/assets/security-user.svg"
          alt="logo_admin"
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
          params: false,
          aide: false,
        }));
      },
      couleur: function () {
        return navbar.admin;
      },
      id: uuid(),
    },
  ];
  const menuItemDown = [
    {
      path: "/notifications",
      name: "Notifications",
      icon: (
        <img
          className="notifs"
          src="./../../src/assets/notification.svg"
          alt="logo_notifs"
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
          params: false,
          aide: false,
        }));
      },
      couleur: function () {
        return navbar.notifs;
      },
      id: uuid(),
    },
    {
      path: "/parametres",
      name: "Paramétres",
      icon: (
        <img
          className="params"
          src="./../../src/assets/setting-2.svg"
          alt="logo_params"
        />
      ),
      func: function () {
        setNavBar({
          upload: false,
          download: false,
          admin: false,
          gestRep: false,
          gestUtils: false,
          creatCompt: false,
          notifs: false,
          params: true,
          aide: false,
        });
      },
      couleur: function () {
        return navbar.params;
      },
      id: uuid(),
    },
    {
      path: "/aide",
      name: "Aide",
      icon: <HelpOutlineOutlinedIcon style={{ paddingLeft: "1px" }} />,
      func: function () {
        setNavBar({
          upload: false,
          download: false,
          admin: false,
          gestRep: false,
          gestUtils: false,
          creatCompt: false,
          notifs: false,
          params: false,
          aide: true,
        });
      },
      couleur: function () {
        return navbar.aide;
      },
      id: uuid(),
    },
  ];
  return (
    <div className="container">
      <div className="sidebar">
        <div className="top-logo">
          <div onClick={toogle}>
            <img
              className="bars"
              src="./../../src/assets/Menu.svg"
              alt="menu"
            />
          </div>
          <div className="LogoWithName">
            <img
              className="logo"
              src="./../../src/assets/logo_djezzy.svg"
              alt="logo_djezzy"
            />
            <div className="Nom">
              <h2>DJEZZY COLLAB</h2>
              <h2 id="arabe">جازي كولاب</h2>
            </div>
          </div>
        </div>

        <div
          className="options"
          style={{ gap: navbar.admin ? "3.26vh" : "22vh" }}
        >
          <div className="optionsUp">
            {menuItemUp.map((item, index) => {
              return item.name === "Administrateur" ? (
                <NavLink
                  to={item.path}
                  key={item.id}
                  sx={{ all: "unset" }}
                  className="linkSpe"
                >
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
                        params: false,
                        aide: false,
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
                        params: false,
                        aide: false,
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
                        params: false,
                        aide: false,
                      }));
                    }}
                  />
                </NavLink>
              ) : (
                <NavLink
                  to={item.path}
                  key={item.id}
                  className="link"
                  activeclassname="active"
                  onClick={item.func}
                  style={{
                    backgroundColor: item.couleur() ? "#f8cece" : "null",
                  }}
                >
                  <div className="iconUp">{item.icon}</div>
                  <div className="link_text">{item.name}</div>
                </NavLink>
              );
            })}
          </div>

          <div className="optionsDown">
            {menuItemDown.map((item, index) => {
              return (
                <NavLink
                  to={item.path}
                  key={item.id}
                  className="link"
                  activeclassname="active"
                  onClick={item.func}
                  style={{
                    backgroundColor: item.couleur() ? "#f8cece" : "null",
                  }}
                >
                  <div className="iconDown">{item.icon}</div>
                  <div className="link_text">{item.name}</div>
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
