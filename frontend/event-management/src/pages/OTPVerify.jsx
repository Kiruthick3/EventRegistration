import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api";

export default function OTPVerify() {
  const [searchParams] = useSearchParams();
  const regId = searchParams.get("reg");
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/registrations/verify-otp", { registrationId: regId, otp: data.otp });
      alert("Confirmed! ID card emailed.");
      navigate("/tickets");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  const resendOtp = async () => {
        try {
            await api.post("/registrations/resend-otp", { registrationId: regId });
            alert("OTP resent to your email.");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to resend OTP");
        }
    };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">OTP Verification</h2>
      <p className="text-sm text-gray-600 mb-3">Enter the OTP sent to your email for registration (registration id: {regId})</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register("otp")} placeholder="6-digit OTP" className="w-full px-3 py-2 border rounded" />
        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-800 transition cursor-pointer">Verify OTP</button>
        <button type="button" onClick={resendOtp} className="w-full px-4 py-2 bg-gray-500 text-white rounded mt-2 hover:bg-gray-600 transition cursor-pointer">Resend OTP</button>
      </form>
    </div>
  );
}
