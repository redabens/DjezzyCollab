import { useState, useEffect, Fragment } from "react";
import "./../styles/GestionUsers.css";
import axios from "axios";
import DisplayUserComponent from "../components/DisplayUserComponent";
import YesNoDialog from "../components/YesNoDialog";
import EditUser from "../components/EditUser";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { useNavigate } from "react-router-dom";

export default function GestionUsers() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [Users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [filterKey, setFilterKey] = useState("Tous les utilisateurs");
  const [showDialog, setShowDialog] = useState(false);
  const [isShowEditUser, setIsShowEditUser] = useState(false);
  const [refreshUsers, setRefreshUsers] = useState(false); //variable to refrech the page every time editing a user

  // Fetching users from DB
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
  }, [refreshUsers]); // Add refreshUsers as a dependency

  // Filter users functionality
  const applyRoleFilter = (data) => {
    switch (filterKey) {
      case "Administrateur":
        return data.filter((user) => user.role === "admin");
      case "Download role":
        return data.filter((user) => user.role === "download");
      case "Upload role":
        return data.filter((user) => user.role === "upload");
      case "Download & upload":
        return data.filter((user) => user.role === "user");
      default:
        return data;
    }
  };

  // Search functionality
  const searchKeys = ["username"];
  const search = (data) => {
    const regxp = new RegExp(query, "gi");
    return data.filter((item) => {
      const pseudoquery = `${item[searchKeys[0]]} ${item[searchKeys[1]]} ${
        item[searchKeys[2]]
      }`;
      return pseudoquery.match(regxp);
    });
  };

  const filteredUsers = search(applyRoleFilter(Users));

  // Handle delete user
  const handleDeleteUser = async (id) => {
    try {
      axios.delete(`http://localhost:3000/users/${id}`)
      .then((res)=>{
        if(res.status === 200){
          setUsers(Users.filter((user) => user._id !== id));
          alert(res.data);
        }
      }).catch((error)=>{
        if(error.response){
          if(error.response.status === 404) return alert("User not found");
          else if(error.response.status === 409) return alert("Failed to delete user from db");
          else if(error.response.status === 500) return alert("Failed to delete user due to the server");
        } else{
          console.log(error);
          alert("An unexpected error occurred. Please try again.");
        }
      });
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user",err);
    }
  };

  const handleEditUser = async (
    user,
    userPath,
    role,
    ableToDelete
  ) => {
    try {
      setRefreshUsers(false);
      const updatedUserData = {
        userPath,
        role,
        ableToDelete,
      };

      const response = await axios.put(
        `http://localhost:3000/users/${user._id}`,
        { updatedUserData, user }
      );

      setUsers((prevUsers) =>
        prevUsers.map((utils) =>
          utils._id === user._id ? response.data.data : utils
        )
      );

      if (response.status === 200) {
        console.log("User updated successfully");
        // Trigger a refresh
        setRefreshUsers(!refreshUsers);
      }
    } catch (err) {
      console.error("Failed to edit user:", err);
      alert("Failed to edit user");
    }
  };

  // Show confirmation dialog
  const showDeleteDialog = (userId) => {
    setShowDialog(true);
    setUserToDelete(userId);
  };

  const showEditUser = (user) => {
    setIsShowEditUser(true);
    setUserToEdit(user);
  };

  // Handle confirmation from dialog
  const onConfirmDialog = async (confirm) => {
    if (confirm && userToDelete) {
      await handleDeleteUser(userToDelete);
    }
    setShowDialog(false);
  };

  const onConfirmEdit = async (confirm, userPath, role, ableToDelete) => {
    if (confirm && userToEdit) {
      await handleEditUser(userToEdit, userPath, role, ableToDelete);
    }
    setIsShowEditUser(false);
  };

  return (
    <div className="gestion-users-page">
      <h1>Gestion des utilisateurs</h1>
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
              <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                  <Fragment>
                    <p style={{ fontSize: "0.9em" }}>{filterKey}</p>
                    <img
                      src="./../../src/assets/filter-square.svg"
                      alt="filtrer_icon"
                      height="20px"
                      width="20px"
                      {...bindTrigger(popupState)}
                    />

                    <Menu {...bindMenu(popupState)}>
                      <MenuItem
                        onClick={() => {
                          setFilterKey("Tous les utilisateurs");
                          popupState.close();
                        }}
                      >
                        Tous les utilisateurs
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFilterKey("Administrateur");
                          popupState.close();
                        }}
                      >
                        Administrateur
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFilterKey("Download role");
                          popupState.close();
                        }}
                      >
                        Download role
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFilterKey("Upload role");
                          popupState.close();
                        }}
                      >
                        Upload role
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFilterKey("Download & upload");
                          popupState.close();
                        }}
                      >
                        Download & upload
                      </MenuItem>
                    </Menu>
                  </Fragment>
                )}
              </PopupState>
            </div>
          </div>
          <div className={filteredUsers.length > 0 ? "users" : "usersEmpty"}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <DisplayUserComponent
                  key={user._id}
                  user={user}
                  onDelete={() => showDeleteDialog(user._id)}
                  onEdit={() => showEditUser(user)}
                />
              ))
            ) : (
              <p className="aucun-user-text">Aucun utilisateur trouvé</p>
            )}
          </div>
        </div>
      </div>
      {showDialog && (
        <div className="popup">
          <YesNoDialog
            titre="Confirmation de suppression"
            message="Voulez-vous vraiment supprimer cet utilisateur?"
            image="./../../src/assets/delete_illustration.svg"
            onConfirmDialog={onConfirmDialog}
            confirmWord="Supprimer"
          />
        </div>
      )}
      {isShowEditUser && (
        <div className="popup">
          <EditUser user={userToEdit} onConfirmEdit={onConfirmEdit} />
        </div>
      )}
    </div>
  );
}
