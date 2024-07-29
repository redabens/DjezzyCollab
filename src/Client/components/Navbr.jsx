import "../styles/Navbar.css";
export default function Navbr() {
  return (
    <nav className="navbar">
      <div className="navbarElt">
        <h3>Abdelhak Kaid</h3>
        <img
          className="pdp"
          src="../src/assets/anonyme.jpg"
          alt="photo_profil"
        />
      </div>
    </nav>
  );
}
