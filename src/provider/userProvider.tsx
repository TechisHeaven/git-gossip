import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MAIN_SERVER_ROUTE } from "../constants";
import axios from "axios";
import { getCurrentUserToken } from "../utils/storage/token.utils";

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
    // Check for token in localStorage
    const token = localStorage.getItem("authToken");
    if (token) {
      // If token exists, get user details
      getUserFromToken(token);
    }
  }, []);

  async function getUserFromToken(token: string) {
    axios
      .get(`${MAIN_SERVER_ROUTE}/auth/user`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
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
        // localStorage.removeItem("authToken");
        setUser(null);
        navigate("/auth"); // Redirect to login page
      })
      .finally(function () {
        // always executed
      });
  }

  useEffect(() => {
    const authToken = getCurrentUserToken();
    if (!authToken && !user && location.pathname !== "/auth") {
      navigate("/auth");
    }
  }, [user, navigate]);

  function logoutUser() {
    setUser(null);
    setUser(null);
    localStorage.removeItem("authToken"); // Clear the token on logout
    navigate("/auth");
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default UserProvider;
