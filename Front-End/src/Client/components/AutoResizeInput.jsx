import React, { useRef, useEffect } from "react";
import "./../styles/Fichier.css";

const AutoResizeInput = ({ rename, nom, handleNom, handleRename }) => {
  const inputRef = useRef(null);

  const adjustInputWidth = () => {
    if (inputRef.current) {
      inputRef.current.style.width = "auto"; // Réinitialiser la largeur pour mesurer le texte
      inputRef.current.style.width = `${nom.length}ch`;
    }
  };

  useEffect(() => {
    adjustInputWidth(); // Ajuster la largeur au chargement
  }, []);

  return (
    <input
      type="text"
      name="titre"
      ref={inputRef}
      value={nom}
      className={!rename ? "titre-nonRename" : "titre-Rename"}
      disabled={!rename}
      onChange={handleNom}
      onKeyUp={(event) => {
        if (event.key === "Enter") {
          handleRename();
        }
      }}
    />
  );
};

export default AutoResizeInput;
