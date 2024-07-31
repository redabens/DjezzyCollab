import { useEffect, useState } from "react";

export default function UploadBar(props){
    const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log('refreshiii');
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
            props.handleIsUploaded(props.file.id);
            clearInterval(timer);
        }
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);
    return (
        <div className="drop-file-uploading_item_bar" style={{width:`${progress}%`}}></div>
    );
}