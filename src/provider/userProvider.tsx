import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MAIN_SERVER_ROUTE } from "../constants";
import axios from "axios";
import { getCurrentUserToken } from "../utils/storage/token.utils";
import { useQuery } from "@tanstack/react-query";
import { UserInterface } from "../types/auth.type";

const AuthContext = createContext<{
  user: UserInterface | null;
  isLoading: boolean;
  isFetching: boolean;
  setUser: (user: any) => void;
  logoutUser: () => void;
}>({
  user: null,
  isLoading: false,
  isFetching: false,
  setUser: () => {},
  logoutUser: () => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const authToken = getCurrentUserToken();

  useEffect(() => {
    if (!authToken && !user && location.pathname !== "/auth") {
      navigate("/auth");
    }
  }, [authToken, navigate]);

  const fetchUser = async (token: string) => {
    try {
      const { data } = await axios.get(`${MAIN_SERVER_ROUTE}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return data;
    } catch (error) {
      if (error) logoutUser();
      throw error;
    }
  };

  const {
    data: userData,
    isLoading,
    isError,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["user"],
    enabled: !!authToken,
    retry: false,
    queryFn: () => fetchUser(authToken as string),
  });

  useEffect(() => {
    if (!isError && userData) setUser(userData);
    if (isError) {
      logoutUser();
    }
  }, [isFetched]);

  function logoutUser() {
    setUser(null);
    localStorage.removeItem("authToken"); // Clear the token on logout
    navigate("/auth");
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading, isFetching, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};

export default UserProvider;
