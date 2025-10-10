"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile").then(async r => {
      const j = await r.json();
      setData(j || {});
      setLoading(false);
    });
  }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body: any = {};
    for (const [k, v] of fd.entries()) {
      if (v === "") continue;
      if (["age","heightCm","weightKg","latitude","longitude","exerciseMinutes","dietQuality","socialInteraction","workStress","substanceUse","sleepHours","screenTimeHours"].includes(k)) {
        body[k] = Number(v);
      } else {
        body[k] = v;
      }
    }
    const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) alert("Saved");
    else alert("Failed");
  }

  function locate() {
    navigator.geolocation.getCurrentPosition((pos) => {
      setData((d: any) => ({ ...d, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
    });
  }

  if (loading) return <div>Loading...</div>;

  return (
    <section className="card p-6 space-y-4">
      <h1 className="text-xl font-semibold">Lifestyle Profile</h1>
      <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Age</label>
          <input className="input" name="age" defaultValue={data.age ?? ""} />
        </div>
        <div>
          <label className="label">Gender</label>
          <input className="input" name="gender" defaultValue={data.gender ?? ""} />
        </div>
        <div>
          <label className="label">City</label>
          <input className="input" name="city" defaultValue={data.city ?? ""} />
        </div>
        <div>
          <label className="label">Country</label>
          <input className="input" name="country" defaultValue={data.country ?? ""} />
        </div>
        <div>
          <label className="label">Latitude</label>
          <input className="input" name="latitude" value={data.latitude ?? ""} onChange={e => setData({ ...data, latitude: e.target.value })} />
        </div>
        <div>
          <label className="label">Longitude</label>
          <input className="input" name="longitude" value={data.longitude ?? ""} onChange={e => setData({ ...data, longitude: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <button type="button" className="btn" onClick={locate}>Use my location</button>
        </div>

        <div>
          <label className="label">Height (cm)</label>
          <input className="input" name="heightCm" defaultValue={data.heightCm ?? ""} />
        </div>
        <div>
          <label className="label">Weight (kg)</label>
          <input className="input" name="weightKg" defaultValue={data.weightKg ?? ""} />
        </div>
        <div>
          <label className="label">Sleep hours</label>
          <input className="input" name="sleepHours" defaultValue={data.sleepHours ?? ""} />
        </div>
        <div>
          <label className="label">Exercise (min/week)</label>
          <input className="input" name="exerciseMinutes" defaultValue={data.exerciseMinutes ?? ""} />
        </div>
        <div>
          <label className="label">Screen time (hrs/day)</label>
          <input className="input" name="screenTimeHours" defaultValue={data.screenTimeHours ?? ""} />
        </div>
        <div>
          <label className="label">Diet quality (1-5)</label>
          <input className="input" name="dietQuality" defaultValue={data.dietQuality ?? ""} />
        </div>
        <div>
          <label className="label">Social interaction (1-5)</label>
          <input className="input" name="socialInteraction" defaultValue={data.socialInteraction ?? ""} />
        </div>
        <div>
          <label className="label">Work stress (1-5)</label>
          <input className="input" name="workStress" defaultValue={data.workStress ?? ""} />
        </div>
        <div>
          <label className="label">Substance use (1-5)</label>
          <input className="input" name="substanceUse" defaultValue={data.substanceUse ?? ""} />
        </div>

        <div className="md:col-span-2">
          <button className="btn w-full">Save Profile</button>
        </div>
      </form>
    </section>
  );
}