import React, {
    createContext,
    useState,
    useEffect,
  } from "react";
  
  import { getuser } from "../services/authService";
  
  type User = {
    name: string;
    email: string;
  };
  
  type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
  };
  
  export const AuthContext = createContext<AuthContextType | null>(null);
  
  export const AuthProvider = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const token = localStorage.getItem("token");
  
      // No token → user is not logged in
      if (!token) {
        return;
      }
  
      getuser()
        .then((response) => {
          // console.log("Current user:", response);
  
          setUser(response.user);
        })
        .catch((error) => {
          // console.log("Failed to get current user:", error);
  
          // Token is probably invalid/expired
          localStorage.removeItem("token");
          setUser(null);
        });
    }, []);
  
    return (
      <AuthContext.Provider
        value={{
          user,
          setUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };