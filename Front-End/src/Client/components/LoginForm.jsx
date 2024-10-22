import "./../styles/LoginForm.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { token, setToken } = useAuth();
  const [credentialsErr, setCredentialsErr] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = (data) => console.log(data);
  const handleError = (errors) => {};
  const handleLogin = () => {
    axios
      .post("http://localhost:3000/login", {
        username: watch("username"),
        password: watch("password"),
      })
      .then((result) => {
        if (result.status === 200) {
          setToken(result.data.token);
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setCredentialsErr(true);
            navigate('/login');
          } else if (error.response.status === 404) {
            setCredentialsErr(true);
            navigate('/login');
          } else if (error.response.status === 500) {
            alert("Erreur connexion de l'utilisateur à cause du serveur LDAP");
            navigate("/login");
          }
        } else {
          console.log(error);
          alert("An unexpected error occurred. Please try again.");
        }
      });
  };

  //------ validations -------
  const registerOptions = {
    username: {
      required: "Entrer votre nom d'utilisateur",
      pattern: {
        // value: /^[^\s@]+@[^\s@]+.[^\s@]+$/,
        message: "Adresse email invalide",
      },
    },
    password: {
      required: "Enrer le mot de passe",
    },
  };
  //-------------------------------
  return (
    <div className="my-form">
      <div className="titles">
        <h1>Se connecter</h1>
        <h6>Connectez-vous à votre compte</h6>
      </div>
      <form onSubmit={handleSubmit(handleLogin, handleError)}>    
        {credentialsErr && (<div className="credentialsErr">
          <p>UserName ou Mot De Passe incorrect. Veuillez réessayez!</p>
        </div>)}
        <div className="input-component">
          <label htmlFor="username">Nom d'utilisateur:</label>
          <input
            name="username"
            type="text"
            placeholder="saisir l'email..."
            {...register("username", registerOptions.username)}
          />
          <small className="text-danger">
            {errors?.username && errors.username.message}
          </small>
        </div>
        <div className="input-component">
          <label htmlFor="password">Mot de passe:</label>
          <input
            name="password"
            type="password"
            placeholder="saisir le mot de passe..."
            {...register("password", registerOptions.password)}
          />
          <small className="text-danger">
            {errors?.password && errors.password.message}
          </small>
          <div className="mdps-oublie">
            <p>Mot de passe oublié?</p>
          </div>
        </div>
        <button type="submit">Connectez-vous maintenant</button>
      </form>
    </div>
  );
}
