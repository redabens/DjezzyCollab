import PropTypes from "prop-types";
import "../styles/DropFileInput.css";
import { useRef, useState } from "react";
const DropFileInput = (props) => {
  const wrapperRef = useRef(null);
  const onDragEnter = () => wrapperRef.current.classList.add("dragover");
  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");
  const onDrop = () => wrapperRef.current.classList.remove("dragover");
  const [fileList, setFileList] = useState([]);
  const onFileDrop = (e) => {
    console.dir(e.target);
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      props.onFileChange(updatedList);
    }
  };

  return (
    <div
      ref={wrapperRef}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className="drop-file-input"
    >
      <div className="drop-file-input_label">
        <img src="./../../src/assets/dragdrop_icon.svg" alt="dragdrop_icon" />
        <p>
          Drag & Drop files or <span>Browse</span>
        </p>
      </div>
      <input type="file" value="" onChange={onFileDrop} />
    </div>
  );
};
DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};
export default DropFileInput;
