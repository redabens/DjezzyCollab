import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./../styles/AddSiteForm.css"

export default function AddSiteForm({handleVisualise}){
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm();
      const [viseErr, setViseErr] = useState(false);
      //------ validations -------
    const registerOptions = {
      host: {
        required: "Entrer l'IP host!",
      },
      port: {
          required: "Entrer le port! Géneralement c'est 22.",
      },
      username: {
        required: "Enrer le nom de l'admin du serveur sftp!",
      },
      password: {
        required: "Enrer le mot de passe!",
      },
    };
    const sftpConfig = {
      host: watch("host"),
      port: watch("port"),
      username: watch("username"),
      password: watch("password"),
    }
    const handleSuccess = ()=>{
          setViseErr(false);
          handleVisualise(sftpConfig);
    }
    const handleError = (errors) => {
        console.log(errors);
        setViseErr(true);
    }
    return (
        <div className="form-g">
            <h1>Formulaire d'ajout de site SFTP</h1>
            <form className="form-d" onSubmit={handleSubmit(handleSuccess,handleError)}>
                <div className="input-group">
                    <div className="input-component">
                        <label htmlFor="host">Host IP:</label>
                        <input type="text" id="host" name="host" placeholder="127.0.0.1"
                        {...register("host", registerOptions.host)}/>
                        <small className="text-danger">
                            {errors?.host && errors.host.message}
                        </small>
                    </div>
                    <div className="input-component">
                        <label htmlFor="port">Port:</label>
                        <input type="text" id="port" name="port" placeholder="22"
                        {...register("port", registerOptions.port)}/>
                        <small className="text-danger">
                            {errors?.port && errors.port.message}
                        </small>
                    </div>
                </div>
                <div className="input-group">
                    <div className="input-component">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" placeholder="Nom de l'Admin"
                        {...register("username", registerOptions.username)}/>
                        <small className="text-danger">
                            {errors?.username && errors.username.message}
                        </small>
                    </div>
                    <div className="input-component">
                        <label htmlFor="password">Password:</label>
                        <input type="text" id="password" name="password" placeholder="Mot de passe"
                        {...register("password", registerOptions.password)}/>
                        <small className="text-danger">
                            {errors?.password && errors.password.message}
                        </small>
                    </div>
                </div>
                <button type="submit" className="visualise">Visualiser</button>
            </form>
            {viseErr && (
                <small className="text-danger">
                    Une erreur c'est produite lors de la visualisation. Réessayez!
                </small>
            )}
        </div>
    );
}