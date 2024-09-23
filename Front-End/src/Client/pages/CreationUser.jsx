import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./../styles/CreationUser.css";
import Switch from "@mui/material/Switch";
import SearchLdapBar from "../components/SearchLdapBar";

export default function CreationUser() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const roleList = ["user", "admin", "download", "upload"];
  const [pathList, setPathList] = useState([]);
  const [userExistError, setUserExistError] = useState("");
  const [ableToDelete, setAbleToDelete] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("");

  const handleUserName = (u) => {
    setUsername(u);
    setValue("username", u);
  };
  //------ useEffect -------
  useEffect(function () {
    axios
      .get("http://localhost:3000/creation-compte")
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setPathList(response.data.paths);
          reset({
            username: "",
            path: response.data.paths[0].path,
            role: "user",
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          console.log("Erreur 404");
          return alert(error.response.data);
        } else {
          console.log(error);
          alert("error inconnue");
        }
      });
  }, []);
  //------ handleSignUp -------
  const handleError = (errors) => {};
  const handleSignUp = async () => {
    const userData = {
      username: username,
      userPath: watch("path"),
      role: watch("role"),
      ableToDelete: ableToDelete,
    };

    try {
      const res = await axios.post("http://localhost:3000/creation-compte", {
        userData,
      });

      if (res.status === 201) {
        setUserExistError("");
        reset();
        setUsername("");
        navigate("/creation-comptes");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert(error.response.data.error);
        } else if (error.response.status === 404) {
          alert(error.response.data.error);
        } else if (error.response.status === 409) {
          setUserExistError(
            "Cet utilisateur existe déja. Veillez choisir un autre."
          );
        } else if (error.response.status === 500) {
          alert(error.response.data.error);
        }
      } else {
        console.log(error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  //------ validations -------
  const registerOptions = {
    //     nom: {
    //       required: "Nom manquant",
    //     },
    //     prenom: {
    //       required: "Prénom manquant",
    //     },
    //  password: {
    //       required: "Entrer le mot de passe",
    //     },
    username: {
      required: "Selectionner un utilisateur",
      // pattern: {
      //   value: /^[a-zA-Z]+\.[a-zA-Z]+$/,
      //   message: "Le nom d'utilisateur doit être au format prénom.nom",
      // },
    },

    path: { required: "Path est obligatoire" },
    role: { required: "Role est obligatoire" },
  };
  //switch able to delete
  const handleSwitchChange = (event) => {
    setAbleToDelete(event.target.checked);
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
            <div className="search-area">
              <SearchLdapBar 
                handleUserName={handleUserName} 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}/>
              <small className="text-danger">{userExistError}</small>
            </div>

            <div className="formElt2">
              <label htmlFor="username">Username:</label>
              <input
                readOnly
                className="username-input"
                name="username"
                value={username}
                type="text"
                placeholder="username..."
                {...register("username", registerOptions.username)}
              />
              <small className="text-danger">
                {errors?.username && errors.username.message}
              </small>
            </div>
            <div className="delete-files-switch">
              <p>Permission de supression des fichiers:</p>
              <Switch
                checked={ableToDelete}
                onChange={handleSwitchChange}
                inputProps={{ "aria-label": "Switch demo" }}
              />
            </div>
            {/* <div className="formElt">
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
            </div> */}
          </div>
          <div className="section-two">
            <div className="formElt">
              <label htmlFor="path">Path des fichiers:</label>
              <select name="path" id="path" {...register("path")}>
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
