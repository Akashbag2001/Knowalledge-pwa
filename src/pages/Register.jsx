import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useHttp from "../api/useHttp";
import useEmailVerification from "../utils/Authentication/useEmailVerification";
import { toast } from "react-toastify";
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
    countryShortName: "",
    state: "",
    city: "",
    schoolName: "",
    termsAccepted: false,
    newSchoolName: "",

    dateOfBirth: ""
  });

  const [errors, setErrors] = useState({});
  // states
  const [showPassword, setShowPassword] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);


  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [countryDetails, setCountryDetails] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isverified, setIsverified] = useState(false)
  const { sendEmailOtp, verifyEmailOtp, otpSent, isVerified } = useEmailVerification();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { sendRequest, loading } = useHttp();
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [dobRaw, setDobRaw] = useState("");

  // ✅ Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await sendRequest("/locations/countries");
        setCountryDetails(response.countries || []);
      } catch (error) {
        console.error("Failed to load countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // ✅ Handle country change → fetch states
  const handleCountryChange = async (e) => {
    const shortName = e.target.value;
    const selectedCountry = countryDetails.find((c) => c.shortName === shortName);

    setFormData((prev) => ({
      ...prev,
      country: selectedCountry?.name || "",
      countryShortName: selectedCountry?.shortName || "",
      state: "",
      city: "",
    }));
    setStates([]);
    setCities([]);

    if (shortName) {
      try {
        const res = await sendRequest(`/locations/states/${shortName}`);
        setStates(res.states || []);
      } catch (error) {
        console.error("Failed to load states:", error);
      }
    }
  };

  // ✅ Handle state change → fetch cities
  const handleStateChange = async (e) => {
    const stateName = e.target.value;

    setFormData((prev) => ({
      ...prev,
      state: stateName,
      city: "",
    }));
    setCities([]);

    if (formData.countryShortName && stateName) {
      try {
        const res = await sendRequest(
          `/locations/cities/${formData.countryShortName}/${stateName}`
        );
        setCities(res.cities || []);
      } catch (error) {
        console.error("Failed to load cities:", error);
      }
    }
  };

  const handleCityChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      city: e.target.value,
    }));
  };

  // ✅ Generic input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.mobile?.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (userType === "student" && !formData.schoolName?.trim()) {
      newErrors.schoolName = "School name is required";
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "Please accept terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate the form
    // if (!validateForm()) return;

    // if (!isverified) {
    //   toast.error("❌ Please verify your email before registering.");
    //   return;
    // }

    // if (!isFormValid()) {
    //   toast.error("❌ Please fill all required fields correctly.");
    //   return;
    // }

    try {
      const requestData = {
        name: formData.name,
        mobileNumber: formData.countryCode + formData.mobile,
        email: formData.email,
        gender: formData.gender,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        schoolName: formData.schoolName === "Others" ? "Others" : formData.schoolName,
        newSchoolName: formData.schoolName === "Others" ? formData.newSchoolName : "",

      };

      const data = await sendRequest("/user/signup", "POST", requestData);

      if (data) {
        toast.success("Registration successful!", {

        });
        // login({
        //   email: data.email || formData.email,
        //   name: data.name || formData.name,
        //   role: "user",
        //   token: data.token,
        // });
        navigate("/login");
      }
    } catch (err) {
      setErrors({ submit: err.message || "Registration failed" });
      toast.error("Registration failed!", {

      })
    }
  };



  const fetchSchools = async () => {
    try {
      const data = await sendRequest("/school/getSchool", "GET");
      setSchools(data?.schools || []);
    } catch (err) {
      console.error("Failed to fetch schools:", err.message);
    }
  };


