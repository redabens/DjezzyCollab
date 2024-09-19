import "../styles/LogoDjezzy.css";
import { useState } from "react";
export default function LogoDjezzy({rotating}) {
  // const [rotating, setRotating] = useState(false);
  // const handleRotateLogo = () => {
  //   setRotating(true);
  //   setTimeout(() => setRotating(false), 2000); // Duration should match the animation duration
  // };

  return (
    <div className="LogoWithName" >
      <img
        className={`logo ${rotating ? "rotate" : ""}`}
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
