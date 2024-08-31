import "./../styles/DisplayUserComponent.css";
import { Fragment } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

export default function DisplayUserComponent({ user, onDelete }) {
  const userName = `${user.firstName} ${user.lastName}`;

  // const handleDeleteClick = () => {
  //   onDelete(user._id);
  // };

  return (
    <div className="user-component">
      <img
        className="profile-img"
        src="./../../src/assets/profile-circle.svg"
        alt="user_photo"
        width="35px"
        height="35px"
      />
      <p className="username">{userName}</p>
      <p className="user-email">{user.email}</p>
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <Fragment>
            <img
              src="./../../src/assets/dot_vertical.svg"
              alt="dots_icon"
              height="20px"
              width="20px"
              {...bindTrigger(popupState)}
            />
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={popupState.close}>Modifier</MenuItem>
              <MenuItem onClick={onDelete}>Supprimer</MenuItem>
              <MenuItem onClick={popupState.close}>Bloquer</MenuItem>
            </Menu>
          </Fragment>
        )}
      </PopupState>
    </div>
  );
}
