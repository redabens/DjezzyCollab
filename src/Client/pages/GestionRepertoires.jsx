import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import CustomTreeItem from "./CustomTreeItem"; // Adjust the import path

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
          <RichTreeView
            items={fileTree}
            slots={{
              item: (props) => (
                <CustomTreeItem {...props} item={props.item} />
              ),
            }}
          />
        </Box>
      </div>
    </div>
  );
}
