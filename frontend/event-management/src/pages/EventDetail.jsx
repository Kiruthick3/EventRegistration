import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth/AuthProvider";

export default function EventDetail() {
  const { id } = useParams();
  const [ev, setEv] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/events/${id}`).then(r => setEv(r.data));
  }, [id]);

    const onRegister = async () => {
    if (!user) {
        navigate("/login");
        return;
    }
    try {
        
        const resCheck = await api.get("/registrations/mine");
        const pending = resCheck.data.find(r => r.eventId._id === id && r.status === "PENDING_OTP");

        if (pending) {
        alert("You have a pending OTP verification.");
        navigate(`/verify-otp?reg=${pending._id}`);
        return;
        }

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
      <p className="mt-3">Venue: <strong>{ev.venue}</strong></p>
      <p>Starts: {new Date(ev.startsAt).toLocaleString()}</p>
      <p>Ends: {new Date(ev.endsAt).toLocaleString()}</p>
      <div className="mt-4">
        <button onClick={onRegister} className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-800 transition rounded cursor-pointer">Register</button>
      </div>
    </div>
  );
}