const handleSendOtp = async () => {
  if (!formData.email) {
    toast.error("Email is required");
    return;
  }

  try {
    setLoadingOtp(true);
    const res = await sendRequest(
      `/user/verifyemail?email=${formData.email}`,
      "POST"
    );

    if (res?.success) {
      toast.success("✅ OTP sent to your email!");
      setIsVerifying(true); // open OTP input
    } else {
      toast.error("❌ Failed to send OTP");
    }
  } catch (err) {
    toast.error(err.message || "❌ Something went wrong");
  } finally {
    setLoadingOtp(false);
  }
};



 const handleConfirmOtp = async () => {
  if (!formData.email || otp.length !== 6) {
    toast.error("Please enter a valid OTP");
    return;
  }

  try {
    const res = await sendRequest(
      `/user/verifyemail?email=${formData.email}&otp=${otp}`,
      "POST"
    );

    if (res?.success) {
      toast.success("✅ Email verified successfully!");
      setIsverified(true);
      setIsVerifying(false);
    } else {
      toast.error("❌ Invalid OTP, please try again.");
    }
  } catch (err) {
    toast.error(err.message || "❌ Verification failed");
  }
};


  const handleVerifyEmail = () => {
    if (!formData.email) {
      alert("Please enter an email first.");
      return;
    }
    // 🔑 Call your backend API here to send OTP
    console.log("Sending OTP to:", formData.email);

  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // only digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const isFormValid = () => {
    return (
      formData.name?.trim() !== "" &&
      formData.email?.trim() !== "" &&
      isverified && // ✅ email must be verified
      formData.password?.trim() !== "" &&
      formData.confirmPassword?.trim() !== "" &&
      formData.countryShortName?.trim() !== "" &&
      formData.state?.trim() !== "" &&
      formData.city?.trim() !== "" &&
      (userType === "other" || formData.schoolName?.trim() !== "") && // School name only for student
      formData.termsAccepted
    );
  };


  useEffect(() => {
    setFormData((prev) => ({
      name: "",
      mobile: "",
      countryCode: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      confirmPassword: "",
      countryShortName: "", // keep only this
      state: "",
      city: "",
      schoolName: "",
      dateOfBirth: "",
      termsAccepted: false,
    }));
    setStates([]);
    setCities([]);
    setIsVerifying(false);
    setIsverified(false);
    setOtp("");

    if (userType === "student") {
      fetchSchools();
    }
  }, [userType]);




  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-900/30 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-900/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-emerald-900/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-neutral-100 mb-2">
              Join Knowalledge Platform
            </h1>
            <p className="text-neutral-400">
              Create your account and start your learning journey
            </p>
          </div>

          {/* User Type Selector */}
          <div className="mb-8">
            <div className="flex bg-neutral-800 rounded-2xl p-1">
              <button
                type="button"
                onClick={() => setUserType("student")}
                className={`flex-1 py-3 cursor-pointer px-6 rounded-xl font-semibold transition-all duration-300 ${userType === "student"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-neutral-400 hover:text-neutral-200"
                  }`}
              >
                School Student
              </button>
              <button
                type="button"
                onClick={() => setUserType("other")}
                className={`flex-1 py-3 cursor-pointer px-6 rounded-xl font-semibold transition-all duration-300 ${userType === "other"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-neutral-400 hover:text-neutral-200"
                  }`}
              >
                Others
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-neutral-900 backdrop-blur-xl rounded-2xl shadow-lg border border-neutral-800 p-8">
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-xl">
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            <form className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name ? "border-red-500" : "border-neutral-700"
                    }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-red-500 text-xs">{errors.name}</p>}
              </div>
              {/* Gender Dropdown */}
              <div>
                <label className="block text-sm font-semibold mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.gender ? "border-red-500" : "border-neutral-700"}`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
                {errors.gender && <p className="mt-1 text-red-500 text-xs">{errors.gender}</p>}
              </div>
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={dobRaw} // keep YYYY-MM-DD for input
                  onChange={(e) => {
                    const rawValue = e.target.value; // YYYY-MM-DD
                    setDobRaw(rawValue);

                    // Convert to JS Date object (backend-friendly)
                    const [year, month, day] = rawValue.split("-");
                    const dobDate = new Date(year, month - 1, day); // JS Date: month is 0-indexed

                    setFormData((prev) => ({
                      ...prev,
                      dateOfBirth: dobDate, // send Date object to backend
                    }));

                    // Clear any previous errors
                    if (errors.dateOfBirth) setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
                  }}
                  className={`w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.dateOfBirth ? "border-red-500" : "border-neutral-700"
                    }`}
                />
                {errors.dateOfBirth && <p className="mt-1 text-red-500 text-xs">{errors.dateOfBirth}</p>}
              </div>



              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-semibold mb-2">Mobile Number</label>
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, countryCode: e.target.value }))
                    }
                    className="w-full lg:w-1/3 px-3 cursor-pointer py-4 border border-r-0 rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none bg-neutral-800 text-neutral-100 border-neutral-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    {countryDetails.map(({ shortName, name, phone }) => (
                      <option key={shortName} value={`+${phone}`}>
                        {name} (+{phone})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full lg:w-2/3 p-4 border rounded-b-xl lg:rounded-r-xl lg:rounded-bl-none bg-neutral-800 text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.mobile ? "border-red-500" : "border-neutral-700"
                      }`}
                    placeholder="Enter mobile number"
                  />
                </div>
                {errors.mobile && <p className="mt-1 text-red-500 text-xs">{errors.mobile}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2">Email Address *</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email ? "border-red-500" : "border-neutral-700"
                      }`}
                    placeholder="Enter email address"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loadingOtp}
                    className="w-1/4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {loadingOtp ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>
                {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email}</p>}
              </div>

              {isVerifying && !isverified && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-2">Enter 6-digit Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength={6}
                    className="w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 text-center tracking-widest 
      focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="______"
                  />

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await verifyEmailOtp(formData.email, otp);
                        toast.success("✅ Email verified successfully!");
                        setIsverified(true)
                      } catch {
                        toast.error("❌ Invalid OTP, please try again.");
                      }
                    }}
                    disabled={otp.length !== 6 || loading}
                    className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 
      disabled:opacity-50 text-white font-semibold rounded-xl cursor-pointer transition-all duration-300"
                  >
                    {loading ? "Verifying..." : "Confirm OTP"}
                  </button>
                </div>
              )}


              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="relative">
                  <label className="block text-sm font-semibold mb-2">Password *</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.password ? "border-red-500" : "border-neutral-700"
                      }`}
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute cursor-pointer inset-y-0 right-4 top-9 flex items-center text-xl"
                  >
                    {showPassword ? "🙈" : "🙉"}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="block text-sm font-semibold mb-2">Confirm Password *</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.confirmPassword ? "border-red-500" : "border-neutral-700"
                      }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute cursor-pointer inset-y-0 right-4 top-9 flex items-center text-xl"
                  >
                    {showConfirmPassword ? "🙈" : "🙉"}
                  </button>
                </div>
              </div>


              {/* Country Dropdown */}
              <div>
                <label className="block text-sm font-semibold mb-2">Country *</label>
                <select
                  name="country"
                  value={formData.countryShortName}
                  onChange={handleCountryChange}
                  className={`w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 ${errors.country ? "border-red-500" : "border-neutral-700"
                    }`}
                >
                  <option value="">Select Country</option>
                  {countryDetails.map(({ shortName, name }) => (
                    <option key={shortName} value={shortName}>
                      {name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-red-500 text-xs">{errors.country}</p>
                )}
              </div>

              {/* State Dropdown */}
              <div>
                <label className="block text-sm font-semibold mb-2">State *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleStateChange}
                  disabled={!formData.countryShortName}
                  className={`w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 disabled:opacity-50 ${errors.state ? "border-red-500" : "border-neutral-700"
                    }`}
                >
                  <option value="">Select State</option>
                  {states.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-red-500 text-xs">{errors.state}</p>
                )}
              </div>

              {/* City Dropdown */}
              <div>
                <label className="block text-sm font-semibold mb-2">City *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleCityChange}
                  disabled={!formData.state}
                  className={`w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 disabled:opacity-50 ${errors.city ? "border-red-500" : "border-neutral-700"
                    }`}
                >
                  <option value="">Select City</option>
                  {cities.map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1 text-red-500 text-xs">{errors.city}</p>
                )}
              </div>
              {/* School Name (Only for Student) */}
              {userType === "student" && (
                <div>
                  <label className="block text-sm font-semibold mb-2">School Name *</label>
                  <select
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        schoolName: value,
                        newSchoolName: value === "Others" ? "" : prev.newSchoolName || "",
                      }));
                    }}
                    disabled={loadingSchools || schools.length === 0}
                    className={`w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 
      ${errors.schoolName ? "border-red-500" : "border-neutral-700"}`}
                  >
                    <option value="">
                      {loadingSchools ? "Loading schools..." : "Select your school"}
                    </option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.name}>
                        {school.name}
                      </option>
                    ))}
                    <option value="Others">Others</option>
                  </select>

                  {/* Show input only if "Others" is selected */}
                  {formData.schoolName === "Others" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        name="newSchoolName"
                        value={formData.newSchoolName || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            newSchoolName: e.target.value,
                            schoolName: "Others",
                          }))
                        }
                        placeholder="Enter your school name"
                        className="w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  )}

                  {errors.schoolName && (
                    <p className="mt-1 text-red-500 text-xs">{errors.schoolName}</p>
                  )}
                </div>
              )}



              {/* Terms */}
              <div>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-blue-600 border-neutral-700 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-neutral-400">
                    I accept the{" "}
                    <a href="#" className="text-blue-400 hover:underline">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-400 hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="mt-1 text-red-500 text-xs">{errors.termsAccepted}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                onClick={handleSubmit}
                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent cursor-pointer" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register</span>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-neutral-400">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-400 hover:underline font-semibold"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
