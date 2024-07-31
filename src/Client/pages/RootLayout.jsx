import "./../../../src/App.css";
import "./../styles/RootLayout.css";
import { useState } from "react";
import Sidebar from "./../components/Sidebar";
import Navbr from "./../components/Navbr";
import LogoDjezzy from "./../components/LogoDjezzy";
import { Outlet, useLocation } from "react-router-dom";
export default function RootLayout() {
  const [open, setOpen] = useState(true);
  const handleToggle = (e) => {
    setOpen((prev) => !prev);
  };
  //-------------- <3 initialisationn de la side bar state <3 -----------------
  const getSidebarParams = (pathname) => {
    const defaultParams = {
      upload: false,
      download: false,
      admin: false,
      gestRep: false,
      gestUtils: false,
      creatCompt: false,
      notifs: false,
      params: false,
      aide: false,
    };
    switch (pathname) {
      case "/upload":
        return { ...defaultParams, upload: true };
      case "/download":
        return { ...defaultParams, download: true };
      case "/admin":
        return { ...defaultParams, admin: true };
      case "/admin/gestion-repertoires":
        return { ...defaultParams, gestRep: true };
      case "/admin/gestion-utilisateurs":
        return { ...defaultParams, gestUtils: true };
      case "/admin/creation-comptes":
        return { ...defaultParams, creatCompt: true };
      case "/notifications":
        return { ...defaultParams, notifs: true };
      case "/parametres":
        return { ...defaultParams, params: true };
      case "/aide":
        return { ...defaultParams, aide: true };
      default:
        return defaultParams;
    }
  };

  const params = getSidebarParams(location.pathname);

  //----------------------------------
  return (
    <div
      className="rootlayout"
      style={
        open
          ? { gridTemplateColumns: "23% 1fr" }
          : { gridTemplateColumns: "4% 1fr" }
      }
    >
      <div className="navbar">
        <Navbr open={open} />
      </div>
      <div className="Sidebar">
        <Sidebar open={open} handleToggle={handleToggle} params={params} />
      </div>
      <div className="LogoDjezzy">
        <LogoDjezzy />
      </div>
      <div className="containers">
        <Outlet context={open} />
      </div>
    </div>
  );
}
