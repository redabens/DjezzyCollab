import "./../../../src/App.css";
import "./../styles/RootLayout.css";
import { useState } from "react";
import Sidebar from "./../components/Sidebar";
import Navbr from "./../components/Navbr";
import LogoDjezzy from "./../components/LogoDjezzy";
import { Outlet } from "react-router-dom";
export default function RootLayout() {
  const [open,setOpen]= useState(true);
  const handleToggle = (e) => {
    setOpen(prev=>(!prev));
  }
  return (
    <div className="rootlayout" style={open? {gridTemplateColumns:'23% 1fr'}:{gridTemplateColumns:'4% 1fr'}}>
      <div className="navbar">
        <Navbr />
      </div>
      <div className="Sidebar">
        <Sidebar open={open} handleToggle={handleToggle}/>
      </div>
      <div className="LogoDjezzy">
        <LogoDjezzy />
      </div>
      <div className="containers" >
        <Outlet context={open}/>
      </div>
    </div>
  );
}
