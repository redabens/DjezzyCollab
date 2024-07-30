import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import DragDropZone from "../components/DragDropZone";
function UploadPage() {
  return (
    <div>
      <DragDropZone />
    </div>
  );
}
export default UploadPage;
