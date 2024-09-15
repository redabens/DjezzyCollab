import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
import Fichier from "../components/Fichier";
import "./../styles/DownloadPage.css";
import YesNoDialog from "../components/YesNoDialog";
function DownloadPage() {
  const { token } = useAuth();
  const [downloads, setDownloads] = useState([]);
  const [isGrid, setIsGrid] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { user } = useOutletContext();
  
  const [refreshFiles, setRefreshFiles] = useState(false);

  const navigate = useNavigate();
  useEffect(
    function () {
      setRefreshFiles(false);
      axios
        .get("http://localhost:3000/download", {
          headers: { Authorization: token },
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data.files);
            setDownloads(res.data.files);
          }
        })
        .catch((error) => {
          if (error.response) {
            if (res.status === 401) return alert("User Id not Found");
            else if (res.status === 404) return alert("User not found");
            else if (res.status === 415) return alert("Directory not found");
            else if (res.status === 500)
              return alert("Failed to upload due to server");
          } else {
            console.log(error);
            alert("An unexpected error occurred. Please try again.");
          }
        });
    },
    [refreshFiles]
  );
  // deleting file
  const [fileToDelete, setFileToDelete] = useState("");
  const showDeleteDialog = (filename) => {
    setShowDelete(true);
    setFileToDelete(filename);
    console.log("showDelete hit in downloadpage, showDialog is: ", showDelete);
  };

  const onConfirmDialog = async (confirm) => {
    console.log("onConfirmDialog hit in download page : " + confirm);
    if (confirm && fileToDelete) {
      await handleDelete(fileToDelete);
    }
    setShowDelete(false);
  };

  const handleDelete = (filename) => {
    try {
      axios
        .delete(`http://localhost:3000/delete/${filename}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          if (res.status === 200) {
            // setDownloads(downloads.filter((file) => file.name !== filename));
            // alert(`File ${filename} deleted successfully.`);
            setShowDelete(false);
            setRefreshFiles(true);
          }
        })
        .catch((error) => {
          if (error.response) {
            const status = error.response.status;
            if (status === 401)
              return alert(
                "User ID not found while trying to delete the file."
              );
            else if (status === 404)
              return alert("User not found while attempting to delete.");
            else if (status === 415)
              return alert("Directory not found, file could not be deleted.");
            else if (status === 500)
              return alert("Failed to delete file due to a server error.");
          } else {
            return alert(
              "An unknown error occurred during the file deletion process."
            );
          }
        });
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div className="download-page">
      <h1>Fichiers disponibles:</h1>
      <div className="display-params">
        <div
          className="display-row"
          onClick={() => setIsGrid(false)}
          title="Rows"
        >
          {isGrid ? (
            <img
              src="./../../src/assets/display_rows.svg"
              alt="display_rows"
              style={{ width: "18px", height: "18px" }}
            />
          ) : (
            <img
              src="./../../src/assets/display_rows_full.svg"
              alt="display_rows"
              style={{ width: "18px", height: "18px" }}
            />
          )}
        </div>
        <div
          className="display-grid"
          onClick={() => setIsGrid(true)}
          title="Grid"
        >
          {isGrid ? (
            <img
              src="./../../src/assets/display_grid_full.svg"
              alt="display_grid"
              style={{ width: "20px", height: "20px" }}
            />
          ) : (
            <img
              src="./../../src/assets/display_grid.svg"
              alt="display_rows"
              style={{ width: "18px", height: "18px" }}
            />
          )}
        </div>
      </div>
      <div
        className={
          downloads.length === 0
            ? "default"
            : isGrid
            ? "grid-preview"
            : "preview"
        }
      >
        {downloads.length > 0 ? (
          downloads.map((file, index) => {
            return (
              <Fichier
                key={index}
                file={file}
                isGrid={isGrid}
                onDelete={() => showDeleteDialog(file.name)}
                user={user}
              />
            );
          })
        ) : (
          <div className="aucun">Aucun fichier existant</div>
        )}
      </div>
      {showDelete && (
        <div className="popup">
          <YesNoDialog
            titre="Supression du fichier"
            message="Voulez-vous vraiment supprimer ce fichier ?"
            image="./../../src/assets/delete_illustration.svg"
            onConfirmDialog={onConfirmDialog}
            confirmWord="Supprimer"
          />
        </div>
      )}
    </div>
  );
}
export default DownloadPage;
