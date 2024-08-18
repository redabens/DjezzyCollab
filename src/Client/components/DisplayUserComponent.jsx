import "./../styles/DisplayUserComponent.css";
export default function DisplayUserComponent({ user }) {
  const userName = `${user.firstName} ${user.lastName}`;
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
      <img
        src="./../../src/assets/dot_vertical.svg"
        alt="dots_icon"
        height="20px"
        width="20px"
      />
    </div>
  );
}
