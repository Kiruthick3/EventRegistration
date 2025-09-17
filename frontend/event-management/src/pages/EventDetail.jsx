import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth/AuthProvider";

export default function EventDetail() {
  const { id } = useParams();
  const [ev, setEv] = useState(null);
  const [registrationsCount, setRegistrationsCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch event details
        const resEvent = await api.get(`/events/${id}`);
        setEv(resEvent.data);

        // Fetch global confirmed registrations count
        const resCount = await api.get(`/registrations/count/${id}`);
        setRegistrationsCount(resCount.data.count);
      } catch (err) {
        console.error("Error loading event details:", err);
      }
    };
    load();
  }, [id]);

  const seatsLeft = ev ? ev.capacity - registrationsCount : 0;

  const onRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (seatsLeft === 0) return; // extra safety

    try {
      // Check if user already has pending OTP registration
      const resCheck = await api.get("/registrations/mine");
      const pending = resCheck.data.find(
        (r) => r.eventId._id === id && r.status === "PENDING_OTP"
      );

      if (pending) {
        alert("You have a pending OTP verification.");
        navigate(`/verify-otp?reg=${pending._id}`);
        return;
      }

      // Create new registration
      const res = await api.post("/registrations", { eventId: id });
      const registrationId = res.data.registrationId;
      alert("OTP sent to your email. Go to OTP verification.");
      navigate(`/verify-otp?reg=${registrationId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  if (!ev) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-semibold">{ev.name}</h2>
      <p className="text-gray-600 mt-2">{ev.description}</p>
      <p className="mt-3">
        Venue: <strong>{ev.venue}</strong>
      </p>
      <p>Starts: {new Date(ev.startsAt).toLocaleString()}</p>
      <p>Ends: {new Date(ev.endsAt).toLocaleString()}</p>
      <p>
        Event cost: {ev.isFree ?? true ? "Free" : `₹${ev.cost ?? 0}`}
      </p>
      <div className="mt-4 flex justify-between items-center">
        <span className="font-semibold">
          {seatsLeft > 0 ? `${seatsLeft} seats left` : "No seats left"}
        </span>
        <button
          onClick={onRegister}
          disabled={seatsLeft === 0}
          className={`px-4 py-2 rounded transition ${
            seatsLeft === 0
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-indigo-600 hover:bg-indigo-800 text-white"
          }`}
        >
          Register
        </button>
      </div>
    </div>
  );
}
