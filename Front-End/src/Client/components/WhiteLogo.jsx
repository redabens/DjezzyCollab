import "../styles/WhiteLogo.css";
function WhiteLogo() {
  return (
    <div className="WhiteLogoWithName">
      <img
        className="Whitelogo"
        src="./../../src/assets/logo_djezzy_whiteVersion.svg"
        alt="logo_djezzy"
      />
      <div className="WhiteNom">
        <h3>DJEZZY COLLAB</h3>
        <h3 id="arabe">جازي كولاب</h3>
      </div>
    </div>
  );
}
export default WhiteLogo;
