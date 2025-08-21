import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import OTPVerify from "./pages/OTPVerify";
import Tickets from "./pages/Tickets";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminGroups from "./pages/admin/AdminGroups";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminScan from "./pages/admin/AdminScan";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/verify-otp" element={<OTPVerify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tickets" element={<PrivateRoute><Tickets /></PrivateRoute>} />

        <Route path="/admin" element={<PrivateRoute roles={["ADMIN"]}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute roles={["ADMIN"]}><AdminUsers /></PrivateRoute>} />
        <Route path="/admin/groups" element={<PrivateRoute roles={["ADMIN"]}><AdminGroups /></PrivateRoute>} />
        <Route path="/admin/events" element={<PrivateRoute roles={["ADMIN"]}><AdminEvents /></PrivateRoute>} />
        <Route path="/admin/registrations" element={<PrivateRoute roles={["ADMIN"]}><AdminRegistrations /></PrivateRoute>} />
        <Route path="/admin/scan" element={<PrivateRoute roles={["ADMIN"]}><AdminScan /></PrivateRoute>} />
      </Routes>
    </>
  );
}
