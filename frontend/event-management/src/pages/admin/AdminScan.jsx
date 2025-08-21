import React, { useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../../api";

export default function AdminScan() {
  const scannerRef = useRef();

  useEffect(() => {
    const id = "qr-reader";
    const el = document.getElementById(id);
    const html5QrCode = new Html5Qrcode(id);

    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decoded) => {
        // decoded is the token string (we expect qrToken)
        try {
          const res = await api.post("/admin/checkin", { qrToken: decoded });
          alert(`Checked in: ${res.data.name} (${res.data.ticketId})`);
        } catch (err) {
          alert(err.response?.data?.message || "Check-in failed");
        }
      },
      (error) => { /* ignore scan errors */ }
    ).catch(err => console.error("QR start failed", err));

    return () => { html5QrCode.stop().catch(()=>{}); };
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Scan QR to Check-in</h1>
      <div id="qr-reader" style={{ width: "100%" }}></div>
    </div>
  );
}
