import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Fichier from "../components/Fichier";
import "./../styles/DownloadPage.css";
function DownloadPage() {
  const { token } = useAuth();
  const [downloads, setDownloads] = useState([]);
  const [isGrid, setIsGrid] = useState(false);
  const navigate = useNavigate();
  useEffect(function () {
    axios.get("http://localhost:3000/download", {
        headers: { Authorization: token },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data.files);
          setDownloads(res.data.files);
        } else if (res.status === 401) return alert("User Id not Found");
        else if (res.status === 404) return alert("User not found");
        else if (res.status === 415) return alert("Directory not found");
        else if (res.status === 500)
          return alert("Failed to upload due to server");
      })
      .catch((error) => {
        alert("Error Donwloading files");
      });
  }, []);
  return (
    <div className="download-page">
      <h1>Fichiers disponibles:</h1>
      <div className="display-params">
        <div
          className="display-row"
          onClick={() => setIsGrid(false)}
          style={{
            backgroundColor: !isGrid
              ? "rgba(173, 216, 230, 0.9)" // baby blue with opacity
              : "transparent",
          }}
          title="Rows"
        >
          <img
            src="./../../src/assets/display_rows.svg"
            alt="display_rows"
            style={{ width: "18px", height: "18px" }}
          />
        </div>
        <div
          className="display-grid"
          onClick={() => setIsGrid(true)}
          style={{
            backgroundColor: isGrid
              ? "rgba(173, 216, 230, 0.9)" // baby blue with opacity
              : "transparent",
          }}
          title="Grid"
        >
          <img
            src="./../../src/assets/display_grid.svg"
            alt="display_grid"
            style={{ width: "20px", height: "20px" }}
          />
        </div>
      </div>
      <div className={isGrid ? "grid-preview" : "preview"}>
        {downloads.map((file, index) => {
          return <Fichier key={index} file={file} isGrid={isGrid} />;
        })}
      </div>
    </div>
  );
}
export default DownloadPage;
