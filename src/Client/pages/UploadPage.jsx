import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import DropFileInput from "./../components/DropFileInput";
import "./../styles/UploadPage.css";

function UploadPage() {
  const context = useOutletContext();
  const onFileChange = (files) => {
    console.log(files);
  };

  return (
    <div className="upload-page">
      <div className="box">
        <h2 className="header">Uploader vos fichiers</h2>
        <DropFileInput onFileChange={onFileChange}/>
      </div>
    </div>
  );
}
export default UploadPage;
