import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function UploadBar(props){
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            props.handleIsUploaded(props.file.id);
          }
          const diff = Math.random() * 15;
          return Math.min(oldProgress + diff, 100);
        });
      }, 500);
  
      return () => {
        clearInterval(timer);
      };
    }, [props.file.id, props.handleIsUploaded]);
    return (
        <div className="drop-file-uploading_item_bar" style={{width:`${progress}%`}}></div>
    );
}

UploadBar.propTypes = {
  file: PropTypes.object.isRequired,
  handleIsUploaded: PropTypes.func.isRequired,
};