import React, { useRef, useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../../api";

export default function AdminScan() {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  const startScan = async () => {
    const id = "qr-reader";
    const el = document.getElementById(id);

    if (el) el.innerHTML = "";

    const html5QrCode = new Html5Qrcode(id);
    scannerRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decoded) => {
          try {
            const res = await api.post("/admin/checkin", { qrToken: decoded });
            alert(`Checked in: ${res.data.name} (${res.data.ticketId})`);
          } catch (err) {
            alert(err.response?.data?.message || "Check-in failed");
          }
        },
        () => {}
      );
      setScanning(true);
    } catch (err) {
      console.error("QR start failed", err);
    }
  };

  const stopScan = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop().catch(() => {});
      setScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 text-center">
      <h1 className="text-2xl font-semibold mb-4">Scan QR to Check-in</h1>
      <div className="flex justify-center">
        <div id="qr-reader" style={{ width: "100%" }}></div>
      </div>

      <div className="mt-4 flex gap-4">
        {!scanning && (
          <button
            onClick={startScan}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Start Scan
          </button>
        )}

        {scanning && (
          <button
            onClick={stopScan}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Stop Scan
          </button>
        )}
      </div>
    </div>
  );
}
