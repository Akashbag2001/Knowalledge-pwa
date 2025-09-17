import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, role, token }
  const [loading, setLoading] = useState(true); // ✅ prevent early redirect

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

  // ✅ Load user & registerFormData from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const savedForm = localStorage.getItem("registerFormData");
    if (savedForm) {
      setRegisterFormData(JSON.parse(savedForm));
    }

    setLoading(false); // ✅ done restoring
  }, []);

  // ✅ Persist form automatically
  useEffect(() => {
    localStorage.setItem("registerFormData", JSON.stringify(registerFormData));
  }, [registerFormData]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", JSON.stringify(userData?.role));
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading, // ✅ expose loading
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
