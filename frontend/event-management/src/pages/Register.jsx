import React from "react";
import { useForm } from "react-hook-form";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/register", data);
      alert("Registered. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register("name")} placeholder="Full name" className="w-full px-3 py-2 border rounded" />
        <input {...register("email")} placeholder="Email" className="w-full px-3 py-2 border rounded" />
        <input {...register("password")} type="password" placeholder="Password" className="w-full px-3 py-2 border rounded" />
        <select {...register("bloodGroup")} className="w-full px-3 py-2 border rounded cursor-pointer">
          <option value="">Select blood group</option>
          <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
          <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
        </select>
        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-800 transition cursor-pointer">Register</button>
      </form>
    </div>
  );
}
