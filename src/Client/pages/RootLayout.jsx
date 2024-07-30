import "./../../../src/App.css";
import "./../styles/RootLayout.css";
import Sidebar from "./../components/Sidebar";
import Navbr from "./../components/Navbr";
import LogoDjezzy from "./../components/LogoDjezzy";
import { Outlet } from "react-router-dom";
export default function RootLayout() {
  return (
    <div className="rootlayout">
      <div className="navbar">
        <Navbr />
      </div>
      <div className="Sidebar">
        <Sidebar />
      </div>
      <div className="LogoDjezzy">
        <LogoDjezzy />
      </div>
      <div className="containers">
        <Outlet />
      </div>
    </div>
  );
}
