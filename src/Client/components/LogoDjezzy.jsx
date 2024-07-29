import "../styles/LogoDjezzy.css";
export default function LogoDjezzy(){
    return (
        <div className="LogoWithName">
            <img
              className="logo"
              src="./../../src/assets/logo_djezzy.svg"
              alt="logo_djezzy"
            />
            <div className="Nom">
              <h2>DJEZZY COLLAB</h2>
              <h2 id="arabe">جازي كولاب</h2>
            </div>
          </div>
    );
}