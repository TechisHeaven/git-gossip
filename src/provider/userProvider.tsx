import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MAIN_SERVER_ROUTE } from "../constants";
import axios from "axios";

const AuthContext = createContext<{
  user: any | null;
  setUser: (user: any | null) => void;
  logoutUser: () => void;
}>({
  user: null,
  setUser: () => {},
  logoutUser: () => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch user authentication status from your backend
    getUser();
  }, []);

  async function getUser() {
    axios
      .get(`${MAIN_SERVER_ROUTE}/auth/user`, {
        withCredentials: true,
      })
      .then(function (response) {
        // handle success
        console.log(response);
        if (response.status === 401) {
          setUser(null);
        }
        setUser(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }

  useEffect(() => {
    if (!user && location.pathname !== "/auth") {
      navigate("/auth");
    }
  }, [user, location, navigate]);

  function logoutUser() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default UserProvider;
