import { useState, useEffect } from "react";
import "./../styles/GestionRepertoires.css";
import AddRepoForm from "../components/AddRepoForm";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";

import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";

export default function GestionRepertoires() {
  const [fileTree, setFileTree] = useState([]);
  const [loadingFileTree, setLoadingFileTree] = useState(true);
  useEffect(() => {
    const fetchFileTree = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tree-files");
        setFileTree(response.data);
        setLoadingFileTree(false);
      } catch (err) {
        console.error("Failed to fetch file tree:", err);
      }
    };

    fetchFileTree();
  }, []);

  return (
    <div className="gestion-rep-page">
      <h1>Gestion des répertoires</h1>
      <div className="add-rep-form">
        <AddRepoForm />
      </div>
      <div className="existant-repos-box">
        <h3>Répertoires existants:</h3>
        {loadingFileTree && <LinearProgress />}
        <Box className="existant-repos-list">
          <RichTreeView items={fileTree} />
        </Box>
      </div>
    </div>
  );
}
