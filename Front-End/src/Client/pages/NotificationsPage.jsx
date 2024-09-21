import NotifComponent from "../components/NotifComponent";
import { useState, useEffect } from "react";
import axios from "axios";
function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/notifs");
          const sortedNotifs = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifs(sortedNotifs);
      } catch (err) {
        console.error("Failed to fetch notifs:", err);
        alert("Can't fetch notifs from DB");
      }
    };
    fetchUsers();
  }, []);
  return (
    <div className="notif-page" style={ notifs.length === 0 ? {justifyContent:'center'} : {}}>
      
      {notifs.length > 0 ? notifs.map((notif) => (
        <NotifComponent key={notif._id} notif={notif} />
      )) : (<div className="aucune">
        <span>Aucune notification</span>
      </div>)}
    </div>
  );
}

export default NotificationsPage;
