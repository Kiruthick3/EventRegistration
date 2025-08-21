import React, { useEffect, useState } from "react";
import api from "../api";
import EventCard from "../components/EventCard";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    loadGroups();
    loadEvents();
  }, []);

  async function loadGroups() {
    const res = await api.get("/groups");
    setGroups(res.data);
  }

  async function loadEvents(gid) {
    const res = await api.get("/events", { params: gid ? { groupId: gid } : {} });
    setEvents(res.data);
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="bg-indigo-500  flex items-center justify-between mb-6">
        <h1 className="text-2xl text-white font-semibold">Events</h1>
        <select value={groupId} onChange={(e) => { setGroupId(e.target.value); loadEvents(e.target.value); }} className="border text-rose-500 px-3 py-1 rounded cursor-pointer">
          <option value="">All groups</option>
          {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map(ev => <EventCard key={ev._id} ev={ev} />)}
      </div>
    </div>
  );
}
