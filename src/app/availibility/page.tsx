"use client";
import { useEffect, useState } from "react";

type Slot = { weekday: number; startMinute: number; endMinute: number; slotMinutes: number; timezone: string };

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [tz, setTz] = useState("Asia/Dhaka");

  useEffect(() => {
    fetch("/api/availability/me").then(async r => {
      if (r.ok) setSlots(await r.json());
    });
  }, []);

  function addSlot() {
    setSlots(s => [...s, { weekday: 1, startMinute: 540, endMinute: 720, slotMinutes: 20, timezone: tz }]);
  }
  function updateSlot(i: number, field: keyof Slot, val: any) {
    setSlots(s => s.map((sl, idx) => idx === i ? { ...sl, [field]: val } : sl));
  }
  async function save() {
    const res = await fetch("/api/availability", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slots }) });
    if (res.ok) alert("Saved"); else alert("Failed");
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Weekly Availability</h1>
      <div className="card p-4">
        <label className="label">Timezone</label>
        <input className="input max-w-xs" value={tz} onChange={e => setTz(e.target.value)} />
      </div>
      <button onClick={addSlot} className="btn">Add Slot</button>
      <div className="space-y-3">
        {slots.map((s, i) => (
          <div key={i} className="card p-4 grid md:grid-cols-5 gap-3">
            <div>
              <label className="label">Weekday (0-6)</label>
              <input className="input" value={s.weekday} onChange={e => updateSlot(i, "weekday", Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Start (min)</label>
              <input className="input" value={s.startMinute} onChange={e => updateSlot(i, "startMinute", Number(e.target.value))} />
            </div>
            <div>
              <label className="label">End (min)</label>
              <input className="input" value={s.endMinute} onChange={e => updateSlot(i, "endMinute", Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Slot (min)</label>
              <input className="input" value={s.slotMinutes} onChange={e => updateSlot(i, "slotMinutes", Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Timezone</label>
              <input className="input" value={s.timezone} onChange={e => updateSlot(i, "timezone", e.target.value)} />
            </div>
          </div>
        ))}
      </div>
      <button onClick={save} className="btn">Save Availability</button>
    </section>
  );
}