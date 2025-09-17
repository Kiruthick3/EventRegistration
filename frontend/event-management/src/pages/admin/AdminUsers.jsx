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
  const [editingId, setEditingId] = useState(null);

  const loadUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  const createUser = async () => {
    try {
      await api.post("/admin/users", form);
      resetForm();
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  const updateUser = async () => {
    try {
      await api.put(`/admin/users/${editingId}`, form);
      resetForm();
      setEditingId(null);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating user");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete user?")) return;
    await api.delete(`/admin/users/${id}`);
    loadUsers();
  };

  const editUser = (u) => {
    setEditingId(u._id);
    setForm({
      name: u.name,
      email: u.email, // email shown but locked
      password: "",
      role: u.role,
      bloodGroup: u.bloodGroup
    });
  };

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", role: "USER", bloodGroup: "O+" });
  };

  useEffect(() => { loadUsers(); }, []);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>

      {/* Add / Edit User form */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 space-y-2">
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({...form, name:e.target.value})}
          className="border px-3 py-2 rounded w-full sm:w-auto"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({...form, email:e.target.value})}
          disabled={!!editingId} // disable when editing
          className="border px-3 py-2 rounded w-full sm:w-auto bg-gray-100"
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({...form, password:e.target.value})}
          className="border px-3 py-2 rounded w-full sm:w-auto"
        />
        <select
          value={form.role}
          onChange={e=>setForm({...form,role:e.target.value})}
          className="border px-3 py-2 rounded w-full sm:w-auto cursor-pointer"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <select
          value={form.bloodGroup}
          onChange={e=>setForm({...form,bloodGroup:e.target.value})}
          className="border px-3 py-2 rounded w-full sm:w-auto cursor-pointer"
        >
          <option>O+</option>
          <option>O-</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
        </select>
      </div>

      <div className="p-4 py-1 flex gap-2">
        {editingId ? (
          <>
            <button
              onClick={updateUser}
              className="px-5 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer"
            >
              Update
            </button>
            <button
              onClick={() => { resetForm(); setEditingId(null); }}
              className="px-5 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={createUser}
            className="px-5 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition cursor-pointer"
          >
            Add
          </button>
        )}
      </div>
      
      {/* Users list */}
      <div className="space-y-3 p-4">
        {users.map(u => (
          <div
            key={u._id}
            className="bg-white p-3 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <div className="font-semibold">{u.name} ({u.role})</div>
              <div className="text-sm text-gray-600">{u.email} | {u.bloodGroup}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => editUser(u)}
                className="px-3 py-1 border bg-yellow-500 text-white rounded hover:bg-yellow-600  transition cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={()=>deleteUser(u._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
