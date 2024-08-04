import { useEffect,useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/Fichier.css";
export default function Fichier({file}){
    // const extension = file.name.slice(file.name.findLastIndex('.'),file.name.length);
    // console.log(extension);
    return (
        <div className="box-file">
            <div className="left">
                <img src="./../../src/assets/Style=broken.svg" alt="FileIcon" style={{width:'26px',height:'26px'}}/>
                <h3>{file.name}</h3>
            </div>
            <div className="right">
                <img src="./../../src/assets/download.svg" alt="DownloadIcon" style={{width:'26px',height:'26px'}}/>
                <img src="./../../src/assets/modifiate.svg" alt="moreIcon"style={{width:'26px',height:'26px'}}/>
            </div>
        </div>
    );
}