import React, { useEffect, useState } from "react";
import api from "../../api";

export default function AdminGroups() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => { load(); }, []);
  const load = async () => {
    const res = await api.get("/groups"); setGroups(res.data);
  };

  const create = async () => {
    if (!name) return alert("Name required");
    await api.post("/groups", { name });
    setName(""); load();
  };

  const remove = async (id) => {
    if (!confirm("Delete group?")) return;
    await api.delete(`/groups/${id}`); load();
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Event Groups</h1>
      <div className="mb-4 flex gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Group name" className="border px-3 py-2 rounded flex-1" />
        <button onClick={create} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-800 transition cursor-pointer">Create</button>
      </div>
      <div className="space-y-2">
        {groups.map(g => (
          <div key={g._id} className="p-3 bg-white rounded shadow flex justify-between">
            <div>{g.name}</div>
            <div><button onClick={()=>remove(g._id)} className="px-2 py-1 border rounded hover:bg-red-600 hover:text-white transition cursor-pointer">Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
