import { useEffect,useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/Fichier.css";
export default function Fichier({file}){
    const { token } = useAuth();
    const [nom,setNom]= useState(file.name);
    const [rename,setRename]= useState(false);
    let lastfilename = '';
    const extension = file.name.slice(file.name.lastIndexOf('.'),file.name.length);
    console.log(extension);
    const handleDownload = ()=>{
        axios.get(`http://localhost:3000/download/${file.name}`,{
            headers: { 'Authorization': token },    
        }).then(res=>{
            if(res.status === 200) { 
                alert(res.data);
            }
            else if(res.status === 401) return alert('User Id not Found');
            else if(res.status === 404) return alert('User not found');
            else if(res.status === 415) return alert('Directory not found');
            else if(res.status === 500) return alert('Failed to upload due to server');
        })
        .catch((error)=>{
            alert('Error Donwloading files');
        })
    }
    const handleRename = ()=>{
        axios.patch(`http://localhost:3000/download/${file.name}`,{nom},{
            headers: { 'Authorization': token },    
        }).then(res=>{
            if(res.status === 200) return alert(res.data);   
            else if(res.status === 401) return alert('User Id not Found Refresh the Page');
            else if(res.status === 404) return alert(res.data);
            else if(res.status === 409) return alert(res.data);
            else if(res.status === 415) return alert('Directory not found');
            else if(res.status === 500) return alert('Failed to upload due to server');
        })
        .catch((error)=>{
            setNom(lastfilename);
            alert('Error Renaming files');
        })
    }
    const activRename = ()=>{
        lastfilename = file.name;
        setRename(true);
    }
    const handleNom = (event)=>{
        setNom(event.target.value);
    }
    return (
        <div className="box-file">
            <div className="left">
                <img src="./../../src/assets/Style=broken.svg" alt="FileIcon" style={{width:'26px',height:'26px'}}/>
                <input type="text" name="titre" value={nom} className={!rename ? "titre-nonRename": "titre-Rename"} disabled={!rename} onChange={handleNom} onKeyUp={(event)=>{
                    console.log('je suis dans le rename');
                    if(event.key === 'Enter'){
                        setRename(false);
                        handleRename();
                    }
                }}/>
            </div>
            <div className="right">
                <div className="downloadImg" onClick={handleDownload}>
                    <img src="./../../src/assets/download.svg" alt="DownloadIcon" style={{width:'26px',height:'26px'} }/>
                </div>
                <div className="modifImg" onClick={activRename}>
                    <img src="./../../src/assets/modifiate.svg" alt="moreIcon"style={{width:'26px',height:'26px'}}/>
                </div>
            </div>
        </div>
    );
}