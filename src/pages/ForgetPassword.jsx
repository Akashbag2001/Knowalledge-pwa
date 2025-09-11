import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useHttp from "../api/useHttp";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const { sendRequest, loading } = useHttp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // Step 1: Send OTP (email only)
  const handleSendOtp = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    try {
      const res = await sendRequest("/user/forgetPassword", "POST", { email });
      if (res.success) {
        toast.success("✅ OTP sent to your email");
        setOtpSent(true);
      } else {
        toast.error(res.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.message || "Error sending OTP");
    }
  };

  // Step 2: Verify OTP (email + otp)
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }
    try {
      const res = await sendRequest("/user/forgetPassword", "POST", {
        email,
        otp,
      });
      if (res.success) {
        toast.success("✅ OTP verified, set new password");
        // 👉 pass email to ResetPassword page
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error(res.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err.message || "Error verifying OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="bg-neutral-900 p-8 rounded-2xl w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold text-center text-neutral-100 mb-6">
          Forgot Password
        </h1>

        {!otpSent ? (
          <>
            <label className="block text-sm font-semibold mb-2 text-neutral-100">
              Enter your email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 mb-4"
              placeholder="Enter your registered email"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <label className="block text-sm font-semibold mb-2 text-neutral-100">
              Enter OTP *
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-4 border rounded-xl bg-neutral-800 text-neutral-100 mb-4"
              placeholder="6-digit OTP"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
