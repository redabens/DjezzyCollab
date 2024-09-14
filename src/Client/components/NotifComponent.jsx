import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState, useEffect } from "react";
import "./../styles/NotificationsPage.css";
import { styled } from "@mui/material/styles";
import axios from "axios";

function NotifComponent({ notif }) {
  const [user, setUser] = useState(null);
  const [userPath,setUserPath] = useState("");
  const [notifText, setNotifText] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (notif.userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/users/${notif.userId}`
          );
          setUser(response.data.data);
          setUserPath(response.data.userPath);
          // the notifi message
          switch (notif.type) {
            case "upload":
              setNotifText("a uploadé un fichier dans le répertoire:");
              break;
          }
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      }
    };

    fetchUserData();
  }, []);

  const CustomAccordion = styled(Accordion)(() => ({
    borderRadius: "8px !important",
    boxShadow: "none",

    "& .MuiAccordionSummary-root": {
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
      borderRadius: "8px",
      minHeight: "40px",
      "&.Mui-expanded": {
        minHeight: "50px",
      },
    },
    "& .MuiAccordionDetails-root": {
      backgroundColor: "#FFF0F0",
      borderRadius: "0px 0px 8px 8px",
    },
  }));

  const formatNotifDate = (dateStr) => {
    const notifDate = new Date(dateStr);
    const now = new Date();
    const timeDiff = now - notifDate; // Difference in milliseconds

    const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
    const oneYear = 365 * oneDay; // Approximation of milliseconds in a year

    if (timeDiff < oneDay) {
      // Less than 24 hours
      return notifDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (timeDiff < oneYear) {
      // More than 24 hours but less than a year
      return notifDate.toLocaleDateString([], {
        day: "2-digit",
        month: "short",
      });
    } else {
      // More than a year
      return notifDate.toLocaleDateString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  };

  if (!user) {
    return <div className="loading-notif">Loading...</div>;
  }

  return (
    <CustomAccordion className="notif-accordian">
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <div className="notif-header">
          <div className="notif-sub-header">
            <p className="user-name">
              {user.firstName} {user.lastName}
            </p>
            <p className="notif-msg">{notifText}</p>
            <p className="repo-name" title="HAHAHA">
              {notif.path}
            </p>
          </div>
          <div className="notif-time">
            <p className="notif-msg">{formatNotifDate(notif.createdAt)}</p>
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <ul className="notif-body">
          <li className="body-item">
            Path: <span>{notif.path}</span>
          </li>
          <li className="body-item">
            Nom du fichier: <span>{notif.fileName}</span>
          </li>
          <li className="body-item">
            Email de l'utilisateur: <span>{user.email}</span>
          </li>
        </ul>
      </AccordionDetails>
    </CustomAccordion>
  );
}

export default NotifComponent;
