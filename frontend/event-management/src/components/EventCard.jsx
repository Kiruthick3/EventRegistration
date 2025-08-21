import React from "react";
import { Link } from "react-router-dom";

export default function EventCard({ ev }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold">{ev.name}</h3>
      <p className="text-sm text-gray-600">{ev.description}</p>
      <p className="text-xs text-gray-500 mt-2">Venue: {ev.venue}</p>
      <p className="text-xs text-gray-500">Starts: {new Date(ev.startsAt).toLocaleString()}</p>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm font-medium">{ev.capacity} seats</span>
        <Link to={`/events/${ev._id}`} className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-800 transition">View</Link>
      </div>
    </div>
  );
}
