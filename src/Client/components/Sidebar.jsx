import { useState } from "react";
import { v4 as uuid } from "uuid";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";
import Administrateur from "./Administrateur";

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
  const [open,setOpen]= useState(true);
  const handleToggle = (e) => {
    setOpen(prev=>(!prev));
  }
  const menuItemUp = [
    {
      path: "/upload",
      name: "Uploader un fichier",
      icon: (
        <img
          src="./../../src/assets/Folder_send.svg"
          alt="logo_download"
          style={open ? { width: "24px", height: "24px" } : { width: "28px", height: "28px" }}
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
        <CloudDownloadOutlinedIcon style={open ? { width: "24px", height: "24px" } : { width: "28px", height: "28px" }} />
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
          style={open ? { width: "24px", height: "24px" } : { width: "28px", height: "28px" }}
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
          src="./../../src/assets/notification.svg"
          alt="logo_notifs"
          style={open ? { width: "24px", height: "24px" } : { width: "28px", height: "28px" }}
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
          src="./../../src/assets/setting-2.svg"
          alt="logo_params"
          style={open ? { width: "24px", height: "24px" } : { width: "28px", height: "28px" }}
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
      icon: <HelpOutlineOutlinedIcon style={open ? { paddingLeft:'1px',width: "24px", height: "24px" } : { paddingLeft:'1px', width: "28px", height: "28px" }} />,
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
      <div className={open ? "sidebar-open" : "sidebar-close"} >
        <div className="top-logo" style={!open ? {display: 'flex',flexDirection: 'row',justifyContent: 'center',} : null}>
          <div onClick={handleToggle}>
            <img
              className={open ? "bars-open" : "bars-close"}
              src="./../../src/assets/Menu.svg"
              alt="menu"
              style={open ? {width:'28px',height:'28px'} : {width:'26px',height:'26px'}}
            />
          </div>
        </div>

        <div
          className="options"
          style={{ gap: !open ? "26vh" : navbar.admin ? '1.5vh': '21vh' }}
        >
          <div className="optionsUp" style={{ gap: open ? '1.2vh' : '2vh'}}>
            {menuItemUp.map((item) => {
              return item.name === "Administrateur" ? (
                <NavLink
                  to={item.path}
                  key={item.id}
                  sx={{ all: "unset" }}
                  className={open ? 'linkSpe' : 'link-close'}
                  onClick={!open ? item.func : null}
                  style={{
                    backgroundColor: !open&&item.couleur() ? "#f8cece" : "null",
                  }}
                >
                  {open ? <Administrateur
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
                  /> : <div className="iconUp">{item.icon}</div>}
                </NavLink>
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
                  {open ? <div className="link_text">{item.name}</div> : null }
                </NavLink>
              );
            })}
          </div>

          <div className="optionsDown" style={{ gap: open ? '1.2vh' : '2vh'}}>
            {menuItemDown.map((item, index) => {
              return (
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
                  {open ? <div className="link_text">{item.name}</div> : null }
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
