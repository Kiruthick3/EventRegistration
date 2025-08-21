import React from "react";
import { useForm } from "react-hook-form";
import api from "../api";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);

      login(res.data.token, res.data.user);

      // Redirect based on role
      if (res.data.user.role === "ADMIN") {
        navigate("/admin");   // admin dashboard
      } else {
        navigate("/events");  // normal users
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 border rounded"
        />
        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-800 transition cursor-pointer">
          Login
        </button>
      </form>
    </div>
  );
}
