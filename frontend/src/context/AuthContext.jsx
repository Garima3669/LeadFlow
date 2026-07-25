import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  getCurrentUser,
} from "../services/authService";


const AuthContext =
  createContext(null);


export const AuthProvider = ({
  children,
}) => {

  const [
    user,
    setUser,
  ] = useState(() => {

    const savedUser =
      localStorage.getItem(
        "leadflow_user"
      );

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });


  const [
    loading,
    setLoading,
  ] = useState(true);


  useEffect(() => {

    const token =
      localStorage.getItem(
        "leadflow_token"
      );

    if (!token) {

      setLoading(false);

      return;
    }


    getCurrentUser()

      .then((response) => {

        const currentUser =
          response.data;

        setUser(
          currentUser
        );

        localStorage.setItem(
          "leadflow_user",
          JSON.stringify(
            currentUser
          )
        );

      })

      .catch(() => {

        localStorage.removeItem(
          "leadflow_token"
        );

        localStorage.removeItem(
          "leadflow_user"
        );

        setUser(null);

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);


  const login = async (
    email,
    password
  ) => {

    const response =
      await loginUser({
        email,
        password,
      });


    const {
      user,
      token,
    } =
      response.data;


    localStorage.setItem(
      "leadflow_token",
      token
    );


    localStorage.setItem(
      "leadflow_user",
      JSON.stringify(
        user
      )
    );


    setUser(user);

    return user;
  };


  const logout = () => {

    localStorage.removeItem(
      "leadflow_token"
    );

    localStorage.removeItem(
      "leadflow_user"
    );

    setUser(null);

  };


  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated:
          !!user,
        isAdmin:
          user?.role ===
          "ADMIN",
        isMember:
          user?.role ===
          "MEMBER",
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};


export const useAuth =
  () => {

    const context =
      useContext(
        AuthContext
      );

    if (!context) {

      throw new Error(
        "useAuth must be used inside AuthProvider"
      );

    }

    return context;

  };