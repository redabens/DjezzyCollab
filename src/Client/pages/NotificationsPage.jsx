import NotifComponent from "../components/NotifComponent";
import { useState, useEffect } from "react";
import axios from "axios";
function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/notifs");
        setNotifs(response.data.data);
      } catch (err) {
        console.error("Failed to fetch notifs:", err);
        alert("Can't fetch notifs from DB");
      }
    };
    fetchUsers();
  }, []);
  return (
    <div className="notif-page">
      {notifs.map((notif) => (
        <NotifComponent key={notif._id} notif={notif} />
      ))}
    </div>
  );
}

export default NotificationsPage;
