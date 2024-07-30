import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { Box } from "@mui/material";
import "../styles/UploadPage.css";
export default function DragDropZone() {



    
//   const [dataURL, setDataURL] = useState(null);
//   const [uploadedURL, setUploaded] = useState(null);

//   const onDrop = useCallback((acceptedFiles) => {
//     const reader = new FileReader();
//     reader.onabort = () => console.log("file reading wa")
//   }, []);

//   const { getRootProps, acceptedFiles, getInputProps, isDragActive } =
//     useDropzone({ onDrop });
//   const selectedFile = acceptedFiles[0];
//   console.log(selectedFile);
//   return (
//     <div className="drop-zone" {...getRootProps()}>
//       <input {...getInputProps()} />
//       {isDragActive ? (
//         <div className="drop-files-img">
//           <img src="./../../assets/dragdrop_icon.svg" alt="dragdrop_icon" />
//         </div>
//       ) : (
//         <div className="drag-files">Drag and drop your files here</div>
//       )}
//     </div>
//   );
}
