import "./../styles/LoginForm.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message, Result } from "antd";
import { useAuth } from "./AuthContext";
export default function LoginForm() {
  const { token, setToken } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState({ value: false, message: "" });
  const onSubmit = (data) => console.log(data);
  const handleError = (errors) => {};
  const handleLogin = () => {
    axios
      .post("http://localhost:3000/login", {
        email: watch("email"),
        password: watch("password"),
      })
      .then((result) => {
        console.log(result);
        if (result.status === 200) {
          setToken(result.data.token);
          navigate("/");
        } else if (result.status === 401) {
          setLoginError({
            value: true,
            message: "Le mot de passe est Incorrect",
          });
        } else {
          setLoginError({ value: true, message: "Utilisateur non enregistré" });
        }
      })
      .catch((errors) => {
        console.log(errors);
        alert(errors);
      });
  };
  //------ validations -------
  const registerOptions = {
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
  };
  //-------------------------------
  return (
    <div className="my-form">
      <div className="titles">
        <h1>Se connecter</h1>
        <h6>Connectez-vous à votre compte</h6>
      </div>
      <form onSubmit={handleSubmit(handleLogin, handleError)}>
        <div className="input-component">
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
          <small className="text-danger">
            {!errors?.password && loginError.value && loginError.message}
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
