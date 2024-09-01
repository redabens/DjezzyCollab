import { TreeItem2 } from "@mui/x-tree-view/TreeItem2";

function CustomTreeItem({ item, ...props }) {
  const handleNodeClick = (event) => {
    console.log("Selected Repertoire Path:", item.id); 
  };

  return (
    <TreeItem2 {...props} item={item} onClick={handleNodeClick}>
      {props.children}
    </TreeItem2>
  );
}

export default CustomTreeItem;
