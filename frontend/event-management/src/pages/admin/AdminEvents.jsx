import React, { useEffect, useState } from "react";
import api from "../../api";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState({ name: "", groupId: "", venue: "", startsAt: "", endsAt: "", capacity: 100 });

  useEffect(() => { load(); }, []);
  async function load() {
    const [evs, gs] = await Promise.all([api.get("/events"), api.get("/groups")]);
    setEvents(evs.data); setGroups(gs.data);
  }

  const create = async () => {
    await api.post("/events", form); setForm({ name: "", groupId: "", venue: "", startsAt: "", endsAt: "", capacity: 100 }); load();
  };

  const remove = async (id) => {
    if (!confirm("Delete event?")) return;
    await api.delete(`/events/${id}`); load();
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Events</h1>

      <div className="p-4 bg-white rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Event name" className="border px-3 py-2 rounded" />
          <select value={form.groupId} onChange={e=>setForm({...form,groupId:e.target.value})} className="border px-3 py-2 rounded cursor-pointer">
            <option value="">Select group</option>
            {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
          <input value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})} placeholder="Venue" className="border px-3 py-2 rounded" />
          <input type="datetime-local" value={form.startsAt} onChange={e=>setForm({...form,startsAt:e.target.value})} className="border px-3 py-2 rounded cursor-text" />
          <input type="datetime-local" value={form.endsAt} onChange={e=>setForm({...form,endsAt:e.target.value})} className="border px-3 py-2 rounded cursor-text" />
          <input type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:Number(e.target.value)})} className="border px-3 py-2 rounded" />
        </div>
        <div className="mt-3">
          <button onClick={create} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-800 transition cursor-pointer">Create Event</button>
        </div>
      </div>

      <div className="space-y-3">
        {events.map(ev => (
          <div key={ev._id} className="bg-white p-3 rounded shadow flex justify-between">
            <div>
              <div className="font-semibold">{ev.name}</div>
              <div className="text-sm text-gray-600">{ev.venue} | {new Date(ev.startsAt).toLocaleString()}</div>
            </div>
            <div><button onClick={()=>remove(ev._id)} className="px-3 py-1 border rounded hover:bg-red-600 hover:text-white transition cursor-pointer">Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
