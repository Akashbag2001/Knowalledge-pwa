import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useHttp from "../api/useHttp";

const Register = () => {
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    countryCode: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
    country: "",
    state: "",
    city: "",
    schoolName: "",
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryDetails, setCountryDetails] = useState([]); // ✅ new state for country codes
  const [countryName, setCountryName] = useState([])

  const { login } = useAuth();
  const navigate = useNavigate();
  const { sendRequest, loading } = useHttp();

  // ✅ Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await sendRequest("/locations/countries");
        setCountryDetails(response.countries); // ✅ updated state name

        console.log(response.countries);

        if (!formData.countryCode && response.countries.length > 0) {
          setFormData((prev) => ({
            ...prev,
            countryCode: ""
          }));
        }
      } catch (error) {
        console.error("Failed to load countries:", error);
      }
    };

    fetchCountries();
  }, []);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };





  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (userType === "student" && !formData.schoolName.trim()) {
      newErrors.schoolName = "School name is required";
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "Please accept terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const endpoint = userType === "student" ? "/auth/register-student" : "/auth/register-other";
      const requestData = {
        ...formData,
        mobile: formData.countryCode + formData.mobile,
        userType,
        isSchoolStudent: userType === "student"
      };

      const data = await sendRequest(endpoint, "POST", requestData);

      if (data) {
        login({
          email: data.email || formData.email,
          name: data.name || formData.name,
          role: "user",
          token: data.token,
        });
        navigate("/dashboard");
      }
    } catch (err) {
      setErrors({ submit: err.message || "Registration failed" });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      {/* Aceternity UI Background Grid */}
      <div className="absolute inset-0  [background-size:50px_50px]" />

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100/20 dark:bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-100/20 dark:bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-emerald-100/20 dark:bg-emerald-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              {/* <KnowledgeLogo size={80} variant="minimal" /> */}
              <span className="font-boold font-xl">K</span>
            </div>
            <h1 className="text-4xl font-black text-neutral-900 dark:text-neutral-100 mb-2">
              Join Knowledge Platform
            </h1>
            <p className="text-neutral-500 dark:text-neutral-500">
              Create your account and start your learning journey
            </p>
          </div>

          {/* User Type Selector */}
          <div className="mb-8">
            <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-1">
              <button
                type="button"
                onClick={() => setUserType("student")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${userType === "student"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  }`}
              >
                School Student
              </button>
              <button
                type="button"
                onClick={() => setUserType("other")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${userType === "other"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  }`}
              >
                Others
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-8">
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-4 border rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"
                    }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-red-500 text-xs">{errors.name}</p>}
              </div>

              {/* Mobile Number with Country Code */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Mobile Number *
                </label>
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
                  {/* Country Code Select */}
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={(e) => {
                      const selectedCode = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        countryCode: selectedCode
                      }));

                      if (errors.countryCode) {
                        setErrors((prev) => ({ ...prev, countryCode: "" }));
                      }
                    }}
                    className="w-full lg:w-1/3 px-3 py-4 border border-r-0 rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    {countryDetails.map(({ shortName, name, phone }) => (
                      <option key={shortName} value={`+${phone}`}>
                        {name} (+{phone})
                      </option>
                    ))}
                  </select>

                  {/* Mobile Input */}
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full lg:w-2/3 p-4 border rounded-b-xl lg:rounded-r-xl lg:rounded-bl-none bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.mobile
                        ? "border-red-500"
                        : "border-neutral-300 dark:border-neutral-700"
                      }`}
                    placeholder="Enter mobile number"
                  />
                </div>
                {errors.mobile && (
                  <p className="mt-1 text-red-500 text-xs">{errors.mobile}</p>
                )}
              </div>


              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-4 border rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"
                    }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email}</p>}
              </div>

              {/* Date of Birth & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full p-4 border rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.dateOfBirth ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"
                      }`}
                  />
                  {errors.dateOfBirth && <p className="mt-1 text-red-500 text-xs">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full p-4 border rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.gender ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"
                      }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-red-500 text-xs">{errors.gender}</p>}
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full p-4 pr-12 border rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.password ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"
                        }`}
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-red-500 text-xs">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full p-4 pr-12 border rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.confirmPassword ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"
                        }`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-red-500 text-xs">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full p-4 border rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.country ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"
                      }`}
                    placeholder="Country"
                  />
                  {errors.country && <p className="mt-1 text-red-500 text-xs">{errors.country}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full p-4 border rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.state ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"
                      }`}
                    placeholder="State"
                  />
                  {errors.state && <p className="mt-1 text-red-500 text-xs">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full p-4 border rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.city ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"
                      }`}
                    placeholder="City"
                  />
                  {errors.city && <p className="mt-1 text-red-500 text-xs">{errors.city}</p>}
                </div>
              </div>

              {/* School Name (Only for Students) */}
              {userType === "student" && (
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    className={`w-full p-4 border rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.schoolName ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"
                      }`}
                    placeholder="Enter your school name"
                  />
                  {errors.schoolName && <p className="mt-1 text-red-500 text-xs">{errors.schoolName}</p>}
                </div>
              )}

              {/* Topics Interest */}
              {/* <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                  Topics of Interest
                </label>
                <div className="flex flex-wrap gap-2">
                  {topicsList.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleTopicToggle(topic)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        formData.topics.includes(topic)
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Profile Picture */}
              {/* <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center overflow-hidden">
                    {formData.profilePic ? (
                      <img
                        src={URL.createObjectURL(formData.profilePic)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-neutral-500 dark:text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div> */}

              {/* Terms & Conditions */}
              <div>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    I accept the{" "}
                    <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.termsAccepted && <p className="mt-1 text-red-500 text-xs">{errors.termsAccepted}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-neutral-400 dark:disabled:bg-neutral-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:-translate-y-0.5 disabled:hover:translate-y-0 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-neutral-600 dark:text-neutral-400">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .bg-grid-neutral-200\\/30 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(212 212 212 / 0.3)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
        .dark .bg-grid-neutral-800\\/30 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(38 38 38 / 0.3)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
};

export default Register;