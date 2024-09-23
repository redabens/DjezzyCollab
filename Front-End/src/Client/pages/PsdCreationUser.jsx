import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./../styles/PsdCreationUser.css";
import Switch from "@mui/material/Switch";
import SearchLdapBar from "../components/SearchLdapBar";

export default function PsdCreationUser() {
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
  const [ableToDelete, setAbleToDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  //------ useEffect -------
  useEffect(function () {
    axios
      .get("http://localhost:3000/creation-compte")
      .then((response) => {
        if (response.status === 200) {
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
  //------ validations -------
  const registerOptions = {
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
        setShowForm(false);
        setAbleToDelete(false);
        navigate("/creation-comptes");
        alert("User added succefully");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert(error.response.data.error);
        } else if (error.response.status === 404) {
          alert(error.response.data.error);
        } else if (error.response.status === 409) {
          setUserExistError(
            "Cet utilisateur existe déja. Veuillez choisir un autre."
          );
          setShowForm(false);
          reset();
          setAbleToDelete(false);
          navigate("/creation-comptes");
        } else if (error.response.status === 500) {
          alert(error.response.data.error);
        }
      } else {
        console.log(error);
        alert("An error occurred. Please try again.");
      }
    }
  };
  //--------
  const handleUserName = (u) => {
    setUsername(u);
    setValue("username", u);
  };
  //switch able to delete
  const handleSwitchChange = (event) => {
    setAbleToDelete(event.target.checked);
  };
  return (
    <div className="psdcreation-user-page">
      <h1>Création d'un nouvel utilisateur</h1>
      <div className={`sub-user-page ${showForm? 'swipe' : ''}`}>
        {!showForm ? (<div className="search-form">
          <SearchLdapBar 
            handleUserName={handleUserName} 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setShowForm={setShowForm}/>
            <small className="text-danger">{userExistError}</small>
        </div>)
        :(<form className="form-sign" onSubmit={handleSubmit(handleSignUp, handleError)}>
            <div className="sub-form">
              <div className="group">
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
                <div className="delete-files">
                  <p>Permission de supression des fichiers:</p>
                  <Switch
                    checked={ableToDelete}
                    onChange={handleSwitchChange}
                    inputProps={{ "aria-label": "Switch demo" }}
                  />
                </div> 
              </div>
              <div className="group">
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
          </form>)}
      </div>
    </div>
  );
}
