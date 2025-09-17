import React, { useEffect, useState } from "react";
import api from "../api";

export default function MyProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    bloodGroup: "O+",
    password: ""
  });
  const [loading, setLoading] = useState(true);


  const loadProfile = async () => {
    try {
      const res = await api.get("/profile");
      setForm({
        name: res.data.name,
        email: res.data.email,
        bloodGroup: res.data.bloodGroup || "O+",
        password: ""
      });
      setLoading(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load profile");
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);


  const updateProfile = async () => {
    try {
      await api.put("/profile", {
        name: form.name,
        bloodGroup: form.bloodGroup,
        password: form.password || undefined
      });
      alert("Profile updated successfully");
      loadProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <div className="space-y-3 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email (cannot change)</label>
          <input
            value={form.email}
            disabled
            className="border px-3 py-2 rounded w-full bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Blood Group</label>
          <select
            value={form.bloodGroup}
            onChange={e => setForm({...form, bloodGroup: e.target.value})}
            className="border px-3 py-2 rounded w-full cursor-pointer"
          >
            <option>O+</option><option>O-</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password (leave blank to keep same)</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={updateProfile}
          className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Update Profile
        </button>
        <button
          onClick={loadProfile}
          className="px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
