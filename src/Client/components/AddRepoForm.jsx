import "./../styles/AddRepoForm.css";
import { useState } from "react";
import { useForm} from "react-hook-form";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
export default function AddRepoForm({ path,renitPath,type,sftpconfig,addedSite}) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const handleAddRepo = async () => {
    if(type === '1'){
      // type 1 pour create path dans gestion repos
      try {
        setError("");
        const response = await axios.post(
          "http://localhost:3000/paths/create",
          { pathName: path },
          { headers: { Authorization: token } }
        );
  
        if (response.status === 201) {
          alert("Path created successfully!");
          setError("");
          renitPath();
        }
      } catch (error) {
        setError("Ce path existe déja");
  
        console.error("Error creating path:", error);
      }
    } else{
      // type 2 pour gestion site pour ajouter le site serveur sftp
      try{
        axios.post("http://localhost:3000/sitesftp/add",{sftpconfig:sftpconfig,defaultPath:path},
           { headers: { Authorization: token },}
        )
        .then((res)=>{
          if(res.status === 200){
            setError("");
            renitPath();
            addedSite();
            alert("Site SFTP added successfully!");
          }
        }).catch((error) => {
          if (error.response) {
            if (error.response.status === 404) return alert("Failed to add site SFTP"); 
            else if (error.response.status === 500) return alert("Failed to add site SFTP due to server");
          } else {
            console.log(error);
            alert("An unexpected error occurred. Please try again.");
          }
        });
      }catch(err){
        console.log(err);
      }
    }
  };

  return (
    <div className="add-repo-form">
      <form onSubmit={handleSubmit(handleAddRepo)} className="form-area">
        <div className="add-repo-component">
          <label htmlFor="repo">Nom du répertoire:</label>
          <div className="input-area">
            <p>{path}</p>
          </div>
          <small className="text-danger" style={{ color: "red" }}>
            {error}
          </small>
        </div>
        <button type="submit" className="valideAddBtn">
          Ajouter
        </button>
      </form>
    </div>
  );
}
