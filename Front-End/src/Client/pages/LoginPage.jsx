import "./../styles/LoginPage.css";
import { useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import WhiteLogo from "../components/WhiteLogo";
import LoginForm from "../components/LoginForm";
function LoginPage() {
  const context = useOutletContext();
  return (
    <div className="login">
      <div className="login-page">
        <div className="imgArea">
          <div className="logodjezzy">
            <WhiteLogo />
          </div>
          <div className="scripts">
            <h2>
              Se connecter manuellement ou s’authentifier pour continuer votre
              expérience
            </h2>
            <h4>
              Bienvenue sur la platforme de gestion de fichiers et documents au
              sein de l’entreprise Djezzy.
            </h4>
          </div>
        </div>

        <div className="formArea">
          <LoginForm />
          <div className="auth">
            <div className="separateur">
              <div className="horizontal-line"></div>
              <p>Ou</p>
              <div className="horizontal-line"></div>
            </div>
            <button>S'authentifier automatiquement</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
