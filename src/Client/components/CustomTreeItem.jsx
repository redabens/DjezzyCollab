import { TreeItem2 } from "@mui/x-tree-view/TreeItem2";

function CustomTreeItem({ item, ...props }) {
  console.log("CustomTreeItem props:", props);
  console.log("Item in CustomTreeItem:", item);
  const handleNodeClick = (event) => {
    console.log("Item object:", item);
    if (item && item.id) {
      console.log("Selected Repertoire Path:", item.id);
    } else {
      console.log("item is empty or doesn't have an id");
    }
  };

  return (
    <TreeItem2 {...props} item={item} onClick={handleNodeClick}>
      {props.children}
    </TreeItem2>
  );
}

export default CustomTreeItem;
