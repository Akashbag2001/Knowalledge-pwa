import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useHttp from "../api/useHttp"; // your custom hook
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { sendRequest, loading } = useHttp();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear error for this field
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (!formData.password?.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = await sendRequest("/user/signin", "POST", formData);
      toast.success("✅ Login successful!");

      // store user info or token if needed
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/dashboard"); // redirect after login
    } catch (err) {
      toast.error(err.message || "❌ Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="bg-neutral-900 p-8 rounded-2xl w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold text-center text-neutral-100 mb-6">Login</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-neutral-100">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-neutral-700"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-neutral-100">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password ? "border-red-500" : "border-neutral-700"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="mt-1 text-red-500 text-xs">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-neutral-400">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-400 hover:underline font-semibold"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
