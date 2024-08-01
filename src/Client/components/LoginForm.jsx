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
  console.log(watch("mdps"));
  const handleError = (errors) => {};
  const handleLogin = () => {};
  //------ validations -------
  const registerOptions = {
    email: { required: "Please enter an email adress" },
    password: {
      required: "Please enter your password",
    },
  };
  return (
    <div className="my-form">
      <h1>Se connecter</h1>
      <h6>Connectez-vous à votre compte</h6>
      <form onSubmit={handleSubmit(handleLogin, handleError)}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            type="text"
            {...register("email", registerOptions.email)}
          />
          <small className="text-danger">{errors?.name}</small>
        </div>
        <div>
          <label htmlFor="mdps">Mot de passe:</label>
          <input
            name="mdps"
            type="password"
            {...register("mdps", registerOptions.password)}
          />
          <small className="text-danger">{errors?.password}</small>
        </div>
        <button>Connectez-vous maintenant</button>
      </form>
    </div>
  );
}
