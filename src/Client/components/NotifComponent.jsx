import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState, useEffect } from "react";
import "./../styles/NotificationsPage.css";
import { styled } from "@mui/material/styles";
import { Height, WidthFull } from "@mui/icons-material";

function NotifComponent({notif}) {
    const [user, setUser] =useState(null);
  const CustomAccordion = styled(Accordion)(({ theme }) => {
 
    return {
      borderRadius: "8px !important",
      boxShadow: "none",

      "& .MuiAccordionSummary-root": {
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",

        borderRadius: "8px",
        //  padding: "8px 16px",
        minHeight: "40px",
        "&.Mui-expanded": {
          minHeight: "50px",
        },
      },
      "& .MuiAccordionDetails-root": {
        backgroundColor: "#e0f7f7",
        borderRadius: "0px 0px 8px 8px",
      },
    };
  });
  return (
    <CustomAccordion className="notif-accordian">
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <div className="notif-header">
          <div className="notif-sub-header">
            <p className="user-name">Sara Iratni</p>
            <p className="notif-msg">
              a uploadé un fichier avec succès dans le répertoire:
            </p>
            <p className="repo-name" title="HAHAHA">
              /AppDataag/sara/App/Local/Admin/Paths/userDirectories/groupe2/user
              x
            </p>
          </div>
          <div className="notif-time"><p className="notif-msg">10:15</p></div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <ul className="notif-body">
          <li className="body-item">
            Email de l'utilisateur: <span>sarair@email.com</span>
          </li>
          <li className="body-item">
            Nom du fichier: <span>releve-emoluments.pdf</span>
          </li>
          <li className="body-item">
            Path: <span>/AppDataag</span>
          </li>
        </ul>
      </AccordionDetails>
    </CustomAccordion>
  );
}
export default NotifComponent;
