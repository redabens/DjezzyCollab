import { useState, useEffect } from "react";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2";
// ------- Components -------
import AddSiteForm from "../components/AddSiteForm";
import SiteTable from "../components/SiteTable";
import AddRepoForm from "../components/AddRepoForm";
import "./../styles/GestionSites.css";

export default function GestionSites() {
  const [formPath, setFormPath] = useState("/");
  const [fileTree, setFileTree] = useState([]);
  const [siteTable, setSiteTable] = useState([]);
  const [selectedRow, setSelectedRow] = useState({
    ancienId: "",
    nouveauId: "",
  });
  const [loadingFileTree, setLoadingFileTree] = useState(false);
  const [visualise, setVisualise] = useState(false);
  useEffect(function () {
    axios
      .get("http://localhost:3000/sitesftp")
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setSiteTable(res.data);
          const tableauselectedId = res.data.filter((row) => row.checked);
          const selectedId =
            tableauselectedId.length > 0 ? tableauselectedId[0]._id : null;
          setSelectedRow((prev) => {
            return { ancienId: "", selectedId: selectedId };
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) return alert("No site SFTP found");
          else if (error.response.status === 500)
            return alert("Failed to have all sites due to server");
        } else {
          console.log(error);
          alert("An unexpected error occurred. Please try again.");
        }
      });
  }, []);
  const handleVisualise = (sftpConfig) => {
    setLoadingFileTree(true);
    setVisualise(true);
    axios
      .post("http://localhost:3000/sitesftp/visualise", sftpConfig)
      .then((res) => {
        if (res.status === 200) {
          setFileTree(res.data);
          setLoadingFileTree(false);
        }
      })
      .catch((error) => {
        if (error.response) {
          if (res.status === 401) return alert("User Id not Found");
          else if (res.status === 404) return alert("User not found");
          // else if (res.status === 415) return alert("Directory not found");
          else if (res.status === 500)
            return alert("Failed to upload due to server");
        } else {
          console.log(error);
          alert("An unexpected error occurred. Please try again.");
        }
      });
  };

  const renderTree = (nodes) => (
    <TreeItem2
      key={nodes.id}
      itemId={nodes.id}
      label={
        nodes.type === "d" ? (
          <span>📁 {nodes.label}</span>
        ) : (
          <span>📄 {nodes.label}</span>
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
  const renitPath = () => {
    setFormPath("/");
  };
  return (
    <div className="gestion-site-page">
      <h1>Gestion des sites</h1>
      <div className="gestion-site-body">
        <div className="choix-site">
          <h2 className="subheader">1. Choisissez un site:</h2>
          <div className="partie-choix">
            <SiteTable
              lignes={siteTable}
              setSelectedRow={setSelectedRow}
              selectedRow={selectedRow}
            />
          </div>
        </div>
        <div className="ajout-site">
          <h2 className="subheader">2. Ajouter un site:</h2>
          <div className="partie-ajout">
            <AddSiteForm handleVisualise={handleVisualise} />
            {visualise && (
              <div className="vis-site">
                <div className="existant-repos-box">
                  <h3>Répertoires existants:</h3>
                  {loadingFileTree && <LinearProgress />}
                  <Box className="existant-repos-list">
                    <SimpleTreeView>
                      {fileTree.map((treeItem) => renderTree(treeItem))}
                    </SimpleTreeView>
                  </Box>
                </div>
                <div className="add-rep-form">
                  <AddRepoForm path={formPath} type="2" renitPath={renitPath} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
