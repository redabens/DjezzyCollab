import { useState } from "react";
import "./App.css";
import Sidebar from "./Client/components/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Client/pages/Dashboard";
import DownloadPage from "./Client/pages/DownloadPage";
import ParametresPage from "./Client/pages/ParametresPage";
import NotificationsPage from "./Client/pages/NotificationsPage";
import UploadPage from "./Client/pages/UploadPage";
import AidePage from "./Client/pages/AidePage";
import AdminPage from "./Client/pages/AdminPage";
import Navbr from "./Client/components/Navbr";
import LogoDjezzy from "./Client/components/LogoDjezzy";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="navbar">
          <Navbr />
        </div>
        <div className="Sidebar">
          <Sidebar >
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/download" element={<DownloadPage />} />
              <Route path="/parametres" element={<ParametresPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/aide" element={<AidePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/gestion-repertoires" element={<AdminPage />} />
              <Route path="/admin/gestion-utilisateurs" element={<AdminPage />} />
              <Route path="/admin/creation-comptes" element={<AdminPage />} />
            </Routes>
          </Sidebar>
        </div>
        <div className="LogoDjezzy">
          <LogoDjezzy />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
