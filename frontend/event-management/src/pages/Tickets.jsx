import React, { useEffect, useState } from "react";
import api from "../api";

export default function Tickets() {
  const [regs, setRegs] = useState([]);

  useEffect(() => {
    api.get("/registrations/mine").then(r => setRegs(r.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">My Registrations</h1>
      <div className="space-y-4">
        {regs.map(r => (
          <div key={r._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{r.eventId?.name}</div>
              <div className="text-sm text-gray-600">Ticket: {r.ticketId || "Pending"}</div>
              <div className="text-sm text-gray-600">Status: {r.status}</div>
            </div>
            <div>
              {r.idCardPath && <a className="px-3 py-1 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-800 transition" href={r.idCardPath} target="_blank" rel="noreferrer">Download ID</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
