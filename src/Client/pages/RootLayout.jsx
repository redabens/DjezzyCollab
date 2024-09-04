import "./../../../src/App.css";
import "./../styles/RootLayout.css";
import { useState,useEffect } from "react";
import Sidebar from "./../components/Sidebar";
import Navbar from "./../components/Navbr";
import LogoDjezzy from "./../components/LogoDjezzy";
import { Outlet, Navigate , useLocation } from "react-router-dom";
import { useAuth } from '../components/AuthContext'; // Assurez-vous du bon chemin d'importation
import axios from "axios";
export default function RootLayout() {


  const [rotating, setRotating] = useState(false);
  const handleRotateLogo = () => {
    setRotating(true);
    setTimeout(() => setRotating(false), 1000); // Duration should match the animation duration
  };




  const { token } = useAuth();
  const [user,setUser] = useState('');
  // Vérifiez l'état d'authentification avant de rendre le contenu
  if (!token) {
    return <Navigate to="/login" />;
  }
  useEffect(function (){
    axios.get("http://localhost:3000/user", {
      headers: { Authorization: token },
    }).then((res) => {
      if (res.status === 200) {
        setUser(res.data.user);
      } else if (res.status === 401) return alert("User Id not Found");
      else if (res.status === 404) return alert("User not found");
      else if (res.status === 500) return alert("Failed to upload due to server");
    })
    .catch((error) => {
      alert("Error getting user");
    });
  },[]);
  const [open, setOpen] = useState(true);
  const handleToggle = (e) => {
    setOpen((prev) => !prev);
    handleRotateLogo();
  };
  //-------------- <3 initialisationn de la side bar state <3 -----------------
  const getSidebarParams = (pathname) => {
    const defaultParams = {
      upload: false,
      download: false,
      // admin: false,
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
      // case "/admin":
      //   return { ...defaultParams, admin: true };
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
          ? { gridTemplateColumns: "18% 1fr" }
          : { gridTemplateColumns: "4% 1fr" }
      }
    >
      <div className="navbar">
        <Navbar open={open} user={user}/>
      </div>
      <div className="Sidebar">
        <Sidebar open={open} handleToggle={handleToggle} params={params} handleRotateLogo={handleRotateLogo}/>
      </div>
      <div className="LogoDjezzy">
        <LogoDjezzy rotating={rotating}/>
      </div>
      <div className="containers">
        <Outlet context={open} />
      </div>
    </div>
  );
}
