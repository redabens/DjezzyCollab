import "./../styles/AddRepoForm.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "./AuthContext";
export default function AddRepoForm({ path,renitPath }) {
  const { token } = useAuth();
  const {
    // register,
    handleSubmit,
    // watch,
    reset,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const handleAddRepo = async () => {
    try {
      setError("");
      const response = await axios.post(
        "http://localhost:3000/paths/create",
        { pathName: path },
        { headers: { Authorization: token } }
      );

      if (response.status === 201) {
        alert("Path created successfully!");
        setError("");
        renitPath();
      }
    } catch (error) {
      setError("Ce path existe déja");

      console.error("Error creating path:", error);
    }
  };

  return (
    <div className="add-repo-form">
      {/* <button
        className="ajouterBtn"
        onClick={() => setFormDisplayed(!formDisplayed)}
      >
        <img
          src="./../../src/assets/add.svg"
          alt="add_icon"
          style={{ width: "18px", height: "18px" }}
        />
        <span>Ajouter</span>
        <img
          src="./../../src/assets/arrow_down.svg"
          alt="show_icon"
          style={{
            width: "18px",
            height: "18px",
            transition: "transform 0.3s ease",
          }}
          className={formDisplayed ? "rotate-icon" : ""}
        />
      </button> */}

      <form onSubmit={handleSubmit(handleAddRepo)} className="form-area">
        <div className="add-repo-component">
          <label htmlFor="repo">Nom du répertoire:</label>
          <div className="input-area">
            <p>{path}</p>
          </div>
          <small className="text-danger" style={{ color: "red" }}>
            {error}
          </small>
        </div>
        <button type="submit" className="valideAddBtn">
          Ajouter
        </button>
      </form>
    </div>
  );
}
