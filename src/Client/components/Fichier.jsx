import { useState } from "react";
import { useAuth } from "../components/AuthContext";
import axios from "axios";
import "./../styles/Fichier.css";

export default function Fichier({ file }) {
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
      })
      .then((res) => {
        if (res.status === 200) {
          alert(res.data);
        } else if (res.status === 401) return alert("User Id not Found");
        else if (res.status === 404) return alert("User not found");
        else if (res.status === 415) return alert("Directory not found");
        else if (res.status === 500)
          return alert("Failed to upload due to server");
      })
      .catch((error) => {
        alert("Error Downloading files");
      });
  };

  const handleRename = () => {
    const newFilename = `${nom}${extension}`;

    axios
      .patch(
        `http://localhost:3000/download/${file.name}`,
        { nom: newFilename },
        {
          headers: { Authorization: token },
        }
      )
      .then((res) => {
        if (res.status === 200) return alert(res.data);
        else if (res.status === 401)
          return alert("User Id not Found Refresh the Page");
        else if (res.status === 404) return alert(res.data);
        else if (res.status === 409) return alert(res.data);
        else if (res.status === 415) return alert("Directory not found");
        else if (res.status === 500)
          return alert("Failed to upload due to server");
      })
      .catch((error) => {
        alert("Error Renaming files");
      });
    setRename(false);
  };

  const activRename = () => {
    setRename(true);
  };

  const handleNom = (event) => {
    setNom(event.target.value);
  };

  return (
    <div className="box-file">
      <div className="left">
        <img
          src="./../../src/assets/yellow_file.svg"
          alt="FileIcon"
          style={{ width: "26px", height: "26px" }}
        />
        <div className="file-name">
          <input
            type="text"
            name="titre"
            value={nom}
            className={!rename ? "titre-nonRename" : "titre-Rename"}
            disabled={!rename}
            onChange={handleNom}
            style={{
              width: `${nom.length}ch`,
            }}
            onKeyUp={(event) => {
              if (event.key === "Enter") {
                handleRename();
              }
            }}
          />
          <span className="file-extension">{extension}</span>{" "}
        </div>
      </div>
      <div className="right">
        <div className="downloadImg" onClick={handleDownload}>
          <img
            src="./../../src/assets/download.svg"
            alt="DownloadIcon"
            style={{ width: "26px", height: "26px" }}
          />
        </div>
        <div className="modifImg" onClick={rename ? handleRename : activRename}>
          <img
            src={
              rename
                ? "/../../src/assets/save_name.svg"
                : "/../../src/assets/modifiate.svg"
            }
            alt="moreIcon"
            style={{ width: "26px", height: "26px" }}
          />
        </div>
      </div>
    </div>
  );
}
