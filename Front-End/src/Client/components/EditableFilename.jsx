import { useState, useRef, useEffect } from 'react';
import "./../styles/EditableFilename.css";

const EditableFilename = ({ filename, handleNom, handleRename, rename }) => {
  const nameWithoutExtension = filename.substring(0, filename.lastIndexOf('.'));
  const extension = filename.substring(filename.lastIndexOf('.'));
  
  const spanRef = useRef(null);

  useEffect(() => {
    // Synchronise le contenu du span avec l'état actuel du nom
    if (spanRef.current) {
      spanRef.current.textContent = nameWithoutExtension;
    }

    // Positionne le curseur à la fin du texte lors de l'activation du mode édition
    if (rename && spanRef.current) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(spanRef.current);
      range.collapse(false); // Place le curseur à la fin
      selection.removeAllRanges();
      selection.addRange(range);
      spanRef.current.focus(); // Donne le focus à l'élément
    }
  }, [nameWithoutExtension, rename]);


  const handleInput = () => {
    const newName = spanRef.current.textContent;
    handleNom({ target: { value: newName } });
  };

  return (
    <div className={!rename ? "editable titre-nonRename" : "editable titre-Rename"}>
      <span
        ref={spanRef}
        contentEditable={rename}
        onInput={handleInput}
        onKeyUp={(event) => {
          if (event.key === "Enter") {
            handleRename();
          }
        }}
        style={!rename ? {border: 'none', outline: 'none',} : {border: 'none', outline: 'none',userSelect:'all'}}
      />
      <span className='extension'>{extension}</span>
    </div>
  );
};

export default EditableFilename;
