import { useState, useEffect } from "react";
import "./../styles/GestionUsers.css";
import axios from "axios";
import DisplayUserComponent from "../components/DisplayUserComponent";
import YesNoDialog from "../components/YesNoDialog";

export default function GestionUsers() {
  const [query, setQuery] = useState("");
  const [Users, setUsers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Getting users from DB
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        setUsers(response.data.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        alert("Can't fetch users from DB");
      }
    };
    fetchUsers();
  }, []);

  // Search functionality
  const searchKeys = ["firstName", "lastName", "email"];
  const search = (data) => {
    const regxp = new RegExp(query, "gi");
    return data.filter((item) => {
      const pseudoquery = `${item[searchKeys[0]]} ${item[searchKeys[1]]} ${
        item[searchKeys[2]]
      }`;
      return pseudoquery.match(regxp);
    });
  };
  const filteredUsers = search(Users);

  // Handle delete user
  const handleDeleteUser = async (id) => {
    console.log("handleDeleteUser hit : " + id);
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers(Users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  // Show confirmation dialog
  const showDeleteDialog = (userId) => {
    setShowDialog(true);
    console.log(
      "showDeleteDialog hit in gestion users, showDialog is: ",
      showDialog
    );
    setUserToDelete(userId);
  };

  // Handle confirmation from dialog
  const onConfirmDialog = (confirm) => {
    console.log("onConfirmDialog hit : " + confirm);
    if (confirm && userToDelete) {
      handleDeleteUser(userToDelete); // the id
    }
    setShowDialog(false);
  };

  return (
    <div className="gestion-users-page">
      <h2>Gestion des utilisateurs</h2>
      <div className="area2">
        <div className="search-bar">
          <img
            src="./../../src/assets/search_loop.svg"
            alt="search_icon"
            width="26px"
            height="26px"
          />
          <input
            type="text"
            placeholder="Recherche..."
            className="search-input"
            onChange={(e) => setQuery(e.target.value.toLocaleLowerCase())}
          />
        </div>
      </div>
      <div className="users-list-area">
        <div className="users-box">
          <div className="users-tools-rectangle">
            <div className="filter-component">
              <p>Filtrer</p>
              <img
                src="./../../src/assets/filter-square.svg"
                alt="filtrer_icon"
                height="20px"
                width="20px"
              />
            </div>
          </div>
          <div className={filteredUsers.length > 0 ? "users" : "usersEmpty"}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <DisplayUserComponent
                  key={user._id}
                  user={user}
                  onDelete={() => showDeleteDialog(user._id)}
                />
              ))
            ) : (
              <p>Aucun utilisateur</p>
            )}
          </div>
        </div>
      </div>

      {showDialog && (
        <YesNoDialog
          titre="Confirmation de suppression"
          message="Voulez-vous vraiment supprimer cet utilisateur?"
          image="./../../src/assets/delete_illustration.svg" // example image
          onConfirmDialog={onConfirmDialog}
        className="delete-dialog-box"/>
      )}
    </div>
  );
}
