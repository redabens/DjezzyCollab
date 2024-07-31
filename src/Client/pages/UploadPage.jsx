import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import DropFileInput from "../components/DropFileInput";
import "../styles/UploadPage.css";

function UploadPage() {
  const onFileChange = (files) => {
    console.log(files);
  };

  return (
    <div>
      <DropFileInput onFileChange={(files) => onFileChange(files)} />
    </div>
  );
}
export default UploadPage;
