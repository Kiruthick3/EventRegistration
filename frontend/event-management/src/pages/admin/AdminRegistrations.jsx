import React, { useEffect, useState } from "react";
import api from "../../api";

export default function AdminRegistrations() {
    const [events, setEvents] = useState([]);
    const [eventId, setEventId] = useState("");
    const [regs, setRegs] = useState([]);

    useEffect(()=> { api.get("/events").then(r=>setEvents(r.data)); }, []);

    const load = async () => {
        if (!eventId) return alert("Select event");
        const res = await api.get("/admin/registrations", { params: { eventId } });
        setRegs(res.data);
    };

    const removeRegistration = async (regId) => {
    try {
        if (!confirm("Remove this user from the event?")) return;

        console.log("Deleting registration ID:", regId); 

        if (!regId || regId.length !== 24) {
        alert("Invalid registration ID. Cannot delete.");
        return;
        }

        const response = await api.delete(`/admin/registrations/${regId}`);
        console.log("Delete response:", response.data);

        load();
    } catch (error) {
        console.error("Error deleting registration:", error);
        alert(
        error.response?.data?.message || "Failed to delete registration"
        );
    }
    };

    // Add function to manually add a user
    const [userEmail, setUserEmail] = useState("");
    const addUserToEvent = async () => {
    if (!eventId || !userEmail) return alert("Select event and enter user email");
    try {
        const userRes = await api.get("/admin/users"); 
        const user = userRes.data.find(u => u.email === userEmail);
        if (!user) return alert("User not found");
        await api.post("/admin/registrations/add", { eventId, userId: user._id });
        setUserEmail("");
        load();
    } catch (err) {
        alert(err.response?.data?.message || "Failed to add user");
    }
    };

    const downloadCsv = async () => {
    if (!eventId) return alert("Select event");

    try {
        const res = await api.get("/admin/registrations/export", {
        params: { eventId },
        responseType: "blob" 
        });

        // create a temporary link to download the file
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `registrations-${eventId}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Export failed");
    }
    };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Registrations</h1>
      <div className="p-1 flex gap-2 mb-4">
        <select value={eventId} onChange={e=>setEventId(e.target.value)} className="border px-3 py-2 rounded cursor-pointer">
          <option value="">Select event</option>
          {events.map(ev=> <option key={ev._id} value={ev._id}>{ev.name}</option>)}
        </select>
        <button onClick={load} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-800 transition cursor-pointer">Load</button>
        <button onClick={downloadCsv} className="px-3 py-2 border rounded hover:bg-indigo-800 hover:text-white transition cursor-pointer">Export CSV</button>
      </div>

        <div className="p-1 flex gap-2 mb-4">
        <input
            placeholder="User email to add"
            value={userEmail}
            onChange={e => setUserEmail(e.target.value)}
            className="border px-2 py-1 rounded"
        />
        <button onClick={addUserToEvent} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer">Add User</button>
        </div>

      <div className="space-y-2">
        {regs.map(r => (
          <div key={r._id} className="bg-white p-3 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="font-semibold">{r.userId?.name} ({r.ticketId})</div>
              <div className="text-sm text-gray-600">{r.userId?.email} | {r.userId?.bloodGroup}</div>
            </div>
            <div className="flex gap-2 items-center">
                <div className="text-sm">{r.status}</div>
                <button onClick={() => removeRegistration(r._id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
