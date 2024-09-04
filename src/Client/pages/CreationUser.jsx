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
    reset,
    formState: { errors },
  } = useForm();
  const list = ["/Downloads/public", "/Users/Managers"];
  const roleList = [ "user","admin", "download", "upload"];
  const [pathList, setPathList] = useState([]);
  const [role, setRole] = useState("user");
  //------ useEffect -------
  useEffect(function () {
    axios
      .get("http://localhost:3000/creation-compte")
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setPathList(response.data.paths);
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          console.log("Erreur 404");
          return alert(error.response.data);
        } else{
        console.log(error);
        alert("error inconnue");
        }
      });
  }, []);
  //------ handleSignUp -------
  const handleError = (errors) => {};
  const handleSignUp = async () => {
    const userData = {
      firstName: watch("nom"),
      lastName: watch("prenom"),
      email: watch("email"),
      password: watch("password"),
      DirPath: watch("path"),
      role: watch("role"),
    };
    axios
      .post("http://localhost:3000/creation-compte", { userData })
      .then((res) => {
        if (res.status === 200) {
          //alert("Utilisateur créé avec succès");
          reset();
        } else if (res.status === 401) {
          alert(res.data);
        } else if (res.status === 404) {
          alert(res.data);
        } else if (res.status === 500) {
          alert(res.data);
        }
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
    role: { required: "Role est obligatoire" },
  };
  return (
    <div className="creation-user-page">
      <h1>Création d'un nouvel utilisateur</h1>
      <form
        className="signUp-form"
        onSubmit={handleSubmit(handleSignUp, handleError)}
      >
        <div className="sections">
          <div className="section-one">
            <div className="formElt">
              <label htmlFor="nom">Nom:</label>
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
              <label htmlFor="prenom">Prénom:</label>
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
            <div className="formElt">
              <label htmlFor="path">Path des fichiers:</label>
              <select name="path" id="path" {...register("path")}>
                {/* <option value="">select a path</option> */}
                {pathList.map((path, index) => (
                  <option value={path.path} key={index}>
                    {path.path}
                  </option>
                ))}
              </select>
            </div>
            <div className="formElt">
              <label htmlFor="role">Role du user:</label>
              <select name="role" id="role" {...register("role")}>
                {/* <option value="">select a role</option> */}
                {roleList.map((role, index) => (
                  <option value={role} key={index}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button type="submit">Créer l'utilisateur</button>
      </form>
    </div>
  );
}
