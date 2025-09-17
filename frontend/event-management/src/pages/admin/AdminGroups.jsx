import React, { useEffect, useState } from "react";
import api from "../../api";

export default function AdminGroups() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null); // track editing group

  useEffect(() => { load(); }, []);
  const load = async () => {
    const res = await api.get("/groups");
    setGroups(res.data);
  };

  const create = async () => {
    if (!name) return alert("Name required");
    await api.post("/groups", { name });
    setName(""); 
    load();
  };

  const update = async (id) => {
    if (!name) return alert("Name required");
    await api.put(`/groups/${id}`, { name });
    setEditingId(null);
    setName("");
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete group?")) return;
    await api.delete(`/groups/${id}`);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Event Groups</h1>
      
      {/* Create / Edit form */}
      <div className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Group name"
          className="border px-3 py-2 rounded flex-1"
        />
        {editingId ? (
          <>
            <button 
              onClick={() => update(editingId)} 
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer"
            >
              Update
            </button>
            <button 
              onClick={() => { setEditingId(null); setName(""); }} 
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
            >
              Cancel
            </button>
          </>
        ) : (
          <button 
            onClick={create} 
            className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-800 transition cursor-pointer"
          >
            Create
          </button>
        )}
      </div>

      {/* Group list */}
      <div className="space-y-2">
        {groups.map(g => (
          <div key={g._id} className="p-3 bg-white rounded shadow flex justify-between items-center">
            <div>{g.name}</div>
            <div className="flex gap-2">
              <button 
                onClick={() => { setEditingId(g._id); setName(g.name); }} 
                className="px-2 py-1 border rounded hover:bg-yellow-500 hover:text-white transition cursor-pointer"
              >
                Edit
              </button>
              <button 
                onClick={() => remove(g._id)} 
                className="px-2 py-1 border rounded hover:bg-red-600 hover:text-white transition cursor-pointer"
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
