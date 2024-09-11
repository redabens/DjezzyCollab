import { useState, useEffect } from "react";
import "./../styles/GestionUsers.css";
import axios from "axios";
import DisplayUserComponent from "../components/DisplayUserComponent";
import YesNoDialog from "../components/YesNoDialog";
import EditUser from "../components/EditUser";
import { Fragment } from "react";
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
  // dialog boxes
  const [showDialog, setShowDialog] = useState(false);
  const [isShowEditUser, setIsShowEditUser] = useState(false);

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

  // filter users fonctionality
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
  const filteredUsers = search(applyRoleFilter(Users));

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

  const handleEditUser = async (user,firstName,lastName,email,userPath,role) => {
    console.log("handleEditUser hit : " + user._id);
    try {
      const updatedUserData = {
        firstName,
        lastName,
        email,
        userPath,
        role,
      };

      const response = await axios.put(
        `http://localhost:3000/users/${user._id}`,
        { updatedUserData, user}
      );

      setUsers((prevUsers) =>
        prevUsers.map((utils) =>
          utils._id === user._id ? response.data.data : utils,
        )
      );

      if (response.status === 200) console.log("User updated successfully");
    } catch (err) {
      console.error("Failed to edit user:", err);
      alert("Failed to edit user");
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

  const showEditUser = (user) => {
    setIsShowEditUser(true);
    console.log(
      "showEditUser hit in gestion users, showEditUser is: ",
      isShowEditUser
    );
    setUserToEdit(user);
  };

  // Handle confirmation from dialog
  const onConfirmDialog = async (confirm) => {
    console.log("onConfirmDialog hit : " + confirm);
    if (confirm && userToDelete) {
      await handleDeleteUser(userToDelete); // the id
    }
    setShowDialog(false);
  };

  const onConfirmEdit = (
    confirm,
    firstName,
    lastName,
    email,
    userPath,
    role
  ) => {
    console.log("onConfirmEdit hit : " + confirm);
    if (confirm && userToEdit) {
      handleEditUser(userToEdit, firstName, lastName, email, userPath, role); // the id
    }
    setIsShowEditUser(false);
    navigate("/gestion-utilisateurs");
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
                        upload role
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
