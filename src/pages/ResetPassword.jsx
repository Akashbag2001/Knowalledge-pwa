import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useHttp from "../api/useHttp";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { sendRequest, loading } = useHttp();

    const [formData, setFormData] = useState({
        email: location.state?.email || "",

        newPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.newPassword) {
            toast.error("All fields are required");
            return;
        }

        try {
            const res = await sendRequest(
                "/user/verifyForgetPasswordOTP",
                "POST",
                {
                    email: formData.email,
                    newPassword: formData.newPassword,
                }
            );

            if (res?.success) {
                toast.success("✅ Password reset successful!");
                navigate("/login");
            } else {
                toast.error(res?.message || "❌ Failed to reset password");
            }
        } catch (err) {
            toast.error(err.message || "❌ Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950">
            <div className="bg-neutral-900 p-8 rounded-2xl w-full max-w-md shadow-lg">
                <h1 className="text-2xl font-bold text-center text-neutral-100 mb-6">
                    Reset Password
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-neutral-100">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100"
                            readOnly={!!location.state?.email}
                        />
                    </div>

                    {/* OTP */}


                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-neutral-100">
                            New Password *
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100"
                            placeholder="Enter new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
