import "../styles/EditUser.css";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import Switch from "@mui/material/Switch";

function EditUser({ user, onConfirmEdit }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    onSubmit,
    formState: { errors },
  } = useForm();

  const [pathList, setPathList] = useState([]);
  const [userPath, setUserPath] = useState("");
  const roleList = ["user", "admin", "download", "upload"];
  const [ableToDelete, setAbleToDelete] = useState(false);

  // Initialize form values with user data when the component mounts
  useEffect(function () {
    if (user) {
      axios
        .get("http://localhost:3000/creation-compte")
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
            setPathList(response.data.paths);
            const UserPath = user.DirPath.filter((dir) => {
              return (
                dir.serveurSFTP.host === response.data.checkedSite.host &&
                dir.serveurSFTP.port === response.data.checkedSite.port &&
                dir.serveurSFTP.username ===
                  response.data.checkedSite.username &&
                dir.serveurSFTP.password ===
                  response.data.checkedSite.password &&
                dir.serveurSFTP.defaultPath ===
                  response.data.checkedSite.defaultPath
              );
            })[0].path;
            reset({
              nom: user.lastName,
              prenom: user.firstName,
              email: user.email,
              path: UserPath,
              role: user.role,
            });
            setAbleToDelete(user.ableToDelete);
            setUserPath(UserPath);
          } else if (response.status === 404) {
            console.log("Erreur 404");
            return alert(response.data);
          }
        })
        .catch((errors) => {
          console.log(errors);
          alert(errors);
        });
    }
  }, []);

  const handleEdit = () => {
    onConfirmEdit(
      true,
      watch("prenom"),
      watch("nom"),
      watch("email"),
      watch("path"),
      watch("role"),
      ableToDelete
    );
  };

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
    path: {
      required: "Path est obligatoire",
    },
    role: {
      required: "Role est obligatoire",
    },
  };

  const handleSwitchChange = (event) => {
    setAbleToDelete(event.target.checked);
  };

  return (
    <div className={`dialog2 ${onConfirmEdit ? "show" : "hide"}`}>
      <div className="dialog-content2">
        <div className="dialog-header2">
          <h2 className="dialog-title2" style={{ color: "black" }}>
            Modifier les information de : {user.firstName} {user.lastName}
          </h2>
          <button
            className="btn-dialog-close2"
            onClick={() =>
              onConfirmEdit(
                false,
                watch("prenom"),
                watch("nom"),
                watch("email"),
                watch("path"),
                watch("role"),
                ableToDelete
              )
            }
          >
            <img src="./../../src/assets/Vector.svg" alt="cancel" />
          </button>
        </div>
        <div className="dialog-body2">
          <div className="dialog-img-body2">
            <img src="./../../src/assets/profile-circle.svg" alt="pdp" />
          </div>

          <form onSubmit={handleSubmit(handleEdit)} className="edit-user-form">
            <div className="formComp">
              <input
                name="nom"
                type="text"
                placeholder="Saisir le nom..."
                {...register("nom", registerOptions.nom)}
              />
              <small className="text-danger">
                {errors?.nom && errors.nom.message}
              </small>
            </div>
            <div className="formComp">
              <input
                name="prenom"
                type="text"
                placeholder="Saisir le prénom..."
                {...register("prenom", registerOptions.prenom)}
              />
              <small className="text-danger">
                {errors?.prenom && errors.prenom.message}
              </small>
            </div>
            <div className="formComp">
              <input
                name="email"
                type="email"
                placeholder="Saisir l'email..."
                {...register("email", registerOptions.email)}
              />
              <small className="text-danger">
                {errors?.email && errors.email.message}
              </small>
            </div>
            <div className="formComp">
              <select name="role" id="role2" {...register("role")}>
                {/* <option value="">select a role</option> */}
                {roleList.map((role, index) => (
                  <option value={role} key={index}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="formComp">
              <select name="path" id="path2" {...register("path")}>
                {/* <option value="">select a path</option> */}
                {pathList.map((path, index) => (
                  <option value={path.path} key={index}>
                    {path.path}
                  </option>
                ))}
              </select>
              <div className="delete-files">
                <p>Permission de supression des fichiers:</p>
                <Switch
                  checked={ableToDelete}
                  onChange={handleSwitchChange}
                  inputProps={{ "aria-label": "Switch demo" }}
                />
              </div>
            </div>
            <div className="dialog-footer2">
              <button
                className="btn-dialog2 btn-dialogg-confirm2"
                type="submit"
              >
                Sauvegarder
              </button>
            </div>
          </form>
          {/* 
          <p className="dialog-message">message</p> */}
        </div>
      </div>
    </div>
  );
}

export default EditUser;
