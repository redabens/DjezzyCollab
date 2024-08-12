import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./../styles/CreationUser.css";
export default function CreationUser() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const handleSignUp = async () => {
    await axios
      .post("http://localhost:3000/signUp", {
        firstName: watch("nom"),
        lastName: watch("prenom"),
        email: watch("email"),
        password: watch("password"),
        DirPath: watch("path"),
      })
      .then((response) => {
        console.log(response.data);
        navigate("/upload");
      })
      .catch((errors) => {
        console.log(errors);
        alert(errors);
      });
  };

  //------ validations -------
  const registerOptions = {
    nom: {
      required: "Nom manquant",
    },
    prenom: {
      required: "Prénom manquant",
    },

    email: {
      required: "Entrer une adresse email",
      pattern: {
        value: /^[^\s@]+@[^\s@]+.[^\s@]+$/,
        message: "Adresse email invalide",
      },
    },
    password: {
      required: "Enrer le mot de passe",
    },
    path: { required: "Path est obligatoire" },
  };
  //-------------------------------
  const list = ["/Downloads/public", "/Users/Managers"];
  const [pathList, setPathList] = useState(list);

  return (
    <div className="creation-user-page">
      <h1>Création d'un nouvel utilisateur</h1>
      <form onSubmit={handleSubmit(handleSignUp)}>
        <div className="section-one">
          <div className="formElt">
            <label htmlFor="Nom">Nom:</label>
            <input
              name="nom"
              type="text"
              placeholder="saisir le nom..."
              {...register("nom", registerOptions.nom)}
            />
            <small className="text-danger">
              {errors?.nom && errors.nom.message}
            </small>
          </div>
          <div className="formElt">
            <label htmlFor="Prénom">Prénom:</label>
            <input
              name="prenom"
              type="text"
              placeholder="saisir le prenom..."
              {...register("prenom", registerOptions.prenom)}
            />
            <small className="text-danger">
              {errors?.prenom && errors.prenom.message}
            </small>
          </div>
          <div className="formElt">
            <label htmlFor="email">Email:</label>
            <input
              name="email"
              type="text"
              placeholder="saisir l'email..."
              {...register("email", registerOptions.email)}
            />
            <small className="text-danger">
              {errors?.email && errors.email.message}
            </small>
          </div>
        </div>
        <div className="section-two">
          <div className="formElt">
            <label htmlFor="password">Mot de passe:</label>
            <input
              name="password"
              type="password"
              placeholder="saisir un mot de passe..."
              {...register("password", registerOptions.password)}
            />
            <small className="text-danger">
              {errors?.password && errors.password.message}
            </small>
          </div>
          <div>
            <label htmlFor="path">Path des fichiers:</label>
            <select name="path" id="path" {...register("path")}>
              {pathList.map((path, index) => (
                <option value={path} key={index}>
                  {path}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button style={{ backgroundColor: "red" }} type="submit">
          Créer l'utilisateur
        </button>
      </form>
    </div>
  );
}
