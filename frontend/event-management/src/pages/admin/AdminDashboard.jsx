import React, { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    Promise.all([
      api.get("/admin/registrations").then(r => r.data.length).catch(()=>0),
      api.get("/events").then(r => r.data.length).catch(()=>0),
    ]).then(([regCount, eventsCount]) => setStats({ regCount, eventsCount }));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-semibold text-center mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total Registrations</div>
          <div className="text-2xl font-bold">{stats.regCount ?? "-"}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total Events</div>
          <div className="text-2xl font-bold">{stats.eventsCount ?? "-"}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Quick Links</div>
          <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap gap-2">
            <Link to="/admin/groups" className="px-3 py-1 bg-indigo-600 text-white text-center rounded hover:bg-indigo-700 transition-colors duration-200">Groups</Link>
            <Link to="/admin/events" className="px-3 py-1 bg-indigo-600 text-white text-center rounded hover:bg-indigo-700 transition-colors duration-200">Events</Link>
            <Link to="/admin/registrations" className="px-3 py-1 bg-indigo-600 text-white text-center rounded hover:bg-indigo-700 transition-colors duration-200">Registrations</Link>
            <Link to="/admin/scan" className="px-3 py-1 bg-indigo-600 text-white text-center rounded hover:bg-indigo-700 transition-colors duration-200">Scan</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
