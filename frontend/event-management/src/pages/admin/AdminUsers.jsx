import React, { useEffect, useState } from "react";
import api from "../../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    bloodGroup: "O+"
  });

  const loadUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  const createUser = async () => {
    try {
      await api.post("/admin/users", form);
      setForm({ name: "", email: "", password: "", role: "USER", bloodGroup: "O+" });
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete user?")) return;
    await api.delete(`/admin/users/${id}`);
    loadUsers();
  };

  useEffect(() => { loadUsers(); }, []);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>

      {/* Add user form */}
      <div className="mb-6 flex gap-2 sm:flex-row sm:flex-wrap gap-2">
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} className="border px-2 py-1 rounded w-full sm:w-auto" />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} className="border px-2 py-1 rounded w-full sm:w-auto" />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} className="border px-2 py-1 rounded w-full sm:w-auto" />
        <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="border px-2 py-1 rounded w-full sm:w-auto w-full sm:w-auto cursor-pointer">
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <select value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})} className="border px-2 py-1 rounded w-full sm:w-auto cursor-pointer">
          <option>O+</option>
          <option>O-</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
        </select>
        <button onClick={createUser} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition cursor-pointer">Add</button>
      </div>

      {/* Users list */}
      <div className="space-y-2">
        {users.map(u => (
          <div key={u._id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{u.name} ({u.role})</div>
              <div className="text-sm text-gray-600">{u.email} | {u.bloodGroup}</div>
            </div>
            <button onClick={()=>deleteUser(u._id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
