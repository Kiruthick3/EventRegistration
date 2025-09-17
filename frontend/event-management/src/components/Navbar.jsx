import React from "react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className={`text-xl font-semibold ${isActive("/") ? "text-blue-600" : "text-indigo-600"}`}>EventReg</Link>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/events" className={`text-sm transition hover:text-indigo-600 ${isActive("/events") ? "text-blue-600 font-semibold" : ""}`}>Events</Link>
          {user && <Link to="/tickets" className={`text-sm transition hover:text-indigo-600 ${isActive("/tickets") ? "text-blue-600 font-semibold" : ""}`}>My Tickets</Link>}
          {user?.role === "ADMIN" && <Link to="/admin"  className={`text-sm transition hover:text-indigo-600 ${isActive("/admin") ? "text-blue-600 font-semibold" : ""}`}>Admin</Link>}
          {user?.role === "ADMIN" && <Link to="/admin/users"  className={`text-sm transition hover:text-indigo-600 ${isActive("/admin/users") ? "text-blue-600 font-semibold" : ""}`}>Users</Link>}
          {user && (<Link to="/my-profile" className={`text-sm transition hover:text-indigo-600 ${isActive("/my-profile") ? "text-blue-600 font-semibold" : ""}`}>My Profile</Link>)}
          {!user ? (
            <>
              <Link to="/login" className="px-3 py-1 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-800 transition">Login</Link>
              <Link to="/register" className="px-3 py-1 rounded border text-sm hover:bg-indigo-800 hover:text-white transition">Register</Link>
            </>
          ) : (
            <>
              <span className="text-sm px-3 text-indigo-600">{user.name}</span>
              <button onClick={onLogout} className="px-3 py-1 rounded border text-sm cursor-pointer transition-colors duration-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:bg-indigo-700 active:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">Logout</button>
            </>
          )}
        </div>

        <button className="md:hidden text-indigo-600 focus:outline-none text-2xl " onClick={() => setMenuOpen(!menuOpen)}> ☰ </button>
      </div>

        {menuOpen && (
            <div className="md:hidden bg-white border-t px-4 py-3 space-y-2">
            <Link to="/events" className={`block text-center text-sm transition ${isActive("/events") ? "text-blue-600 font-semibold" : ""}`}>Events</Link>
            {user && <Link to="/tickets" className={`block text-center text-sm transition ${isActive("/tickets") ? "text-blue-600 font-semibold" : ""}`}>My Tickets</Link>}
            {user?.role === "ADMIN" && <Link to="/admin" className={`block text-center text-sm transition ${isActive("/admin") ? "text-blue-600 font-semibold" : ""}`}>Admin</Link>}
            {user?.role === "ADMIN" && <Link to="/admin/users" className={`block text-center text-sm transition ${isActive("/admin/users") ? "text-blue-600 font-semibold" : ""}`}>Users</Link>}
            {user && (<Link to="/my-profile" className={`block text-center text-sm transition ${isActive("/my-profile") ? "text-blue-600 font-semibold" : ""}`}> My Profile </Link>)}
            {!user ? (
                <>
                <Link to="/login" className="block px-3 py-1 rounded bg-indigo-600 text-white text-center text-sm hover:bg-indigo-800 transition">Login</Link>
                <Link to="/register" className="block px-3 py-1 rounded border text-center text-sm hover:bg-indigo-800 hover:text-white transition">Register</Link>
                </>
            ) : (
                <>
                <span className="block text-center text-sm text-indigo-600">{user.name}</span>
                <button onClick={onLogout} className=" w-full sm:w-auto px-3 py-1 rounded border border-gray-300 text-sm text-center sm:text-left bg-white cursor-pointer transition-colors duration-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:bg-indigo-700 active:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                    Logout
                </button>

                </>
            )}
            </div>
        )}
    </nav>
  );
}
