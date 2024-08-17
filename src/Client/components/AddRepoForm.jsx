import "./../styles/AddRepoForm.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "./AuthContext";
export default function AddRepoForm() {
  const { token } = useAuth();
  const [formDisplayed, setFormDisplayed] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddRepo = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/paths/create",
        {
          pathName: watch("repo"),
        },
        { headers: { Authorization: token } }
      );

      if (response.status === 201) {
        alert("Path created successfully!");
        reset();
      }
    } catch (error) {
      console.error("Error creating path:", error);
      alert("Error creating path: :O " + error.message);
    }
  };

  return (
    <div className="add-repo-form">
      <button
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
      </button>
      {formDisplayed && (
        <form onSubmit={handleSubmit(handleAddRepo)} className="form-area">
          <div className="add-repo-component">
            <label htmlFor="repo">Nom du répertoire:</label>
            <input
              name="repo"
              type="text"
              placeholder="saisir le nom..."
              {...register("repo", {
                required: "Enter the repository name",
              })}
            />
            <small
              className="text-danger"
              style={{ color: errors.repo ? "red" : "white" }}
            >
              {errors.repo ? errors.repo.message : "."}
            </small>
          </div>
          <button type="submit" className="valideAddBtn">
            Ajouter
          </button>
        </form>
      )}
    </div>
  );
}
