import React from "react";
import { Link } from "react-router-dom";

export default function EventCard({ ev }) {
  const startDate = new Date(ev.startsAt);
  const endDate = new Date(ev.endsAt);
  const now = new Date();

  const isPast = now > endDate; 

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold">{ev.name}</h3>
      <p className="text-sm text-gray-600">{ev.description}</p>

      <p className="text-xs text-gray-500 mt-2">Venue: {ev.venue}</p>
      <p className="text-xs text-gray-500"> Starts: {startDate.toLocaleString()}</p>
      <p className="text-xs text-gray-500"> Ends: {endDate.toLocaleString()}</p>
      <p className="text-xs text-gray-500">Event cost: {(ev.isFree?? true) ? "Free" : `₹${ev.cost ?? 0}`}</p>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm font-medium">{ev.capacity} seats</span>

        {isPast ? (
          <span className="text-sm px-3 py-1 bg-gray-400 text-white rounded">
            Event Ended
          </span>
        ) : (
          <Link
            to={`/events/${ev._id}`}
            className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-800 transition"
          >
            View
          </Link>
        )}
      </div>
    </div>
  );
}
