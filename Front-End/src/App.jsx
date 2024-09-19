import "./App.css";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
// pages
import DownloadPage from "./Client/pages/DownloadPage";
import GestionSites from "./Client/pages/GestionSites";
import NotificationsPage from "./Client/pages/NotificationsPage";
import UploadPage from "./Client/pages/UploadPage";
import CreationUser from "./Client/pages/CreationUser";
import GestionRepertoires from "./Client/pages/GestionRepertoires";
import GestionUsers from "./Client/pages/GestionUsers";
import LoginPage from "./Client/pages/LoginPage";
// fixed element
import { AuthProvider } from "./Client/components/AuthContext"; // Importez le fournisseur de contexte
import RootLayout from "./Client/pages/RootLayout";
import NotFound from "./Client/pages/NotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RootLayout />}>
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/gestion-repertoires" element={<GestionRepertoires />} />
        <Route path="/gestion-utilisateurs" element={<GestionUsers />} />
        <Route path="/gestion-sites" element={<GestionSites />} />
        <Route path="/creation-comptes" element={<CreationUser />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

export default App;
