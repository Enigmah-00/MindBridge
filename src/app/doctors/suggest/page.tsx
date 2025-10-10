"use client";
import { useEffect, useState } from "react";

export default function DoctorSuggestPage() {
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  function locate() {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLat(String(pos.coords.latitude));
      setLng(String(pos.coords.longitude));
    });
  }

  async function search() {
    setLoading(true);
    const qs = new URLSearchParams();
    if (lat) qs.set("lat", lat);
    if (lng) qs.set("lng", lng);
    qs.set("maxKm", "50");
    const res = await fetch(`/api/doctors/suggest?${qs.toString()}`);
    setResults(await res.json());
    setLoading(false);
  }

  useEffect(() => { locate(); }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Suggested Doctors</h1>
      <div className="card p-4 grid md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="label">Latitude</label>
          <input className="input" value={lat} onChange={e => setLat(e.target.value)} />
        </div>
        <div>
          <label className="label">Longitude</label>
          <input className="input" value={lng} onChange={e => setLng(e.target.value)} />
        </div>
        <button onClick={locate} className="btn">Use my location</button>
        <button onClick={search} className="btn">{loading ? "Searching..." : "Search"}</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {results.map((d, i) => (
          <div key={i} className="card p-5">
            <div className="text-sm text-gray-500">{d.telehealth ? "Telehealth available" : "In-person"}</div>
            <h3 className="font-semibold">{d.name}</h3>
            <div className="text-sm text-gray-600">{d.city}, {d.country} • {d.distanceKm?.toFixed(1)} km away</div>
            <div className="text-sm mt-2">
              Specialties: {d.specialties.map((s: any) => s.specialty.name).join(", ")}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}