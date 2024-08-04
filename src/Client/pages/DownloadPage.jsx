import { useEffect,useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Fichier from "../components/Fichier";
import "./../styles/DownloadPage.css";
function DownloadPage(){
    const { token } = useAuth();
    const [downloads, setDownloads] = useState([]);
    const navigate = useNavigate();
    useEffect(function(){
        axios.get('http://localhost:3000/download',{
            headers: { 'Authorization': token },    
        }).then(res=>{
            if(res.status === 200) { 
                console.log(res.data.files);
                setDownloads(res.data.files);
            }
            else if(res.status === 401) return alert('User Id not Found');
            else if(res.status === 404) return alert('User not found');
            else if(res.status === 415) return alert('Directory not found');
            else if(res.status === 500) return alert('Failed to upload due to server');
        })
        .catch((error)=>{
            alert('Error Donwloading files');
            navigate('/login');
        })
    },[]);
    return(
        <div className="download-page">
            <h1>Download Page</h1>
            <div className="preview">
                {downloads.map((file,index)=>{
                    return (
                            <Fichier key={index} file={file}/>
                    );
                })}
            </div>        
        </div>
    );
}
export default DownloadPage;