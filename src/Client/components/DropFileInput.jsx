import PropTypes from "prop-types";
import { v4 as uuid } from "uuid";
import "../styles/DropFileInput.css";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import UploadBar from "./UploadBar";
import axios from "axios";

const DropFileInput = (props) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const onDragEnter = () => {
    wrapperRef.current.classList.add("dragover");
  };
  const onDragLeave = (e) => {
    wrapperRef.current.classList.remove("dragover");
  };
  const onDrop = (e) => {
    wrapperRef.current.classList.remove("dragover");
  };
  const [sizeError,setSizeError] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploadedFileList, setUploadedFileList] = useState([]);
  // const [nombre,setNombre] = useState({uploading:0,uploaded:0});
  const onFileDrop = (e) => {
    setSizeError(false);
    const maxSize = 25 * 1024 * 1024; // Limite de taille de fichier : 25MB
    const newFile = e.target.files;
    console.log(newFile);
    if (newFile) {
      const updatedList = [...fileList];
    for (let i = 0; i < newFile.length; i++) {
      if (newFile[i].size > maxSize) {
        setSizeError(true);
      } else{
        updatedList.push({ id: uuid(), file: newFile[i], isUploaded: false });
      }
    }
      setFileList(updatedList);
      props.onFileChange(updatedList);
    }
  };
  const FileListRemove = (id) => {
    setFileList((prev) => prev.filter((item) => item.id !== id));
  };
  const uploadedFileListRemove = (id) => {
    setUploadedFileList((prev) => prev.filter((item) => item.id !== id));
  };
  const handleIsUploaded = (id) => {
    setFileList((prev) => {
      return prev.map((file) => {
        if (file.id === id) {
          return { ...file, isUploaded: true };
        }
        return file;
      });
    });
  };
  useEffect(function () {
    setUploadedFileList(fileList.filter((file) => file.isUploaded));
  },  [fileList]);
  const SendFiles = async (event)=>{
    event.preventDefault();
    setFileList([]);
    const formData = new FormData();
    const addFilesToFormData = async ()=>{
      for (let i = 0; i < uploadedFileList.length; i++) {
        formData.append('files', uploadedFileList[i].file);
      }
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`); // Affiche le nom de chaque fichier ajouté
      }
      setUploadedFileList([]);
    }
    await addFilesToFormData();
    axios.post('http://localhost:3000/upload',
      formData,{headers: { 'Authorization': token }}
    ).then(res=>{
        if(res.status === 200) { 
          navigate('/upload');
        }
    }).catch((error) => {
      if(error.response){
        if (res.status === 401) return alert("User Id not Found");
        else if (res.status === 404) return alert("User not found");
        // else if (res.status === 415) return alert("Directory not found");
        else if (res.status === 500) return alert("Failed to upload due to server");
      } else {
        console.log(error);
        alert("An unexpected error occurred. Please try again.");
      }
    });
  }
  return (
    <form className="dropfile" onSubmit={SendFiles}>
      <div className="drop-file" style={{gap: sizeError? "5px": "20px"}}>
        <div
          ref={wrapperRef}
          onDragEnter={() => {
            onDragEnter();
          }}
          onDragLeave={() => {
            onDragLeave();
          }}
          onDrop={() => {
            onDrop();
          }}
          className="drop-file-input"
        >
          <div className="drop-file-input_label">
            <img
              src="./../../src/assets/dragdrop_icon.svg"
              alt="dragdrop_icon"
              style={{ width: "50px", height: "40px" }}
            />
            <p>
              Drag & Drop files or <span>Browse</span>
            </p>
            <p style={{ fontSize: "10px", color: "gray", marginTop: "10px" }}>
              Supported formates: JPEG, PNG, SVG, GIF, MP4, PDF, Word, PPT, DAT.
            </p>
          </div>

          <input type="file" value="" onChange={onFileDrop} multiple />
        </div>
        {sizeError && <p style={{color:"red",fontSize:"12px"}}>File size should be less than 25MB</p>}
        <div className="drop-file-preview">
          {fileList.length > 0 ? (
            <div className="drop-file-uploading">
              <p className="file-uploaded_titles">
                Uploading
              </p>
              <div
                className="drop-file-uploading_items"
                style={
                  fileList.length > 1
                    ? {
                        border: "#dbdbdb solid 1px",
                        borderRadius: "8px",
                      }
                    : {}
                }
              >
                {fileList.map((file) => {
                  if (!file.isUploaded) {
                    return (
                      <div key={file.id} className="drop-file-uploading_item">
                        <div className="drop-file-uploading_item_details">
                          <div className="drop-file-uploading_item_details_left">
                            <img
                              src="./../../src/assets/Style=broken.svg"
                              alt={file.file.name}
                              style={{ height: "15px", width: "15px" }}
                            />
                            <p className="drop-file-uploading_item_name">
                              {file.file.name}
                            </p>
                          </div>
                          <div
                            className="drop-file-uploaded_item_details_right"
                            onClick={() => {
                              FileListRemove(file.id);
                            }}
                          >
                            <img
                              src="./../../src/assets/Vector.svg"
                              alt={file.file.name}
                            />
                          </div>
                        </div>
                        <UploadBar
                          handleIsUploaded={handleIsUploaded}
                          file={file}
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ) : null}
          {uploadedFileList.length > 0 ? (
            <div className="drop-file-uploaded">
              <p
                className="file-uploaded_titles"
                style={{ paddingTop: "10px" }}
              >
                Uploaded
              </p>
              <div
                className="drop-file-uploaded_items"
                style={
                  uploadedFileList.length > 1
                    ? {
                        border: "#dbdbdb solid 1px",
                        borderRadius: "8px",
                      }
                    : {}
                }
              >
                {uploadedFileList.map((file) => (
                  <div key={file.id} className="drop-file-uploaded_item">
                    <div className="drop-file-uploaded_item_left">
                      <img
                        src="./../../src/assets/Style=broken.svg"
                        alt={file.file.name}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <p className="drop-file-uploaded_item_name">
                        {file.file.name}
                      </p>
                    </div>
                    <div
                      className="drop-file-uploaded_item_right"
                      onClick={() => {
                        FileListRemove(file.id);
                        uploadedFileListRemove(file.id);
                      }}
                    >
                      <img
                        src="./../../src/assets/Delete.svg"
                        alt={file.file.name}
                        style={{ height: "20px", width: "20px" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="btnContainer">
        <button className="envoyerBtn" disabled={uploadedFileList.length === 0}>
          UPLOAD FILES
        </button>
      </div>
    </form>
  );
};
DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};
export default DropFileInput;
