"use client";
import { useEffect, useState } from "react";

type Slot = { weekday: number; startMinute: number; endMinute: number; slotMinutes: number; timezone: string };

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Convert minutes to hour string (e.g., 540 -> "9:00 AM")
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, "0")} ${ampm}`;
}

// Convert hour string to minutes (e.g., "9:00 AM" -> 540)
function timeToMinutes(time: string): number {
  const parts = time.split(" ");
  if (parts.length !== 2) return 0;
  const [timePart, ampm] = parts;
  const timeParts = timePart?.split(":");
  if (!timeParts || timeParts.length !== 2) return 0;
  const hours = Number(timeParts[0]);
  const mins = Number(timeParts[1]);
  let totalHours = hours;
  if (ampm === "PM" && hours !== 12) totalHours += 12;
  if (ampm === "AM" && hours === 12) totalHours = 0;
  return totalHours * 60 + (mins || 0);
}

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [tz] = useState("Asia/Dhaka");

  useEffect(() => {
    fetch("/api/availibility").then(async r => {
      if (r.ok) setSlots(await r.json());
    });
  }, []);

  function addSlot() {
    // Default: Monday 9 AM - 5 PM, 60-minute slots
    setSlots(s => [...s, { weekday: 1, startMinute: 540, endMinute: 1020, slotMinutes: 60, timezone: tz }]);
  }

  function removeSlot(i: number) {
    setSlots(s => s.filter((_, idx) => idx !== i));
  }

  function updateSlot(i: number, field: keyof Slot, val: any) {
    setSlots(s => s.map((sl, idx) => idx === i ? { ...sl, [field]: val } : sl));
  }

  async function save() {
    const res = await fetch("/api/availibility", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slots }) });
    if (res.ok) alert("✅ Availability saved successfully!"); else alert("❌ Failed to save");
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">📅 Weekly Availability</h1>
        <p className="text-gray-600 mt-2">Set your available hours for each day of the week (Bangladesh Time - {tz})</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Set hourly slots for your availability. Patients will be able to book appointments during these times.
        </p>
      </div>

      <button onClick={addSlot} className="btn bg-blue-600 hover:bg-blue-700 text-white">
        ➕ Add Time Slot
      </button>

      <div className="space-y-4">
        {slots.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">
            No availability slots added yet. Click "Add Time Slot" to get started.
          </div>
        ) : (
          slots.map((s, i) => (
            <div key={i} className="card p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Slot {i + 1}</h3>
                <button 
                  onClick={() => removeSlot(i)} 
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  🗑️ Remove
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="label">Day of Week</label>
                  <select 
                    className="input w-full" 
                    value={s.weekday} 
                    onChange={e => updateSlot(i, "weekday", Number(e.target.value))}
                  >
                    {WEEKDAYS.map((day, idx) => (
                      <option key={idx} value={idx}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Start Time</label>
                  <select 
                    className="input w-full" 
                    value={s.startMinute} 
                    onChange={e => updateSlot(i, "startMinute", Number(e.target.value))}
                  >
                    {Array.from({ length: 24 }, (_, h) => h * 60).map(min => (
                      <option key={min} value={min}>{minutesToTime(min)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">End Time</label>
                  <select 
                    className="input w-full" 
                    value={s.endMinute} 
                    onChange={e => updateSlot(i, "endMinute", Number(e.target.value))}
                  >
                    {Array.from({ length: 24 }, (_, h) => (h + 1) * 60).map(min => (
                      <option key={min} value={min}>{minutesToTime(min)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Slot Duration</label>
                  <select 
                    className="input w-full" 
                    value={s.slotMinutes} 
                    onChange={e => updateSlot(i, "slotMinutes", Number(e.target.value))}
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                📌 <strong>{WEEKDAYS[s.weekday]}</strong> from <strong>{minutesToTime(s.startMinute)}</strong> to <strong>{minutesToTime(s.endMinute)}</strong> ({s.slotMinutes} min slots)
              </div>
            </div>
          ))
        )}
      </div>

      {slots.length > 0 && (
        <button onClick={save} className="btn bg-green-600 hover:bg-green-700 text-white w-full md:w-auto">
          💾 Save Availability
        </button>
      )}
    </section>
  );
}