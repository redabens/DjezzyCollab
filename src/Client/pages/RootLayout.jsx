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
    <div className="rootlayout">
      <div className="navbar">
        <Navbr />
      </div>
      <div className="Sidebar">
        <Sidebar open={open} handleToggle={handleToggle}/>
      </div>
      <div className="LogoDjezzy">
        <LogoDjezzy />
      </div>
      <div className="containers" style={open ? {width:'77%',left:'23%'} : {width:'96%',left:'4%'}}>
        <Outlet context={open}/>
      </div>
    </div>
  );
}
