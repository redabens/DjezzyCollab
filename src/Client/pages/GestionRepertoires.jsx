import { useState, useEffect } from "react";
import "./../styles/GestionRepertoires.css";
import AddRepoForm from "../components/AddRepoForm";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2";

export default function GestionRepertoires() {
  const [fileTree, setFileTree] = useState([]);
  const [loadingFileTree, setLoadingFileTree] = useState(true);

  useEffect(() => {
    const fetchFileTree = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tree-files");
        const limitedTree = response.data.slice(2, 4); // Limit to the first two directories
        setFileTree(limitedTree);
        setLoadingFileTree(false);
      } catch (err) {
        console.error("Failed to fetch file tree:", err);
      }
    };
    fetchFileTree();
  }, []);

  const renderTree = (nodes) => (
    <TreeItem2 key={nodes.id} nodeId={nodes.id} label={nodes.label} onClick={() => handleNodeClick(nodes)}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem2>
  );

  const handleNodeClick = (node) => {
    if (node && node.id) {
      console.log("Selected Repertoire Path:", node.id);
    } else {
      console.error("Node or node.id is undefined");
    }
  };

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
          <SimpleTreeView>
            {fileTree.map((treeItem) => renderTree(treeItem))}
          </SimpleTreeView>
        </Box>
      </div>
    </div>
  );
}
