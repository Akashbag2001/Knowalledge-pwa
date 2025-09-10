import { useState } from "react";
import useHttp from "../../api/useHttp";


export default function useEmailVerification() {
  const { sendRequest, loading } = useHttp();
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Step 1: Send OTP
  const sendEmailOtp = async (email) => {
    try {
      const response = await sendRequest(
        `/user/verifyemail?email=${encodeURIComponent(email)}`,
        "POST"
      );
      console.log("OTP Sent:", response);
      setOtpSent(true);
      return response;
    } catch (error) {
      console.error("Failed to send OTP:", error.message);
      setOtpSent(false);
      throw error;
    }
  };

  // Step 2: Verify OTP
  const verifyEmailOtp = async (email, otp) => {
    try {
      const response = await sendRequest(
        `/user/verifyemail?email=${encodeURIComponent(email)}&otp=${otp}`,
        "POST"
      );
      console.log("OTP Verified:", response);
      setIsVerified(true);
      return response;
    } catch (error) {
      console.error("OTP Verification Failed:", error.message);
      setIsVerified(false);
      throw error;
    }
  };

  return { sendEmailOtp, verifyEmailOtp, otpSent, isVerified, loading };
}
