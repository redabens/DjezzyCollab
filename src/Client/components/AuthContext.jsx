import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (token) {
      async function fetchUserRole() {
        try {
          const res = await axios.get("/userRole", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRole(res.data.role);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
      fetchUserRole();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
