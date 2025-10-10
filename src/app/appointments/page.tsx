"use client";
import { useEffect, useState } from "react";

type Doctor = { id: string; name: string };
type Slot = { startMinute: number; endMinute: number; slotMinutes: number };

export default function AppointmentsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [my, setMy] = useState<any[]>([]);

  useEffect(() => {
    // Quick doctor list from seeds
    fetch("/api/doctors/list").then(async r => setDoctors(await r.json()));
    refreshMy();
  }, []);

  async function refreshMy() {
    const r = await fetch("/api/appointments");
    if (r.ok) setMy(await r.json());
  }

  async function loadSlots() {
    if (!selected || !date) return;
    const r = await fetch(`/api/availability/${selected}?date=${date}`);
    if (r.ok) setSlots(await r.json());
  }

  async function book(startMinute: number) {
    const r = await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ doctorId: selected, date, startMinute }) });
    const j = await r.json();
    if (r.ok) {
      alert(`Booked. Serial: ${j.serialNumber}`);
      refreshMy();
    } else {
      alert(j.error || "Booking failed");
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Appointments</h1>
      <div className="card p-4 grid md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="label">Doctor</label>
          <select className="input" value={selected} onChange={e => setSelected(e.target.value)}>
            <option value="">Select</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Date (YYYY-MM-DD)</label>
          <input className="input" value={date} onChange={e => setDate(e.target.value)} placeholder="2025-10-15" />
        </div>
        <button onClick={loadSlots} className="btn">Load Slots</button>
      </div>

      {slots.length > 0 && (
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Available Slots</h3>
          <div className="flex flex-wrap gap-2">
            {slots.map((s, i) => (
              <button key={i} onClick={() => book(s.startMinute)} className="px-3 py-2 rounded border hover:bg-brand-100">
                {Math.floor(s.startMinute/60).toString().padStart(2, "0")}:{(s.startMinute%60).toString().padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-semibold mb-2">My Appointments</h3>
        {my.length === 0 ? <div className="text-gray-600">None yet.</div> : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Doctor</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Time</th>
                  <th className="py-2">Serial</th>
                  <th className="py-2">Status</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {my.map((a) => (
                  <tr key={a.id} className="border-b">
                    <td className="py-2">{a.doctor.name}</td>
                    <td className="py-2">{a.date.slice(0, 10)}</td>
                    <td className="py-2">{Math.floor(a.startMinute/60).toString().padStart(2,"0")}:{(a.startMinute%60).toString().padStart(2,"0")}</td>
                    <td className="py-2">{a.serialNumber}</td>
                    <td className="py-2">{a.status}</td>
                    <td className="py-2">
                      {a.status === "BOOKED" && (
                        <button className="px-3 py-1 rounded border" onClick={async () => {
                          const r = await fetch(`/api/appointments/${a.id}/cancel`, { method: "PATCH" });
                          if (r.ok) { alert("Cancelled"); refreshMy(); }
                        }}>Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}