import { useState } from "react";
import "./App.css";
import {
  createBrowserRouter,
  BrowserRouter,
  Route,
  Routes,
  Link,
  NavLink,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
// pages
import Dashboard from "./Client/pages/Dashboard";
import DownloadPage from "./Client/pages/DownloadPage";
import ParametresPage from "./Client/pages/ParametresPage";
import NotificationsPage from "./Client/pages/NotificationsPage";
import UploadPage from "./Client/pages/UploadPage";
import AidePage from "./Client/pages/AidePage";
import AdminPage from "./Client/pages/AdminPage";
// fixed element
import RootLayout from "./Client/pages/RootLayout";
import NotFound from "./Client/pages/NotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<RootLayout />} >
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
      </Route>
      <Route path="*" element={<NotFound />}/>
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
