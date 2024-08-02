import "./../styles/LoginForm.css";
import { useForm } from "react-hook-form";
export default function LoginForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  console.log(watch("email"));
  console.log(watch("password"));
  const handleError = (errors) => {};
  const handleLogin = () => {};
  //------ validations -------
  const registerOptions = {
    email: {
      required: "Entrer une adresse email",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
          <div className="mdps-oublie">
            <p>Mot de passe oublié?</p>
          </div>
        </div>
        <button type="submit">Connectez-vous maintenant</button>
      </form>
    </div>
  );
}
