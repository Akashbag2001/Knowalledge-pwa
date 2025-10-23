import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    mobile: "",
    countryCode: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
    country: "",
    countryShortName: "",
    state: "",
    city: "",
    schoolName: "",
    newSchoolName: "",
    termsAccepted: false,
  });

  // ✅ Load user from sessionStorage (tab-isolated)
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // ✅ Ensure role defaults to "user" if missing
      if (!parsedUser.role) parsedUser.role = "user";
      setUser(parsedUser);
    }

    const savedForm = localStorage.getItem("registerFormData");
    if (savedForm) {
      setRegisterFormData(JSON.parse(savedForm));
    }

    setLoading(false);
  }, []);

  // ✅ Persist register form data in localStorage (shared safely)
  useEffect(() => {
    localStorage.setItem("registerFormData", JSON.stringify(registerFormData));
  }, [registerFormData]);

  // ✅ login stores session-scoped user data
  const login = (userData) => {
    const role = userData?.role || "user"; // default if undefined
    const updatedUser = { ...userData, role };

    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        registerFormData,
        setRegisterFormData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
