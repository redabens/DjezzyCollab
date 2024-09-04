import { useState, useEffect } from "react";
import "./../styles/GestionRepertoires.css";
import AddRepoForm from "../components/AddRepoForm";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2";

export default function GestionRepertoires() {
  const [formPath, setFormPath] = useState("/");
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
  
  const renitPath = ()=>{
    setFormPath("/");
  }

  const renderTree = (nodes) => (
    <TreeItem2
      key={nodes.id}
      itemId={nodes.id}
      label={
        nodes.type === "d" ? (
          <span>
            📁 {nodes.label}
          </span>
        ) : (
          <span >
            📄 {nodes.label}
          </span>
        )
      }
      onClick={(event) => handleNodeClick(event, nodes)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem2>
  );
  const handleNodeClick = (event, node) => {
    event.stopPropagation();
    if (node && node.id && node.type === "d") {
      console.log("Selected Repertoire Path iiiiiis:", node.id);
      setFormPath(node.id);
    } else {
      console.error("Node or node.id is undefined");
    }
  };
  return (
    <div className="gestion-rep-page">
      <h1>Gestion des répertoires</h1>
      <div className="add-rep-form">
        <AddRepoForm path={formPath} renitPath={renitPath} />
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
