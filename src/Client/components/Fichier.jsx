import { useState } from "react";
import { useAuth } from "../components/AuthContext";
import axios from "axios";
import "./../styles/Fichier.css";
import AutoResizeInput from "./AutoResizeInput";

export default function Fichier({ file, isGrid }) {
  const { token } = useAuth();
  const [nom, setNom] = useState(
    file.name.slice(0, file.name.lastIndexOf("."))
  );
  const [rename, setRename] = useState(false);
  const extension = file.name.slice(file.name.lastIndexOf("."));

  const handleDownload = () => {
    axios
      .get(`http://localhost:3000/download/${file.name}`, {
        headers: { Authorization: token },
        responseType: "blob",
      })
      .then((res) => {
        if (res.status === 200) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a"); // creates a link that is manageable programarly
          link.href = url;
          link.setAttribute("download", file.name);  
          document.body.appendChild(link); //add the link to the list of html objects 
          link.click(); 
          document.body.removeChild(link);
        } else {
          handleError(res.status);
        }
      })
      .catch((error) => {
        alert("Error Downloading files");
      });
  };

  const handleError = (status) => {
    switch (status) {
      case 401:
        return alert("User Id not Found");
      case 404:
        return alert("User not found");
      case 415:
        return alert("Directory not found");
      case 500:
        return alert("Failed to upload due to server");
      default:
        return alert("An unknown error occurred");
    }
  };

  const handleRename = () => {
    const newFilename = `${nom}${extension}`;
    axios
      .patch(
        `http://localhost:3000/download/${file.name}`,
        { nom: newFilename },
        { headers: { Authorization: token } }
      )
      .then((res) => {
        if (res.status === 200) {
          alert(res.data);
        } else {
          handleError(res.status);
        }
      })
      .catch((error) => {
        alert("Error Renaming files");
      });
    setRename(false);
  };

  const activRename = () => setRename(true);
  const handleNom = (event) => setNom(event.target.value);

  return (
    <div className={isGrid ? "grid-box-file" : "box-file"}>
      <div className={isGrid ? "top" : "left"} title={file.name}>
        <img
          src="./../../src/assets/yellow_file.svg"
          alt="FileIcon"
          style={
            isGrid
              ? { width: "70px", height: "70px" }
              : { width: "26px", height: "26px" }
          }
        />
        <div className="file-name">
          <AutoResizeInput
            rename={rename}
            nom={nom}
            handleNom={handleNom}
            handleRename={handleRename}
          />
          <span className="file-extension">{extension}</span>
        </div>
      </div>
      <div className={isGrid ? "bottom" : "right"}>
        <div className="downloadImg" onClick={handleDownload}>
          <img
            src="./../../src/assets/download.svg"
            alt="DownloadIcon"
            style={
              isGrid
                ? { width: "20px", height: "20px" }
                : { width: "23px", height: "23px" }
            }
          />
        </div>
        <div className="modifImg" onClick={rename ? handleRename : activRename}>
          <img
            src={
              rename
                ? "/../../src/assets/save_name.svg"
                : "/../../src/assets/modifiate.svg"
            }
            alt="ModificationIcon"
            style={
              isGrid
                ? { width: "20px", height: "20px" }
                : { width: "23px", height: "23px" }
            }
          />
        </div>
      </div>
    </div>
  );
}
