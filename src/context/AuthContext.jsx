import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, role, token }

  // ✅ Register form persistence
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

  // ✅ Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const savedForm = localStorage.getItem("registerFormData");
    if (savedForm) {
      setRegisterFormData(JSON.parse(savedForm));
    }
  }, []);

  // ✅ Save registerFormData to localStorage automatically
  useEffect(() => {
    localStorage.setItem("registerFormData", JSON.stringify(registerFormData));
  }, [registerFormData]);

  const login = (userData) => {
    // userData should be { email, role, token }
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", JSON.stringify(userData?.role));
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        registerFormData,
        setRegisterFormData, // expose form setter
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ custom hook for easy access
export const useAuth = () => useContext(AuthContext);
