import PropTypes from "prop-types";
import { v4 as uuid } from "uuid";
import "../styles/DropFileInput.css";
import { useEffect, useRef, useState } from "react";
import UploadBar from "./UploadBar";
import Button from "@mui/material/Button";

const DropFileInput = (props) => {
  const wrapperRef = useRef(null);
  const onDragEnter = () => wrapperRef.current.classList.add("dragover");
  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");
  const onDrop = () => wrapperRef.current.classList.remove("dragover");
  const [fileList, setFileList] = useState([]);
  const [uploadedFileList, setUploadedFileList] = useState([]);
  const onFileDrop = (e) => {
    console.dir(e.target);
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList = [
        ...fileList,
        { id: uuid(), file: newFile, isUploaded: false },
      ];
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
  }, fileList);
  return (
    <>
      <div
        ref={wrapperRef}
        onDragEnter={(event) => {
          event.preventDefault;
          onDragEnter();
        }}
        onDragLeave={(event) => {
          event.preventDefault;
          onDragLeave();
        }}
        onDrop={(event) => {
          event.preventDefault;
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
            Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
          </p>
        </div>

        <input type="file" value="" onChange={onFileDrop} />
      </div>
      <div className="drop-file-preview">
        {fileList.length > 0 ? (
          <div className="drop-file-uploading">
            <p className="file-uploaded_titles">
              Uploading- {fileList.filter((file) => file.isUploaded).length}/
              {fileList.length}files
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
            <p className="file-uploaded_titles" style={{ paddingTop: "10px" }}>
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
      {uploadedFileList.length > 0 && (
        <div className="btnContainer">
          <button className="envoyerBtn">
            <p>Envoyer</p>
            <img src="./../../src/assets/send.svg" alt="send_icon" />
          </button>
        </div>
      )}
    </>
  );
};
DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};
export default DropFileInput;
